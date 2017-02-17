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
         * Adds CSS class to the element
         * @param element
         * @param className
         * @return {Array|*}
         */
        addClass(element, className) {
            element = this.getElement(element);

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
         * Adds an event listener
         * @param element
         * @param event
         * @param listener
         * @return {*}
         */
        addEventListener(element, event, listener) {
            element = this.getElement(element);

            if (typeof element.addEventListener === 'function') {
                return element.addEventListener(event, listener);
            }
            else if (typeof element.attachEvent === 'function') {
                return element.attachEvent(event, listener);
            }
        },

        /**
         * Place the element inside a target
         * @param element
         * @param position
         * @param parent
         * @return {HTMLElement}
         */
        align(element, position, parent) {
            element = this.getElement(element);
            this.css(element, this.calculateAlign(element, position, parent));
            return element;
        },

        /**
         * Place an object toward a target
         * @param element
         * @param position
         * @param target
         * @return {HTMLElement}
         */
        anchor(element, position, target) {
            element = this.getElement(element);
            this.css(element, this.calculateAnchor(element, position, target));
            return element;
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
         * Returns the element border
         * @param element
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        border(element) {
            const bottom = parseInt(this.getComputedStyle(element, 'border-bottom-width'));
            const left = parseInt(this.getComputedStyle(element, 'border-left-width'));
            const right = parseInt(this.getComputedStyle(element, 'border-right-width'));
            const top = parseInt(this.getComputedStyle(element, 'border-top-width'));
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
         * Position an object inside another
         * @param element
         * @param position
         * @param parent
         * @return {*}
         */
        calculateAlign(element, position, parent) {
            element = this.getElement(element);
            position = position || '';

            if (parent) {
                parent = this.getElement(parent);

                // Use body as parent
                if (parent.nodeName === 'HTML') {
                    parent = document.body;
                }
                // Append element to parent if needed
                if (parent !== element.parentNode) {
                    parent.append(element);
                }
            }
            else {
                // Use parent node if no parent defined
                parent = element.parentNode
            }

            let elmHeight = this.outerHeight(element, true);
            let elmWidth = this.outerWidth(element, true);
            let elmMargin = this.margin(element);
            let parentHeight = this.innerHeight(parent);
            let parentWidth = this.innerWidth(parent);
            let parentPadding = this.padding(parent);
            let relativeLeft = parent.scrollLeft;
            let relativeTop = parent.scrollTop;
            let relativeBottom = -relativeTop;// todo maybe subtract element height ?
            let relativeRight = -relativeLeft;// todo maybe subtract element width ?
            let prop = {
                bottom: '',
                left: '',
                right: '',
                top: ''
            };

            // If the target is fixed, we use the window as parent
            if (this.css(element, 'position') === 'fixed') {
                parent = window;
                parentHeight = this.innerHeight(parent);
                parentWidth = this.innerWidth(parent);
                relativeLeft = 0;
                relativeTop = 0;
                relativeBottom = 0;
                relativeRight = 0;
            }

            const getCenterX = () => {
                return relativeLeft + (this.width(parent) / 2 - elmWidth / 2);
            };

            const getCenterY = () => {
                return relativeTop + (this.height(parent) / 2 - elmHeight / 2);
            };

            // Limit element size to parent size
            if (elmWidth > parentWidth) {
                prop.width = (parentWidth - (elmWidth - this.width(element)));
            }
            if (elmHeight > parentHeight) {
                prop.height = (parentHeight - (elmHeight - this.height(element)));
            }

            // Vertical position
            if (position.indexOf('bottom') !== -1) {
                prop.bottom = Math.max(parentPadding.bottom, elmMargin.bottom);
            }
            else if (position.indexOf('top') !== -1) {
                prop.top = Math.max(parentPadding.top, elmMargin.top);
            }
            else {
                prop.top = (getCenterY() + Math.max(parentPadding.top, elmMargin.top));
            }

            // Horizontal position
            if (position.indexOf('left') !== -1) {
                prop.left = Math.max(parentPadding.left, elmMargin.left);
            }
            else if (position.indexOf('right') !== -1) {
                prop.right = Math.max(parentPadding.right, elmMargin.right);
            }
            else {
                prop.left = (getCenterX() + Math.max(parentPadding.left, elmMargin.left));
            }

            // Add pixel unit to numbers
            for (let attr in prop) {
                if (typeof prop[attr] === 'number') {
                    prop[attr] = prop[attr] + 'px';
                }
            }
            return prop;
        },

        /**
         * Position an object from the exterior
         * @param element
         * @param position
         * @param target
         * @return {*}
         */
        calculateAnchor(element, position, target) {
            position = position || '';
            element = this.element(element);

            let isPixel = target instanceof Array && target.length === 2;

            if (!isPixel) {
                target = this.element(target);
            }

            let targetHeight = isPixel ? 1 : target.outerHeight();
            let targetWidth = isPixel ? 1 : target.outerWidth();
            let targetCenterX = parseInt(targetWidth / 2);
            let targetCenterY = parseInt(targetHeight / 2);
            let targetOffset = isPixel ? {left: target[0], top: target[1]} : target.offset();

            let objWidth = element.outerWidth(true);
            let objHeight = element.outerHeight(true);
            let objCenterX = parseInt(objWidth / 2);
            let objCenterY = parseInt(objHeight / 2);

            let prop = {
                bottom: '',
                left: '',
                right: '',
                top: ''
            };

            // Vertical positioning
            if (position.indexOf('bottom') !== -1) {
                prop.top = targetOffset.top + targetHeight;
            }
            else if (position.indexOf('top') !== -1) {
                prop.top = targetOffset.top - objHeight;
            }
            else {
                prop.top = targetOffset.top + targetCenterY - objCenterY;
            }

            // Horizontal positioning
            if (position.indexOf('left') !== -1) {
                prop.left = targetOffset.left - objWidth;
            }
            else if (position.indexOf('right') !== -1) {
                prop.left = targetOffset.left + targetWidth;
            }
            else {
                prop.left = targetOffset.left + targetCenterX - objCenterX;
            }

            // Use window for positioning
            if (element.css('position') === 'fixed') {
                prop.left -= window.scrollX;
                prop.top -= window.scrollY;
            }

            // // todo Check that the element is not positioned outside of the screen
            // if (prop.bottom != null && prop.bottom < 0) {
            //     prop.bottom = 0;
            // }
            // if (prop.left != null && prop.left < 0) {
            //     prop.left = 0;
            // }
            // if (prop.right != null && prop.right < 0) {
            //     prop.right = 0;
            // }
            // if (prop.top != null && prop.top < 0) {
            //     prop.top = 0;
            // }

            // Add pixel unit to numbers
            for (let attr in prop) {
                if (typeof prop[attr] === 'number') {
                    prop[attr] = prop[attr] + 'px';
                }
            }
            return prop;
        },

        /**
         * Calculates maximized properties
         * @param element
         * @return {{bottom: string, height: string, left: string, right: string, top: string, width: string}}
         */
        calculateMaximize(element) {
            element = this.getElement(element);
            const parent = element.parentNode;
            const ctnPadding = this.padding(parent);
            const elmMargin = this.margin(element);
            let prop = {
                bottom: '',
                height: (this.height(parent) - elmMargin.vertical) + 'px',
                left: '',
                right: '',
                top: '',
                width: (this.width(parent) - elmMargin.horizontal) + 'px'
            };

            // Horizontal position
            if (this.isPosition('right', element)) {
                prop.right = ctnPadding.right + 'px';
            } else {
                prop.left = ctnPadding.left + 'px';
            }
            // Vertical position
            if (this.isPosition('bottom', element)) {
                prop.bottom = ctnPadding.bottom + 'px';
            } else {
                prop.top = ctnPadding.top + 'px';
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
            element = this.getElement(element);
            position = position || '';

            // Create a clone with minimal size
            const clone = element.cloneNode(true);
            this.css(clone, {height: 'auto', width: 'auto'});

            // Calculate minimized size
            let prop = this.calculateAlign(clone, position, element.parentNode);
            prop.height = this.outerHeight(clone) + 'px';
            prop.width = this.outerWidth(clone) + 'px';
            clone.remove();

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
            return this.apply(fn, context, args);
        },

        /**
         * Returns the closest parent element matching the selector
         * @param element
         * @param selector
         * @return {*}
         */
        closest(element, selector) {
            element = this.getElement(element);
            return element.closest(selector);
        },

        /**
         * Applies the styles to the target.
         * Styles can be a string or an object.
         * @param element
         * @param styles
         * @return {*}
         */
        css(element, styles) {
            element = this.getElement(element);

            // Writing styles
            if (styles) {
                if (typeof styles === 'object') {
                    let mergedStyles = '';

                    // Get current styles
                    for (let i = 0; i < element.style.length; i += 1) {
                        const property = element.style[i];

                        // Ignore properties that are overwritten
                        if (!(property in styles)) {
                            let value = element.style[property];
                            if (typeof value === 'string' && value === '') {
                                value = '""';
                            }
                            mergedStyles += `${property}: ${value};`;
                        }
                    }
                    // Add new styles
                    for (let style in styles) {
                        if (styles.hasOwnProperty(style)) {
                            let value = styles[style];

                            // Check if style is supported
                            if (!(style in element.style)) {
                                console.warn(`Style "${style}" is not supported by element.`, element);
                            }
                            if (typeof value === 'string' && value === '') {
                                value = '""';
                            }
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
         * Returns a Cuic element if possible
         * @param elm
         * @return {*|Cuic.Element}
         */
        element(elm) {
            if (elm instanceof this.Element) {
                return elm;
            }
            if (elm instanceof HTMLElement) {
                return new this.Element(elm);
            }
            if (elm instanceof jQuery) {
                return new this.Element(elm.get(0));
            }
            return elm;
        },

        /**
         * Enters full screen
         * @param element
         */
        enterFullScreen(element) {
            element = this.getElement(element);

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
         * Merge objects
         * @return {*}
         */
        extend() {
            const args = Array.prototype.slice.call(arguments);
            let recursive = false;
            let a = args.shift();

            if (typeof a === 'boolean') {
                recursive = a;
                a = args.shift();
            }

            for (let i = 0; i < args.length; i += 1) {
                const b = args[i];

                if (typeof b === 'object' && b !== null && b !== undefined
                    && typeof a === 'object' && a !== null && a !== undefined) {
                    for (let key in b) {
                        if (b.hasOwnProperty(key)) {
                            if (recursive && typeof b[key] === 'object' && b[key] !== null && b[key] !== undefined) {
                                a[key] = this.extend(a[key], b[key]);
                            } else {
                                a[key] = b[key];
                            }
                        }
                    }
                } else if (b !== null && b !== undefined) {
                    a = b;
                }
            }
            return a
        },

        /**
         * Returns CSS classes
         * @param element
         * @return {Array}
         */
        getClasses(element) {
            element = this.getElement(element);
            return element.className.split(' ');
        },

        /**
         * Returns the computed style of the element
         * @param element
         * @param style
         * @return {*}
         */
        getComputedStyle(element, style) {
            element = this.getElement(element);
            return window.getComputedStyle(element, null).getPropertyValue(style);
        },

        /**
         * Returns the HTML element from various objects (Cuic, jQuery...)
         * @param element
         * @return {*|HTMLElement|HTMLDocument}
         */
        getElement(element) {
            if (element instanceof HTMLElement) {
                return element;
            }
            if (element instanceof HTMLDocument) {
                return element;
            }
            if (element instanceof this.Element) {
                return element.getElement();
            }
            if (element instanceof jQuery) {
                return element.get(0);
            }
            throw new TypeError(`element is not supported (HTMLElement, Cuic.Element or jQuery)`);
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
            element = this.getElement(element);
            const classes = this.getClasses(element);
            const classNames = (className || '').split(' ');
            let result = classNames.length > 0;

            for (let i = 0; i < classNames.length; i += 1) {
                if (classes.indexOf(classNames[i]) === -1) {
                    result = false;
                    break;
                }
            }
            return result;
        },

        /**
         * Returns the element height
         * @param element
         * @return {number}
         */
        height(element) {
            element = this.getElement(element);
            const padding = this.padding(element);
            return element.clientHeight - padding.vertical;
        },

        /**
         * Returns the element width including padding
         * @param element
         * @return {number}
         */
        innerHeight(element) {
            element = this.getElement(element);
            // todo subtract vertical scrollbar width
            return element.clientHeight;
        },

        /**
         * Returns the element width including padding
         * @param element
         * @return {number}
         */
        innerWidth(element) {
            element = this.getElement(element);
            // todo subtract horizontal scrollbar width
            return element.clientWidth;
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
         * Checks if the element is a parent node
         * @param parent
         * @param element
         * @return {boolean}
         */
        isParent(parent, element) {
            parent = this.getElement(parent);
            element = this.getElement(element);
            let elm = element;

            do {
                elm = elm.parentNode;

                if (elm === parent) {
                    return true;
                }
            } while (elm);

            return false;
        },

        /**
         * Checks if the element is at the position
         * @param position
         * @param element
         * @return {boolean}
         */
        isPosition(position, element) {
            element = this.getElement(element);
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
            const bottom = parseInt(this.getComputedStyle(element, 'margin-bottom'));
            const left = parseInt(this.getComputedStyle(element, 'margin-left'));
            const right = parseInt(this.getComputedStyle(element, 'margin-right'));
            const top = parseInt(this.getComputedStyle(element, 'margin-top'));
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
         * @return {HTMLElement}
         */
        maximize(element) {
            element = this.getElement(element);
            this.removeClass(element, 'minimized');
            this.addClass(element, 'maximized');
            this.css(element, this.calculateMaximize(element));
            return element;
        },

        /**
         * Minimizes the element
         * @param element
         * @param position
         * @return {HTMLElement}
         */
        minimize(element, position) {
            element = this.getElement(element);
            this.removeClass(element, 'maximized');
            this.addClass(element, 'minimized');
            this.css(element, this.calculateMinimize(element, position));
            return element;
        },

        /**
         * Creates a namespace helper
         * @param ns
         * @return {Function}
         */
        namespace(ns) {
            return function (event, id) {
                id = Cuic.slug(id);
                return `${event}.cuic.${ns}` + (id ? `.${id}` : '');
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
            element = this.getElement(element);
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
         * Returns the element offset
         * @param element
         * @return {{left: Number, top: Number}}
         */
        offset(element) {
            element = this.getElement(element);
            return {
                left: element.offsetLeft,
                top: element.offsetTop
            };
        },

        /**
         * Attaches an event listener
         * @param event
         * @param element
         * @param callback
         * @return {*}
         */
        on(event, element, callback) {
            element = this.getElement(element);
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
            element = this.getElement(element);
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
         * Returns the element height including padding, border and margin
         * @param element
         * @param includeMargin
         * @return {number}
         */
        outerHeight(element, includeMargin) {
            element = this.getElement(element);
            const margin = this.margin(element);
            return element.offsetHeight + (includeMargin ? margin.vertical : 0);
        },

        /**
         * Returns the element width including padding, border and margin
         * @param element
         * @param includeMargin
         * @return {number}
         */
        outerWidth(element, includeMargin) {
            element = this.getElement(element);
            const margin = this.margin(element);
            return element.offsetWidth + (includeMargin ? margin.horizontal : 0);
        },

        /**
         * Returns the element padding
         * @param element
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        padding(element) {
            const bottom = parseInt(this.getComputedStyle(element, 'padding-bottom'));
            const left = parseInt(this.getComputedStyle(element, 'padding-left'));
            const right = parseInt(this.getComputedStyle(element, 'padding-right'));
            const top = parseInt(this.getComputedStyle(element, 'padding-top'));
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
         * Returns the element position
         * @param element
         * @return {{bottom: Number, left: Number, right: Number, top: Number}}
         */
        position(element) {
            const bottom = parseInt(this.getComputedStyle(element, 'bottom'));
            const left = parseInt(this.getComputedStyle(element, 'left'));
            const right = parseInt(this.getComputedStyle(element, 'right'));
            const top = parseInt(this.getComputedStyle(element, 'top'));
            return {
                bottom: bottom,
                left: left,
                right: right,
                top: top
            };
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
            element = this.getElement(element);
            let classes = this.getClasses(element);
            const classNames = (className || '').split(' ');

            for (let i = 0; i < classNames.length; i += 1) {
                let index = classes.indexOf(classNames[i]);

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
            element = this.getElement(element);

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
        },

        /**
         * Returns the element width
         * @param element
         * @return {number}
         */
        width(element) {
            element = this.getElement(element);
            const padding = this.padding(element);
            return element.clientWidth - padding.horizontal;
        }
    };

    if (window) {
        window.Cuic = Cuic;
    }

    $(document).ready(function () {
        // Save mouse position on move
        Cuic.on('mousemove', document, (ev) => {
            Cuic.mouseX = ev.clientX;
            Cuic.mouseY = ev.clientY;
        });

        // Make root nodes fit screen,
        // that allow dialogs and other floating elements
        // to be positioned on all the screen.
        $('html,body').css({height: '100%', minHeight: '100%'});
    });

})(jQuery, window);
