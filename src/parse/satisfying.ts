import validRange from 'semver/ranges/valid.js';
import major from 'semver/functions/major.js';
import satisfies from 'semver/functions/satisfies.js';
import maxSatisfying from 'semver/ranges/max-satisfying.js';

export default function getSatisfying(current: string, versions: Array<string>, range: string): string {
  const majorRange = validRange(`^${ major(current) }`);
  return maxSatisfying(versions.filter(version => satisfies(version, majorRange)), range);
}
