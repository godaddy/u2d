import checkAction from './actions/check';
import fetchOptions from './fetch/options';

import type { Options, Results } from './types';

async function check(options?: Partial<Options.Input>): Promise<Results> {
  return await checkAction(await fetchOptions(options));
}

export { check };
export default check;
export * from './types';
