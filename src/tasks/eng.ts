import { ListrTask } from 'listr2';

import getFn from '../parse/fn';
import getTitle from '../parse/title';
import getOptions from '../parse/listr';
import { ENG } from '../constants/tasks';

import nvm from './nvm';
import node from './node';
import manager from './manager';

import type { Context } from '../types';

export default {
  title: getTitle(ENG),
  task: (ctx: Context, task) => {
    return task.newListr([
      getFn(nvm, ctx),
      getFn(node, ctx),
      getFn(manager, ctx)
    ], getOptions(ctx, true));
  }
} as ListrTask;
