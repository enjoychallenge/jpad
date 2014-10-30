'use strict';

module.exports = function(grunt) {
  var plovrConfigs = grunt.config('plovrConfigs');
  if(!plovrConfigs) {
    throw new Error('`plovrConfigs` required');
  }

  grunt.config.merge({
    shell: {
      fixjs: {
        command: ['fixjsstyle', 
          '--jslint_error=all',
          '--custom_jsdoc_tags=event,fires,api,observable',
          '--strict',
          '-r',
          'client/src/js'
        ].join(' ')
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  
  grunt.registerTask('fix', ['shell:fixjs']);
};