var gulp = require('gulp');

var clean = require('gulp-clean');

var gulpSequence = require('gulp-sequence');

var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var connect = require('gulp-connect-multi')();
const fs = require('fs')
const serveStatic = require('serve-static')

gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task('copy', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist/'))
    .pipe(connect.reload());
});

gulp.task('browserify', function() {
  return browserify('./src/app.js')
    .transform('babelify')
    .transform('hbsfy')
    .bundle()
    .pipe(source('app.js')) // gives streaming vinyl file object
    .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
    .pipe(uglify()) // now gulp-uglify works
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload());
});

gulp.task('connect', connect.server({
  root: 'dist',
  port: 3000,
  livereload: true,
  open: {
    browser: 'firefox'
  },
  middleware: (connect, options) => {
    const middlewares = []

    if (!Array.isArray(options.root)) {
      options.root = [options.root]
    }

    options.root.forEach(function(root) {
      middlewares.push(serveStatic(root))
    })

    // default: index.html
    middlewares.push((req, res) => {
      fs
        .createReadStream(`${options.root}/index.html`)
        .pipe(res)
    })
    return middlewares
  }
}));

gulp.task('watch', function () {
  gulp.watch(['./src/**/*.html'], ['copy']);
  gulp.watch(['./src/**/*.js'], ['browserify']);
  gulp.watch(['./src/**/*.hbs'], ['browserify']);
});


gulp.task('default', gulpSequence(['clean'], 'copy', 'browserify'));
gulp.task('start', gulpSequence(['default'], 'connect', 'watch'));
