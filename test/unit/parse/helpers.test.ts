import { jest } from '@jest/globals';

import getHelpers from '../../../src/parse/helpers';
import warning from '../../../src/constants/warning';
import { Level } from '../../../src/types';

let task, context;

beforeEach(() => {
  context = {
    level: Level.info,
    skips: [],
    infos: [],
    errors: [],
    warnings: []
  };
  task = {
    title: 'title',
    skip: jest.fn(),
    newListr: jest.fn()
  };
});

describe('skip', () => {
  test('default', () => {
    getHelpers(context, task).skip('test message');
    expect(task.skip).not.toHaveBeenCalled();
    expect(task.title).toEqual('');
  });

  test('level debug', () => {
    context.level = Level.debug;
    getHelpers(context, task).skip('test message');
    expect(task.skip).toHaveBeenCalledWith(expect.stringContaining('test message'));
    expect(task.title).toEqual('title');
  });
});

describe('info', () => {
  test('default', () => {
    getHelpers(context, task).info('test message');
    expect(task.title).toContain('test message');
  });

  test('level warn', () => {
    context.level = Level.warn;
    getHelpers(context, task).info('test message');
    expect(task.title).toEqual('');
  });
});

describe('warn', () => {
  test('default', () => {
    getHelpers(context, task).warn('test message');
    expect(task.title).toContain('test message');
    expect(task.title.endsWith(warning)).toEqual(true);
    expect(context.warnings).toHaveLength(1);
    expect(context.warnings[0].message).toContain('test message');
  });
  test('level error', () => {
    context.level = Level.error;
    getHelpers(context, task).warn('test message');
    expect(task.title).toEqual('');
  });
});

describe('error', () => {
  describe('text', () => {
    test('default', () => {
      expect(() => getHelpers(context, task).error('test message')).toThrow('test message');
      expect(context.errors).toHaveLength(0);
    });
  });

  describe('RangeError', () => {
    test('default', () => {
      expect(() => getHelpers(context, task).error(RangeError('test message'))).toThrow('test message');
      expect(task.title).toContain('test message');
      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].message).toContain('test message');
    });
  });

  describe('Error', () => {
    test('default', () => {
      expect(() => getHelpers(context, task).error(Error('test message'))).toThrow('failed');
      expect(task.title).toContain('failed');
      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].message).toContain('failed');
    });

    test('level debug', () => {
      context.level = Level.debug;
      expect(() => getHelpers(context, task).error(Error('test message'))).toThrow('test message');
      expect(task.title).toContain('test message');
      expect(context.errors).toHaveLength(1);
      expect(context.errors[0].message).toContain('test message');
    });
  });
});
