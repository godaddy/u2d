import { Listr } from 'listr2';

import getFn from '../parse/fn';
import getOptions from '../parse/listr';

import eng from './eng';
import pkg from './pkg';

import type { Context } from '../types';

export default function tasks(ctx: Context) {
  return new Listr([
    getFn(eng, ctx),
    getFn(pkg, ctx)
  ], getOptions(ctx));
}
