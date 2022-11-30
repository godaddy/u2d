import tty from './tty';

export const ttySep = ' ';
export const nonTtySep = ' › ';

export default tty ? ttySep : nonTtySep;
