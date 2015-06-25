/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Karl STEIN
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
 */

module.exports = function (grunt) {

    var concatenatedFile = "build/<%= pkg.name %>-<%= pkg.version %>.js";
    var compressedFile = "build/<%= pkg.name %>-<%= pkg.version %>.min.js";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
                separator: ";"
            },
            dist: {
                src: [
                    "src/base.js",
                    "src/fn-draggable.js",
                    "src/fn-forms.js",
                    "src/fn-hook.js",
                    "src/fn-keys.js",
                    "src/fn-resizable.js",
                    "src/ui-dialog.js",
                    "src/ui-grid.js",
                    "src/ui-notification.js",
                    "src/ui-panel.js",
                    "src/ui-popup.js",
                    "src/ui-table.js",
                    "src/ui-tabs.js",
                    "src/ui-tooltip.js",
                    "src/ui-tree.js"
                ],
                dest: concatenatedFile
            }
        },
        uglify: {
            options: {
                banner: ""
            },
            build: {
                src: concatenatedFile,
                dest: compressedFile
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    // Default task(s).
    grunt.registerTask("default", ["concat", "uglify"]);

};