import isFile from '../../../src/assert/file';

test('returns true on files', () => {
  expect(isFile('./package.json')).toBe(true);
});

test('returns false on directories', () => {
  expect(isFile('./')).toBe(false);
});

test('returns false on non existing', () => {
  expect(isFile('./fail')).toBe(false);
});

test('returns false on invalid', () => {
  expect(isFile('...')).toBe(false);
});
