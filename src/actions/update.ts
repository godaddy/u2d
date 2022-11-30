import { Listr } from 'listr2';

import pkg from '../tasks/pkg';
import update from '../tasks/update';
import getFn from '../parse/fn';
import getOptions from '../parse/listr';
import { Action } from '../types';

import type { Context, Options, Results } from '../types';

export default async function updateAction(options: Options.Export): Promise<Results> {
  const ctx: Context = {
    ...options,
    action: Action.UPDATE,
    skips: [],
    infos: [],
    errors: [],
    warnings: []
  };
  try {
    const tasks = new Listr([
      getFn(pkg, ctx),
      getFn(update, ctx)
    ], {
      ...getOptions(ctx),
      concurrent: false
    });
    await tasks.run();
  } catch (err) {
    if (!ctx.bail) {
      throw err;
    }
  }
  return {
    skips: ctx.skips,
    infos: ctx.infos,
    errors: ctx.errors,
    warnings: ctx.warnings
  };
}
