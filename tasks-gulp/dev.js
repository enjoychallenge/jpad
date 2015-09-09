'use strict';

module.exports = function (gulp, plugins, gulpcfg) {
  
  gulp.task('dev:serve', function (cb) {

    //1. run your script as a server 
    var server = plugins.liveServer(
        './server/server.js',
        {env: {OL3DS_APPPATH: gulpcfg.appPath}},
        false
    );
    server.start();
 
    //restart my server 
    gulp.watch('./server/server.js', server.start.bind(server));

    cb();
  });


  gulp.task('dev', ['dev:serve']);
};

