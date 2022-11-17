import { Option } from 'commander';

import managers from '../constants/managers';

export default new Option('-m, --manager <manager>', 'package manager')
  .choices(managers);
