import chalk from 'chalk';
import { figures } from 'listr2';

import type { Options, Results } from '../types';

export default function getHandler(options: Partial<Options.Input>) {
  return function getResults({ errors, warnings }: Results) {
    const errorCount = errors.length;
    if (!options.silent) {
      const warningCount = warnings.length;
      const problemCount = errorCount + warningCount;
      if (problemCount) {
        const message = `${ problemCount } problems (${ errorCount } errors, ${ warningCount } warnings)`;
        if (errorCount > 0) {
          console.error(`\n${ chalk.red(`${ figures.cross } ${ message }`) }`);
        } else {
          console.warn(`\n${ chalk.yellow(`${ figures.warning } ${ message }`) }`);
        }
      }
    }
    // eslint-disable-next-line no-process-exit
    process.exit(errorCount > 0 ? 1 : 0);
  };
}
