// Load plugins
var gulp         = require('gulp'),
    component    = require('gulp-component-build'),
    sass         = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    //jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    rename       = require('gulp-rename'),
    clean        = require('gulp-clean'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache');
    //livereload   = require('gulp-livereload');

// Styles
gulp.task('styles', function() {
  return gulp.src('styles/*.sass')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('build/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('build/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('component.json')
    .pipe(component.scripts())
    .pipe(rename('jcal.js'))
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['build/styles', 'build/js'], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts');
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('styles/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('lib/*.js', ['scripts']);

  // Create LiveReload server
  //var server = livereload();

  // Watch any files in dist/, reload on change
  //gulp.watch(['dist/**']).on('change', function(file) {
    //server.changed(file.path);
  //});

});

