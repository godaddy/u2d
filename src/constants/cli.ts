import envs from './envs';
import levels from './levels';
import managers from './managers';
import * as defaults from './defaults';

export interface Option {
  flags: string,
  description: string,
  default?: any,
  defaultDescription?: string,
  choices?: Array<string>
  conflicts?: string | Array<string>
}

export const cwd: Option = {
  flags: '-p, --cwd <dir>',
  description: 'working directory',
  default: defaults.cwd,
  defaultDescription: 'process.cwd()'
};

export const config: Option = {
  flags: '-c, --config <path>',
  description: 'configuration file or url'
};

export const manager: Option = {
  flags: '-m, --manager <manager>',
  description: 'package manager',
  choices: managers
};

export const depth: Option = {
  flags: '-d, --depth <number>',
  description: 'node_modules depth',
  default: defaults.depth,
  defaultDescription: String(defaults.depth)
};

export const env: Option = {
  flags: '-e, --env <env>',
  description: 'node_modules environment',
  choices: envs,
  default: defaults.env
};

export const log: Option = {
  flags: '-l, --log <level>',
  description: 'logging level',
  default: defaults.log,
  choices: levels,
  conflicts: 'silent'
};

export const local: Option = {
  flags: '-a, --local',
  description: 'enable package.json engines/dependencies'
};

export const bail: Option = {
  flags: '-b, --bail',
  description: 'disable error collection'
};

export const silent: Option = {
  flags: '-s, --silent',
  description: 'disable logging'
};

export const showConfig: Option = {
  flags: '-o, --show-config',
  description: 'print config and exit'
};
