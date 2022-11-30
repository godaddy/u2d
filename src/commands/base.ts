import { Command } from 'commander';

import getMessage from '../parse/message';
import fetchOptions from '../fetch/options';
import * as defaults from '../constants/cliDefaults';
import * as Options from '../options';

import type { CommandOptions } from 'commander';

class BaseCommand extends Command {
  addCommand(cmd: Command, opts?: CommandOptions): this {
    return super.addCommand(cmd.copyInheritedSettings(program), opts);
  }

  action(fn: (...args: any[]) => (void | Promise<void>)): this {
    return super.action(async (opts, ...args) => {
      let options;
      try {
        options = await fetchOptions(opts, defaults);
        if (opts.showConfig) {
          // Format data
          delete options.provider;
          if (options.depth === Infinity) {
            options.depth = Options.depth.defaultValueDescription;
          }
          // Print and exit
          process.stdout.write(JSON.stringify(options, null, '  ') + '\n');
          process.exit(0);
        }
      } catch (err) {
        this.error(getMessage('configuration error', err));
      }
      try {
        return fn.call(this, options, ...args);
      } catch (err) {
        this.error(getMessage('action error', err));
      }
    });
  }
}

const program = new BaseCommand();
export { program, BaseCommand as Command };
