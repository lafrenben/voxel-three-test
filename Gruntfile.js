module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
	files: {
	  'public/gen/app.js': ['client/app.js']
	}
      }
    },
    express: {
      dev: {
	options: {
	  script: 'server.js'
	}
      }
    },
    watch: {
      options: {
	livereload: true
      },
      js: {
	files: 'client/**/*.js',
	tasks: ['browserify']
      },
      express: {
	files: ['server.js', 'public/*.html'],
	tasks: ['express:dev'],
	options: {
	  spawn: false
	}
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.registerTask('default', ['build', 'express:dev', 'watch']);
  grunt.registerTask('build', ['browserify']);
};
