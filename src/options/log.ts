import { Option } from 'commander';

import { log } from '../constants/cliDefaults';
import levels from '../constants/levels';

export default new Option('-l, --log <level>', 'logging level')
  .choices(levels)
  .default(null, JSON.stringify(log))
  .conflicts('silent');
