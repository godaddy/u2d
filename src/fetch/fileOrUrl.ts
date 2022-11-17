import { createRequire } from 'module';

import fetch from 'node-fetch';

import isURL from '../assert/url';

const Cache = new Map();
const require = createRequire(import.meta.url);

export default async function fetchFileOrURL(fileOrURL: string): Promise<any> {
  // Get Cache
  let result = Cache.get(fileOrURL);
  if (!result) {
    if (isURL(fileOrURL)) {
      const res = await fetch(fileOrURL, {
        headers: {
          'Content-Type': 'application/json',
          // https://jsonbin.io/ support
          'X-BIN-META': 'false'
        }
      });
      if (!res.ok) {
        throw Error(res.statusText);
      }
      result = await res.json();
    } else {
      const exp = require(fileOrURL);
      result = exp.default || exp || {};
    }
    // Set Cache
    Cache.set(fileOrURL, result);
  }
  return result;
}
