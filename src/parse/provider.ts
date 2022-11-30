import NPM from '../providers/npm';
import { Manager } from '../types';

import type { ManagerType, Options } from '../types';

export default function getProvider(manager: ManagerType, options: Options.Export) {
  switch (manager) {
    case Manager.NPM:
      return new NPM(options);
  }
}
