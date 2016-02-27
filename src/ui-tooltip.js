/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Karl STEIN
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

    var ns = Cuic.namespace('tooltip');
    var tooltips = [];

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
        var selector;

        // Set default options
        options = $.extend(true, {}, Cuic.Tooltip.prototype.options, options);

        // Define attributes
        self.attribute = options.attribute;
        self.followPointer = options.followPointer === true;

        // Define vars
        position = options.position;
        selector = options.selector;

        // Add the tooltip to the list
        tooltips.push(self);

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
         * Sets the tooltip content
         * @param html
         * @return {Cuic.Tooltip}
         */
        self.setContent = function (html) {
            content.html(html);
            return self;
        };

        /**
         * Sets the position relative
         * @param pos
         * @return {Cuic.Tooltip}
         */
        self.setPosition = function (pos) {
            position = pos;
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

        var body = $(document.body);
        var content = $('<div>', {}).appendTo(element);
        var tail = $('<span>', {
            'class': 'tail',
            style: {position: 'absolute', display: 'inline-block'}
        }).appendTo(element);

        function refreshTail() {
            switch (position) {
                case 'top':
                    tail.removeClass('tail-top tail-left tail-right').addClass('tail-bottom');
                    tail.css({
                        left: '50%',
                        right: 'auto',
                        top: 'auto',
                        bottom: -tail.height() + 'px',
                        margin: '0 0 0 ' + (-tail.width() / 2) + 'px'
                    });
                    break;

                case 'bottom':
                    tail.removeClass('tail-bottom tail-left tail-right').addClass('tail-top');
                    tail.css({
                        left: '50%',
                        right: 'auto',
                        top: -tail.height() + 'px',
                        bottom: 'auto',
                        margin: '0 0 0 ' + (-tail.width() / 2) + 'px'
                    });
                    break;

                case 'right':
                    tail.removeClass('tail-top tail-bottom tail-right').addClass('tail-left');
                    tail.css({
                        left: -tail.width() + 'px',
                        right: 'auto',
                        top: '50%',
                        bottom: 'auto',
                        margin: (-tail.height() / 2) + 'px 0 0 0'
                    });
                    break;

                case 'left':
                    tail.removeClass('tail-top tail-bottom tail-left').addClass('tail-right');
                    tail.css({
                        left: 'auto',
                        right: -tail.width() + 'px',
                        top: '50%',
                        bottom: 'auto',
                        margin: (-tail.height() / 2) + 'px 0 0 0'
                    });
                    break;
            }
        }

        // Replace previous event listener
        body.off(ns('mouseenter', selector)).on(ns('mouseenter', selector), selector, function (ev) {
            var t = $(ev.target);
            var text = t.attr(self.attribute);

            if (!text || !text.length) {
                text = t.attr('data-tooltip');
            }

            if (text && text.length) {
                t.attr(self.attribute, '');
                t.attr('data-tooltip', text);

                content.html(text);

                if (self.followPointer) {
                    Cuic.anchor(element, position, [ev.pageX, ev.pageY]);
                } else {
                    Cuic.anchor(element, position, ev.currentTarget);
                    refreshTail();
                }
                self.open();
            }
        });

        // Replace previous event listener
        body.off(ns('mousemove', selector)).on(ns('mousemove', selector), selector, function (ev) {
            if (self.followPointer) {
                Cuic.anchor(element, position, [ev.pageX, ev.pageY]);
            } else {
                Cuic.anchor(element, position, ev.currentTarget);
                refreshTail();
            }
        });

        // Replace previous event listener
        body.off(ns('mouseleave', selector)).on(ns('mouseleave', selector), selector, function (ev) {
            self.close();
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
        selector: '[title]',
        zIndex: 10
    };

    $(document).ready(function () {
        // Closes the tooltip on click (to avoid tooltip to remain if the page content changed)
        $(document.body).off(ns('click')).on(ns('click'), function () {
            for (var i = 0; i < tooltips.length; i += 1) {
                tooltips[i].close();
            }
        });
    });

})(jQuery);
