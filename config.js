'use strict';
var glob = require('glob');

var plovrPattern = 'src/client/**/*.plovr.json';
var ol3ds = {
  appPath: '/path/to/application/',
  plovrCfgs: glob.sync(plovrPattern),
  mainPlovrCfgs: glob.sync(plovrPattern, {
    ignore: [
      'src/client/**/*.dev.plovr.json',
      'src/client/**/*.modon.plovr.json'
    ]
  }),
  port: 9000,
  libMappings: [
    {
      src: 'bower_components/ol3/css/',
      dest: '_lib/ol3/css/'
    },
    {
      src: 'bower_components/ol3/examples/resources/',
      dest: '_lib/ol3/examples/resources/'
    }
  ],
  srcClientMappings: [
    '**/*.png'
  ],
  generateSourceMaps: false
};

module.exports = ol3ds;
