import checkAction from './actions/check';
import updateAction from './actions/update';
import fetchOptions from './fetch/options';

import type { Options, Results } from './types';

async function check(options?: Partial<Options.CheckInput>): Promise<Results> {
  return await checkAction(await fetchOptions(options));
}

async function update(options?: Partial<Options.UpdateInput>): Promise<Results> {
  return await updateAction(await fetchOptions(options));
}

export { check, update };
export default check;
export * from './types';
