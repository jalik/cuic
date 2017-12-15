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

const gulp = require("gulp");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const less = require("gulp-less");
const stripComments = require('gulp-strip-comments');
const stripCssComments = require('gulp-strip-css-comments');
const watch = require("gulp-watch");

const pkg = require("./package.json");
const distDir = "dist";
const distFile = `${pkg.name}`;

// Compile CSS files
gulp.task("build:css", function () {
    return gulp.src([
        "src/**/*.less"
    ])
        .pipe(concat(`${distFile}.css`))
        .pipe(less())
        .pipe(stripCssComments())
        // .pipe(autoprefixer()) //fixme needs node v7.10.0
        .pipe(gulp.dest(`${distDir}`));
});

// Compile JavaScript files
gulp.task("build:js", function () {
    return gulp.src([
        "src/js/**/*.js"
    ])
        .pipe(babel({presets: ["env"]}))
        .pipe(stripComments())
        .pipe(gulp.dest(`${distDir}`));
});

// Concat + compile files
gulp.task("build", ["build:css", "build:js"]);

// Concat + compress files
gulp.task("default", ["build"]);

// Concat + compress files
gulp.task("prepublish", ["build"]);

// Automatic rebuild
gulp.task("watch", function () {
    gulp.watch(["src/**/*.less"], ["build:css"]);
    gulp.watch(["src/**/*.js"], ["build:js"]);
});
