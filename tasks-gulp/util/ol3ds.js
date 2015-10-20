'use strict';
var url = require('url');
var ol3dsCfg = require('../../config.js');
var fs = require("fs-extra");
var path = require("path");
var glob = require('glob');
var recast = require('recast');

require('./../../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');
goog.require('goog.object');
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
  recast.visit(ast, {
    visitLiteral: function(path) {
      var node = path.node;
      if(goog.isString(node.value) &&
          goog.string.startsWith(node.value, './')) {
        var src = node.value;
        src = url.resolve('/'+jsPath, src);
        src = ol3dsCfg.appPath + src.substr(1);
        //console.log('src', src);
        node.value = src;
        return node;
      }
      this.traverse(path);
    }
  });
};

var plovr = {};

/**
 * @param {type} ast
 */
plovr.updatePaths = function(json, plovrSrcPath, plovrDestPath) {
  var srcDir = path.dirname(plovrSrcPath);
  var destDir = path.dirname(plovrDestPath);
  var srcClientDir = path.resolve('./src/client');
  var replacePath = function(pth) {
    var p = path.resolve(srcDir, pth);
    p = path.relative(destDir, p);
    p = p.replace(/\\/g, '/');
    return p;
  };
  
  if(json['closure-library']) {
    json['closure-library'] = replacePath(json['closure-library']);
  }
  if(json["externs"]) {
    json["externs"] = goog.array.map(json["externs"], function(p) {
      return replacePath(p);
    })
  }
  if(json["paths"]) {
    json["paths"] = goog.array.map(json["paths"], function(p) {
      p = path.normalize(path.resolve(srcDir, p));
      var rp = path.normalize(path.relative(srcClientDir, p));
      if(rp.indexOf('..')!==0 && p.indexOf(srcClientDir)===0) {
        p = path.join('./temp/precompile/client', rp);
        p = path.resolve(p);
        p = path.relative(destDir, p).replace(/\\/g, '/');
        if(rp === '.') {
          p += '/../client'
        }
      } else {
        p = replacePath(p);
      }
      return p;
    });
  }
};

/**
 * @param {string} plovrJsonPath
 */
plovr.getCompilerMode = function(plovrJsonPath) {
  
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

/**
 * @param {string} srcCfgPath
 */
plovr.getDependentConfigs = function(srcCfgPath) {
  srcCfgPath = path.normalize(path.resolve('.', srcCfgPath));
  var pths = plovr.getConfigs();
  pths = goog.array.map(pths, function(p) {
    return path.normalize(path.resolve('.', p));
  });
  goog.asserts.assert(goog.array.contains(pths, srcCfgPath));
  
  var depLinks = {};
  
  goog.array.forEach(pths, function(pth) {
    var fcontent = fs.readFileSync(pth);
    var json = JSON.parse(fcontent);
    var inherits = json['inherits'];
    if(inherits) {
      var p = path.resolve(path.dirname(pth), inherits);
      if(!goog.object.containsKey(depLinks, p)) {
        depLinks[p] = [];
      }
      depLinks[p].push(pth);
    }
    if(!depLinks[pth]) {
      depLinks[pth] = [];
    }
  });
  
  var result = [];
  var deps = depLinks[srcCfgPath].concat();
  while(deps.length) {
    var p = deps.shift();
    result.push(p);
    goog.array.extend(deps, depLinks[p]);
  };
  return result;
};

plovr.getConfigs = function() {
  return glob.sync(ol3dsCfg.plovrPattern);
};

plovr.getPrecompileConfigs = function() {
  var cfgs = plovr.getConfigs();
  var result = goog.array.map(cfgs, function(cfg) {
    return plovr.srcToPrecompilePath(cfg);
  });
  return result;
};

plovr.getPrecompileMainConfigs = function() {
  var cfgs = plovr.getMainConfigs();
  var result = goog.array.map(cfgs, function(cfg) {
    return plovr.srcToPrecompilePath(cfg);
  });
  return result;
};

plovr.getMainConfigs = function() {
  return glob.sync(ol3dsCfg.plovrPattern, {
    ignore: [
      'src/client/**/*.dev.plovr.json',
      'src/client/**/*.modon.plovr.json'
    ]
  });
};

plovr.getHtmls = function() {
  return glob.sync(ol3dsCfg.plovrHtmlPattern);
};

plovr.srcToPrecompilePath = function(srcCfgPath) {
  var src = path.relative('./src', srcCfgPath);
  var result = path.join('./temp/precompile', src);
  return result;
};

module.exports = {
  absolutizePathsInHtml: absolutizePathsInHtml,
  absolutizePathsInJs: absolutizePathsInJs,
  plovr: plovr
};
