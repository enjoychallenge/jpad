'use strict';

var fse = require('fs-extra');
var os = require('os');

module.exports = function(grunt) {

  grunt.config.merge({
    curl: {
      pip: {
        src: 'https://bootstrap.pypa.io/get-pip.py',
        dest: 'get-pip.py'
      }
    },
    shell: {
      installLinter: {
        command: (os.platform() !== 'win32' ? 'sudo ' : '')
            + 'pip install http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz --upgrade'
      },
      installPip: {
        command: 'python get-pip.py'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  
  grunt.registerTask(
    'fixOl3',
    'Fixing OL3 to get it compatible with our version of Closure Compiler',
    function() {
      var path = 'bower_components/ol3/src/ol/color/color.js';
      var cnt = grunt.file.read(path);
      cnt = cnt.replace(
          "    goog.asserts.fail(s + ' is not a valid color');",
          "    throw Error(s + ' is not a valid color');"
          );
      grunt.file.write(path, cnt);
      path = 'bower_components/ol3/src/ol/geom/simplegeometry.js';
      cnt = grunt.file.read(path);
      cnt = cnt.replace(
          "    goog.asserts.fail('unsupported stride: ' + stride);",
          "    throw Error('unsupported stride: ' + stride);"
          );
      cnt = cnt.replace(
          "    goog.asserts.fail('unsupported layout: ' + layout);",
          "    throw Error('unsupported layout: ' + layout);"
          );
      grunt.file.write(path, cnt);
      
      path = 'bower_components/ol3/src/ol/map.js';
      cnt = grunt.file.read(path);
      cnt = cnt.replace(
          "// FIXME recheck layer/map projection compatability when projection changes",
          "/**\n" +
          " * @license OpenLayers 3. See http://openlayers.org/\n" +
          " * License: https://raw.githubusercontent.com/openlayers/ol3/master/LICENSE.md\n" +
          " * Version: v3.0.0\n" +
          " */\n"
          );
      grunt.file.write(path, cnt);
    }
  );

  grunt.registerTask(
    'deletePip',
    'Deleting pip download file',
    function() {
      fse.unlinkSync('get-pip.py');
    }
  );

  grunt.registerTask('installPip', ['curl:pip', 'shell:installPip', 'deletePip']);
  grunt.registerTask('install', ['installPip', 'shell:installLinter', 'fixOl3']);

};
