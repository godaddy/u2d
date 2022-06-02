import { Context, Environment } from '../types';

let promise;

export default function fetchNPM(ctx: Context) {
  if (promise) {
    return promise;
  }
  const args = ['ls', '--parseable', `--depth=${ ctx.depth }`, ctx.env === Environment.LOCAL ? '--all' : `--${ ctx.env }`];
  return (promise = ctx.spawn('npm', args, { reject: false }).then(({ stdout, stderr, exitCode }) => {
    if (exitCode === 1 && !stderr) {
      return [];
    }
    return stdout
      .split('\n')
      .map(dir => dir
        .trim()
        .replace(/\\/g, '/'))
      .sort((a, b) => {
        const diff = a.split('node_modules').length - b.split('node_modules').length;
        if (diff) {
          return diff;
        }
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
  }));
}
