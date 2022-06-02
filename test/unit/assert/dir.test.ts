import isDir from '../../../src/assert/dir';

test('returns true on directories', () => {
  expect(isDir('./')).toBe(true);
});

test('returns false on files', () => {
  expect(isDir('./package.json')).toBe(false);
});

test('returns false on non existing', () => {
  expect(isDir('./fail')).toBe(false);
});

test('returns false on invalid', () => {
  expect(isDir('...')).toBe(false);
});
