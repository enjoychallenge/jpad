'use strict';
var url = require('url');
var ol3dsCfg = require('../../config.js');
var acorn = require("acorn");
var escodegen = require("escodegen");
var estraverse = require("estraverse");
var fs = require("fs-extra");
var path = require("path");

require('./../../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');
goog.require('goog.asserts');


/**
 * @param {type} $
 */
var absolutizePathsInHtml = function($, htmlPath) {
  $('[href]').each(function(i, elem) {
      var href = $(this).attr('href');
      if(!(goog.string.startsWith(href, '/') ||
          goog.string.contains(href, '//'))) {
        href = url.resolve('/'+htmlPath, href);
        href = ol3dsCfg.appPath + href.substr(1);
        $(this).attr('href', href);
      }
  });
  $('[src]').each(function(i, elem) {
      var src = $(this).attr('src');
      if(!(goog.string.startsWith(src, '/') ||
          goog.string.contains(src, '//'))) {
        src = url.resolve('/'+htmlPath, src);
        src = ol3dsCfg.appPath + src.substr(1);
        $(this).attr('src', src);
      }
  });
};

/**
 * @param {type} ast
 */
var absolutizePathsInJs = function(ast, jsPath) {
  estraverse.replace(ast, {
    enter: function (node, parent) {
      if(node.type==='Literal' &&
          goog.isString(node.value) &&
          goog.string.startsWith(node.value, './')) {
        var src = node.value;
        src = url.resolve('/'+jsPath, src);
        src = ol3dsCfg.appPath + src.substr(1);
        //console.log('src', src);
        node.value = src;
        return node;
      }
    }
  });
};

/**
 * @param {string} plovrJsonPath
 */
var getCompilerMode = function(plovrJsonPath) {
  
  var getMode = function(pth) {
    var fcontent = fs.readFileSync(pth);
    var json = JSON.parse(fcontent);
    var mode = json['mode'];
    if(mode) {
      return mode;
    } else {
      var inherits = json['inherits'];
      goog.asserts.assert(!!inherits);
      var newPath = path.resolve(path.dirname(pth), inherits);
      return getMode(newPath);
    }
  };
  return getMode(plovrJsonPath);
};

module.exports = {
  absolutizePathsInHtml: absolutizePathsInHtml,
  absolutizePathsInJs: absolutizePathsInJs,
  plovr: {
    getCompilerMode: getCompilerMode
  }
};
