'use strict';

module.exports = function(grunt) {
  
  grunt.initConfig({
    
    // bower_components files that should be copied to public folder
    publBowerFiles: [
      {
        src: 'bower_components/proj4js/lib/proj4js-combined.js',
        dest: 'client/public/lib/proj4js/proj4js-combined.js'
      },
      {
        cwd: 'bower_components/ol3/css',
        src: '**/*',
        dest: 'client/public/lib/ol3/css/',
        expand: true
      },
      {
        cwd: 'bower_components/ol3/resources',
        src: '**/*',
        dest: 'client/public/lib/ol3/resources/',
        expand: true
      }
    ],
    
    
    // source files that should be copied to public folder
    publSrcFiles: [
      {
        cwd: 'client/src/css/',
        src: ['**/*', '!plovr.css'],
        dest: 'client/public/css/',
        expand: true
      }
    ]
    
    

  });
  
  require('./tasks/util/reg-plovr-vars.js')(grunt);

  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');

  

  
  grunt.registerTask('default', ['dev']);

};


