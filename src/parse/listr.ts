import { ListrBaseClassOptions } from 'listr2';

import Logger from '../tasks/logger';

import type { Context } from '../types';

export default function getListrOptions(ctx: Context, subtask = false): ListrBaseClassOptions {
  const options: ListrBaseClassOptions = {
    ctx,
    concurrent: true,
    collectErrors: false,
    exitOnError: ctx.bail,
    rendererSilent: ctx.silent
  };
  if (subtask) {
    return options;
  }
  options.rendererOptions = {
    collapse: false,
    suffixSkips: false,
    showErrorMessage: false
  };
  options.nonTTYRendererOptions = {
    logEmptyTitle: false,
    logTitleChange: false,
    logger: Logger
  };
  return options;
}
