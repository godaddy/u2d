import * as u2d from '../../src/main';

describe('check', () => {
  test('returns no errors or warnings', () => {
    return u2d.check({ local: false, config: {} }).then(res => {
      expect(res.errors).toBeDefined();
      expect(res.errors).toHaveLength(0);
      expect(res.warnings).toBeDefined();
      expect(res.warnings).toHaveLength(0);
    });
  });
});
