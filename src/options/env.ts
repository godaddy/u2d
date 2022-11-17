import { Option } from 'commander';

import { env } from '../constants/cliDefaults';
import envs from '../constants/envs';

export default new Option('-e, --env <env>', 'node_modules environment')
  .choices(envs)
  .default(null, JSON.stringify(env));
