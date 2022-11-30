import stripAnsi from 'strip-ansi';

import { nonTtySep } from '../constants/seperator';
import tty from '../constants/tty';

import type { ListrRenderer, ListrTaskWrapper } from 'listr2';
import type { Result } from '../types';

export default function getResult(
  task: ListrTaskWrapper<unknown, typeof ListrRenderer>,
  message: Error | string,
  meta?: { [key: string]: any }
): Result {
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
    name: tty
      ? crumbs[crumbs.length - 2]
      : (crumbs[crumbs.length - 1] || '').split(nonTtySep).pop(),
    title: crumbs.reverse().join(nonTtySep),
    message: stripAnsi(
      message instanceof Error
        ? message.message
        : message
    ),
    meta: { ...meta }
  };
}
