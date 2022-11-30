import { ListrTask } from 'listr2';

import getTitle from '../parse/title';
import getHelpers from '../parse/helpers';
import { UPDATE } from '../constants/tasks';
import getOptions from '../parse/listr';

import noProvider from './no-provider';

import type { Context } from '../types';

export default {
  title: getTitle(UPDATE),
  task: (ctx: Context, task) => {
    if (!ctx.provider) {
      return noProvider(ctx, task, UPDATE);
    }
    return task.newListr([{
      title: getTitle(UPDATE, ctx.manager),
      task: async (ctx, task) => {
        const { info, error, skip } = getHelpers(ctx, task);
        const updates = [];
        ctx.warnings.forEach(warning => {
          if (warning.meta?.update) {
            updates.push(`${ warning.name }@${ warning.meta.update }`);
          }
        });
        if (!updates.length) {
          return skip('no updates');
        }
        try {
          info(await ctx.provider.update(updates));
        } catch (err) {
          error(err);
        }
      }
    }], getOptions(ctx, true));
  }
} as ListrTask;
