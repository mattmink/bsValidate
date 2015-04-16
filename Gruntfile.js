module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      task: {
        src: ['jquery.bsvalidate.js'], 
        dest: 'jquery.bsvalidate.min.js'
      }
    },
    uglify: {
      task: {
        src: ['jquery.bsvalidate.js'], 
        dest: 'jquery.bsvalidate.min.js'
      },
      options: {
        preserveComments: 'some'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'uglify']);
};