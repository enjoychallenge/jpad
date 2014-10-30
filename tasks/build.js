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
      build: ["client/public"],
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
          var dst = pth.replace('client/src/', 'client/public/');
          dst = dst.replace('.plovr.json', '.js');
          var result = 'java -jar bower_components/plovr/index.jar build ' +
              pth + ' > ' + dst;
          return result;
        }).join('&')
      }
    },
    createPublicHtml: {
      my: {
        files: publBowerFiles
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  
  grunt.registerMultiTask(
    'createPublicHtml',
    'Creating client/public/**/*.html',
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
            dest: path.relative('client/public/', dest)
          });
        });
      });
      //end of grunt-contrib-copy
      
      var findPathToReplace = function(url) {
        return goog.array.find(urlsToReplace, function(urlToReplace) {
          return goog.string.endsWith(url, urlToReplace.src);
        });
      };
      
      var htmls = grunt.file.expand('client/src/**/*.html');
      
      goog.array.forEach(htmls, function(htmlPath) {
        var cnt = grunt.file.read(htmlPath);
        var pathPrefix = path.relative('client/src/', path.dirname(htmlPath));
        var urlToReplace;
        cnt = cnt.replace(/^(.*<(link|script).* (?:src|href)=['"])([^'"]+)(['"].*\/(\2)?>.*$)/gmi,
            function(match, prefix, tag, url, postfix) {
              // plovr-compiled CSS
              if(url.indexOf('http://localhost:9810/css/')==0) {
                var plovrId = url.substring(26, url.length-1);
                if(goog.string.caseInsensitiveEndsWith(plovrId, '-debug')) {
                  plovrId = plovrId.substring(0, plovrId.length-6);
                }
                var plovrConfig = grunt.file.readJSON(plovrIds[plovrId]);
                var dstCss = plovrConfig['css-output-file'];
                dstCss = dstCss.replace('../public/', '');
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
              } else if(goog.string.endsWith(url, 'css/plovr.css')) {
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
        var dst = htmlPath.replace('client/src/', 'client/public/');
        fse.ensureDirSync(path.dirname(dst));
        grunt.file.write(dst, cnt);
      });
      
      goog.array.forEach(prodPlovrConfigs, function(pth) {
        var dst = pth.replace('client/src/', 'client/public/');
        fse.ensureDirSync(path.dirname(dst));
      });
      
      
    }
  );

  
  grunt.registerTask(
    'updatePathsInPublicCss',
    'Updating paths in public CSSs built by Plovr',
    function() {
      goog.array.forEach(prodPlovrCsss, function(plovrBuildCss) {
        var pathPrefix = path.relative('client/public/', path.dirname(plovrBuildCss));

        var cnt = grunt.file.read(plovrBuildCss);
        cnt = cnt.replace(/url\(\s?(['"]?)(?:\.\.\/)+(img\/[^'")]+)\1\s?\)/gmi,
            function(match, wrapper, imgPath) {
              var imgPath = path.relative(pathPrefix, imgPath);
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
  
  
  grunt.registerTask('updatePublic', ['clean:build', 'copy:fromBower', 'copy:fromSrc', 'createPublicHtml:my']);
  grunt.registerTask('build', ['updatePublic', 'shell:buildUsingPlovr', 'updatePathsInPublicCss']);

};