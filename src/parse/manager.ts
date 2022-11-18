import path from 'path';

import exists from '../assert/exists';
import { Manager, ManagerType } from '../types';

export default function getManager(cwd: string): ManagerType {
  if (exists(path.join(cwd, 'yarn.lock'))) {
    return Manager.YARN;
  }
  if (exists(path.join(cwd, 'pnpm-lock.yaml'))) {
    return Manager.PNPM;
  }
  return Manager.NPM;
}
