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
var request = require("request");
var gulp = require('gulp');
var gulpPlugins = require('gulp-load-plugins')();

var appPath = ol3dsCfg.appPath;
var port = ol3dsCfg.port;

require('./../tasks-gulp/dev')(gulp, gulpPlugins, ol3dsCfg);

//deal with compiled JS files
app.use('/_compile', function(req, res, next) {
  var localSrcPath = __dirname+'/../temp/precompile/client'+req.path;
  localSrcPath = path.normalize(localSrcPath);
  if(!fs.existsSync(localSrcPath)) {
    next();
    return;
  }
  var localDestPath = __dirname+'/../temp/compile/client'+req.path;
  localDestPath = path.normalize(localDestPath);
  localDestPath = path.join(
      path.dirname(localDestPath),
      path.basename(localDestPath, '.plovr.json')+'.js'
  );
  if(fs.existsSync(localDestPath)) {
    fs.createReadStream(localDestPath).pipe(res);
    return;
  }
  
  var basename = path.basename(localSrcPath, '.plovr.json');
  var plovrId = basename.replace(/\./g, '-');
  var plovrUrl = 'http://localhost:9810/compile?id='+plovrId;
  
  fs.ensureDirSync(path.dirname(localDestPath));
  
  var plovrMode = ol3ds.plovr.getCompilerMode(localSrcPath);
  if(plovrMode==='RAW') {
    var r = request(plovrUrl, function (error, response, body) {
      body = body.replace("var path = '/compile';", "var path = '/_compile';");
      res.send(body);
      fs.writeFileSync(localDestPath, body, {encoding: 'utf-8'});
      return;
    });
  } else {
    var r = request(plovrUrl);
    r.pipe(res);
    r.pipe(fs.createWriteStream(localDestPath));
    return;
  }
});

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
    gulp.start('htmlpathabs', function(err) {
      var precompiledPath =
          path.relative(__dirname+'/../src/client/', localHtmlPath);
      precompiledPath = __dirname+'/../temp/precompile/client/'+precompiledPath;
      precompiledPath = path.normalize(precompiledPath);
      
      var fcontent = fs.readFileSync(precompiledPath);
      var $ = cheerio.load(fcontent);
      //replace links to *.plovr.json
      $('script[src$=\'.plovr.json\']').each(function(i, elem) {
          var src = $(this).attr('src');
          var srcName = path.basename(src);
          var srcPlovrPath =
              path.resolve(path.dirname(localHtmlPath), srcName);
          var srcBasename = path.basename(src, '.plovr.json');
          var devPlovrName = srcBasename+'.dev.plovr.json';
          var devPlovrPath =
              path.resolve(path.dirname(localHtmlPath), devPlovrName);
          if(fs.existsSync(devPlovrPath)) {
            var plovrPath = devPlovrPath;
          } else {
            plovrPath = srcPlovrPath;
          }
          plovrPath = path.relative(__dirname+'/../src/client/', plovrPath);
          plovrPath = '/_compile/'+plovrPath.replace(/\\/g, '/');
          src = plovrPath;
          $(this).attr('src', src);
      });
      var outContent = $.html();
      res.set('Content-Type', 'text/html');
      res.send(outContent);
      return;
    });
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


