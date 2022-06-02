import getURL from '../../../src/parse/url';

test('returns absolute urls', () => {
  expect(getURL('http://localhost')).toEqual('http://localhost/');
});

test('returns relative urls', () => {
  expect(getURL('./test', 'http://localhost')).toEqual('http://localhost/test');
});

test('throws if invalid url', () => {
  expect(() => getURL('./')).toThrow();
});
