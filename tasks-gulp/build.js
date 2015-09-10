'use strict';
var glob = require("glob");
var path = require("path");
var fs = require("fs-extra");

require('./../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');

module.exports = function (gulp, plugins, ol3dsCfg) {
  
  gulp.task('build:css:min', function () {

    var stream = gulp.src('src/client/**/*.css')
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('build/client'));
    return stream;
  });

  gulp.task('build:css:absolutize-paths', ['build:css:min'], function (cb) {
    var css = require('css');
    var fpaths = glob.sync('build/client/**/*.css');
    goog.array.forEach(fpaths, function(fpath) {
      var fcontent = fs.readFileSync(fpath, {encoding: 'utf-8'});
      var cssobj = css.parse(fcontent);
      
      var processRules = function(rules) {
        goog.array.forEach(rules, function(rule) {
          if(rule.declarations) {
            processDeclarations(rule.declarations);
          } else if(rule.rules) {
            processRules(rule.rules);
          }
        });
      };
      
      var processDeclarations = function(declarations) {
        goog.array.forEach(declarations, function(declaration) {
          var declval = declaration.value;
          declval = declval.replace(
              /(^|^.* )url\(\s*(['"]?)(.+)\1\s*\)($| .*$)/gmi,
              function(match, prefix, wrapper, pth, postfix) {
                var completePath = path.resolve(path.dirname(fpath), pth);
                var relPath = path.relative('build/client/', completePath);
                relPath = ol3dsCfg.appPath + relPath.replace(/\\/g, '/');
                var result = prefix + 'url(' + wrapper + relPath;
                result += wrapper + ')' + postfix;
                return result;
              }
          );
          declaration.value = declval;
        });
      };
      processRules(cssobj.stylesheet.rules);
      
      var cssout = css.stringify(cssobj, {compress:true});
      fs.writeFileSync(fpath, cssout, {encoding: 'utf-8'});
    });

    cb();
  });


  gulp.task('build', ['build:css:min', 'build:css:absolutize-paths']);
};

