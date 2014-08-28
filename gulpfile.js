var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var install = require('gulp-install');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var mocha = require('gulp-spawn-mocha');
var runSequence = require('run-sequence');

gulp.task('default', ['build', 'test']);

gulp.task('build', ['build-less', 'build-version', 'install-example-modules']);

gulp.task('build-less', function(){
  return gulp.src('client/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('client/www/style'));
});

gulp.task('build-version', function(callback) {
  var pkg = require('./package.json');
  var content =
    '// This file is generated by `gulp build`. Do not edit manually!' +
    '\ndocument.querySelector(".header-version").innerHTML = ' +
      JSON.stringify('Studio v' + pkg.version) + ';' +
    '\n';

  var filepath = path.resolve(__dirname,
     'client', 'www', 'scripts', 'version.js');

  fs.writeFile(filepath, content, 'utf-8', callback);
});

gulp.task('install-example-modules', function() {
  return gulp.src('examples/*/package.json')
    .pipe(install({ production: true }));
});

gulp.task('test', ['build'], function(callback) {
  runSequence(
    'jshint',
    'test-backend',
     callback);
});

gulp.task('jshint', function() {
  return gulp.src([
    'server/**/*.js',
    'client/test/**/*.js',
    // TODO(bajtos) add more files once they pass the linter
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test-backend', function() {
  return gulp.src('server/test/*.js', { read: false })
    .pipe(mocha());
});
