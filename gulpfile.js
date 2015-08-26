var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

function loadTask(task) {
    require('./tasks-gulp/' + task)(gulp, plugins);
}
loadTask('build');
loadTask('dev-lint');
loadTask('fix');
loadTask('lint');

gulp.task('fixlint', ['fix', 'lint']);
gulp.task('default', ['dev-lint']);