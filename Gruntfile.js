'use strict';

module.exports = function(grunt) {
  
  grunt.initConfig({
    
    // bower_components files that should be copied to public folder
    publBowerFiles: [
      {
        src: 'bower_components/proj4js/lib/proj4js-combined.js',
        dest: 'client/public/js/proj4js-combined.js'
      },
      {
        cwd: 'bower_components/ol3/css',
        src: '**/*',
        dest: 'client/public/ol3/css/',
        expand: true
      },
      {
        cwd: 'bower_components/ol3/resources',
        src: '**/*',
        dest: 'client/public/ol3/css/',
        expand: true
      }
    ],
    
    
    // source files that should be copied to public folder
    publSrcFiles: [
    ]
    
    

  });
  
  require('./tasks/util/reg-plovr-vars.js')(grunt);

  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');

  

  
  grunt.registerTask('default', ['serve']);

};


