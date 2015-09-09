var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var config = {
  appPath: 'path/to/application'
};

function loadTask(task) {
    require('./tasks-gulp/' + task)(gulp, plugins, config);
}
loadTask('build');
loadTask('dev');
loadTask('dev-lint');
loadTask('fix');
loadTask('lint');

gulp.task('fixlint', ['fix', 'lint']);
gulp.task('default', ['dev']);