'use strict';

module.exports = function (gulp, plugins) {
  
  gulp.task('lint:gjslint', function (cb) {

    gulp.src('src/client/**/*.js')
        .pipe(plugins.gjslint({
            flags: [
              '--jslint_error=all',
              '--strict',
              '--custom_jsdoc_tags=event,fires,api,observable'
            ]
        }))
        .pipe(plugins.gjslint.reporter('console'));

    cb();
  });


  gulp.task('lint', ['lint:gjslint']);
};

