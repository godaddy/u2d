import chalk from 'chalk';
import { figures } from 'listr2';
import { Command } from 'commander';

import check from '../actions/check';
import fetchOptions from '../fetch/options';
import getMessage from '../parse/message';
import * as defaults from '../constants/cliDefaults';
import * as Options from '../options';

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
  .addOption(Options.showConfig)
  .action(async ({ showConfig, ...opts }) => {
    let options;
    try {
      options = await fetchOptions(opts, defaults);
    } catch (err) {
      command.error(getMessage('configuration error', err));
    }
    try {
      if (showConfig) {
        if (options.depth === Infinity) {
          options.depth = Options.depth.defaultValueDescription;
        }
        process.stdout.write(JSON.stringify(options, null, '  '));
        process.stdout.write('\n');
        process.exit(0);
      } else {
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
      }
    } catch (err) {
      command.error(getMessage('action error', err));
    }
  });

export default command;
