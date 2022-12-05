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

export type EnvironmentType = typeof Environment[keyof typeof Environment];

export const Action = {
  CHECK: 'check',
  UPDATE: 'update'
} as const;

export type ActionType = typeof Action[keyof typeof Action];

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

  export interface Provider {
    id?: ManagerType;

    dirs(depth: string | number);

    update(pkgs: Array<string>);

    view(pkg: string);
  }

  interface Common {
    cwd: string;
    env: EnvironmentType;
    manager: ManagerType;
    log: keyof typeof Level;
    bail: boolean;
    silent: boolean;
    local: boolean;
  }

  interface CommonInput extends Common {
    config: string | Partial<Config.Input>;
    showConfig: boolean;
  }

  export interface Check extends Common {
    depth: string | number;
  }

  export interface CheckInput extends Check, CommonInput {
  }

  export interface Update extends Common {
    dryRun: boolean;
  }

  export interface UpdateInput extends Update, CommonInput {
  }

  export interface Base extends Check, Update {
  }

  export interface Input extends Base, CheckInput, UpdateInput {
  }

  export interface Export extends Base, Config.Export {
    level: Level;
    spawn: Spawn;
    tty: boolean;
    provider?: Provider;
  }
}

export interface Result {
  name: string;
  title: string;
  message: string;
  meta: { [key: string]: any };
}

export interface Results {
  skips: Array<Result>;
  infos: Array<Result>;
  errors: Array<Result>;
  warnings: Array<Result>;
}

export interface Context extends Options.Export, Results {
  action: ActionType;
}
