'use strict';
var url = require('url');
var ol3dsCfg = require('../../config.js');
var acorn = require("acorn");
var escodegen = require("escodegen");
var estraverse = require("estraverse");

require('./../../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');


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
 * @param {type} $
 */
var absolutizePathsInJs = function(ast, htmlPath) {
  estraverse.replace(ast, {
    enter: function (node, parent) {
      if(node.type==='Literal' &&
          goog.isString(node.value) &&
          goog.string.startsWith(node.value, './')) {
        var src = node.value;
        src = url.resolve('/'+htmlPath, src);
        src = ol3dsCfg.appPath + src.substr(1);
        //console.log('src', src);
        node.value = src;
        return node;
      }
    }
  });
};

module.exports = {
  absolutizePathsInHtml: absolutizePathsInHtml,
  absolutizePathsInJs: absolutizePathsInJs
};
