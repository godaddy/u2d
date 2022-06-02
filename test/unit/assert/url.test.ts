import isURL from '../../../src/assert/url';

test('returns true on localhost', () => {
  expect(isURL('http://localhost/test')).toBe(true);
});

test('returns true on https', () => {
  expect(isURL('https://domain/test')).toBe(true);
});

test('returns false on http', () => {
  expect(isURL('http://domain/test')).toBe(false);
});

test('returns false on invalid', () => {
  expect(isURL('./test')).toBe(false);
});
