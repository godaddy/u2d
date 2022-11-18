import { Option, InvalidArgumentError } from 'commander';

import { depth } from '../constants/cliDefaults';

export default new Option('-d, --depth <number>', 'node_modules depth')
  .default(null, String(depth))
  .argParser(arg => {
    if (arg.toLowerCase() === 'infinity') {
      return Infinity;
    }
    const number = Math.floor(Number(arg));
    if (isNaN(number)) {
      throw new InvalidArgumentError('invalid number');
    }
    return number;
  });
