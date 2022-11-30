import chalk from 'chalk';
import { ListrRenderer, ListrTaskWrapper } from 'listr2';

import isPass from '../assert/pass';
import isFail from '../assert/fail';
import tty from '../constants/tty';
import sep from '../constants/seperator';
import { falseRange } from '../constants/checks';
import { Action, Level } from '../types';

import getFn from './fn';
import getTitle from './title';
import getOptions from './listr';
import getHelpers from './helpers';
import getSatisfying from './satisfying';

import type { Check, Context } from '../types';

type Version = false | string | Array<[string, string]>;

interface Options {
  check: Check.Export | ((ctx: Context) => Check.Export),
  version: Version | ((ctx: Context) => Version | Promise<Version>),
  view?: ((ctx: Context) => Array<string> | Promise<Array<string>>)
}

export default function checkTask(options: Options) {
  return async (ctx: Context, task: ListrTaskWrapper<unknown, typeof ListrRenderer>) => {
    const { skip, info, warn, error } = getHelpers(ctx, task);
    try {
      const check = await getFn(options.check, ctx);
      if (!check) {
        return skip('not configured');
      }
      const version = await getFn(options.version, ctx);
      if (!version) {
        return skip('not installed');
      }
      const { pass, fail } = check;
      if (Array.isArray(version)) {
        let hasWarn = false;
        let hasFail = pass === falseRange;
        const subtasks = [];
        version.forEach(([title, nested]) => {
          subtasks.push({
            title: getTitle(task.title, title),
            task: checkTask({
              ...options,
              check,
              version: nested
            })
          });
          if ((hasFail && hasWarn) || isPass(nested, pass)) {
            return;
          }
          if (isFail(nested, fail)) {
            hasFail = true;
          } else {
            hasWarn = true;
          }
        });
        // Ignore if no warn/fail and level is warn/fail
        if ((ctx.level === Level.error && !hasFail) || (ctx.level === Level.warn && !hasWarn && !hasFail)) {
          task.title = '';
          return;
        }
        if (!tty) {
          task.title = '';
        }
        return task.newListr(subtasks, { ...getOptions(ctx, true), concurrent: false });
      }
      const meta: { [key: string]: any } = { pass, fail, version };
      if (isPass(version, pass)) {
        return info(chalk.green(version), meta);
      }
      const help = check.help ? (sep + check.help) : '';
      if (pass === falseRange) {
        // Fail if installed
        return error(chalk.red(version) + ', wanted none' + help, meta);
      }
      if (ctx.action === Action.UPDATE && options.view) {
        const view = meta.view = await getFn(options.view, ctx);
        if (!view.length) {
          return error(chalk.red(version) + ', unable to view versions' + help, meta);
        }
        const update = meta.update = getSatisfying(version, view, pass);
        if (update) {
          return warn(chalk.yellow(version) + ', updating to ' + chalk.green(update) + help, meta);
        }
      }
      const details = ', wanted ' + pass + help;
      return isFail(version, fail)
        ? error(chalk.red(version) + details, meta)
        : warn(chalk.yellow(version) + details, meta);
    } catch (err) {
      error(err);
    }
  };
}
