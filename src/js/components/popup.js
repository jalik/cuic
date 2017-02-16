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

    var ns = Cuic.namespace('popup');

    /**
     * Creates a popup
     * @param options
     * @constructor
     */
    Cuic.Popup = function (options) {
        var self = this;
        var $element;
        var isClosing = false;
        var isOpened = false;
        var isOpening = false;
        var position;
        var $target;

        // Default options
        options = Cuic.extend(true, {}, Cuic.Popup.prototype.options, options);

        // Define attributes
        self.autoClose = options.autoClose === true;
        self.autoRemove = options.autoRemove === true;
        self.closeable = options.closeable === true;
        self.closeButton = options.closeButton;

        // Define vars
        position = options.position;
        $target = $(options.target);

        /**
         * Closes the popup
         * @param callback
         * @return {Cuic.Popup}
         */
        self.close = function (callback) {
            if (isOpening || (isOpened && !isClosing)) {
                isClosing = true;
                isOpening = false;
                $element.stop(true, false).fadeOut(200, function () {
                    if (typeof callback === 'function') {
                        callback.call(self);
                    }
                    if (self.autoRemove) {
                        $element.remove();
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
            return $element;
        };

        /**
         * Checks if the popup is opened
         * @return {boolean}
         */
        self.isOpened = function () {
            return isOpened;
        };

        /**
         * Opens the popup
         * @param callback
         * @return {Cuic.Popup}
         */
        self.open = function (callback) {
            if (isClosing || (!isOpened && !isOpening)) {
                isClosing = false;
                isOpening = true;

                // Add the close button
                if (self.closeable) {
                    $element.find('.close-popup').remove();
                    $('<span>', {
                        class: 'close-popup',
                        html: self.closeButton
                    }).appendTo($element);
                }

                // If the content of the popup has changed,
                // we need to check if there is a close button
                $element.find('.close-popup').off('click').one(ns('click'), self.close);

                // Position the element
                self.setAnchor(position, $target);

                $element.stop(true, false).fadeIn(200, function () {
                    if (typeof callback === 'function') {
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
         * @return {Cuic.Popup}
         */
        self.setAnchor = function (pos, targ) {
            position = pos;
            $target = $(targ || $target);
            Cuic.anchor($element, pos, $target);
            return self;
        };

        /**
         * Sets the content
         * @param html
         * @return {Cuic.Popup}
         */
        self.setContent = function (html) {
            $element.html(html);
            return self;
        };

        /**
         * Toggles the popup visibility
         * @param callback
         * @return {Cuic.Popup}
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
        $element = $('<div>', {
            class: options.className,
            html: options.content
        }).appendTo(document.body);

        // Set custom styles
        Cuic.css($element, options.css);

        // Set required styles
        $element.css({
            display: 'none',
            position: 'absolute',
            zIndex: options.zIndex
        });

        // Close the popup when the user clicks outside of it
        $(document).off(ns('mousedown')).on(ns('mousedown'), function (ev) {
            var target = $(ev.target);

            if (target !== $element && target.closest($element).length === 0) {
                if (self.autoClose && isOpened) {
                    self.close();
                }
            }
        });
    };

    /**
     * Default options
     * @type {*}
     */
    Cuic.Popup.prototype.options = {
        autoClose: true,
        autoRemove: true,
        className: 'popup',
        closeable: false,
        closeButton: '×',
        content: null,
        css: null,
        position: 'right',
        target: null,
        zIndex: 9
    };

})(jQuery);
