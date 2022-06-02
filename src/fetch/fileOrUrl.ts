import fetch from 'node-fetch';

import isURL from '../assert/url';

const Cache = new Map();

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
      const exports = await import(fileOrURL);
      result = exports.default || exports || {};
    }
    // Set Cache
    Cache.set(fileOrURL, result);
  }
  return result;
}
