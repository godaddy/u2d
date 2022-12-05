import path from 'path';
import { spawnSync } from 'child_process';

import * as cliDefaults from '../../src/constants/cliDefaults';

const cwd = process.cwd();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { showConfig, ...defaults } = cliDefaults;

const spawnCLISync = (args = []) => {
  return spawnSync('npx', ['.', 'update', ...args.concat('--dry-run')], {
    cwd,
    shell: true,
    stdio: 'pipe',
    encoding: 'utf8'
  });
};

describe('update', () => {
  describe('config', () => {
    let defaultConfig;
    beforeEach(() => {
      defaultConfig = {
        ...defaults,
        manager: 'npm',
        dryRun: true,
        depth: String(defaults.depth),
        tty: expect.any(Boolean),
        packages: {},
        engines: {
          nvm: {
            pass: '>=16.0.0 <17.0.0-0',
            fail: expect.any(Object)
          }
        }
      }
    });
    const getConfig = (args = []) => JSON.parse(spawnCLISync(args.concat('--show-config')).stdout);
    test('applies u2d defaults', async () => {
      const config = await getConfig();
      expect(config).toEqual({
        ...defaultConfig,
        local: true,
        engines: {
          ...defaultConfig.engines,
          npm: {
            pass: '>=8.0.0'
          }
        },
        packages: expect.any(Object)
      });
    });

    test('applies defaults with config', async () => {
      const config = await getConfig([
        '--config',
        path.resolve('./test/mocks/config/empty.json')
      ]);
      expect(config).toEqual(defaultConfig);
    });
  });

  describe('run', () => {
    test('passes', () => {
      const output = spawnCLISync(['--local']).stderr;
      expect(output).not.toContain('problems');
    });
  });
});
