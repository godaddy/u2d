import fs from 'fs';

export default function exists(file: string) {
  return fs.existsSync(file);
}
