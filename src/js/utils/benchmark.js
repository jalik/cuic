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

class Benchmark {
  constructor() {
    this.startTime = null;
    this.stopTime = null;
    this.time = 0;
  }

  /**
   * Returns benchmark time
   * @returns {number}
   */
  getTime() {
    if (this.startTime && this.stopTime) {
      return this.stopTime - this.startTime;
    } else if (this.startTime) {
      return Date.now() - this.startTime;
    }
    return 0;
  }

  /**
   * Checks if benchmark is started
   * @returns {boolean}
   */
  isStarted() {
    return typeof this.startTime === 'number';
  }

  /**
   * Resets the benchmark
   */
  reset() {
    this.time = 0;
    this.startTime = null;
    this.stopTime = null;
  }

  /**
   * Starts the benchmark
   * @returns {*}
   */
  start() {
    this.startTime = Date.now();
    this.stopTime = null;
  }

  /**
   * Stops the benchmark
   * @returns {*}
   */
  stop() {
    this.startTime = null;
    this.stopTime = Date.now();
  }
}

export default Benchmark;
