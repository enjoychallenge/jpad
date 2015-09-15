var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
require('./bower_components/closure-library/closure/goog/bootstrap/nodejs');
var runSequence = require('run-sequence');
var ol3dsCfg = require('./config.js');
var htmlpathabs = require('./tasks-gulp/util/htmlpathabs.js');
var jspathabs = require('./tasks-gulp/util/jspathabs.js');


var argv = require('yargs')
    .usage('Usage: gulp <command> [options]')
    .command('dev', 'Run dev server and open app.')
    .command('build', 'Compile and refactor files for publishing.')
    .option('s', {
        type: 'boolean',
        alias: 'sourcemap',
        describe: 'Generate source maps for JS files.' +
            ' Related to \'build\' task only.'
    })
    .help('h')
    .alias('h', 'help')
    .argv;

ol3dsCfg.generateSourceMaps = !!argv.s;

function loadTask(task) {
    require('./tasks-gulp/' + task)(gulp, plugins, ol3dsCfg);
}
loadTask('build');
loadTask('dev');
loadTask('dev-lint');
loadTask('fix');
loadTask('lint');

gulp.task('fixlint', function(cb) {
  runSequence('fix', 'lint', cb);
});

gulp.task('htmlpathabs', function() {
  var src = './src/client/**/*.html';
  var dest = './precompile/client';
  return gulp.src(src)
      //.pipe(newer(dest))
      .pipe(htmlpathabs())
      .pipe(gulp.dest(dest));
      

});
gulp.task('jspathabs', function() {
  var src = './src/client/**/*.js';
  var dest = './precompile/client';
  return gulp.src(src)
      //.pipe(newer(dest))
      .pipe(jspathabs())
      .pipe(gulp.dest(dest));
      

});
gulp.task('default', ['dev']);