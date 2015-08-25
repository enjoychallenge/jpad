var glob = require("glob");
var path = require("path");
var TreeModel = require("tree-model");

require('./../../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');

var assert = require("assert");
describe('src/client/', function() {
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
  
  var fpaths = glob.sync('src/client/**/*', {nodir: true});

  var findCorrectParent = function(fname) {
    var parts = fname.split('.');
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

  goog.array.forEach(fpaths, function(fpath) {
    fpath = path.relative('src/client', fpath).replace(/\\/g, '/');
    describe(fpath, function () {
      var fname = path.basename(fpath, path.extname(fpath))
      var correctDirNode = findCorrectParent(fname);
      var correctDir = correctDirNode.model.path;
      var fdir = path.dirname(fpath);
      fdir = fdir==='.' ? '' : fdir;

      fpath = 'src/client/'+fpath;
      fdir = 'src/client/'+fdir;

      var cdirParts = correctDir ? correctDir.split('/') : [];
      var fparts = fname.split('.');
      var correctDirs = [];
      for (var i = cdirParts.length, max = fparts.length+1; i < max; i++) {
        var d = 'src/client/'+fparts.slice(0, i).join('/');
        correctDirs.push(d);
      }
      correctDirs = correctDirs.join(' ');
      correctDir = 'src/client/'+correctDir;

      it('should be either located in one of following folders (' +
          correctDirs+') ' +
          'or renamed', function () {
        assert.equal(fdir, correctDir);
      });
    });
  });
});

