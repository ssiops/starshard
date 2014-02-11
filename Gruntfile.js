/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    target: '_static',
    banner: '/**\n' +
              '* <%= pkg.name %> v<%= pkg.version %>\n' +
              '* by <%= pkg.author %>\n' +
              '*/\n',

    // Before generating any new files,
    // remove any previously-created files.
    clean: {
      static: ['<%= target %>']
    },

    jshint: {
      options: {
        jshintrc: './.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['./static/js/application/*.js']
      },
      lib: {
        src: ['./lib/*.js']
      }
    },

    uglify: {
      application: {
        files: [{
          src: './static/js/application/*.js',
          dest: '<%= target %>/js/application',
          expand: true,
          flatten: true,
          ext: '.min.js'
        }]
      }
    },

    less: {
      options: {
        compile: true
      },
      bootstrap: {
        files: {
          '<%= target %>/css/bootstrap.css' : './less/bootstrap/bootstrap.less'
        }
      },
      bs_min: {
        options: {
          yuicompress: true
        },
        files: {
          '<%= target %>/css/bootstrap.min.css' : './less/bootstrap/bootstrap.less',
        }
      },
      style: {
        files: {
          '<%= target %>/css/style.css' : './less/style.less'
        }
      },
      style_min: {
        options: {
          yuicompress: true
        },
        files: {
          '<%= target %>/css/style.min.css' : 'less/style.less'
        }
      }
    },

    copy: {
      static: {
        expand: true,
        cwd: './static',
        src: '**',
        dest: '<%= target %>'
      }
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'copy', 'uglify:application']
      },
      less: {
        files: ['./less/*.less', './less/bootstrap/*.less'],
        tasks: ['less']
      },
      static: {
        files: './static/**',
        tasks: ['copy']
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['less', 'uglify']);

  grunt.registerTask('default', ['clean', 'jshint', 'build', 'copy']);

  grunt.registerTask('dev', ['default', 'watch']);

  grunt.registerTask('test', ['jshint', 'build']);
};