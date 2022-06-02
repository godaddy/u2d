import fs from 'fs';

export default function isDir(dir: string) {
  try {
    return fs.lstatSync(dir).isDirectory();
  } catch {
    return false;
  }
}
