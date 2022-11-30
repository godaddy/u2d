import { Environment, Manager, Options } from '../types';

export default class implements Options.Provider {
  public readonly id = Manager.NPM;
  private readonly _cache: Map<string, any>;
  private readonly _options: Options.Export;

  constructor(options) {
    this._cache = new Map();
    this._options = options;
  }

  private spawn(args) {
    const key = args.join('|');
    if (this._cache.has(key)) {
      return this._cache.get(key);
    }
    const value = this._options.spawn('npm', args, { reject: false });
    this._cache.set(key, value);
    return value;
  }

  public dirs(depth = this._options.depth) {
    const { env } = this._options;
    const args = ['ls', '--parseable', `--depth=${ depth }`, env === Environment.LOCAL ? '--all' : `--${ env }`];
    return this.spawn(args).then(({ stdout, stderr, exitCode }) => {
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
    });
  }

  public update(pkgs) {
    const args = ['install', ...pkgs, '--no-fund', '--no-audit', '--no-progress', '--loglevel=error'];
    if (this._options.env === Environment.GLOBAL) {
      args.push('--global');
    }
    return this.spawn(args).then(({ stdout, exitCode}) => {
      if (exitCode > 0) {
        throw Error('failed install');
      }
      return stdout.trim();
    });
  }

  public view(pkg) {
    const args = ['view', pkg, 'versions', '--json'];
    return this.spawn(args).then(({ stdout, exitCode }) => {
      if (exitCode > 0) {
        return [];
      }
      return JSON.parse(stdout);
    });
  }
}
