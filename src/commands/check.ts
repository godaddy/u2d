import chalk from 'chalk';
import { figures } from 'listr2';

import check from '../actions/check';
import * as Options from '../options';

import { Command } from './base';

const command = new Command('check')
  .description('run version checks')
  .addOption(Options.cwd)
  .addOption(Options.config)
  .addOption(Options.env)
  .addOption(Options.depth)
  .addOption(Options.manager)
  .addOption(Options.log)
  .addOption(Options.bail)
  .addOption(Options.silent)
  .addOption(Options.local)
  .addShowConfig((options) => {
    if (options.depth === Infinity) {
      options.depth = Options.depth.defaultValueDescription;
    }
    return options;
  })
  .action(async (options) => {
    const { errors, warnings } = await check(options);
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
    process.exit(errorCount > 0 ? 1 : 0);
  });

export default command;
