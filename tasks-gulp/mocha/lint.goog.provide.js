var glob = require("glob");
var path = require("path");
var TreeModel = require("tree-model");
var assert = require("chai").assert;
var fs = require("fs-extra");

require('./../../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');

describe('namespace', function() {
  var jspaths = glob.sync('src/client/**/*.js', {nodir: true});
  
  var jsnames = goog.array.map(jspaths, function(jspath) {
    return path.basename(jspath, '.js');
  });
  
  var jsregexps = goog.array.map(jsnames, function(jsname) {
    var re = new RegExp('^'+jsname.replace(/\./g, '\\.')+'(\\..+|$)');
    return re;
  });
  
  var findCorrectFile = function(namespace) {
    var result = null;
    goog.array.forEach(jsregexps, function(jsregexp, idx) {
      if(namespace.match(jsregexp)) {
        if(!result || result.split('.').length<jsnames[idx].split('.').length) {
          result = jspaths[idx];
        }
      }
    });
    return result;
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
        namespaces.push(tok4.value.toLowerCase());
      }
    });
    goog.array.removeDuplicates(namespaces);
    
    

    goog.array.forEach(namespaces, function(namespace) {
      describe(namespace, function() {
        var correctFile = findCorrectFile(namespace);

        it('should be provided in file with suitable name', function () {
          var cfsuggestion = correctFile || 'src/client/'+namespace+'.js';
          assert(correctFile && correctFile === completeFpath,
              'should be either located in another file (e.g. '+cfsuggestion+
              ') or renamed starting with '+jsnames[fidx]);
        });
      });
    });
  });
});

