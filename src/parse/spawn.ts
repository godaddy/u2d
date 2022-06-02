import execa from 'execa';

import type { Options } from '../types';

export default function getSpawn(cwd: string): Options.Spawn {
  return (cmd, args = [], opts: any = {}) => execa(cmd, args, {
    cwd,
    ...opts,
    env: {
      NO_UPDATE_NOTIFIER: 'true',
      ...opts.env
    }
  });
}
