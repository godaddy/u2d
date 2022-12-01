import chalk from 'chalk';
import { figures } from 'listr2';

import update from '../actions/update';
import * as Options from '../options';

import { Command } from './base';

const command = new Command('update')
  .description('auto update dependencies')
  .addOption(Options.cwd)
  .addOption(Options.config)
  .addOption(Options.env)
  .addOption(Options.manager)
  .addOption(Options.log)
  .addOption(Options.bail)
  .addOption(Options.silent)
  .addOption(Options.local)
  .addOption(Options.dryRun)
  .addOption(Options.showConfig)
  .action(async (options) => {
    const { errors, warnings } = await update(options);
    const errorCount = errors.length;
    if (!options.silent) {
      let warningCount = warnings.length;
      let updateCount = 0;
      warnings.forEach(warning => {
        if (warning.meta?.update) {
          updateCount++;
          warningCount--;
        }
      });
      const problemCount = errorCount + warningCount + updateCount;
      if (problemCount) {
        const message = `${ problemCount } problems (${ errorCount } errors, ${ warningCount } warnings, ${ updateCount } updates)`;
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
