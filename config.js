'use strict';
var glob = require('glob');

var plovrPattern = 'src/client/**/*.plovr.json';
var ol3ds = {
  appPath: '/path/to/application/',
  plovrCfgs: glob.sync(plovrPattern),
  mainPlovrCfgs: glob.sync(plovrPattern, {
    ignore: 'src/client/**/*.debug.plovr.json'
  }),
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
  ],
  generateSourceMaps: false
};

module.exports = ol3ds;
