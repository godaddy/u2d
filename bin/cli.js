#!/usr/bin/env node
'use strict';

if (require('supports-esm')) {
  import('../dist/cli.mjs');
} else {
  require('../dist/cli.js');
}
