import isURL from '../assert/url';

import getURL from './url';
import getRange from './range';

import type { Check } from '../types';

export default function getCheck(passValue?: Check.InputPassValue, failValue?: Check.InputFailValue, helpValue?: string) {
  const pass = getRange(passValue);
  if (!pass) {
    throw Error(`invalid pass value`);
  }
  let fail;
  if (failValue != null) {
    fail = getRange(failValue);
    if (!fail) {
      throw Error(`invalid fail value`);
    }
  }
  return {
    pass,
    fail,
    help: (helpValue && isURL(helpValue) ? getURL(helpValue) : helpValue) || void 0
  };
}
