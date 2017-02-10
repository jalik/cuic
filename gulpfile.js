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
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const pump = require('pump');
const rename = require('gulp-rename');
const standard = require('gulp-standard');
const uglify = require('gulp-uglify');

const Package = require('./package.json');


gulp.task('js', function (cb) {
    return gulp.src([
        "src/js/base.js",
        "src/js/fn-benchmark.js",
        "src/js/fn-draggable.js",
        "src/js/fn-forms.js",
        "src/js/fn-hook.js",
        "src/js/fn-keys.js",
        "src/js/fn-resizable.js",
        "src/js/ui-dialog.js",
        "src/js/ui-grid.js",
        "src/js/ui-notification.js",
        "src/js/ui-panel.js",
        "src/js/ui-popup.js",
        "src/js/ui-switcher.js",
        "src/js/ui-table.js",
        "src/js/ui-tabs.js",
        "src/js/ui-tooltip.js",
        "src/js/ui-tree.js"
    ])
    // .pipe(eslint())
    // .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
    // .pipe(standard())
    // .pipe(standard.reporter('default', {
    //     breakOnError: true,
    //     quiet: true
    // }))
        .pipe(concat(Package.name + '.' + Package.version + '.js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('compress', function (cb) {
    pump([
            gulp.src('dist/js/*.js'),
            uglify(),
            rename({
                suffix: '.min'
            }),
            // concat(Package.name + '.' + Package.version + '.min.js'),
            gulp.dest('dist/js')
        ],
        cb
    );
});

gulp.task('css', function () {
    return gulp.src('src/**/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('build/css'));
});

gulp.task('default', ['js', 'compress', 'css']);
