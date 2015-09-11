'use strict';
var glob = require("glob");
var path = require("path");
var fs = require("fs-extra");
var exec = require('child_process').exec;

require('./../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');

module.exports = function (gulp, plugins, ol3dsCfg) {
  
  gulp.task('build:clean', function (cb) {
    fs.removeSync('build');
    cb();
  });

  gulp.task('build:plovr', function (cb) {
    var useMap = ol3dsCfg.generateSourceMaps;
    var ncmds = ol3dsCfg.mainPlovrCfgs.length;
    if(!ncmds) {
      cb();
    }
    goog.array.forEach(ol3dsCfg.mainPlovrCfgs, function(pth) {
      var dst = pth.replace('src/client/', 'build/client/');
      dst = dst.replace('.plovr.json', '.js');
      fs.mkdirsSync(path.dirname(dst));
      fs.mkdirsSync(path.dirname(dst));
      var cmd = 'java -jar bower_components/plovr/index.jar build ';
      if(useMap) {
        cmd += '--create_source_map ' + dst + '.map ';
      }
      cmd += pth + ' > ' + dst;
      exec(cmd, function(error, stdout, stderr) {
        if(stdout) {
          console.log('stdout', pth, error.toString());
        }
        if(error) {
          cb(error);
        } else {
          ncmds--;
          if(!ncmds) {
            cb();
          }
        }
      });
    });
  });

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


  gulp.task('build', [
    'build:clean',
    'build:plovr',
    'build:css:min',
    'build:css:absolutize-paths'
  ]);
};

