import getTask from '../parse/task';
import getTitle from '../parse/title';
import { ENG } from '../constants/tasks';

import type { ListrTask } from 'listr2';

export default {
  title: getTitle(ENG, 'nvm'),
  task: getTask({
    check: (ctx) => ctx.engines.nvm,
    version: process.versions.node
  })
} as ListrTask;
