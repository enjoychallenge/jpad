var glob = require("glob");
var path = require("path");
var TreeModel = require("tree-model");
var assert = require("chai").assert;
var fs = require("fs-extra");

require('./../../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');

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
  
  var fpaths = glob.sync('src/client/**/*');

  goog.array.forEach(fpaths, function(completeFpath) {
    var fpath = path.relative('src/client', completeFpath).replace(/\\/g, '/');
    describe(fpath, function () {
      var fextname = path.basename(fpath);
      var extname = path.extname(fextname);
      var fname = path.basename(fpath, extname);
      
      var isdir = fs.statSync(completeFpath).isDirectory();
      if(!isdir) {
        it('should be located according to its name ' +
            '(or named according to its location)',
          function () {
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

            var correctDirNode = findCorrectParent(fname);
            var correctDir = correctDirNode.model.path;
            var completeCorrectDir = 'src/client/'+correctDir;
            var fdir = path.dirname(fpath);
            fdir = fdir==='.' ? '' : fdir;
            var completeFdir = 'src/client/'+fdir;
            var cdirParts = correctDir ? correctDir.split('/') : [];
            var fparts = fname.split('.');
            var correctDirs = [];
            var max = fparts.length+1;
            for (var i = cdirParts.length; i < max; i++) {
              var d = 'src/client/'+fparts.slice(0, i).join('/');
              correctDirs.push(d);
            }
            correctDirs = correctDirs.join(path.delimiter);

            assert.equal(completeFdir, completeCorrectDir,
                'should be either located in one of following folders (' +
                correctDirs+') ' + 'or renamed'
            );
        });
      }
      
      it('should be named according to pattern', function () {
        if(isdir) {
          var fextnamere = /^[a-z][a-z0-9]*$/;
        } else {
          fextnamere = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/;
        }
        assert.match(fextname, fextnamere);
      });
      
    });
  });
});

