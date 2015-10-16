'use strict';
var spawn = require('child_process').spawn;
var htmlpathabs = require('./util/htmlpathabs.js');
var jspathabs = require('./util/jspathabs.js');
var plovrpathupd = require('./util/plovrpathupd.js');
var vinylPaths = require('vinyl-paths');
var path = require("path");
var fs = require("fs-extra");
var ol3ds =  require('../tasks-gulp/util/ol3ds.js');
require('./../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');

module.exports = function (gulp, plugins, ol3dsCfg) {
  var plovr;
  
  gulp.task('dev:serve:plovr', ['plovrpathupd'], function (cb) {
    //start plovr server
    var args = ['-jar', 'bower_components/plovr/index.jar', 'serve'];
    goog.array.extend(args, ol3ds.plovr.getConfigs());
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

  gulp.task('htmlpathabs', function() {
    var src = './src/client/**/*.html';
    var dest = './temp/precompile/client';
    return gulp.src(src)
        //.pipe(newer(dest))
        .pipe(htmlpathabs())
        .pipe(gulp.dest(dest));
  });
  
  gulp.task('jspathabs', function() {
    var src = './src/client/**/*.js';
    var dest = './temp/precompile/client';
    return gulp.src(src)
        //.pipe(newer(dest))
        .pipe(jspathabs())
        .pipe(gulp.dest(dest));
  });

  gulp.task('plovrpathupd', function() {
    var src = './src/client/**/*.plovr.json';
    var dest = './temp/precompile/client';
    return gulp.src(src)
        .pipe(plugins.newer(dest))
        .pipe(plovrpathupd())
        .pipe(gulp.dest(dest));
  });
  
  gulp.task('dev:watch:plovr', ['dev:serve:plovr'], function() {
    var src = './src/client/**/*.plovr.json';
    var dest = './temp/precompile/client';
    
    return plugins.watch(src)
      .pipe(vinylPaths(function(plovrCfgs) {
        plovrCfgs = goog.isArray(plovrCfgs) ? plovrCfgs : [plovrCfgs];
        goog.array.forEach(plovrCfgs, function(plovrCfg) {
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
            var relCfg = path.relative('./src/', affCfg);
            var affScript = path.join('./temp/compile', relCfg);
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
  
  gulp.task('dev', [
    'dev:serve:plovr',
    'dev:serve',
    'dev:open',
    'dev:watch:plovr'
  ]);
};

