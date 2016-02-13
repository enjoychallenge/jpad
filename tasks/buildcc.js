'use strict';


module.exports = function (gulp, plugins) {
  
  gulp.task('buildcc:compile', /*['install:clean-temp'], */function (cb) {
    
    var exec = require('child_process').exec;
 
    var cmd = 'java -jar bower_components/closure-compiler/compiler.jar ' +
        '--flagfile tasks/buildcc.flags.txt';
    
    exec(cmd, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });

  });


  gulp.task('buildcc', ['buildcc:compile']);

};


