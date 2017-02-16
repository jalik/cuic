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

(function ($) {
    'use strict';

    Cuic.Switcher = function (options) {
        var self = this;
        var activeElement;
        var index = 0;
        var started = false;
        var timer;

        // Default options
        options = Cuic.extend(true, {
            autoStart: true,
            delay: 3000,
            repeat: true,
            target: null
        }, options);

        // Define attributes
        self.autoStart = options.autoStart === true;
        self.delay = parseInt(options.delay);
        self.repeat = options.repeat === true;

        // Get target
        var element = $(options.target);

        if (element.length < 1) {
            throw new Error("Invalid target");
        }

        /**
         * Displays the first element
         */
        self.first = function () {
            self.goTo(0);
        };

        /**
         * Returns the active element
         * @return {*}
         */
        self.getActiveElement = function () {
            return activeElement;
        };

        /**
         * Returns the switcher's element
         * @return {*|HTMLElement}
         */
        self.getElement = function () {
            return element;
        };

        /**
         * Returns the element at the specified index
         * @return {*}
         */
        self.getElementAt = function (index) {
            return element.children().eq(index);
        };

        /**
         * Returns the index of the visible element
         * @return {*}
         */
        self.getIndex = function () {
            return element.children().index(activeElement) || 0;
        };

        /**
         * Displays the element at the specified index
         * @param pos
         */
        self.goTo = function (pos) {
            var started = self.isStarted();
            var children = element.children();
            var childrenSize = children.length;
            pos = parseInt(pos);

            if (pos >= childrenSize) {
                index = self.repeat ? 0 : childrenSize - 1;
            } else if (pos < 0) {
                index = self.repeat ? childrenSize - 1 : 0;
            } else {
                index = pos;
            }

            if (index !== self.getIndex()) {
                self.stop();

                // Get the visible element
                activeElement = children.eq(index);

                // Hide visible elements
                children.hide();

                // Show the active element
                activeElement.fadeIn(500, function () {
                    if (started) {
                        self.start();
                    }
                });
            }
        };

        /**
         * Checks if the switcher is started
         * @return {boolean}
         */
        self.isStarted = function () {
            return started;
        };

        /**
         * Displays the last element
         */
        self.last = function () {
            self.goTo(element.children().length - 1);
        };

        /**
         * Displays the next element
         */
        self.next = function () {
            self.goTo(index + 1);
        };

        /**
         * Displays the previous element
         */
        self.previous = function () {
            self.goTo(index - 1);
        };

        /**
         * Starts the started
         */
        self.start = function () {
            if (!started) {
                timer = setInterval(self.next, self.delay);
                started = true;
            }
        };

        /**
         * Stop the started
         */
        self.stop = function () {
            if (started) {
                clearInterval(timer);
                started = false;
            }
        };

        // Hide elements
        activeElement = self.getElementAt(0);
        element.children().not(activeElement).hide();

        // Auto start timer
        if (self.autoStart) {
            self.start();
        }
    };

})(jQuery);
