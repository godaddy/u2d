import tty from '../constants/tty';
import sep from '../constants/seperator';

export default function getTitle(...crumbs: Array<string>) {
  const length = crumbs.length;
  if (tty) {
    return crumbs[length - 1];
  }
  return length === 1
    ? ''
    : crumbs.join(sep);
}
