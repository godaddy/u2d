import { ListrTask } from 'listr2';

import getFn from '../parse/fn';
import getTitle from '../parse/title';
import getOptions from '../parse/listr';
import { PKG } from '../constants/tasks';
import { Manager } from '../types';

import npm from './npm';
import fallback from './fallback';

import type { Context } from '../types';

export default {
  title: getTitle(PKG),
  task: (ctx: Context, task) => {
    let handler: any;
    if (ctx.manager === Manager.NPM) {
      handler = npm;
    } else {
      // TODO: Add yarn/pnpm support
      handler = fallback;
    }
    return task.newListr(
      Object.keys(ctx.packages).map((pkg) => getFn(handler(pkg), ctx)),
      getOptions(ctx, true)
    );
  }
} as ListrTask;
