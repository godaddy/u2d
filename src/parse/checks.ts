import getCheck from './check';
import getMessage from './message';

import type { Checks } from '../types';

export default function getChecks(checks: Checks.Input = {}): Checks.Export {
  const results: Partial<Checks.Export> = {};
  Object.keys(checks).sort().forEach(key => {
    const value = checks[key] ?? void 0;
    try {
      let check;
      switch (typeof value) {
        case 'object': {
          check = Array.isArray(value)
            ? getCheck(value[0], value[1], value[2])
            : getCheck(value.pass, value.fail, value.help);
          break;
        }
        case 'number':
        case 'boolean':
        case 'string': {
          check = getCheck(value);
          break;
        }
        default: {
          throw Error(`unknown check format`);
        }
      }
      results[key] = check;
    } catch (err) {
      throw Error(getMessage(`unable to process check '${ key }'`, err));
    }
  });
  return results as Checks.Export;
}
