/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Karl STEIN
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

    /**
     * Creates a tooltip
     * @param options
     * @constructor
     */
    Cuic.Tooltip = function (options) {
        var self = this;
        var element;
        var isClosing = false;
        var isOpened = false;
        var isOpening = false;
        var position;
        var target;

        // Set default options
        options = $.extend(true, {}, Cuic.Tooltip.prototype.options, options);

        // Define attributes
        self.attribute = options.attribute;
        self.followPointer = options.followPointer === true;

        // Define vars
        position = options.position;
        target = $(options.target);

        /**
         * Closes the tooltip
         * @param callback
         * @return {Cuic.Tooltip}
         */
        self.close = function (callback) {
            if (isOpening || (isOpened && !isClosing)) {
                isClosing = true;
                isOpening = false;
                element.stop(true, false).fadeOut(200, function () {
                    if (callback) {
                        callback.call(self);
                    }
                    if (self.autoRemove) {
                        element.remove();
                    }
                    isClosing = false;
                    isOpened = false;
                });
            }
            return self;
        };

        /**
         * Returns the element
         * @return {*}
         */
        self.getElement = function () {
            return element;
        };

        /**
         * Checks if the tooltip is opened
         * @return {boolean}
         */
        self.isOpened = function () {
            return isOpened;
        };

        /**
         * Opens the tooltip
         * @param callback
         * @return {Cuic.Tooltip}
         */
        self.open = function (callback) {
            if (isClosing || (!isOpened && !isOpening)) {
                isClosing = false;
                isOpening = true;

                // Position the element
                self.setAnchor(position, target);

                element.stop(true, false).fadeIn(200, function () {
                    if (callback) {
                        callback.call(self);
                    }
                    isOpening = false;
                    isOpened = true;
                });
            }
            return self;
        };

        /**
         * Sets the position relative to a target
         * @param pos
         * @param targ
         * @return {Cuic.Tooltip}
         */
        self.setAnchor = function (pos, targ) {
            position = pos;
            target = $(targ || target);
            Cuic.anchor(element, pos, target);
            return self;
        };

        /**
         * Sets the tooltip content
         * @param html
         * @return {Cuic.Tooltip}
         */
        self.setContent = function (html) {
            element.html(html);
            return self;
        };

        /**
         * Toggles the tooltip visibility
         * @param callback
         * @return {Cuic.Tooltip}
         */
        self.toggle = function (callback) {
            if (isClosing || (!isOpened && !isOpening)) {
                self.open(callback);
            } else {
                self.close(callback);
            }
            return self;
        };

        // Create the element
        element = $('<div>', {
            'class': options.className
        }).appendTo(document.body);

        // Set custom styles
        Cuic.applyCss(options.css, element);

        // Set required styles
        element.css({
            display: 'none',
            position: 'absolute',
            zIndex: options.zIndex
        });

        $(options.target).each(function () {
            var target = $(this);
            var content = target.attr(self.attribute);

            // Display the tooltip
            target.on('mouseenter', function (ev) {
                target.attr('data-tooltip', content);
                target.attr(self.attribute, '');
                element.html(content);

                if (self.followPointer) {
                    Cuic.anchor(element, position, [ev.pageX, ev.pageY]);
                } else {
                    Cuic.anchor(element, position, target);
                }
                self.open();
            });

            // Move the tooltip
            target.on('mousemove', function (ev) {
                if (self.followPointer) {
                    Cuic.anchor(element, position, [ev.pageX, ev.pageY]);
                } else {
                    Cuic.anchor(element, position, target);
                }
            });

            // Close the tooltip
            target.on('mouseleave', function () {
                var text = target.attr('data-tooltip');
                target.attr('data-tooltip', '');
                target.attr(self.attribute, text);
                self.close();
            });
        });
    };

    /**
     * Default options
     * @type {*}
     */
    Cuic.Tooltip.prototype.options = {
        attribute: 'title',
        className: 'tooltip',
        css: null,
        followPointer: true,
        position: 'right bottom',
        target: null,
        zIndex: 10
    };

})(jQuery);