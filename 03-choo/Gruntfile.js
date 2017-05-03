'use strict'

const fs = require('fs')
const serveStatic = require('serve-static')

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        outputStyle: 'compressed',
        sourceMap: false
      },
      dist: {
        files: {
          './dist/css/main.css': './src/scss/main.scss'
        }
      }
    },

    browserify: {
      watch: {
        files: {
          './dist/app.js': ['./src/app.js']
        },
        options: {
          transform: ['hbsfy', 'babelify']
        }
      },
      dist: {
        files: {
          './dist/app.js': ['./src/app.js']
        },
        options: {
          transform: ['hbsfy', 'babelify', 'uglifyify']
        }
      }
    },

    clean: {
      dist: ['./dist']
    },

    connect: {
      server: {
        options: {
          base: './dist',
          hostname: '0.0.0.0',
          livereload: true,
          open: true,
          port: 3000,
          middleware: (connect, options) => {
            const middlewares = []

            if (!Array.isArray(options.base)) {
              options.base = [options.base]
            }

            options.base.forEach(function(base) {
              middlewares.push(serveStatic(base))
            })

            // default: index.html
            middlewares.push((req, res) => {
              fs
                .createReadStream(`${options.base}/index.html`)
                .pipe(res)
            })
            return middlewares
          }
        }
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: '*.html',
            dest: './dist/'
          },
          {
            expand: true,
            cwd: 'src/assets',
            src: '*.png',
            dest: './dist/assets'
          }
        ]
      }
    },

    watch: {
      js: {
        files: ['./src/**/*.js', './src/**/*.hbs'],
        tasks: ['browserify:watch'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['./src/**/*.html'],
        tasks: ['copy'],
        options: {
          livereload: true
        }
      },
      sass: {
        files: ['./src/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true
        }
      }
    }
  })

  grunt.registerTask('default', ['clean', 'copy', 'browserify:dist', 'sass'])
  grunt.registerTask('start', ['default', 'connect', 'watch'])

}
