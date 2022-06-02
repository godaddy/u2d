import stripAnsi from 'strip-ansi';

import type { ListrRenderer, ListrTaskWrapper } from 'listr2';
import type { Result } from '../types';

export default function getResult(task: ListrTaskWrapper<unknown, typeof ListrRenderer>, message: unknown): Result {
  const crumbs = [];
  let curTask = task.task;
  while (curTask) {
    const crumb = curTask.initialTitle;
    if (crumb) {
      crumbs.push(crumb);
    }
    curTask = curTask.listr?.parentTask;
  }
  return {
    name: crumbs[crumbs.length - 2],
    title: crumbs.reverse().join(' › '),
    message: stripAnsi(
      message instanceof Error
        ? message.message
        : message as string
    )
  };
}
