import fs from 'fs';
import path from 'path';

import { ListrTask } from 'listr2';

import getTitle from '../parse/title';
import getOptions from '../parse/listr';
import getTask from '../parse/task';
import { PKG } from '../constants/tasks';
import { Action, Level } from '../types';

import noProvider from './no-provider';

import type { Context } from '../types';

export default {
  title: getTitle(PKG),
  task: (ctx: Context, task) => {
    if (!ctx.provider) {
      return noProvider(ctx, task);
    }
    const fetchAllDirs = ctx.provider.dirs(ctx.action === Action.UPDATE ? 0 : ctx.depth);
    return task.newListr(
      Object.keys(ctx.packages).map((pkg) => {
        const pkgPath = `node_modules/${ pkg }`;
        const fetchDirs = fetchAllDirs.then(dirs => dirs.filter(dir => dir.endsWith(pkgPath)));
        return {
          title: getTitle(PKG, pkg),
          enabled: (ctx) => {
            // Always enable if debugging
            if (ctx.level >= Level.debug) {
              return true;
            }
            // Disable if not installed
            return fetchDirs.then(dirs => !!dirs.length);
          },
          task: getTask({
            view: (ctx) => ctx.provider.view(pkg),
            check: (ctx) => ctx.packages[pkg],
            version: async (ctx) => {
              const dirs = await fetchDirs;
              const versions = await Promise.all(
                dirs.map((dir) => fs.promises
                  .readFile(path.resolve(dir, 'package.json'), 'utf-8')
                  .then((raw: string) => [path.relative(ctx.cwd, dir), JSON.parse(raw).version]))
              );
              const len = dirs.length;
              if (len === 0) {
                return false;
              }
              if (len === 1) {
                return versions[0][1];
              }
              return versions;
            }
          })
        };
      }),
      getOptions(ctx, true)
    );
  }
} as ListrTask;
