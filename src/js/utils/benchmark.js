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

/**
 * Benchmark tool to monitor code execution time
 */
Cuic.Benchmark = class {

    constructor() {
        const self = this;
        let started = false;
        let times = [];

        /**
         * Returns benchmark time
         * @returns {number}
         */
        self.getTime = () => {
            let total = 0;
            let lastEvent = null;

            for (let i = 1; i < times.length; i += 1) {
                if (lastEvent === 'start') {
                    lastEvent = 'stop';
                } else {
                    lastEvent = 'start';
                    total += times[i] - times[i - 1];
                }
            }

            if (self.isStarted()) {
                total += Date.now() - times[times.length - 1];
            }
            return total;
        };

        /**
         * Checks if benchmark is started
         * @returns {boolean}
         */
        self.isStarted = function () {
            return started;
        };

        /**
         * Resets the benchmark
         */
        self.reset = function () {
            times = [];
        };

        /**
         * Starts the benchmark
         * @returns {*}
         */
        self.start = function () {
            if (!self.isStarted()) {
                let time = Date.now();
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
        self.stop = function () {
            if (self.isStarted()) {
                let time = Date.now();
                times.push(time);
                started = false;
                return time;
            }
            return false;
        };
    }
};
