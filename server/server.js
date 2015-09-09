'use strict';

var express = require('express');
var app = express();
var path = require("path");

var appPath = process.env.OL3DS_APPPATH;
if(appPath) {
  var physdir = __dirname+'/../src/client/'.replace(/\//g, path.sep);
  app.use('/'+appPath+'/', express.static(physdir));
}

app.use('/', express.static(__dirname+'/../'));

app.listen(9000, function() {
  console.log("Server is up");
});


