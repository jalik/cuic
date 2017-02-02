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

    var ns = Cuic.namespace('tooltip');
    var tooltips = [];

    /**
     * Creates a tooltip
     * @param options
     * @constructor
     */
    Cuic.Tooltip = function (options) {
        var self = this;
        var elm;
        var $elm;
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
            if (self.isOpened()) {
                Cuic.once('transitionend', elm, function () {
                    Cuic.debug('Tooltip.closed');
                    // $elm.removeClass('closing');
                    Cuic.call(callback, self);
                    $elm.css({display: 'none'});

                    if (self.autoRemove) {
                        $elm.remove();
                    }
                });
                Cuic.debug('Tooltip.close');
                $elm.addClass('closed');
                // $elm.addClass('closing');
                $elm.removeClass('opening');
                $elm.removeClass('opened');
            }
            return self;
        };

        /**
         * Returns the element
         * @return {*}
         */
        self.getElement = function () {
            return $elm;
        };

        /**
         * Checks if the tooltip is closing
         * @return {boolean}
         */
        self.isClosing = function () {
            return $elm.hasClass('closing');
        };

        /**
         * Checks if the tooltip is opened
         * @return {boolean}
         */
        self.isOpened = function () {
            return $elm.hasClass('opened');
        };

        /**
         * Checks if the tooltip is opening
         * @return {boolean}
         */
        self.isOpening = function () {
            return $elm.hasClass('opening');
        };

        /**
         * Opens the tooltip
         * @param callback
         * @return {Cuic.Tooltip}
         */
        self.open = function (callback) {
            if (!self.isOpened()) {
                Cuic.once('transitionend', elm, function () {
                    Cuic.debug('Tooltip.opened');
                    // $elm.removeClass('opening');
                    Cuic.call(callback, self);
                });
                Cuic.debug('Tooltip.open');
                $elm.addClass('opened');
                // $elm.addClass('opening');
                $elm.removeClass('closing');
                $elm.removeClass('closed');
                $elm.css({display: 'block'});
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
            if (self.isClosing() || !self.isOpened()) {
                self.open(callback);
            } else {
                self.close(callback);
            }
            return self;
        };

        // Create the element
        $elm = $('<div>', {
            'class': options.className
        }).appendTo(document.body);

        // Get element reference
        elm = $elm.get(0);

        // Set custom styles
        Cuic.applyCss(options.css, $elm);

        // Set required styles
        $elm.css({
            display: 'none',
            position: 'absolute',
            zIndex: options.zIndex
        });

        var body = $(document.body);
        var content = $('<div>', {}).appendTo($elm);
        var tail = $('<span>', {
            'class': 'tail',
            style: {position: 'absolute', display: 'inline-block'}
        }).appendTo($elm);

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

        // Open tooltip when mouse enter area
        body.off(ns('mouseenter', selector)).on(ns('mouseenter', selector), selector, function (ev) {
            var t = $(ev.currentTarget);
            var text = t.attr(self.attribute);

            if (!text || !text.length) {
                text = t.attr('data-tooltip');
            }

            if (text && text.length) {
                t.attr(self.attribute, '');
                t.attr('data-tooltip', text);

                content.html(text);

                if (self.followPointer) {
                    Cuic.anchor($elm, position, [ev.pageX, ev.pageY]);
                } else {
                    Cuic.anchor($elm, position, ev.currentTarget);
                    refreshTail();
                }
                self.open();
            }
        });

        // Move tooltip when mouse moves over area
        // todo optimize
        body.off(ns('mousemove', selector)).on(ns('mousemove', selector), selector, function (ev) {
            if (self.followPointer) {
                Cuic.anchor($elm, position, [ev.pageX, ev.pageY]);
            } else {
                Cuic.anchor($elm, position, ev.currentTarget);
                refreshTail();
            }
        });

        // Close tooltip when mouse leaves area
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
