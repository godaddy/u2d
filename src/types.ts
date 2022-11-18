import execa from 'execa';

import type { Range } from 'semver';

export enum Level {
  error,
  warn,
  info,
  debug
}

export const Manager = {
  NPM: 'npm',
  PNPM: 'pnpm',
  YARN: 'yarn'
} as const;

export type ManagerType = typeof Manager[keyof typeof Manager];

export const Environment = {
  GLOBAL: 'global',
  LOCAL: 'local',
  PROD: 'prod',
  DEV: 'dev'
} as const;

export type EnvironmentType = typeof Environment[keyof typeof Environment]

export namespace Check {
  export interface Export {
    pass: string | Range;
    fail?: string | Range;
    help?: string;
  }

  export type InputValue = string | number;
  export type InputFailValue = true | InputValue;
  export type InputPassValue = false | InputFailValue;
  export type InputArray = [InputPassValue, InputFailValue?, string?];
  export type InputObject = { pass: InputPassValue, fail?: InputFailValue, help?: string };
  export type Input = InputPassValue | InputArray | InputObject;
}

export namespace Checks {
  export type Input = {
    [key: string]: Check.Input;
  }
  export type Export = {
    [key: string]: Check.Export;
  }
}

export namespace Config {
  export interface Input extends Options.Base {
    engines: Checks.Input;
    packages: Checks.Input;
  }

  export interface Export extends Options.Base {
    engines: Checks.Export;
    packages: Checks.Export;
  }
}

export namespace Options {

  export type Spawn = (cmd: string, args?: Array<string>, options?: execa.Options) => execa.ExecaChildProcess;

  export interface Base {
    cwd: string,
    bail: boolean;
    silent: boolean;
    local: boolean;
    depth: string | number;
    log: keyof typeof Level;
    env: EnvironmentType;
    manager: ManagerType;
  }

  export interface Input extends Base {
    config: string | Partial<Config.Input>;
  }

  export interface Export extends Base, Config.Export {
    level: Level;
    spawn: Spawn;
    tty: boolean;
  }
}

export interface Result {
  name: string,
  title: string,
  message: string
}

export interface Results {
  skips: Array<Result>,
  infos: Array<Result>,
  errors: Array<Result>,
  warnings: Array<Result>
}

export interface Context extends Options.Export, Results {

}
