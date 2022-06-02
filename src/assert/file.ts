import fs from 'fs';

export default function isFile(file: string) {
  try {
    return fs.lstatSync(file).isFile();
  } catch {
    return false;
  }
}
