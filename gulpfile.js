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
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const less = require("gulp-less");
const minifyCSS = require("gulp-csso");
const pump = require("pump");
const rename = require("gulp-rename");
const stripComments = require('gulp-strip-comments');
const stripCssComments = require('gulp-strip-css-comments');
const uglify = require("gulp-uglify");
const watch = require("gulp-watch");

const pkg = require("./package.json");
const distDir = "dist";
const docsDir = "docs";
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

// Compress CSS files
gulp.task("compress:css", function () {
    return gulp.src(`${distDir}/${distFile}.css`)
        .pipe(minifyCSS())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest(`${distDir}`));
});

// Compile JavaScript files
gulp.task("build:js", function () {
    return gulp.src([
        // "src/js/polyfill.js",
        // "src/js/base.js",
        // "src/js/utils/**/*.js",
        // "src/js/ui/**/element.js",
        // "src/js/ui/**/component.js",
        // "src/js/ui/**/group.js",
        // "src/js/ui/**/*.js",
        "src/js/**/*.js"
    ])
    // .pipe(concat(`${distFile}.js`))
        .pipe(babel({presets: ["env"]}))
        .pipe(stripComments())
        .pipe(gulp.dest(`${distDir}`));
});

// Compress JavaScript files
gulp.task("compress:js", function (cb) {
    // pump([
    //         gulp.src(`${distDir}/${distFile}.js`),
    //         uglify(),
    //         rename({suffix: ".min"}),
    //         gulp.dest(`${distDir}`)
    //     ],
    //     cb
    // );
});

// Copy compiled CSS to docs
gulp.task("doc:css", function () {
    return gulp.src(`${distDir}/css/*.min.css`)
        .pipe(gulp.dest(`${docsDir}/css`));
});

// Copy compiled JS to docs
gulp.task("doc:js", function () {
    return gulp.src(`${distDir}/js/*.min.js`)
        .pipe(gulp.dest(`${docsDir}/js`));
});

// Concat + compile files
gulp.task("build", ["build:css", "build:js"]);

// Compress files
gulp.task("compress", ["compress:css", "compress:js"]);

// Add compiled files to docs
gulp.task("doc", ["doc:css", "doc:js"]);

// Concat + compress files
gulp.task("default", ["build", "compress", "doc"]);

// Concat + compress files
gulp.task("prepublish", ["build", "compress"]);

// Automatic rebuild
gulp.task("watch", function () {
    gulp.watch(["src/**/*.less"], ["build:css"]);
    gulp.watch(["src/**/*.js"], ["build:js"]);
    gulp.watch([`${distDir}/**/*.css`, `!${distDir}/**/*.min.css`], ["compress:css", "doc:css"]);
    gulp.watch([`${distDir}/**/*.js`, `!${distDir}/**/*.min.js`], ["compress:js", "doc:js"]);
});
