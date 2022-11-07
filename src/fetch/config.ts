import path from 'path';

import { cosmiconfig } from 'cosmiconfig';

import getConfig from '../parse/config';
import * as defaults from '../constants/defaults';

export default async function fetchConfig(config?: string | {}, cwd: string = defaults.cwd) {
  if (!config) {
    const found = await cosmiconfig('u2d').search(cwd);
    return found
      ? getConfig(found.config, path.dirname(found.filepath))
      : {};
  }
  if (typeof config === 'string') {
    config = {
      extends: config
    };
  }
  return getConfig({ ...config }, cwd);
}
