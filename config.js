'use strict';
var glob = require('glob');

var ol3ds = {
  appPath: '/path/to/application/',
  plovrCfgs: glob.sync('src/client/**/*.plovr.json'),
  port: 9000,
  fileMappings: [
    {
      src: 'bower_components/ol3/css/',
      dest: '_lib/ol3/css/'
    },
    {
      src: 'bower_components/ol3/examples/resources/',
      dest: '_lib/ol3/examples/resources/'
    },
    {
      src: 'src/client/**/*.png',
      dest: ''
    }
  ]
};

module.exports = ol3ds;
