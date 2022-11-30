import sep from '../constants/seperator';
import warning from '../constants/warning';
import { Level } from '../types';

import getTaskResult from './result';

import type { ListrRenderer, ListrTaskWrapper } from 'listr2';
import type { Context } from '../types';

export default function getHelpers(ctx: Context, task: ListrTaskWrapper<unknown, typeof ListrRenderer>) {
  const { level, skips, infos, warnings, errors } = ctx;
  const getResult = (message, meta?) => getTaskResult(task, message, meta);
  return {
    skip(msg: string, meta?) {
      if (level >= Level.debug) {
        // Capture
        skips.push(getResult(msg, meta));

        // Display
        task.skip(task.title + sep + msg);
      } else {
        // Hide
        task.title = '';
      }
    },
    info(msg: string = '', meta?) {
      if (level >= Level.info) {
        // Capture
        infos.push(getResult(msg, meta));

        // Display
        task.title = task.title + sep + msg;
      } else {
        // Hide
        task.title = '';
      }
    },
    warn(msg: string, meta?) {
      if (level >= Level.warn) {
        // Capture
        warnings.push(getResult(new RangeError(msg), meta));

        // Display hack
        task.title = task.title + sep + msg + warning;
        return task.newListr([{
          title: '',
          exitOnError: false,
          task: () => {
            throw Error;
          }
        }]);
      } else {
        // Hide
        task.title = '';
      }
    },
    error(msg: unknown, meta?) {
      let error;
      if (typeof msg === 'string') {
        // Check failed, generate error
        error = new RangeError(msg);
      } else {
        // Capture
        error = msg instanceof RangeError || (msg instanceof Error && level >= Level.debug)
          ? msg
          : new Error('failed');
        errors.push(getResult(error, meta));

        // Display
        task.title = task.title + sep + error.message;
      }
      throw error;
    }
  };
}
