import { Listr } from 'listr2';

import { Action } from '../types';
import getFn from '../parse/fn';
import eng from '../tasks/eng';
import pkg from '../tasks/pkg';
import getOptions from '../parse/listr';

import type { Context, Options, Results } from '../types';

export default async function check(options: Options.Export): Promise<Results> {
  const ctx: Context = {
    ...options,
    action: Action.CHECK,
    skips: [],
    infos: [],
    errors: [],
    warnings: []
  };
  try {
    const tasks = new Listr([
      getFn(eng, ctx),
      getFn(pkg, ctx)
    ], getOptions(ctx));
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
