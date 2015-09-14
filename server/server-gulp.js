'use strict';
require('./../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');
goog.require('goog.string');

var express = require('express');
var app = express();
var path = require("path");
var fs = require("fs-extra");
var cheerio = require("cheerio");
var ol3dsCfg = require('./../config.js');
var ol3ds =  require('../tasks-gulp/util/ol3ds.js');

var appPath = ol3dsCfg.appPath;
var port = ol3dsCfg.port;

goog.array.forEach(ol3dsCfg.libMappings, function(lm) {
  var physdir = (__dirname+'/../'+lm.src).replace(/\//g, path.sep);
  app.use(appPath+lm.dest, express.static(physdir));  
});

//deal with HTML files
app.use(appPath, function(req, res, next) {
  var reqPath = req.path.replace(/^\/|\/$/g, '');
  if(req.originalUrl+'/' === appPath) {
    res.redirect(appPath);
    return;
  }
  var localReqPath = __dirname+'/../src/client/'+reqPath;
  if(fs.lstatSync(localReqPath).isDirectory()) {
    if(!goog.string.endsWith(req.path, '/')) {
      res.redirect(appPath+reqPath+'/');
      return;
    }
    if(reqPath === '') {
      var htmlName = 'index.html';
      var htmlPath = htmlName;
    } else {
      htmlName = reqPath.replace(/^\/|\/$/g, '').replace(/\//g, '.');
      htmlName += '.index.html';
      htmlPath = reqPath+'/'+htmlName;
    }
    var localHtmlPath = path.join(localReqPath, htmlName);
  }
  if(goog.string.endsWith(reqPath, '.html')) {
    localHtmlPath = localReqPath;
    htmlPath = reqPath;
  }
  if(localHtmlPath) {
    if(!fs.existsSync(localHtmlPath)) {
      next();
      return;
    }
    var fcontent = fs.readFileSync(localHtmlPath);
    var $ = cheerio.load(fcontent);
    //replace links to *.plovr.json with plovr server URL
    $('script[src$=\'.plovr.json\']').each(function(i, elem) {
        var src = $(this).attr('src');
        var srcBasename = path.basename(src, '.plovr.json');
        var plovrId = srcBasename.replace(/\./g, '-');
        var devPlovrName = srcBasename+'.dev.plovr.json';
        var devPlovrPath =
            path.resolve(path.dirname(localHtmlPath), devPlovrName);
        if(fs.existsSync(devPlovrPath)) {
          plovrId += '-dev';
        }
        src = 'http://localhost:9810/compile?id='+plovrId;
        $(this).attr('src', src);
    });
    ol3ds.absolutizePathsInHtml($, htmlPath);
    res.set('Content-Type', 'text/html');
    res.send($.html());
    return;
  } else {
    next();
  }
});

var physdir = __dirname+'/../src/client/'.replace(/\//g, path.sep);
app.use(appPath, express.static(physdir, {
  redirect: true
}));



app.listen(port, function() {
  console.log("Server is up");
});


