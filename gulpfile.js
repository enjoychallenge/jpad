var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
require('./bower_components/closure-library/closure/goog/bootstrap/nodejs');
var glob = require('glob');
var ol3dsCfg = require('./config.js');


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

gulp.task('fixlint', ['fix', 'lint']);
gulp.task('default', ['dev']);