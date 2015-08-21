'use strict';
require('./../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.string');

var fse = require('fs-extra');
var path = require('path');

module.exports = function(grunt) {
  /*var plovrConfigs = this.data.plovrConfigs;
  if(!plovrConfigs) {
    throw new Error('`plovrConfigs` required');
  }*/
  var prodPlovrConfigs = grunt.config('prodPlovrConfigs');
  if(!prodPlovrConfigs) {
    throw new Error('`prodPlovrConfigs` required');
  }
  var plovrIds = grunt.config('plovrIds');
  if(!plovrIds) {
    throw new Error('`provrIds` required');
  }
  var prodPlovrCsss = grunt.config('prodPlovrCsss');
  if(!prodPlovrCsss) {
    throw new Error('`prodPlovrCsss` required');
  }
  var publBowerFiles = grunt.config('publBowerFiles');
  if(!publBowerFiles) {
    throw new Error('`publBowerFiles` required');
  }
  var publSrcFiles = grunt.config('publSrcFiles');
  if(!publSrcFiles) {
    throw new Error('`publSrcFiles` required');
  }

  grunt.config.merge({
    clean: {
      build: ["build/client"]
    },
    copy: {
      fromBower: {
        files: publBowerFiles
      },
      fromSrc: {
        files: publSrcFiles
      }
    },
    shell: {
      buildUsingPlovr: {
        command: goog.array.map(prodPlovrConfigs, function(pth) {
          var useMap = grunt.option('map');
          var dst = pth.replace('src/client/', 'build/client/');
          dst = dst.replace('.plovr.json', '.js');
          var result = 'java -jar bower_components/plovr/index.jar build ';
          if(useMap) {
            result += '--create_source_map ' + dst + '.map ';
          }
          result += pth + ' > ' + dst;
          return result;
        }).join('&')
      }
    },
    createBuildHtml: {
      my: {
        files: publBowerFiles
      }
    },
    open: {
      build: {
        path: 'http://localhost:9000/build/client/'
      }
    }
  });

  require('load-grunt-tasks')(grunt);


  grunt.registerTask(
      'addSourceMapUrl',
      'Add source map URL if map option is true.',
      function() {
        goog.array.forEach(prodPlovrConfigs, function(pth) {
          var dst = pth.replace('src/client/', 'build/client/');
          dst = dst.replace('.plovr.json', '.js');
          var cnt = grunt.file.read(dst);
          cnt += '//# sourceMappingURL='+path.basename(dst)+'.map';
          grunt.file.write(dst, cnt);
        });
      }
  );


  grunt.registerMultiTask(
    'createBuildHtml',
    'Creating build/client/**/*.html',
    function() {
      
      //taken from grunt-contrib-copy
      var dest;
      var isExpandedPair;
      
      var urlsToReplace = [];
      
      this.files.forEach(function(filePair) {
        isExpandedPair = filePair.orig.expand || false;

        filePair.src.forEach(function(src) {
          if (detectDestType(filePair.dest) === 'directory') {
            dest = (isExpandedPair) ? filePair.dest : unixifyPath(path.join(filePair.dest, src));
          } else {
            dest = filePair.dest;
          }
          urlsToReplace.push({
            src: src,
            dest: path.relative('build/client/', dest)
          });
        });
      });
      //end of grunt-contrib-copy
      
      var findPathToReplace = function(url) {
        return goog.array.find(urlsToReplace, function(urlToReplace) {
          return goog.string.endsWith(url, urlToReplace.src);
        });
      };
      
      var absBuildPath = path.resolve('.', 'build/');
      var absSrcPath = path.resolve('.', 'src/');
      var htmls = grunt.file.expand('src/client/**/*.html');
      
      goog.array.forEach(htmls, function(htmlPath) {
        var cnt = grunt.file.read(htmlPath);
        var pathPrefix = path.relative('src/client/', path.dirname(htmlPath));
        var absHtmlPath = path.resolve('.', htmlPath);
        var htmlRelPath = path.relative(absSrcPath, absHtmlPath);
        var absBuildHtmlPath = path.join(absBuildPath, htmlRelPath);
        var urlToReplace;
        cnt = cnt.replace(/^(.*<(link|script).* (?:src|href)=['"])([^'"]+)(['"].*\/(\2)?>.*$)/gmi,
            function(match, prefix, tag, url, postfix) {
              // plovr-compiled CSS
              if(url.indexOf('http://localhost:9810/css/')==0) {
                var plovrId = url.substring(26, url.length-1);
                if(goog.string.caseInsensitiveEndsWith(plovrId, '-debug')) {
                  plovrId = plovrId.substring(0, plovrId.length-6);
                }
                var plovrConfigPath = plovrIds[plovrId];
                var plovrConfig = grunt.file.readJSON(plovrConfigPath);
                var dstCss = plovrConfig['css-output-file'];
                plovrConfigPath = path.resolve('.', plovrConfigPath);
                var plovrConfigDir = path.dirname(plovrConfigPath);
                var absCssPath = path.resolve(plovrConfigDir, dstCss);
                dstCss = path.relative(path.dirname(absBuildHtmlPath),
                    absCssPath);
                dstCss = dstCss.replace(/\\/g,"/");
                var result = prefix + dstCss + postfix;
              // plovr-compiled JS
              } else if (url.indexOf('http://localhost:9810/compile?')==0) {
                plovrId = (new goog.Uri(url)).getParameterValue('id');
                if(goog.string.caseInsensitiveEndsWith(plovrId, '-debug')) {
                  plovrId = plovrId.substring(0, plovrId.length-6);
                }
                var dstJs = plovrIds[plovrId];
                dstJs = path.basename(dstJs, '.plovr.json')+'.js';
                result = prefix + dstJs + postfix;
              // plovr.css
              } else if(goog.string.endsWith(url, 'plovr.css')) {
                result = '';
              // references to bower_components
              } else if((urlToReplace = findPathToReplace(url))) {
                var filePath = path.relative(pathPrefix, urlToReplace.dest);
                filePath = filePath.replace(/\\/g,"/");
                result = prefix + filePath + postfix;
              } else {
                result = match;
              }
              return result;
            });
        var dst = htmlPath.replace('src/client/', 'build/client/');
        fse.ensureDirSync(path.dirname(dst));
        grunt.file.write(dst, cnt);
      });
      
      goog.array.forEach(prodPlovrConfigs, function(pth) {
        var dst = pth.replace('src/client/', 'build/client/');
        fse.ensureDirSync(path.dirname(dst));
      });
      
      
    }
  );

  
  grunt.registerTask(
    'updatePathsInBuildCss',
    'Updating paths in CSSs built by Plovr',
    function() {
      goog.array.forEach(prodPlovrCsss, function(plovrBuildCss) {
        var pathPrefix = path.relative('build/client/', path.dirname(plovrBuildCss));

        var cnt = grunt.file.read(plovrBuildCss);
        cnt = cnt.replace(/url\(\s?(['"]?)(?:\.\.\/)+(img\/[^'")]+)\1\s?\)/gmi,
            function(match, wrapper, imgPath) {
              imgPath = path.relative(pathPrefix, imgPath);
              imgPath = imgPath.replace(/\\/g,"/");
              var result = "url('"+imgPath+"')";
              return result;
            });
        grunt.file.write(plovrBuildCss, cnt);
      });
      
    }
  );

  //taken from grunt-contrib-copy
  var detectDestType = function(dest) {
    if (grunt.util._.endsWith(dest, '/')) {
      return 'directory';
    } else {
      return 'file';
    }
  };
  var unixifyPath = function(filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };
  //end grunt-contrib-copy
  
  
  grunt.registerTask('updateBuild', ['clean:build', 'copy:fromBower', 'copy:fromSrc', 'createBuildHtml:my']);
var buildTasks = [
    'updateBuild',
    'shell:buildUsingPlovr',
    'updatePathsInBuildCss',
    'open:build'
  ];
  var useMap = grunt.option('map');
  if (useMap) {
    buildTasks.push('addSourceMapUrl');
  }
  grunt.registerTask('build', buildTasks);

};