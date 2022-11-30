import { program } from './commands/base';
import check from './commands/check';
import update from './commands/update';

program
  .name('u2d')
  .showHelpAfterError(true)
  .allowExcessArguments(false)
  .addCommand(check, { isDefault: true })
  .addCommand(update)
  .parseAsync();
