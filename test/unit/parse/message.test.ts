import getMessage from '../../../src/parse/message';

test('returns message', () => {
  expect(getMessage('test')).toEqual('test');
});

test('prepends error message', () => {
  expect(getMessage('test', new Error('error'))).toEqual('test: error');
});
