'use strict';

module.exports = function(grunt) {
  
  grunt.initConfig({
    
    // bower_components files that should be copied to build folder
    publBowerFiles: [
      {
        src: 'bower_components/proj4js/lib/proj4js-combined.js',
        dest: 'build/client/lib/proj4js/proj4js-combined.js'
      },
      {
        cwd: 'bower_components/ol3/css',
        src: '**/*',
        dest: 'build/client/lib/ol3/css/',
        expand: true
      },
      {
        cwd: 'bower_components/ol3/examples/resources',
        src: '**/*',
        dest: 'build/client/lib/ol3/examples/resources/',
        expand: true
      }
    ],
    
    
    // source files that should be copied to build folder
    publSrcFiles: [
      {
        cwd: 'src/client/',
        src: ['**/*.css', '!plovr.css'],
        dest: 'build/client/',
        expand: true
      }
    ]
    
    

  });
  
  require('./tasks/util/reg-plovr-vars.js')(grunt);

  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');

  

  
  grunt.registerTask('default', ['dev']);

};


