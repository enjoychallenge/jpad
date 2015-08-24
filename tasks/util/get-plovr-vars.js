'use strict';
require('./../../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');
var grunt = require('grunt');
var path = require('path');



// array of paths to plovr config files
var plovrConfigs = grunt.file.expand('src/client/**/*.plovr.json');

// array of paths to plovr production config files
var prodPlovrConfigs = grunt.file.expand(['src/client/**/*.plovr.json',
    '!src/client/**/*.debug.plovr.json']);

// object (plovrId: path to plovr config files)
var plovrIds = {};
goog.array.forEach(plovrConfigs, function(pth) {
  var json = grunt.file.readJSON(pth);
  plovrIds[json.id] = pth;
});

module.exports = {
  plovrConfigs: plovrConfigs,
  prodPlovrConfigs: prodPlovrConfigs,
  plovrIds: plovrIds
};
