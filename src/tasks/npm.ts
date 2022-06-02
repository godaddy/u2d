import fs from 'fs';
import path from 'path';

import getTask from '../parse/task';
import getTitle from '../parse/title';
import fetchNPM from '../fetch/npm';
import { PKG } from '../constants/tasks';
import { Level } from '../types';

import type { ListrTask } from 'listr2';

export default function npm(pkg: string): ListrTask {
  let fetchDirs;
  return {
    title: getTitle(PKG, pkg),
    enabled: (ctx) => {
      // Create promise
      fetchDirs = fetchNPM(ctx).then(dirs => {
        const pkgPath = `node_modules/${ pkg }`;
        return dirs.filter(dir => dir.endsWith(pkgPath));
      });
      // Always enable if debugging
      if (ctx.level >= Level.debug) {
        return true;
      }
      // Disable if not installed
      return fetchDirs.then(dirs => !!dirs.length);
    },
    task: getTask({
      check: (ctx) => ctx.packages[pkg],
      version: async (ctx) => {
        const dirs = await fetchDirs;
        if (!dirs.length) {
          return;
        }
        const versions = await Promise.all(
          dirs.map((dir) => {
            return fs.promises
              .readFile(path.resolve(dir, 'package.json'), 'utf-8')
              .then((raw: string) => [path.relative(ctx.cwd, dir), JSON.parse(raw).version]);
          })
        );
        return dirs.length === 1 ? versions[0][1] : versions;
      }
    })
  };
}
