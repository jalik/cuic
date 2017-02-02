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

(function ($, window) {
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
    var Cuic = {

        /**
         * Use debug mode
         */
        DEBUG: false,

        /**
         * The mouse X position
         * @type {number}
         */
        mouseX: 0,

        /**
         * The mouse Y position
         * @type {number}
         */
        mouseY: 0,

        /**
         * Adds an event listener
         * @param element
         * @param event
         * @param listener
         * @return {*}
         */
        addEventListener: function (element, event, listener) {
            if (typeof element.addEventListener === 'function') {
                return element.addEventListener(event, listener);
            }
            else if (typeof element.attachEvent) {
                return element.attachEvent(event, listener);
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
            var prop = this.calculateAnchor(elm, position, target);
            this.debug('Cuic.anchor:', prop);
            elm.css(prop);
            return elm;
        },

        /**
         * Calls the function with an array of arguments
         * @param fn
         * @param context
         * @param args
         * @return {*}
         */
        apply: function (fn, context, args) {
            if (typeof fn === 'function') {
                return fn.apply(context, args);
            }
        },

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
         * @return {*}
         */
        calculateAnchor: function (elm, position, target) {
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

            var prop = {
                bottom: '',
                right: ''
            };

            switch (pos[0]) {
                case 'bottom':
                    prop.left = offset.left + targetWidthHalf - objWidthHalf;
                    prop.top = offset.top + targetHeight;
                    break;

                case 'left':
                    prop.left = offset.left - objWidth;
                    prop.top = offset.top + targetHeightHalf - objHeightHalf;
                    break;

                case 'right':
                    prop.left = offset.left + targetWidth;
                    prop.top = offset.top + targetHeightHalf - objHeightHalf;
                    break;

                case 'top':
                    prop.left = offset.left + targetWidthHalf - objWidthHalf;
                    prop.top = offset.top - objHeight;
                    break;
            }

            switch (pos[1]) {
                case 'bottom':
                    prop.top = offset.top + targetHeight;
                    break;

                case 'middle':
                    prop.top = offset.top + targetHeightHalf - objHeightHalf;
                    break;

                case 'top':
                    prop.top = offset.top - objHeight;
                    break;
            }

            if (elm.css('position') === 'fixed') {
                prop.left -= window.scrollX;
                prop.top -= window.scrollY;
            }

            // Check that the element is not positioned outside the screen
            if (prop.bottom != null && prop.bottom < 0) {
                prop.bottom = 0;
            }
            if (prop.left != null && prop.left < 0) {
                prop.left = 0;
            }
            if (prop.right != null && prop.right < 0) {
                prop.right = 0;
            }
            if (prop.top != null && prop.top < 0) {
                prop.top = 0;
            }
            return prop;
        },

        /**
         * Calculates maximize properties
         * @param element
         * @param position
         * @param container
         * @return {{bottom: string, height: number, left: string, right: string, top: string, width: number}}
         */
        calculateMaximize: function (element, position, container) {
            var ctnPadding = Cuic.padding(container);
            var elmMargin = Cuic.margin(element);
            var prop = {
                bottom: '',
                height: container.height() - elmMargin.vertical,
                left: '',
                right: '',
                top: '',
                width: container.width() - elmMargin.horizontal
            };

            // Horizontal position
            if (position.indexOf('right') !== -1) {
                prop.right = ctnPadding.right;
            } else {
                prop.left = ctnPadding.left;
            }

            // Vertical position
            if (position.indexOf('bottom') !== -1) {
                prop.bottom = ctnPadding.bottom;
            } else {
                prop.top = ctnPadding.top;
            }
            return prop;
        },

        /**
         * Maximizes the element
         * @param element
         * @param position
         * @param container
         * @return {*|HTMLElement}
         */
        maximize: function (element, position, container) {
            var prop = Cuic.calculateMaximize(element, position, container);
            var $elm = $(element);
            Cuic.debug('Cuic.maximize', prop);
            $elm.addClass('maximized');
            $elm.css(prop);
            return $elm;
        },

        /**
         * Position an object inside another
         * @param element
         * @param position
         * @param container
         * @return {*}
         */
        calculatePosition: function (element, position, container) {
            var $elm = $(element);
            var $container = $(container || $elm.offsetParent());

            if ($container.length === 1 && $container.get(0)) {
                if ($container.get(0).nodeName === 'HTML') {
                    $container = $(document.body);
                }
                $container.append($elm);
            } else {
                throw new TypeError('Cannot position element, invalid container');
            }

            var containerHeight = $container.innerHeight();
            var containerWidth = $container.innerWidth();
            var containerMargin = Cuic.margin($container);
            var containerPadding = Cuic.padding($container);
            var targetHeight = $elm.outerHeight(true);
            var targetWidth = $elm.outerWidth(true);
            var relativeLeft = $container.get(0).scrollLeft;
            var relativeTop = $container.get(0).scrollTop;
            var relativeBottom = -relativeTop;
            var relativeRight = -relativeLeft;
            var prop = {
                bottom: '',
                left: '',
                right: '',
                top: ''
            };

            // If the target is fixed, we use the window as container
            if ($elm.css('position') === 'fixed') {
                // Use jQuery to get window's size because
                // it returns the value without scrollbars
                $container = $(window);
                containerHeight = $container.innerHeight();
                containerWidth = $container.innerWidth();
                relativeLeft = 0;
                relativeTop = 0;
                relativeBottom = 0;
                relativeRight = 0;
            }

            function getCenterX() {
                return relativeLeft + (containerWidth / 2 - targetWidth / 2);
            }

            function getCenterY() {
                return relativeTop + (containerHeight / 2 - targetHeight / 2);
            }

            // Check that the element is not bigger than the container
            if (targetWidth > containerWidth) {
                prop.width = containerWidth - (targetWidth - $elm.width());
            }
            if (targetHeight > containerHeight) {
                prop.height = containerHeight - (targetHeight - $elm.height());
            }

            // Vertical position
            if (position.indexOf('bottom') !== -1) {
                prop.bottom = containerPadding.bottom;
            } else if (position.indexOf('top') !== -1) {
                prop.top = containerPadding.top;
            } else {
                prop.top = getCenterY() + containerPadding.top;
            }

            // Horizontal position
            if (position.indexOf('left') !== -1) {
                prop.left = containerPadding.left;
            } else if (position.indexOf('right') !== -1) {
                prop.right = containerPadding.right;
            } else {
                prop.left = getCenterX() + containerPadding.left;
            }

            return prop;
        },

        /**
         * Calls the function with arguments
         * @return {*}
         */
        call: function () {
            var context;
            var fn;
            var args = Array.prototype.slice.call(arguments);

            if (args.length >= 2) {
                fn = args.shift();
                context = args.shift();
            }
            else if (args.length > 0) {
                fn = args.shift();
            }
            return this.apply(fn, context, args);
        },

        /**
         * Displays a message in the console
         */
        debug: function () {
            if (this.DEBUG && console !== undefined) {
                console.log.apply(this, Array.prototype.slice.call(arguments));
            }
        },

        /**
         * Returns the element margins
         * @param elm
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        margin: function (elm) {
            elm = $(elm);
            var bottom = parseInt(elm.css('margin-bottom'));
            var left = parseInt(elm.css('margin-left'));
            var right = parseInt(elm.css('margin-right'));
            var top = parseInt(elm.css('margin-top'));
            return {
                bottom: bottom,
                horizontal: left + right,
                left: left,
                right: right,
                top: top,
                vertical: bottom + top
            };
        },

        /**
         * Creates a namespace helper
         * @param ns
         * @return {Function}
         */
        namespace: function (ns) {
            return function (event, id) {
                id = Cuic.slug(id);
                return event + '.cuic.' + ns + (id ? '.' + id : '');
            };
        },

        /**
         * Removes an event listener
         * @param event
         * @param element
         * @param callback
         * @return {*}
         */
        off: function (event, element, callback) {
            // return this.removeEventListener(element, event, callback);
            return $(element).off(event, callback);
        },

        /**
         * Attaches an event listener
         * @param event
         * @param element
         * @param callback
         * @return {*}
         */
        on: function (event, element, callback) {
            // return this.addEventListener(element, event, callback);
            return $(element).on(event, callback);
        },

        /**
         * Attaches a unique event listener
         * @param event
         * @param element
         * @param callback
         * @return {*}
         */
        once: function (event, element, callback) {
            // Use correct event
            // event = Cuic.whichEvent(event);

            var listener = function (ev) {
                // this.removeEventListener(element, event, callback);
                Cuic.apply(callback, this, Array.prototype.slice.call(arguments));
            };
            // return this.addEventListener(element, event, listener);
            return $(element).one(event, listener);
        },

        /**
         * Returns the element padding
         * @param elm
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        padding: function (elm) {
            elm = $(elm);
            var bottom = parseInt(elm.css('padding-bottom'));
            var left = parseInt(elm.css('padding-left'));
            var right = parseInt(elm.css('padding-right'));
            var top = parseInt(elm.css('padding-top'));
            return {
                bottom: bottom,
                horizontal: left + right,
                left: left,
                right: right,
                top: top,
                vertical: bottom + top
            };
        },

        /**
         * Positions the element
         * @param elm
         * @param position
         * @param container
         * @return {*}
         */
        position: function (elm, position, container) {
            var prop = this.calculatePosition(elm, position, container);
            Cuic.debug('Cuic.position:', prop);
            elm.css(prop);
            return elm;
        },

        /**
         * Removes an event listener
         * @param element
         * @param event
         * @param listener
         * @return {*}
         */
        removeEventListener: function (element, event, listener) {
            if (typeof element.removeEventListener === 'function') {
                return element.removeEventListener(event, listener);
            }
            else if (typeof element.detachEvent) {
                return element.detachEvent(event, listener);
            }
        },

        /**
         * Removes all special characters
         * @param text
         * @return {string}
         */
        slug: function (text) {
            if (typeof text === 'string') {
                text = text.replace(/ +/g, '-');
                text = text.replace(/[^a-zA-Z0-9_-]+/g, '');
            }
            return text;
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
        },

        /**
         * Returns the event supported by the current environment
         * @param event
         * @return {*}
         */
        whichEvent: function (event) {
            var ev;
            var el = document.createElement('div');
            var resolver = {};

            switch (event) {
                case 'transitionend':
                    resolver = {
                        'transition': 'transitionend',
                        'OTransition': 'oTransitionEnd',
                        'MozTransition': 'transitionend',
                        'WebkitTransition': 'webkitTransitionEnd'
                    };
                    break;
            }

            for (ev in resolver) {
                if (el.style[ev] !== undefined) {
                    return resolver[ev];
                }
            }
            return event;
        }
    };

    if (window) {
        window.Cuic = Cuic;
    }

    $(document).ready(function () {
        var ns = Cuic.namespace('base');

        // Save mouse position on move
        $(document).off(ns('mousemove')).on(ns('mousemove'), function (ev) {
            Cuic.mouseX = ev.clientX;
            Cuic.mouseY = ev.clientY;
        });

        // Make root nodes fit screen,
        // that allow dialogs and other floating elements
        // to be positioned on all the screen.
        $('html,body').css({height: '100%', minHeight: '100%'});
    });

})(jQuery, window);
