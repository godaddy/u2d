import isURL from '../assert/url';
import isFile from '../assert/file';
import exists from '../assert/exists';

import getURL from './url';
import getFile from './file';
import getMessage from './message';

export default function getFileOrURL(fileOrURL: string, cwd?: string) {
  if (isURL(fileOrURL)) {
    try {
      return getURL(fileOrURL);
    } catch (err) {
      throw Error(getMessage(`'${ fileOrURL }' is an invalid URL`, err));
    }
  }
  fileOrURL = getFile(fileOrURL, cwd);
  if (!exists(fileOrURL)) {
    throw Error(`'${ fileOrURL }' does not exist`);
  }
  if (!isFile(fileOrURL)) {
    throw Error(`'${ fileOrURL }' is not a file`);
  }
  return fileOrURL;
}
