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

    // Check if the namespace is not used
    if (typeof Cuic !== 'undefined') {
        throw 'Cuic already exists';
    }

    // Check if jQuery is loaded
    if (typeof jQuery === 'undefined') {
        throw 'jQuery not found';
    }

    /**
     * The Common User Interface Components
     * @type {*}
     */
    window.Cuic = {
        /**
         * The mouse X position
         * @type {number}
         */
        mouseX: null,

        /**
         * The mouse Y position
         * @type {number}
         */
        mouseY: null,

        /**
         * Applies the styles to the target.
         * Styles can be a string or an object.
         * @param styles
         * @param elm
         */
        applyCss: function (styles, elm) {
            if (styles != null) {
                if (typeof styles === 'object') {
                    elm.css(styles);
                }
                else if (typeof styles === 'string') {
                    elm.attr('style', elm.attr('style') + ';' + styles);
                }
            }
        },

        /**
         * Position an object from the exterior
         * @param elm
         * @param position
         * @param target
         * @return {jQuery}
         */
        anchor: function (elm, position, target) {
            var isPixel = target instanceof Array && target.length === 2;

            if (!isPixel) {
                target = $(target);
            }

            var targetHeight = isPixel ? 1 : target.outerHeight();
            var targetHeightHalf = targetHeight / 2;
            var targetWidth = isPixel ? 1 : target.outerWidth();
            var targetWidthHalf = targetWidth / 2;

            var objWidth = elm.outerWidth(true);
            var objWidthHalf = objWidth / 2;
            var objHeight = elm.outerHeight(true);
            var objHeightHalf = objHeight / 2;

            var offset = isPixel ? {left: target[0], top: target[1]} : target.offset();

            var pos = position.split(' ');

            var styles = {
                bottom: '',
                right: ''
            };

            switch (pos[0]) {
                case 'bottom':
                    styles.left = offset.left + targetWidthHalf - objWidthHalf;
                    styles.top = offset.top + targetHeight;
                    break;

                case 'left':
                    styles.left = offset.left - objWidth;
                    styles.top = offset.top + targetHeightHalf - objHeightHalf;
                    break;

                case 'right':
                    styles.left = offset.left + targetWidth;
                    styles.top = offset.top + targetHeightHalf - objHeightHalf;
                    break;

                case 'top':
                    styles.left = offset.left + targetWidthHalf - objWidthHalf;
                    styles.top = offset.top - objHeight;
                    break;
            }

            switch (pos[1]) {
                case 'bottom':
                    styles.top = offset.top + targetHeight;
                    break;

                case 'middle':
                    styles.top = offset.top + targetHeightHalf - objHeightHalf;
                    break;

                case 'top':
                    styles.top = offset.top - objHeight;
                    break;
            }

            if (elm.css('position') === 'fixed') {
                styles.left -= window.scrollX;
                styles.top -= window.scrollY;
            }

            // Check that the element is not positioned outside the screen
            if (styles.bottom != null && styles.bottom < 0) {
                styles.bottom = 0;
            }
            if (styles.left != null && styles.left < 0) {
                styles.left = 0;
            }
            if (styles.right != null && styles.right < 0) {
                styles.right = 0;
            }
            if (styles.top != null && styles.top < 0) {
                styles.top = 0;
            }

            // Position the object
            elm.css(styles);

            return elm;
        },

        /**
         * Returns the element margins
         * @param elm
         * @return {{bottom: Number, left: Number, right: Number, top: Number}}
         */
        margin: function (elm) {
            elm = $(elm);
            return {
                bottom: parseInt(elm.css('margin-bottom')),
                left: parseInt(elm.css('margin-left')),
                right: parseInt(elm.css('margin-right')),
                top: parseInt(elm.css('margin-top'))
            }
        },

        /**
         * Returns the element padding
         * @param elm
         * @return {{bottom: Number, left: Number, right: Number, top: Number}}
         */
        padding: function (elm) {
            elm = $(elm);
            return {
                bottom: parseInt(elm.css('padding-bottom')),
                left: parseInt(elm.css('padding-left')),
                right: parseInt(elm.css('padding-right')),
                top: parseInt(elm.css('padding-top'))
            }
        },

        /**
         * Position an object inside another
         * @param elm
         * @param position
         * @param container
         * @return {jQuery}
         */
        position: function (elm, position, container) {
            elm = $(elm);

            // Use element's parent as reference
            container = $(container || elm.offsetParent());

            if (container.length === 1 && container.get(0)) {
                if (container.get(0).nodeName === 'HTML') {
                    container = $(document.body);
                }
                container.append(elm);
            } else {
                throw new Error('Cannot position element, invalid container');
            }

            var fixed = false;
            var containerHeight = container.innerHeight();
            var containerWidth = container.innerWidth();

            // Use jQuery to get window's size because
            // it returns the value without scrollbars
            var windowHeight = $(window).innerHeight();
            var windowWidth = $(window).innerWidth();

            // If the target is fixed, we use the window as container
            if (elm.css('position') === 'fixed') {
                containerHeight = windowHeight;
                containerWidth = windowWidth;
                fixed = true;
            }

            // Check that the element is not bigger than the container
            if (elm.outerWidth(true) > containerWidth) {
                elm.width(containerWidth - (elm.outerWidth(true) - elm.width()));
            }
            if (elm.outerHeight(true) > containerHeight) {
                elm.height(containerHeight - (elm.outerHeight(true) - elm.height()));
            }

            var targetHeight = elm.outerHeight(true);
            var targetWidth = elm.outerWidth(true);
            var relativeLeft = fixed ? 0 : container.get(0).scrollLeft;
            var relativeTop = fixed ? 0 : container.get(0).scrollTop;
            var relativeBottom = fixed ? 0 : -relativeTop;
            var relativeRight = fixed ? 0 : -relativeLeft;

            var styles = {};

            function getCenterX() {
                return relativeLeft + (containerWidth / 2 - targetWidth / 2);
            }

            function getCenterY() {
                return relativeTop + (containerHeight / 2 - targetHeight / 2);
            }

            var pos = position.split(' ');

            if (pos[0]) {
                switch (pos[0]) {
                    case 'bottom':
                        styles.bottom = relativeBottom;
                        styles.left = getCenterX();
                        break;

                    case 'center':
                        styles.left = getCenterX();
                        styles.top = getCenterY();
                        break;

                    case 'left':
                        styles.left = relativeLeft;
                        styles.top = getCenterY();
                        break;

                    case 'right':
                        styles.right = relativeRight;
                        styles.top = getCenterY();
                        break;

                    case 'top':
                        styles.left = getCenterX();
                        styles.top = relativeTop;
                        break;

                    default:
                        if (/^[0-9]+(\.[0-9]*)?[a-z%]*$/g.test(pos[0])) {
                            styles.left = pos[0];
                        }
                }
            }

            if (pos[1]) {
                switch (pos[1]) {
                    case 'bottom':
                        styles.top = '';
                        styles.bottom = relativeBottom;
                        break;

                    case 'middle':
                        styles.bottom = '';
                        styles.top = getCenterY();
                        break;

                    case 'top':
                        styles.bottom = '';
                        styles.top = relativeTop;
                        break;
                }
            }

            // Check that the element is not positioned outside the screen
            if (styles.bottom != null && styles.bottom < 0) {
                styles.bottom = 0;
            }
            if (styles.left != null && styles.left < 0) {
                styles.left = 0;
            }
            if (styles.right != null && styles.right < 0) {
                styles.right = 0;
            }
            if (styles.top != null && styles.top < 0) {
                styles.top = 0;
            }

            // Remove previous position
            elm.css({
                bottom: '',
                left: '',
                right: '',
                top: ''
            });

            // Apply new position
            elm.css(styles);

            return elm;
        },

        /**
         * Returns the value depending of the type of the value,
         * for example, if it is a function, it will returns the result of the function.
         * @param value
         * @param context
         * @return {*}
         */
        valueOf: function (value, context) {
            switch (typeof value) {
                case 'function':
                    value = value.call(context);
                    break;
            }
            return value;
        }
    };

    $(document).ready(function () {
        // Save mouse position on move
        $(document).on('mousemove', function (ev) {
            Cuic.mouseX = ev.clientX;
            Cuic.mouseY = ev.clientY;
        });

        // Make root nodes fit screen,
        // that allow dialogs and other floating elements
        // to be positioned at the bottom.
        $('html,body').css({height: '100%', minHeight: '100%'});
    });

})(jQuery);
