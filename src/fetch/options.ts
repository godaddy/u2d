import fs from 'fs';
import path from 'path';

import getDir from '../parse/dir';
import getSpawn from '../parse/spawn';
import getChecks from '../parse/checks';
import getManager from '../parse/manager';
import envs from '../constants/envs';
import levels from '../constants/levels';
import managers from '../constants/managers';
import * as _defaults from '../constants/defaults';

import fetchConfig from './config';

import type { Config, Options } from '../types';

export default async function fetchOptions(options: Partial<Options.Input> = {}, defaults: Partial<Options.Base> = _defaults): Promise<Options.Export> {
  const cwd = getDir(options.cwd || defaults.cwd, defaults.cwd);
  let config: Partial<Config.Input> = await fetchConfig(options.config, cwd);

  const getValue = (key: keyof Options.Input): any => options[key] ?? config[key] ?? defaults[key];

  // Validate env
  const env = getValue('env');
  if (envs.indexOf(env) === -1) {
    throw Error(`invalid env '${ env }'`);
  }

  // Validate log/level
  const log = getValue('log');
  const level = levels.indexOf(log);
  if (level === -1) {
    throw Error(`invalid log '${ log }'`);
  }

  // Validate depth
  let depth;
  const depthRaw = getValue('depth');
  if (typeof depthRaw === 'string') {
    depth = depthRaw.toLowerCase() === 'infinity'
      ? Infinity
      : parseInt(depthRaw, 10);
  } else {
    depth = depthRaw;
  }
  if (isNaN(depth)) {
    throw Error(`invalid depth '${ depthRaw }'`);
  }

  // Validate manager
  const manager = getValue('manager') ?? getManager(cwd);
  if (managers.indexOf(manager) === -1) {
    throw Error(`invalid manager '${ manager }'`);
  }

  // Import local package engines and dependencies
  const local = Boolean(getValue('local'));
  if (local) {
    try {
      const raw = await fs.promises.readFile(path.join(cwd, 'package.json'), 'utf-8');
      const pkg = JSON.parse(raw);
      config.engines = Object.assign({}, pkg.engines, config.engines);
      config.packages = Object.assign({}, pkg.devDependencies, pkg.dependencies, pkg.peerDependencies, config.packages);
    } catch {
      // Ignore
    }
  }

  // Import local .nvmrc
  try {
    const raw = await fs.promises.readFile(path.join(cwd, '.nvmrc'), 'utf-8');
    if (!config.engines) {
      config.engines = {};
    }
    config.engines.nvm = { pass: raw.trim(), fail: true };
  } catch {
    // Ignore
  }

  return {
    cwd,
    env,
    log,
    level,
    local,
    depth,
    manager,
    silent: Boolean(getValue('silent')),
    bail: Boolean(getValue('bail')),
    tty: Boolean(process.stdout.isTTY),
    spawn: getSpawn(cwd),
    engines: getChecks(config.engines),
    packages: getChecks(config.packages)
  };
}
