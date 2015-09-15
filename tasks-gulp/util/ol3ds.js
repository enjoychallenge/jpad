'use strict';
var url = require('url');
var ol3dsCfg = require('../../config.js');



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

module.exports = {
  absolutizePathsInHtml: absolutizePathsInHtml
};
