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
      },
      createOlExt: {
        command: 'node bower_components/ol3/tasks/build-ext.js'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  
  grunt.registerTask(
    'deletePip',
    'Deleting pip download file',
    function() {
      fse.unlinkSync('get-pip.py');
    }
  );

  grunt.registerTask('installPip', ['curl:pip', 'shell:installPip', 'deletePip']);
  grunt.registerTask('install', ['installPip', 'shell:installLinter', 'shell:createOlExt']);

};