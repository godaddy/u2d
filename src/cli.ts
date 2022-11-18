import { program } from 'commander';

import check from './commands/check';

program
  .name('u2d')
  .showHelpAfterError(true)
  .allowExcessArguments(false)
  .addCommand(check.copyInheritedSettings(program), { isDefault: true })
  .parseAsync();
