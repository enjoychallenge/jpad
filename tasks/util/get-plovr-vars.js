'use strict';
require('./../../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');
var grunt = require('grunt');



// array of paths to plovr config files
var plovrConfigs = grunt.file.expand('client/src/**/*.plovr.json');

// array of paths to plovr production config files
var prodPlovrConfigs = grunt.file.expand(['client/src/**/*.plovr.json',
    '!client/src/**/*-debug.plovr.json']);

// object (plovrId: path to plovr config files)
var plovrIds = {};
goog.array.forEach(plovrConfigs, function(pth) {
  var json = grunt.file.readJSON(pth);
  plovrIds[json.id] = pth;
});

// array of production CSS files compiled by plovr
var prodPlovrCsss = [];
goog.array.forEach(prodPlovrConfigs, function(pth) {
  var json = grunt.file.readJSON(pth);
  var cssOutputFile = json['css-output-file'];
  var cssInputs = json['css-inputs'];
  if(cssInputs && cssOutputFile && cssInputs.length) {
    var absCssOutput = path.resolve(path.dirname(pth), cssOutputFile);
    var relCssOutput = path.relative('.', absCssOutput);
    prodPlovrCsss.push(relCssOutput);
  }
});

module.exports = {
  plovrConfigs: plovrConfigs,
  prodPlovrConfigs: prodPlovrConfigs,
  prodPlovrCsss: prodPlovrCsss,
  plovrIds: plovrIds
};