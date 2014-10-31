'use strict';

module.exports = function(grunt) {
  var plovrConfigs = grunt.config('plovrConfigs');
  if(!plovrConfigs) {
    throw new Error('`plovrConfigs` required');
  }

  grunt.config.merge({
    express: {
      dev: {
        options: {
          script: './server/server.js'
        }
      }
    },
    watch: {
      express: {
        files: ['server/*.js'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    },
    open: {
      dev: {
        path: 'http://localhost:9000/client/src/'
      }
    },
    bgShell: {
      _defaults: {
        bg: true
      },

      serveUsingPlovr: {
        cmd: 'java -jar bower_components/plovr/index.jar serve '+plovrConfigs.join(' ')
      }
    }
  });

  require('load-grunt-tasks')(grunt);


  grunt.registerTask('dev', ['bgShell:serveUsingPlovr', 'express:dev', 'open:dev', 'watch']);
};