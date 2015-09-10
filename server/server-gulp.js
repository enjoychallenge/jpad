'use strict';
require('./../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');
goog.require('goog.string');

var express = require('express');
var app = express();
var path = require("path");
var ol3dsCfg = require('./../config.js');

var appPath = ol3dsCfg.appPath;
var port = ol3dsCfg.port;

goog.array.forEach(ol3dsCfg.fileMappings, function(fm) {
  if(!goog.string.startsWith(fm.src, 'src/client/')) {
    var physdir = (__dirname+'/../'+fm.src).replace(/\//g, path.sep);
    app.use(appPath+fm.dest, express.static(physdir));  
  }
});


var physdir = __dirname+'/../src/client/'.replace(/\//g, path.sep);
app.use(appPath, express.static(physdir));



app.listen(port, function() {
  console.log("Server is up");
});


