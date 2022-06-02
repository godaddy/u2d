import { Level, Environment } from '../types';

import levels from './levels';

export const cwd = process.cwd();
export const bail = false;
export const silent = true;
export const local = false;
export const level = Level.info;
export const env = Environment.LOCAL;
export const log = levels[level] as keyof typeof Level;
export const depth = Infinity;
