import path from 'path';

import { jest } from '@jest/globals';

import fetchConfig from '../../../src/fetch/config';

const mockConfigPkg: any = jest.requireActual('../../mocks/config/package.json');

const cwd = path.resolve('./test/mocks/config');

test('uses cosmiconfig', () => {
  return fetchConfig(void 0, cwd).then(res => {
    expect(res).toEqual(mockConfigPkg.u2d);
  });
});

test('fetches json', () => {
  return fetchConfig('./example.json', cwd).then(res => {
    expect(res).toEqual({ test: 'json' });
  });
});

test('fetches js', () => {
  return fetchConfig('./example.js', cwd).then(res => {
    expect(res).toEqual({ test: 'js' });
  });
});

test('extends', () => {
  return fetchConfig({ extends: './example.js', cwd }, cwd).then(res => {
    expect(res).toEqual({ test: 'js', cwd });
  });
});
