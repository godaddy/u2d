import validRange from 'semver/ranges/valid.js';

import { trueRange, falseRange } from '../constants/checks';

import type { Check } from '../types';

export default function getRange(value: Check.InputPassValue | Check.InputFailValue) {
  if (value === true || value === '*') {
    return trueRange;
  }
  if (value === false || value === '<*') {
    return falseRange;
  }
  if (typeof value === 'number') {
    return validRange(`^${ value }`);
  }
  return value && validRange(value) || '';
}
