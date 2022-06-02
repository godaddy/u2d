import path from 'path';

import exists from '../assert/exists';
import { Manager } from '../types';

export default function getManager(cwd: string) {
  let manager: typeof Manager[keyof typeof Manager] = Manager.NPM;
  if (exists(path.join(cwd, 'yarn.lock'))) {
    manager = Manager.YARN;
  } else if (exists(path.join(cwd, 'pnpm-lock.yaml'))) {
    manager = Manager.PNPM;
  }
  return manager;
}
