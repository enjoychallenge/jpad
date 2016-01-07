'use strict';
var spawn = require('child_process').spawn;
var htmlpathabs = require('./util/htmlpathabs.js');
var jspathabs = require('./util/jspathabs.js');
var plovrpathupd = require('./util/plovrpathupd.js');
var vinylPaths = require('vinyl-paths');
var path = require("path");
var fs = require("fs-extra");
var ol3ds =  require('../tasks-gulp/util/ol3ds.js');
var glob = require('glob');
require('./../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');

module.exports = function (gulp, plugins, ol3dsCfg) {
  var plovr;
  
  gulp.task('dev:clean-temp', function (cb) {
    fs.removeSync('temp');
    cb();
  });
  
  gulp.task('dev:serve:plovr', ['precompile:plovr', 'precompile:js'], function (cb) {
    //start plovr server
    var args = ['-jar', 'bower_components/plovr/index.jar', 'serve'];
    var plovrConfigs = ol3ds.plovr.getPrecompileConfigs();
    goog.array.extend(args, plovrConfigs);
    plovr = spawn('java', args);
    var logData = function (data) {
      console.log(data.toString());
    };
    plovr.stdout.on('data', logData);
    plovr.stderr.on('data', logData);
    plovr.on('close', function (code) {
      if(code!==null) { 
       console.log('plovr exited with code ' + code);
      }
    });
    
    cb();
  });
  
  gulp.task('dev:serve', ['dev:serve:plovr'], function (cb) {
    //run dev server 
    var server = plugins.liveServer(
        './server/server-gulp-dev.js',
        undefined,
        false
    );
    server.start();
 
    //restart dev server 
    gulp.watch('./server/server-gulp-dev.js', function() {
        server.start.apply(server);
    });
    
    cb();
  });

  gulp.task('dev:open', ['dev:serve'], function(){
    var url = 'http://localhost:'+ol3dsCfg.port + ol3dsCfg.appPath;
    gulp.src(__filename)
        .pipe(plugins.open({
          uri: url
        }));
  });
  
  gulp.task('htmlpathabsmodoff', function() {
    var src = './src/client/**/*.html';
    var modFolder = ol3dsCfg.modulesOffFolder;
    var dest = './temp/'+modFolder+'/precompile/client';
    return gulp.src(src)
        .pipe(plugins.newer(dest))
        .pipe(htmlpathabs({includeModulesOnFolder: false}))
        .pipe(gulp.dest(dest));
  });
  
  gulp.task('htmlpathabsmodon', function() {
    var src = './src/client/**/*.html';
    var modFolder = ol3dsCfg.modulesOnFolder;
    var dest = './temp/'+modFolder+'/precompile/client';
    return gulp.src(src)
        .pipe(plugins.newer(dest))
        .pipe(htmlpathabs({includeModulesOnFolder: true}))
        .pipe(gulp.dest(dest));
  });
  
  gulp.task('precompile:js', ['precompile:js:modoff', 'precompile:js:modon']);

  gulp.task('precompile:js:modoff', function() {
    var src = [
      'src/client/**/*.js',
      '!src/client/**/*.externs.js',
      '!src/client/**/*.modon.js'
    ];
    var modFolder = ol3dsCfg.modulesOffFolder;
    var dest = './temp/'+modFolder+'/precompile/client';
    return gulp.src(src)
        .pipe(plugins.newer(dest))
        .pipe(jspathabs({includeModulesOnFolder: false}))
        .pipe(gulp.dest(dest));
  });

  gulp.task('precompile:js:modon', function() {
    var src = [
      'src/client/**/*.js',
      '!src/client/**/*.externs.js',
      '!src/client/**/*.modoff.js'
    ];
    var modFolder = ol3dsCfg.modulesOnFolder;
    var dest = './temp/'+modFolder+'/precompile/client';
    return gulp.src(src)
        .pipe(plugins.newer(dest))
        .pipe(jspathabs({includeModulesOnFolder: true}))
        .pipe(gulp.dest(dest));
  });

  gulp.task('precompile:plovr', [
    'precompile:plovr:modoff',
    'precompile:plovr:modon'
  ]);
  
  gulp.task('precompile:plovr:modoff', function() {
    var src = [
      'src/client/**/*.plovr.json',
      '!src/client/**/*.modon.plovr.json',
      '!src/client/**/*.modon.dev.plovr.json'
    ];
    var modFolder = ol3dsCfg.modulesOffFolder;
    var dest = './temp/'+modFolder+'/precompile/client';
    return gulp.src(src)
        .pipe(plugins.newer(dest))
        .pipe(plovrpathupd({modulesOn: false}))
        .pipe(gulp.dest(dest));
  });
  gulp.task('precompile:plovr:modon', function() {
    var src = [
      'src/client/**/*.plovr.json'
    ];
    var modFolder = ol3dsCfg.modulesOnFolder;
    var dest = './temp/'+modFolder+'/precompile/client';
    return gulp.src(src)
        .pipe(plugins.newer(dest))
        .pipe(plovrpathupd({modulesOn: true}))
        .pipe(gulp.dest(dest));
  });
  
  gulp.task('dev:watch:js', ['dev:serve:plovr'], function() {
    var src = './src/client/**/*.js';
    return plugins.watch(src, function() {
      gulp.start(['precompile:js', 'compile:delete-js']);
    });
  });

  gulp.task('compile:delete-js', function(cb) {
    var modFolders = [ol3dsCfg.modulesOnFolder, ol3dsCfg.modulesOffFolder];
    var jss = glob.sync('./temp/@('+modFolders.join('|')+')/compile/**/*.js');
    goog.array.forEach(jss, function(js) {
      fs.unlinkSync(js);
    });
    cb();
  });

  gulp.task('dev:watch:plovr', ['dev:serve:plovr'], function() {
    var src = './src/client/**/*.plovr.json';
    
    return plugins.watch(src)
      .pipe(vinylPaths(function(plovrCfgs) {
        plovrCfgs = goog.isArray(plovrCfgs) ? plovrCfgs : [plovrCfgs];
        goog.array.forEach(plovrCfgs, function(plovrCfg) {
          var modulesOn = path.basename(plovrCfg)
              .indexOf('.'+ol3dsCfg.modulesOnFolder+'.') > -1;
          var modFolder = modulesOn ? ol3dsCfg.modulesOnFolder :
                  ol3dsCfg.modulesOffFolder;
          var dest = './temp/'+modFolder+'/precompile/client';
          var srcp = path.relative('./src/client', plovrCfg);
          var destp = path.join(dest, srcp);
          if(!fs.existsSync(srcp)) {
            fs.unlinkSync(destp);
          }
          //delete compiled JS files
          var depCfgs = ol3ds.plovr.getDependentConfigs(plovrCfg);
          var affectedCfgs = depCfgs.concat();
          affectedCfgs.push(path.normalize(path.resolve('.', plovrCfg)));
          
          goog.array.forEach(affectedCfgs, function(affCfg) {
            modulesOn = path.basename(affCfg)
                .indexOf('.'+ol3dsCfg.modulesOnFolder+'.') > -1;
            modFolder = modulesOn ? ol3dsCfg.modulesOnFolder :
                    ol3dsCfg.modulesOffFolder;
            var relCfg = path.relative('./src/', affCfg);
            var affScript = path.join('./temp/'+modFolder+'/compile', relCfg);
            affScript = path.join(path.dirname(affScript),
                path.basename(affScript, '.plovr.json')+'.js');
            if(fs.existsSync(affScript)) {
              fs.unlinkSync(affScript);
            }
            
          });
        }, this);
        if(plovr) {
          console.log('Stopping plovr.');
          plovr.kill();
          plovr = null;
        }
        gulp.start(['dev:serve:plovr']);
        return Promise.resolve();
    }));

  });
  
  gulp.task('dev', ['dev:clean-temp'], function() {
    gulp.start([
      'dev:serve',
      'dev:open',
      'dev:watch:plovr',
      'dev:watch:js'
    ]);
  });
};

