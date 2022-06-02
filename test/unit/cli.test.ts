import path from 'path';

import { jest } from '@jest/globals';

import * as defaults from '../../src/constants/defaults';

let originalArgv;

beforeEach(() => {
  originalArgv = process.argv;
  jest.setTimeout(1000 * 30);
  jest.resetModules();
});

afterEach(() => {
  process.argv = originalArgv;
});

const getCLIOutput = (args = []) => {
  let output = '';
  const waitForExit = new Promise(resolve => {
    jest.spyOn(process, 'exit').mockImplementation(resolve as any);
  });
  [[console, 'log'], [console, 'warn'], [process.stdout, 'write']].forEach(([obj, method]) => {
    // @ts-ignore
    jest.spyOn(obj, method).mockImplementation((data) => {
      output += data;
    });
  });
  process.argv = originalArgv.slice(0, 2).concat(args);
  return Promise.all([
    import('../../src/cli'),
    waitForExit
  ]).then(() => output);
};

describe('config', () => {
  const getConfig = (args = []) => getCLIOutput(['--show-config'].concat(args)).then((output) => JSON.parse(output));

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
        node: {
          pass: '>=16.0.0'
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
  test('passes', async () => {
    const output = await getCLIOutput(['--local']);
    expect(output).toContain('0 errors');
  });
});
