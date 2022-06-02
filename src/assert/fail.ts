import satisfies from 'semver/functions/satisfies.js';

import { trueRange, falseRange } from '../constants/checks';

export default function isFail(version, range?) {
  return range && (range !== falseRange && (range === trueRange || satisfies(version, range)));
}
