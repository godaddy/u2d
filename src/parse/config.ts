import path from 'path';
import { createRequire } from 'module';

import fetchFileOrURL from '../fetch/fileOrUrl';
import isURL from '../assert/url';

import getURL from './url';
import getFile from './file';
import getMessage from './message';

const require = createRequire(import.meta.url);

export default async function getConfig({ extends: ext, ...config }: { extends?: string }, from: string) {
  if (ext) {
    if (isURL(from)) {
      // Relative URL
      ext = getURL(ext, from);
    } else if (isURL(ext)) {
      // File requesting URL
      ext = getURL(ext);
    } else if (ext.startsWith('.')) {
      // Relative File
      ext = require.resolve(getFile(ext, from));
    } else if (!path.isAbsolute(ext)) {
      // Node Module
      ext = require.resolve(ext, { paths: [from] });
    }
    try {
      config = Object.assign(await getConfig(await fetchFileOrURL(ext), ext), config);
    } catch (err) {
      throw Error(getMessage(`failed to load '${ ext }' from '${ from }'`, err));
    }
  }
  // TODO: Format shape
  return config;
}
