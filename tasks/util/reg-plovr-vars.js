'use strict';


module.exports = function(grunt) {
  var plovrVars = require('./get-plovr-vars.js');

  grunt.config.merge(plovrVars);
}