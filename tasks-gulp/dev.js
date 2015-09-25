'use strict';
var spawn = require('child_process').spawn;
var htmlpathabs = require('./util/htmlpathabs.js');
var jspathabs = require('./util/jspathabs.js');
require('./../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');

module.exports = function (gulp, plugins, ol3dsCfg) {
  
  gulp.task('dev:serve:plovr', function (cb) {
    //start plovr server
    var args = ['-jar', 'bower_components/plovr/index.jar', 'serve'];
    goog.array.extend(args, ol3dsCfg.plovrCfgs);
    var plovr = spawn('java', args);
    var logData = function (data) {
      console.log(data.toString());
    };
    plovr.stdout.on('data', logData);
    plovr.stderr.on('data', logData);
    plovr.on('close', function (code) {
      console.log('plovr exited with code ' + code);
    });
    
    cb();
  });
  
  gulp.task('dev:serve', function (cb) {
    //run dev server 
    var server = plugins.liveServer(
        './server/server-gulp-dev.js',
        undefined,
        false
    );
    server.start();
 
    //restart dev server 
    gulp.watch('./server/server-gulp-dev.js', server.start.bind(server));
    
    cb();
  });

  gulp.task('dev:open', function(){
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

  gulp.task('dev', ['dev:serve:plovr', 'dev:serve', 'dev:open']);
};

