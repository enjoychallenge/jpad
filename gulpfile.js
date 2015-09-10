var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var glob = require('glob');

var ol3dsCfg = {
  appPath: 'path/to/application',
  plovrCfgs: glob.sync('src/client/**/*.plovr.json')
};

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