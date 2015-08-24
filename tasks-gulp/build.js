'use strict';

module.exports = function (gulp, plugins) {
  
  gulp.task('build:css', function (cb) {

    gulp.src('src/client/**/*.css')
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('build/client'));

    cb();
  });


  gulp.task('build', ['build:css']);
};

