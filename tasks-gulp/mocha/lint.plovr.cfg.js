var glob = require("glob");
var path = require("path");
var TreeModel = require("tree-model");
var assert = require("chai").assert;
var fs = require("fs-extra");

require('./../../bower_components/closure-library/closure/goog/bootstrap/nodejs');
goog.require('goog.array');

describe('plovr configuration', function() {
  var fpaths = glob.sync('src/client/**/*.plovr.json');
  
  var fnames = goog.array.map(fpaths, function(fpath) {
    return path.basename(fpath, '.plovr.json');
  });
  
  goog.array.forEach(fnames, function(fname, fidx) {
    var completeFpath = fpaths[fidx];
    
    describe(completeFpath, function() {
      var fcontent = fs.readFileSync(completeFpath);
      var fjson = JSON.parse(fcontent);
    
     it('should have "id" suitable for file name', function () {
       var correctId =  fname.replace(/\./g, '-');
       var plovrId = fjson.id;
       var correctfname =  plovrId.replace(/-/g, '.')+'.plovr.json';
        assert.equal(correctId, plovrId,
            'should be either located in another file (' +correctfname+
            ') or should have "id" set to "'+correctId+'"');
      });
    });
  });
});

