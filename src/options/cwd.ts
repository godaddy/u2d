import { Option } from 'commander';

export default new Option('--cwd <dir>', 'working directory')
  .default(null, 'process.cwd()');
