var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
require('./bower_components/closure-library/closure/goog/bootstrap/nodejs');
var runSequence = require('run-sequence');
var ol3dsCfg = require('./config.js');

var argv = require('yargs')
    .usage('Usage: gulp <command> [options]')
    .command('build', 'Compile and refactor files for publishing.')
    .command('dev', 'Run dev server and open app.')
    .command('devlint', 'Run watcher for linting and fixing ' +
        'source code style in Closure way immediately during editing.')
    .command('fix', 'Fix source code style in Closure way.')
    .command('fixlint', 'Fix and lint source code style ' +
        'in Closure and ol3ds way.')
    .command('lint', 'Lint source code style in Closure and ol3ds way.')
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
loadTask('devlint');
loadTask('fix');
loadTask('lint');

gulp.task('fixlint', function(cb) {
  runSequence('fix', 'lint', cb);
});

gulp.task('default', ['dev']);