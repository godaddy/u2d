import { program, InvalidArgumentError } from 'commander';

import u2d from './main';
import * as cli from './constants/cli';
import * as defaults from './constants/defaults';
import getDir from './parse/dir';
import getMessage from './parse/message';
import getOption from './parse/cliOption';
import getFileOrURL from './parse/fileOrUrl';
import getHandler from './parse/results';
import fetchOptions from './fetch/options';

program
  .name('u2d')
  .addOption(
    getOption(cli.cwd)
      .argParser(dir => {
        try {
          return getDir(dir, program.getOptionValue('cwd'));
        } catch (err) {
          throw new InvalidArgumentError(getMessage(`invalid cwd`, err));
        }
      })
  )
  .addOption(
    getOption(cli.config)
      .argParser(fileOrURL => {
        try {
          return getFileOrURL(fileOrURL, program.getOptionValue('cwd'));
        } catch (err) {
          throw new InvalidArgumentError(getMessage(`invalid config`, err));
        }
      })
  )
  .addOption(getOption(cli.manager))
  .addOption(
    getOption(cli.depth)
      .argParser(arg => {
        if (arg.toLowerCase() === 'infinity') {
          return Infinity;
        }
        const num = parseInt(arg, 10);
        if (isNaN(num)) {
          throw new InvalidArgumentError('invalid number');
        }
        return num;
      })
  )
  .addOption(getOption(cli.env))
  .addOption(getOption(cli.log))
  .addOption(getOption(cli.local))
  .addOption(getOption(cli.bail))
  .addOption(getOption(cli.silent))
  .addOption(getOption(cli.showConfig))
  .showHelpAfterError(true)
  .parse();

let promise;
const { showConfig, ...options } = { silent: false, ...program.opts() };
for (const [key, value] of Object.entries(options)) {
  if (program.getOptionValueSource(key) === 'default') {
    // eslint-disable-next-line import/namespace
    if (key in defaults && value === defaults[key]) {
      // Remove default values so config can override
      delete options[key];
    }
  }
}
if (showConfig) {
  promise = fetchOptions(options).then((parsed) => {
    // Format output
    if (parsed.depth === Infinity) {
      parsed.depth = cli.depth.defaultDescription;
    }
    process.stdout.write(JSON.stringify(parsed, null, '  '));
    process.stdout.write('\n');
    process.exit(0);
  });
} else {
  promise = u2d(options).then(getHandler(options));
}
promise.catch(err => {
  program.error(getMessage('configuration error', err));
});
