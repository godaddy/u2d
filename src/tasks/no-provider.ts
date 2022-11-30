import getTitle from '../parse/title';
import getOptions from '../parse/listr';
import getHelpers from '../parse/helpers';
import { PKG } from '../constants/tasks';

export default function noProvider(ctx, task, parent = PKG) {
  return task.newListr([{
    title: getTitle(parent, ctx.manager),
    task: (ctx, task) => getHelpers(ctx, task).skip(`not supported`)
  }], getOptions(ctx, true));
}
