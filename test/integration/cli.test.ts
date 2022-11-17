import path from 'path';
import { spawnSync } from 'child_process';

import * as defaults from '../../src/constants/defaults';

const cwd = process.cwd();

const spawnCLISync = (args = []) => {
  return spawnSync('npx', ['.', ...args], {
    cwd,
    shell: true,
    stdio: 'pipe',
    encoding: 'utf8'
  });
};

describe('config', () => {
  const getConfig = (args = []) => JSON.parse(spawnCLISync(['--show-config'].concat(args)).stdout);

  test('applies u2d defaults', async () => {
    const config = await getConfig();
    expect(config).toEqual({
      manager: 'npm',
      local: true,
      bail: false,
      silent: false,
      log: defaults.log,
      env: defaults.env,
      level: defaults.level,
      depth: String(defaults.depth),
      cwd: process.cwd(),
      tty: expect.any(Boolean),
      engines: {
        nvm: {
          pass: '>=16.0.0 <17.0.0-0',
          fail: expect.any(Object)
        },
        npm: {
          pass: '>=8.0.0'
        }
      },
      packages: expect.any(Object)
    });
  });

  test('applies defaults', async () => {
    const config = await getConfig([
      '--config',
      path.resolve('./test/mocks/config/empty.json')
    ]);
    expect(config).toEqual({
      manager: 'npm',
      local: false,
      bail: false,
      silent: false,
      log: defaults.log,
      env: defaults.env,
      level: defaults.level,
      depth: String(defaults.depth),
      cwd: process.cwd(),
      tty: expect.any(Boolean),
      engines: expect.any(Object),
      packages: expect.any(Object)
    });
  });
});

describe('run', () => {
  test('passes', () => {
    const output = spawnCLISync(['--local']).stderr;
    expect(output).toContain('0 errors');
  });
});
