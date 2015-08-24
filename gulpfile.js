var gulp = require('gulp');
var watch = require('gulp-watch');
var shell = require('gulp-shell');
var path = require('path');

// in a task
 
gulp.task('default', function () {

  var options = {
    templateData: {
      f: function (filePath) {
        filePath = path.relative('.', filePath);
        filePath = filePath.replace(/\\/g,"/");
        return filePath;
      }
    }
  };
  
  watch('./src/client/**/*.js')
    .pipe(shell(['fixjsstyle ' +
          '--jslint_error=all ' +
          '--custom_jsdoc_tags=event,fires,api,observable ' +
          '--strict ' +
          '<%= f(file.path) %>'], options));
  
});

 
