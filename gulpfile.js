/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const pump = require('pump');
const rename = require('gulp-rename');
const standard = require('gulp-standard');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

const pkg = require('./package.json');
const buildDir = 'build/' + pkg.version;
const baseFile = pkg.name + '.' + pkg.version;


/**
 * Compile CSS/LESS files
 */
gulp.task('build:css', function () {
    return gulp.src([
        'src/less/base.less',
        'src/**/*.less'
    ])
        .pipe(concat(baseFile + '.css'))
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest(buildDir + '/css'));
});

/**
 * Compress CSS/LESS files
 */
gulp.task('compress:css', function () {
    return gulp.src(buildDir + '/css/' + baseFile + '.css')
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(buildDir + '/css'));
});

/**
 * Compile Javascript files
 */
gulp.task('build:js', function (cb) {
    return gulp.src([
        "src/js/base.js",
        "src/js/ui/component.js",
        "src/js/ui/*.js",
        "src/js/**/*.js"
    ])
    // .pipe(eslint())
    // .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
    // .pipe(standard())
    // .pipe(standard.reporter('default', {
    //     breakOnError: true,
    //     quiet: true
    // }))
        .pipe(concat(baseFile + '.js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest(buildDir + '/js'));
});

/**
 * Compress Javascript files
 */
gulp.task('compress:js', function (cb) {
    pump([
            gulp.src(buildDir + '/js/' + baseFile + '.js'),
            uglify(),
            rename({suffix: '.min'}),
            gulp.dest(buildDir + '/js')
        ],
        cb
    );
});

// Concat + compile files
gulp.task('build', ['build:css', 'build:js']);

// Compress files
gulp.task('compress', ['compress:css', 'compress:js']);

// Concat + compress files
gulp.task('default', ['build', 'compress']);

// Automatic rebuild
gulp.task('watch', function () {
    gulp.watch(['src/**/*.less'], ['build:css']);
    gulp.watch(['src/**/*.js'], ['build:js']);
    gulp.watch(['build/**/*.css', '!build/**/*.min.css'], ['compress:css']);
    gulp.watch(['build/**/*.js', '!build/**/*.min.js'], ['compress:js']);
});
