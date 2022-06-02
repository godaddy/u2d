import satisfies from 'semver/functions/satisfies.js';

import { trueRange, falseRange } from '../constants/checks';

export default function isPass(version, range) {
  return range !== falseRange && (range === trueRange || satisfies(version, range));
}
