import path from 'path';

import * as defaults from '../constants/defaults';

export default function getFile(file: string, cwd: string = defaults.cwd): string {
  return path.resolve(cwd, file);
}
