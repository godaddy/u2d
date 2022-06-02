import getTask from '../parse/task';
import getTitle from '../parse/title';
import { ENG } from '../constants/tasks';

import type { ListrTask } from 'listr2';
import type { Context } from '../types';

export default function manager(ctx: Context): ListrTask {
  return {
    title: getTitle(ENG, ctx.manager),
    task: getTask({
      check: ctx.engines[ctx.manager],
      version: async (ctx) => (await ctx.spawn(ctx.manager, ['-v'])).stdout
    })
  };
}
