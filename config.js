'use strict';
var glob = require('glob');

var ol3ds = {
  appPath: '/path/to/application/',
  plovrCfgs: glob.sync('src/client/**/*.plovr.json'),
  port: 9000
};

module.exports = ol3ds;
