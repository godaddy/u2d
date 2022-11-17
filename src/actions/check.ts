import getTasks from '../tasks';

import type { Context, Options, Results } from '../types';

export default async function check(options: Options.Export): Promise<Results>{
  const ctx: Context = {
    ...options,
    skips: [],
    infos: [],
    errors: [],
    warnings: []
  };
  const tasks = getTasks(ctx);
  try {
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
