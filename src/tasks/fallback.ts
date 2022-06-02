import getTitle from '../parse/title';
import getHelpers from '../parse/helpers';
import { PKG } from '../constants/tasks';

import type { ListrTask } from 'listr2';

export default function fallback(pkg: string): ListrTask {
  return {
    title: getTitle(PKG, pkg),
    task: (ctx, task) => {
      getHelpers(ctx, task).skip(`'${ ctx.manager }' not currently supported`);
    }
  };
}
