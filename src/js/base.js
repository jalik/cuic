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
    const Cuic = {

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
        addEventListener(element, event, listener) {
            if (typeof element.addEventListener === 'function') {
                return element.addEventListener(event, listener);
            }
            else if (typeof element.attachEvent === 'function') {
                return element.attachEvent(event, listener);
            }
        },

        /**
         * Adds CSS class to the element
         * @param element
         * @param className
         * @return {Array|*}
         */
        addClass(element, className) {
            let classes = this.getClasses(element);
            const target = (className || '').split(' ');

            for (let i = 0; i < target.length; i += 1) {
                // Check if class is already assigned
                if (classes.indexOf(target[i]) === -1) {
                    classes.push(target[i]);
                }
            }
            element.className = classes.join(' ');
            return classes;
        },

        /**
         * Position an object from the exterior
         * @param element
         * @param position
         * @param target
         * @return {jQuery}
         */
        anchor(element, position, target) {
            let $element = $(element);
            let prop = Cuic.calculateAnchor($element, position, target);
            $element.css(prop);
            return $element;
        },

        /**
         * Calls the function with an array of arguments
         * @param fn
         * @param context
         * @param args
         * @return {*}
         */
        apply(fn, context, args) {
            if (typeof fn === 'function') {
                return fn.apply(context, args);
            }
        },

        /**
         * Position an object from the exterior
         * @param element
         * @param position
         * @param target
         * @return {*}
         */
        calculateAnchor(element, position, target) {
            let isPixel = target instanceof Array && target.length === 2;

            if (!isPixel) {
                target = $(target);
            }

            let targetHeight = isPixel ? 1 : target.outerHeight();
            let targetHeightHalf = targetHeight / 2;
            let targetWidth = isPixel ? 1 : target.outerWidth();
            let targetWidthHalf = targetWidth / 2;

            let objWidth = element.outerWidth(true);
            let objWidthHalf = objWidth / 2;
            let objHeight = element.outerHeight(true);
            let objHeightHalf = objHeight / 2;

            let offset = isPixel ? {left: target[0], top: target[1]} : target.offset();

            let pos = position.split(' ');

            let prop = {
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

            if (element.css('position') === 'fixed') {
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
         * Calculates maximized properties
         * @param element
         * @param position
         * @return {{bottom: string, height: number, left: string, right: string, top: string, width: number}}
         */
        calculateMaximize(element, position) {
            position = position || '';
            let $element = $(element);
            let $container = $($element.offsetParent());
            let ctnPadding = Cuic.padding($container);
            let elmMargin = Cuic.margin($element);
            let prop = {
                bottom: '',
                height: $container.height() - elmMargin.vertical,
                left: '',
                right: '',
                top: '',
                width: $container.width() - elmMargin.horizontal
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
         * Calculates minimized properties
         * @param element
         * @param position
         * @return {*}
         */
        calculateMinimize(element, position) {
            position = position || '';
            let $element = $(element);
            let $container = $element.offsetParent();

            // Create a clone with minimal size
            let $clone = $(element.cloneNode(true));
            $clone.css({height: 'auto', width: 'auto'});

            // Calculate minimized size
            let prop = Cuic.calculatePosition($clone, position, $container);
            prop.height = $clone.outerHeight();
            prop.width = $clone.outerWidth();
            $clone.remove();

            return prop;
        },

        /**
         * Position an object inside another
         * @param element
         * @param position
         * @param parent
         * @return {*}
         */
        calculatePosition(element, position, parent) {
            let $element = $(element);
            let $container = $(parent || $element.offsetParent());
            position = position || '';

            if ($container.length === 1 && $container.get(0)) {
                if ($container.get(0).nodeName === 'HTML') {
                    $container = $(document.body);
                }
                $container.append($element);
            } else {
                throw new TypeError('Cannot position element, invalid parent');
            }

            let containerHeight = $container.innerHeight();
            let containerWidth = $container.innerWidth();
            let containerPadding = Cuic.padding($container);
            let targetHeight = $element.outerHeight(true);
            let targetWidth = $element.outerWidth(true);
            let relativeLeft = $container.get(0).scrollLeft;
            let relativeTop = $container.get(0).scrollTop;
            let relativeBottom = -relativeTop;
            let relativeRight = -relativeLeft;
            let prop = {
                bottom: '',
                left: '',
                right: '',
                top: ''
            };

            // If the target is fixed, we use the window as parent
            if ($element.css('position') === 'fixed') {
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
                return relativeLeft + ($container.width() / 2 - targetWidth / 2);
            }

            function getCenterY() {
                return relativeTop + ($container.height() / 2 - targetHeight / 2);
            }

            // Check that the element is not bigger than the parent
            if (targetWidth > containerWidth) {
                prop.width = containerWidth - (targetWidth - $element.width());
            }
            if (targetHeight > containerHeight) {
                prop.height = containerHeight - (targetHeight - $element.height());
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
        call() {
            let context;
            let fn;
            let args = Array.prototype.slice.call(arguments);

            if (args.length >= 2) {
                fn = args.shift();
                context = args.shift();
            }
            else if (args.length > 0) {
                fn = args.shift();
            }
            return Cuic.apply(fn, context, args);
        },

        /**
         * Applies the styles to the target.
         * Styles can be a string or an object.
         * @param element
         * @param styles
         */
        css(element, styles) {
            if (element instanceof jQuery) {
                element = element.get(0);
            }

            // Writing styles
            if (styles) {
                if (typeof styles === 'object') {
                    let mergedStyles = '';

                    // Get current styles
                    for (let i = 0; i < element.style.length; i += 1) {
                        const property = element.style[i];
                        let value = element.style[property];
                        mergedStyles += `${property}: ${value};`;
                    }
                    // Add new styles
                    for (let style in styles) {
                        if (styles.hasOwnProperty(style)) {
                            let value = styles[style];
                            mergedStyles += `${style}: ${value};`;
                        }
                    }
                    element.style = mergedStyles;
                }
                else if (typeof styles === 'string') {
                    // Set styles
                    if (styles.indexOf(':') !== -1) {
                        element.style = styles;
                    } else {
                        // Return specific style
                        return element.style[styles];
                    }
                }
            }
            // Return all styles
            return element.style;
        },

        /**
         * Displays a message in the console
         */
        debug() {
            if (this.DEBUG && console !== undefined) {
                console.log.apply(this, Array.prototype.slice.call(arguments));
            }
        },

        /**
         * Enters full screen
         * @param element
         */
        enterFullScreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },

        /**
         * Exits full screen
         */
        exitFullScreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        },

        /**
         * Returns CSS classes
         * @param element
         * @return {Array}
         */
        getClasses(element) {
            return element.className.split(' ');
        },

        /**
         * Returns the CSS style prefix depending of the browser
         * @return {*}
         */
        getStylePrefix() {
            const element = document.createElement('div');

            // Check with animation
            if (element.WebkitAnimation == '') return '-webkit-';
            if (element.MozAnimation == '') return '-moz-';
            if (element.OAnimation == '') return '-o-';

            // Check with transition
            if (element.WebkitTransition == '') return '-webkit-';
            if (element.MozTransition == '') return '-moz-';
            if (element.OTransition == '') return '-o-';

            return '';
        },

        /**
         * Checks if the element has the CSS class
         * @param element
         * @param className
         * @return {boolean}
         */
        hasClass(element, className) {
            const classes = this.getClasses(element);
            const target = (className || '').split(' ');
            let result = false;

            for (let i = 0; i < target.length; i += 1) {
                if (classes.indexOf(target[i]) !== -1) {
                    result = true;
                } else {
                    result = false;
                }
            }
            return result;
        },

        /**
         * Checks if the browser is Chrome 1+
         * @return {boolean}
         */
        isChrome() {
            return !!window.chrome && !!window.chrome.webstore;
        },

        /**
         * Checks if the browser is Edge 20+
         * @return {boolean}
         */
        isEdge() {
            return !isIE && !!window.StyleMedia;
        },

        /**
         * Checks if the browser is Firefox 1.0+
         * @return {boolean}
         */
        isFirefox() {
            return typeof InstallTrigger !== 'undefined';
        },

        /**
         * Checks if full screen is enabled
         * @return {boolean}
         */
        isFullScreenEnabled() {
            return (document.fullscreenEnabled
                || document.webkitFullscreenEnabled
                || document.mozFullScreenEnabled
                || document.msFullscreenEnabled) === true;
        },

        /**
         * Checks if the browser is Internet Explorer 6-11
         * @return {boolean}
         */
        isIE() {
            return /*@cc_on!@*/!!document.documentMode;
        },

        /**
         * Checks if the browser is Opera 8.0+
         * @return {boolean}
         */
        isOpera() {
            return (!!window.opr && !!opr.addons)
                || !!window.opera
                || navigator.userAgent.indexOf(' OPR/') >= 0;
        },

        /**
         * Checks if the element is at the position
         * @param position
         * @param element
         * @return {boolean}
         */
        isPosition(position, element) {
            const style = element.style;

            if (position.indexOf('bottom') !== -1) {
                return style.bottom && !style.top;
            }
            if (position.indexOf('top') !== -1) {
                return style.top && !style.bottom;
            }
            if (position.indexOf('left') !== -1) {
                return style.left && !style.right;
            }
            if (position.indexOf('right') !== -1) {
                return style.right && !style.left;
            }
            return false;
        },

        /**
         * Checks if the browser is Safari 3.0+
         * @return {boolean}
         */
        isSafari() {
            return /constructor/i.test(window.HTMLElement)
                || (function (p) {
                    return p.toString() === "[object SafariRemoteNotification]";
                })(!window['safari']
                    || safari.pushNotification);
        },

        /**
         * Returns the element margins
         * @param element
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        margin(element) {
            let $element = $(element);
            let bottom = parseInt($element.css('margin-bottom'));
            let left = parseInt($element.css('margin-left'));
            let right = parseInt($element.css('margin-right'));
            let top = parseInt($element.css('margin-top'));
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
         * Maximizes the element
         * @param element
         * @param position
         * @return {*|HTMLElement}
         */
        maximize(element, position) {
            let prop = Cuic.calculateMaximize(element, position);
            let $element = $(element);
            $element.addClass('maximized');
            $element.css(prop);
            return $element;
        },

        /**
         * Minimizes the element
         * @param element
         * @param position
         * @return {*|HTMLElement}
         */
        minimize(element, position) {
            let prop = Cuic.calculateMinimize(element, position);
            let $element = $(element);
            $element.addClass('minimized');
            $element.removeClass('maximized');
            $element.css(prop);
            return $element;
        },

        /**
         * Creates a namespace helper
         * @param ns
         * @return {Function}
         */
        namespace(ns) {
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
        off(event, element, callback) {
            const browserEvent = this.whichEvent(event);

            // Event is a animation
            if (event.indexOf('animation') !== -1) {
                const duration = this.prefixStyle('animation-duration');

                // Execute callback now
                if (!browserEvent && !('animation' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Event is a transition
            else if (event.indexOf('transition') !== -1) {
                const duration = this.prefixStyle('transition-duration');

                // Execute callback now
                if (!browserEvent && !('transition' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Check if event is supported
            if (!browserEvent) {
                console.warn(`Event "${event}" is not supported by this browser.`);
            }
            return this.removeEventListener(element, browserEvent, callback);
        },

        /**
         * Attaches an event listener
         * @param event
         * @param element
         * @param callback
         * @return {*}
         */
        on(event, element, callback) {
            const browserEvent = this.whichEvent(event);

            // Event is a animation
            if (event.indexOf('animation') !== -1) {
                const duration = this.prefixStyle('animation-duration');

                // Execute callback now
                if (!browserEvent && !('animation' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Event is a transition
            else if (event.indexOf('transition') !== -1) {
                const duration = this.prefixStyle('transition-duration');

                // Execute callback now
                if (!browserEvent && !('transition' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Check if event is supported
            if (!browserEvent) {
                console.warn(`Event "${event}" is not supported by this browser.`);
            }
            return this.addEventListener(element, browserEvent, callback);
        },

        /**
         * Attaches a unique event listener
         * @param event
         * @param element
         * @param callback
         * @return {*}
         */
        once(event, element, callback) {
            const browserEvent = this.whichEvent(event);

            // Event is a animation
            if (event.indexOf('animation') !== -1) {
                const duration = this.prefixStyle('animation-duration');

                // Execute callback now
                if (!browserEvent && !('animation' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Event is a transition
            else if (event.indexOf('transition') !== -1) {
                const duration = this.prefixStyle('transition-duration');

                // Execute callback now
                if (!browserEvent && !('transition' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Check if event is supported
            if (!browserEvent) {
                console.warn(`Event "${event}" is not supported by this browser.`);
            }
            const listener = function (ev) {
                Cuic.removeEventListener(element, browserEvent, listener);
                Cuic.apply(callback, this, Array.prototype.slice.call(arguments));
            };
            return this.addEventListener(element, browserEvent, listener);
        },

        /**
         * Returns the element padding
         * @param element
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        padding(element) {
            let $element = $(element);
            let bottom = parseInt($element.css('padding-bottom'));
            let left = parseInt($element.css('padding-left'));
            let right = parseInt($element.css('padding-right'));
            let top = parseInt($element.css('padding-top'));
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
         * @param element
         * @param position
         * @param parent
         * @return {*}
         */
        position(element, position, parent) {
            let $element = $(element);
            let prop = this.calculatePosition(element, position, parent);
            $element.css(prop);
            return $element;
        },

        /**
         * Returns the prefixed style
         * @param style
         * @return {string}
         */
        prefixStyle(style) {
            const prefix = this.getStylePrefix();
            return typeof prefix === 'string' && prefix.length ? prefix + style : style;
        },

        /**
         * Removes CSS class from the element
         * @param element
         * @param className
         * @return {*|Array}
         */
        removeClass(element, className) {
            let classes = this.getClasses(element);
            const target = (className || '').split(' ');

            for (let i = 0; i < target.length; i += 1) {
                let index = classes.indexOf(target[i]);

                if (index !== -1) {
                    classes.splice(index, 1);
                }
            }
            element.className = classes.join(' ');
            return classes;
        },

        /**
         * Removes an event listener
         * @param element
         * @param event
         * @param listener
         * @return {*}
         */
        removeEventListener(element, event, listener) {
            if (typeof element.removeEventListener === 'function') {
                return element.removeEventListener(event, listener);
            }
            else if (typeof element.detachEvent === 'function') {
                return element.detachEvent(event, listener);
            }
        },

        /**
         * Removes all special characters
         * @param text
         * @return {string}
         */
        slug(text) {
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
        valueOf(value, context) {
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
        whichEvent(event) {
            let ev;
            let el = document.createElement('div');
            let resolver = {};

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
            // Check in resolver
            for (ev in resolver) {
                if (el.style[ev] !== undefined) {
                    return resolver[ev];
                }
            }
            // Check in document
            if (document[event] !== undefined || document[`on${event}`] !== undefined) {
                return event;
            }
        }
    };

    if (window) {
        window.Cuic = Cuic;
    }

    $(document).ready(function () {
        let ns = Cuic.namespace('base');

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
