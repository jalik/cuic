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

(function () {
    'use strict';

    /**
     * Benchmark tool to monitor code execution time
     * @constructor
     */
    Cuic.Benchmark = function () {
        var started = false;
        var times = [];

        /**
         * Returns benchmark time
         * @returns {number}
         */
        this.getTime = function () {
            var total = 0;
            var lastEvent = null;

            for (var i = 1; i < times.length; i += 1) {
                if (lastEvent === 'start') {
                    lastEvent = 'stop';
                } else {
                    lastEvent = 'start';
                    total += times[i] - times[i - 1];
                }
            }

            if (this.isStarted()) {
                total += Date.now() - times[times.length - 1];
            }

            return total;
        };

        /**
         * Checks if benchmark is started
         * @returns {boolean}
         */
        this.isStarted = function () {
            return started;
        };

        /**
         * Resets the benchmark
         */
        this.reset = function () {
            times = [];
        };

        /**
         * Starts the benchmark
         * @returns {*}
         */
        this.start = function () {
            if (!this.isStarted()) {
                var time = Date.now();
                times.push(time);
                started = true;
                return time;
            }
            return false;
        };

        /**
         * Stops the benchmark
         * @returns {*}
         */
        this.stop = function () {
            if (this.isStarted()) {
                var time = Date.now();
                times.push(time);
                started = false;
                return time;
            }
            return false;
        };
    };

})();
