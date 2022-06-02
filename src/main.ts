import getTasks from './tasks/index';
import fetchOptions from './fetch/options';

import type { Context, Options, Results } from './types';

export default async function u2d(options?: Partial<Options.Input>): Promise<Results> {
  const ctx: Context = {
    ...await fetchOptions(options),
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

export * from './types';
