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

  gulp.task('lint:mocha', function (cb) {
    return gulp.src('tasks-gulp/mocha/lint.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(plugins.mocha({reporter: 'dot'}));
    cb();
    
  });


  gulp.task('lint', ['lint:gjslint', 'lint:mocha']);
};

