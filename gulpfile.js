/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const less = require('gulp-less');
const stripCssComments = require('gulp-strip-css-comments');
const watch = require('gulp-watch');
const pkg = require('./package.json');

const buildPath = 'dist';
const distDir = 'dist';
const distFile = `${pkg.name}`;

// Compile source files
gulp.task('build', () => gulp.src([
  'src/js/**/*.js',
])
  .pipe(babel())
  .pipe(gulp.dest(buildPath)));

// Compile CSS files
gulp.task('build:css', () => gulp.src([
  'src/**/*.less',
])
  .pipe(concat(`${distFile}.css`))
  .pipe(less())
  .pipe(stripCssComments())
  .pipe(autoprefixer())
  .pipe(gulp.dest(distDir)));

// Remove compiled files
gulp.task('clean', () => del([buildPath]));

// Check code quality
gulp.task('eslint', () => gulp.src([
  'src/**/*.js',
  'test/**/*.js',
  '!node_modules/**',
])
  .pipe(eslint())
  .pipe(eslint.formatEach())
  .pipe(eslint.failAfterError()));

// Prepare files for production
gulp.task('prepare', gulp.series('clean', /*'eslint',*/ 'build', 'build:css'));

// Rebuild automatically
gulp.task('watch:js', () => watch(['src/**/*.js'], ['build']));
gulp.task('watch:css', () => watch(['src/**/*.less'], ['build:css']));
gulp.task('watch', gulp.parallel('watch:js', 'watch:css'));

// Prepare files for production
gulp.task('default', gulp.series('prepare'));
