var glob = require("glob");
var path = require("path");
var TreeModel = require("tree-model");
var assert = require("chai").assert;
var fs = require("fs-extra");
var ol3ds = require('./../util/ol3ds.js');

require('./../../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');
goog.require('goog.math');

describe('namespace', function() {
  var jspaths = glob.sync('src/client/**/*.js', {nodir: true});
  
  var jspartss = goog.array.map(jspaths, ol3ds.getFileParts);
  
  var jsregexps = goog.array.map(jspartss, function(jsparts) {
    var re = new RegExp('^'+jsparts.join('\\.')+'(\\..+|$)');
    return re;
  });
  
  var findCorrectFile = function(namespace) {
    var parts = ol3ds.getNamespaceParts(namespace);
    namespace = parts.join('.');
    var result = null;
    goog.array.forEach(jsregexps, function(jsregexp, idx) {
      if(namespace.match(jsregexp)) {
        if(!result || result.split('.').length<jspartss[idx].length) {
          result = jspaths[idx];
        }
      }
    });
    return result;
  };
  
  var dirTree = new TreeModel();
  var dirRoot = dirTree.parse({name: 'client', path: ''});
  var dirpaths = glob.sync('src/client/**/');
  dirpaths.shift();
  goog.array.forEach(dirpaths, function(dirpath) {
    dirpath = dirpath.substring(0, dirpath.length-1);
    dirpath = path.relative('src/client', dirpath).replace(/\\/g, '/');
    var parts = dirpath.split('/');
    var dirname = parts.pop();
    var modelopts = {name: dirname, path: dirpath};
    var dirnode = dirTree.parse(modelopts);
    var parentPath = parts.join('/');
    var parent = dirRoot.first(function(n) {
      return n.model.path === parentPath;
    });
    parent.addChild(dirnode);
  });

  var findCorrectDir = function(namespace) {
    var parts = ol3ds.getNamespaceParts(namespace);
    var parentPath = parts.join('/');
    var parent = dirRoot.first(function(n) {
      return n.model.path === parentPath;
    });
    parts.pop();
    while(!parent) {
      parentPath = parts.join('/');
      parent = dirRoot.first(function(n) {
        return n.model.path === parentPath;
      });
      parts.pop();
    }
    return parent;
  };


  goog.array.forEach(jspaths, function(completeFpath, fidx) {
    var fpath = path.relative('src/client', completeFpath).replace(/\\/g, '/');
    var fextname = path.basename(fpath);
    var extname = path.extname(fextname);
    var fname = path.basename(fpath, extname);
    
    var fcontent = fs.readFileSync(completeFpath);
    var acorn = require("acorn");
    var tokens = [];
    acorn.parse(fcontent, {onToken: tokens});
    

    var namespaces = [];
    goog.array.forEach(tokens, function(tok, tidx) {
      var tok1 = tokens[tidx+1];
      var tok2 = tokens[tidx+2];
      var tok3 = tokens[tidx+3];
      var tok4 = tokens[tidx+4];
      var tok5 = tokens[tidx+5];
      if(tok1 && tok2 && tok3 && tok4 && tok5 &&
          tok.value === 'goog' && tok.type.label === 'name' &&
              tok.type.startsExpr &&
          tok1.type.label === '.' &&
          tok2.value === 'provide' &&
          tok3.type.label === '(' &&
          tok4.type.label === 'string' &&
          tok5.type.label === ')') {
        var ns = tok4.value;
        namespaces.push(ns);
      }
    });
    goog.array.removeDuplicates(namespaces);
    
    

    goog.array.forEach(namespaces, function(namespace) {
      describe(namespace, function() {
        var nsParts = ol3ds.getNamespaceParts(namespace);
        var correctDirNode = findCorrectDir(namespace);
        var correctDir = correctDirNode.model.path;
        
        var completeCorrectDir = 'src/client/'+correctDir;
        
        it('should be provided by file located in appropriate dir, e.g. ' +
            completeCorrectDir, function () {
          var dirname = path.dirname(completeFpath);
          assert.equal(dirname, completeCorrectDir);
        });
        
        it('should not contain two parts with same name',
            function () {
          var originalLength = nsParts.length;
          goog.array.removeDuplicates(nsParts);
          assert.equal(nsParts.length, originalLength);
        });

        var correctFile = findCorrectFile(namespace);
        var cfsuggestion = correctFile;
        if(!cfsuggestion) {
          var fnidx = correctDir.length ? correctDir.split('/').length : 0;
          fnidx = goog.math.clamp(fnidx, 0, nsParts.length-1);
          cfsuggestion = path.join(completeCorrectDir, nsParts[fnidx]+'.js');
          cfsuggestion = cfsuggestion.replace(/\\/g, '/');
        }
        it('should be located in another file, e.g. '+cfsuggestion,
            function () {
          assert.equal(completeFpath, cfsuggestion);
        });
      });
    });
  });
});

