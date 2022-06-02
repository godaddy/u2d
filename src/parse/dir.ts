import isDir from '../assert/dir';
import exists from '../assert/exists';

import getFile from './file';

export default function getDir(dir: string, cwd?: string) {
  dir = getFile(dir, cwd);
  if (!exists(dir)) {
    throw Error(`'${ dir }' does not exist`);
  }
  if (!isDir(dir)) {
    throw Error(`'${ dir }' is not a directory`);
  }
  return dir;
}
