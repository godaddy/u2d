import { Command } from 'commander';

import { showConfig } from '../options';
import getMessage from '../parse/message';
import fetchOptions from '../fetch/options';
import * as defaults from '../constants/cliDefaults';

import type { CommandOptions } from 'commander';

class BaseCommand extends Command {
  private _showConfig?;

  addCommand(cmd: Command, opts?: CommandOptions): this {
    return super.addCommand(cmd.copyInheritedSettings(program), opts);
  }

  addShowConfig(parser?): this {
    this.addOption(showConfig);
    this._showConfig = parser || true;
    return this;
  }

  action(fn: (...args: any[]) => (void | Promise<void>)): this {
    return super.action(async (opts, ...args) => {
      let options;
      try {
        options = await fetchOptions(opts, defaults);
        if (opts.showConfig && this._showConfig) {
          // Format data
          if (typeof this._showConfig === 'function') {
            options = await this._showConfig(options);
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
