import { program } from './commands/base';
import check from './commands/check';

program
  .name('u2d')
  .showHelpAfterError(true)
  .allowExcessArguments(false)
  .addCommand(check, { isDefault: true })
  .parseAsync();
