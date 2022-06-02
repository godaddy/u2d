import { Logger, LogLevels } from 'listr2';

import warning from '../constants/warning';

const failures = new Set();

export default class extends Logger {

  start() {
    // ignore start messages
  }

  success(message: string) {
    // ignore empty success messages
    if (message.trim()) {
      return super.success(message);
    }
  }

  fail(message: string) {
    // only log failure messages once
    if (!failures.has(message)) {
      failures.add(message);
      return super.fail(message);
    }
  }

  parseMessage(level: LogLevels, message: string) {
    let parsed = super.parseMessage(level, message);
    // support warning messages
    if (level === LogLevels.SUCCESS && parsed.endsWith(warning)) {
      parsed = parsed.slice(0, -1).replace('SUCCESS', 'WARNING');
    }
    return parsed;
  }
}
