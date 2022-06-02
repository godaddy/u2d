import u2d from '../../src/main';

test('returns no errors or warnings', () => {
  return u2d({ local: false, config: {} }).then(res => {
    expect(res.errors).toBeDefined();
    expect(res.errors).toHaveLength(0);
    expect(res.warnings).toBeDefined();
    expect(res.warnings).toHaveLength(0);
  });
});
