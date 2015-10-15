'use strict';

var ol3ds = {
  appPath: '/path/to/application/',
  plovrPattern: 'src/client/**/*.plovr.json',
  plovrHtmlPattern: 'src/client/**/*.html',
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
