var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var StringDecoder = require('string_decoder').StringDecoder;
var ol3ds = require('./ol3ds.js');
var acorn = require("acorn");
var escodegen = require("escodegen");
var estraverse = require("estraverse");
var path = require("path");



var PLUGIN_NAME = 'gulp-js-path-abs';

function plovrPathUpdater(options) {
  var decoder = new StringDecoder('utf8');

  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // return empty file
      return cb(null, file);
    }
    if (file.isBuffer()) {
      var intxt = decoder.write(file.contents);
      var json = JSON.parse(intxt);
      
      var srcPath = file.path;
      var destPath = path.relative('./src/client', srcPath);
      destPath = path.join('./precompile/client', destPath);
      destPath = path.resolve('.', destPath);
      //console.log(destPath);

      ol3ds.plovr.updatePaths(json, srcPath, destPath);
      var output = JSON.stringify(json, null, '  ');
      var outtxt = output;
      file.contents = new Buffer(outtxt);
    }
    if (file.isStream()) {
      throw new PluginError(PLUGIN_NAME, 'Not yet supported!');
      //file.contents = file.contents.pipe(prefixStream(prefixText));
    }
    cb(null, file);
  });
}

// Exporting the plugin main function
module.exports = plovrPathUpdater;