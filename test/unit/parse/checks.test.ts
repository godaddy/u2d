import checks from '../../../src/parse/checks';
import { trueRange, falseRange } from '../../../src/constants/checks';

import type { Range } from 'semver';

const checkShape = (pass: string | Range, fail?: string | Range, help?: string) => ({ pass, fail, help });

test('returns empty object', () => {
  expect(checks()).toEqual({});
});

test('returns pass checks', () => {
  expect(checks({
    number: 0,
    string: '^1',
    true: true,
    false: false,
    array_number: [0.2],
    array_string: ['3'],
    array_true: [true],
    array_false: [false],
    object_number: {
      pass: 4
    },
    object_string: {
      pass: '~5'
    },
    object_true: {
      pass: true
    },
    object_false: {
      pass: false
    }
  })).toEqual({
    number: checkShape('<1.0.0-0'),
    string: checkShape('>=1.0.0 <2.0.0-0'),
    true: checkShape(trueRange),
    false: checkShape(falseRange),
    array_number: checkShape('>=0.2.0 <0.3.0-0'),
    array_string: checkShape('>=3.0.0 <4.0.0-0'),
    array_true: checkShape(trueRange),
    array_false: checkShape(falseRange),
    object_number: checkShape('>=4.0.0 <5.0.0-0'),
    object_string: checkShape('>=5.0.0 <6.0.0-0'),
    object_true: checkShape(trueRange),
    object_false: checkShape(falseRange)
  });
});

test('returns fail checks', () => {
  expect(checks({
    array_number: [1, 0],
    array_string: ['2', '1'],
    array_true: [2.5, true],
    object_number: {
      pass: 3,
      fail: 4
    },
    object_string: {
      pass: '5',
      fail: '4'
    },
    object_true: {
      pass: 5.5,
      fail: true
    }
  })).toEqual({
    array_number: checkShape('>=1.0.0 <2.0.0-0', '<1.0.0-0'),
    array_string: checkShape('>=2.0.0 <3.0.0-0', '>=1.0.0 <2.0.0-0'),
    array_true: checkShape('>=2.5.0 <3.0.0-0', trueRange),
    object_number: checkShape('>=3.0.0 <4.0.0-0', '>=4.0.0 <5.0.0-0'),
    object_string: checkShape('>=5.0.0 <6.0.0-0', '>=4.0.0 <5.0.0-0'),
    object_true: checkShape('>=5.5.0 <6.0.0-0', trueRange)
  });
});

test('throws on unknown types', () => {
  expect(() => checks({
    // @ts-ignore
    symbol: Symbol('test')
  })).toThrow('unknown check format');
});

test('throws on unhandled types', () => {
  expect(() => checks({
    null: null
  })).toThrow('unable to process check');
});
