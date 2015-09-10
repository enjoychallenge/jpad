'use strict';

var express = require('express');
var app = express();
var path = require("path");
var ol3dsCfg = require('./../config.js');

var appPath = ol3dsCfg.appPath;
var port = ol3dsCfg.port;
if(appPath) {
  var physdir = __dirname+'/../src/client/'.replace(/\//g, path.sep);
  app.use(appPath, express.static(physdir));
}

app.use('/', express.static(__dirname+'/../'));

app.listen(port, function() {
  console.log("Server is up");
});


