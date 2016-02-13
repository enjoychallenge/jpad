'use strict';


module.exports = function (gulp, plugins) {
  
  gulp.task('build6:compile', /*['install:clean-temp'], */function (cb) {
    
    var exec = require('child_process').exec;
 
    var cmd = 'java -jar bower_components/closure-compiler/compiler.jar ' +
        '--flagfile tasks/build6.flags.txt';
    
    exec(cmd, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });

  });


  gulp.task('build6', ['build6:compile']);

};


