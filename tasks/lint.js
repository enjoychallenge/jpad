'use strict';

module.exports = function(grunt) {
  var plovrConfigs = grunt.config('plovrConfigs');
  if(!plovrConfigs) {
    throw new Error('`plovrConfigs` required');
  }

  grunt.config.merge({
    shell: {
      lint: {
        command: ['gjslint', 
          '--jslint_error=all',
          '--custom_jsdoc_tags=event,fires,api,observable',
          '--strict',
          '--beep',
          '-r',
          'src/client'
        ].join(' ')
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  
  grunt.registerTask('lint', ['shell:lint']);
};