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
  var modulesOn = path.basename(req.path)
      .indexOf('.'+ol3dsCfg.modulesOnFolder+'.') > -1;
  var modFolder = modulesOn ? ol3dsCfg.modulesOnFolder :
          ol3dsCfg.modulesOffFolder;

  
  var localSrcPath =
      __dirname+'/../temp/'+modFolder+'/precompile/client'+req.path;
  localSrcPath = path.normalize(localSrcPath);
  if(!fs.existsSync(localSrcPath)) {
    next();
    return;
  }
  var localDestPath =
      __dirname+'/../temp/'+modFolder+'/compile/client'+req.path;
  localDestPath = path.normalize(localDestPath);
  localDestPath = path.join(
      path.dirname(localDestPath),
      path.basename(localDestPath, '.plovr.json')+'.js'
  );
  
  var plovrId = ol3ds.plovr.getId(localSrcPath);
  var plovrDomain = 'http://localhost:9810/';
  var plovrUrl = plovrDomain+'compile?id='+plovrId;
  var plovrSourcemap = plovrDomain+'sourcemap?id='+plovrId;
  
  if(fs.existsSync(localDestPath)) {
    res.setHeader('x-sourcemap', plovrSourcemap);
    fs.createReadStream(localDestPath).pipe(res);
    return;
  }
  
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
    r.on('response', function(response) {
      response.headers['x-sourcemap'] = plovrSourcemap;
    });
    r.pipe(res);
    r.pipe(fs.createWriteStream(localDestPath));
      return;
  }
});

goog.array.forEach(ol3dsCfg.libMappings, function(lm) {
  var physdir = (__dirname+'/../'+lm.src).replace(/\//g, path.sep);
  app.use('/'+lm.dest, express.static(physdir));
});

var serveHtmlFiles = function(req, res, next, modulesOn) {
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
    var htmlName = 'index.html';
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
    var gulpTask = modulesOn ? 'htmlpathabsmodon' : 'htmlpathabsmodoff';
    gulp.start(gulpTask, function(err) {
      var precompiledPath =
          path.relative(__dirname+'/../src/client/', localHtmlPath);
      var modFolder = modulesOn ? ol3dsCfg.modulesOnFolder :
          ol3dsCfg.modulesOffFolder;
      precompiledPath = __dirname+'/../temp/'+modFolder+
          '/precompile/client/'+precompiledPath;
      precompiledPath = path.normalize(precompiledPath);
      
      var fcontent = fs.readFileSync(precompiledPath);
      var $ = cheerio.load(fcontent);
      //replace links to *.plovr.json
      $('script[src$=\'.plovr.json\']').each(function(i, elem) {
          var src = $(this).attr('src');
          var srcName = path.basename(src);
          var srcBasename = path.basename(src, '.plovr.json');
          if(modulesOn) {
            srcBasename += '.'+ol3dsCfg.modulesOnFolder;
            srcName = srcBasename + '.plovr.json';
          }
          var srcPlovrPath =
              path.resolve(path.dirname(localHtmlPath), srcName);
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
};

//deal with HTML files
app.use('/'+ol3dsCfg.modulesOnFolder+appPath, function(req, res, next) {
  serveHtmlFiles(req, res, next, true);
});

//deal with HTML files
app.use(appPath, function(req, res, next) {
  serveHtmlFiles(req, res, next, false);
});

var physdir = __dirname+'/../src/client/'.replace(/\//g, path.sep);
app.use(appPath, express.static(physdir, {
  redirect: true
}));
app.use('/'+ol3dsCfg.modulesOnFolder+appPath, express.static(physdir, {
  redirect: true
}));



app.listen(port, function() {
  console.log("Server is up");
});


