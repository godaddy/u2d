import exists from '../../../src/assert/exists';

test('returns true on directories', () => {
  expect(exists('./')).toBe(true);
});

test('returns true on files', () => {
  expect(exists('./package.json')).toBe(true);
});

test('returns false on non existing', () => {
  expect(exists('./fail')).toBe(false);
});

test('returns false on invalid', () => {
  expect(exists('...')).toBe(false);
});

