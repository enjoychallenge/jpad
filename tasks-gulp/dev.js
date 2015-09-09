'use strict';
var spawn = require('child_process').spawn;
require('./../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');

module.exports = function (gulp, plugins, ol3dsCfg) {
  
  gulp.task('dev:serve', function (cb) {
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

    //run dev server 
    var server = plugins.liveServer(
        './server/server.js',
        {env: {OL3DS_APPPATH: ol3dsCfg.appPath}},
        false
    );
    server.start();
 
    //restart dev server 
    gulp.watch('./server/server.js', server.start.bind(server));

    cb();
  });


  gulp.task('dev', ['dev:serve']);
};

