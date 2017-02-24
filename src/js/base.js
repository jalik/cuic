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

(function (window) {
    'use strict';

    const Cuic = {

        /**
         * Global options
         */
        options: {
            debug: false
        },

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
         * Adds pixel unit to numeric values if needed
         * @param styles
         * @return {*}
         */
        autoPixel(styles) {
            const properties = [
                // positioning
                'bottom',
                'left',
                'padding',
                'right',
                'top',
                // dimension
                'max-height',
                'max-width',
                'height',
                'width',
                // margin
                'margin',
                'margin-bottom',
                'margin-left',
                'margin-right',
                'margin-top',
                // padding
                'padding',
                'padding-bottom',
                'padding-left',
                'padding-right',
                'padding-top'
            ];

            // Add pixel unit to numbers
            for (let style in styles) {
                if (styles.hasOwnProperty(style)) {
                    if (typeof styles[style] === 'number' && properties.indexOf(style) !== -1) {
                        styles[style] = styles[style] + 'px';
                    }
                }
            }
            return styles;
        },

        /**
         * Position an object inside another
         * @param element
         * @param position
         * @param parent
         * @return {*}
         */
        calculateAlign(element, position, parent) {
            element = this.element(element);
            position = position || '';

            if (parent) {
                parent = this.element(parent);

                // Use body as parent
                if (parent.node().nodeName === 'HTML') {
                    parent = this.element(document.body);
                }
            }
            else {
                // Use parent node if no parent defined
                parent = element.offsetParent();
            }

            let elHeight = element.outerHeight(true);
            let elWidth = element.outerWidth(true);
            let parentHeight = parent.height();
            let parentWidth = parent.width();
            let relativeLeft = parent.node().scrollLeft; // todo use internal method scrollLeft
            let relativeTop = parent.node().scrollTop; // todo use internal method scrollTop
            let relativeBottom = -relativeTop;
            let relativeRight = -relativeLeft;
            let prop = {
                bottom: '',
                left: '',
                right: '',
                top: ''
            };

            // If the target is fixed, we use the window as parent
            switch (element.css('position')) {
                case 'fixed':
                    parent = this.element(window);
                    parentHeight = parent.innerHeight();
                    parentWidth = parent.innerWidth();
                    relativeLeft = 0;
                    relativeTop = 0;
                    relativeBottom = 0;
                    relativeRight = 0;
                    break;
            }

            const centerX = relativeLeft + Math.max(0, parent.innerWidth() / 2 - elWidth / 2);
            const centerY = relativeTop + Math.max(0, parent.innerHeight() / 2 - elHeight / 2);

            // Vertical position
            if (position.indexOf('top') !== -1) {
                prop.top = 0;
            }
            else if (position.indexOf('bottom') !== -1) {
                prop.bottom = 0;
            }
            else {
                prop.top = centerY;
            }

            // Horizontal position
            if (position.indexOf('left') !== -1) {
                prop.left = 0;
            }
            else if (position.indexOf('right') !== -1) {
                prop.right = 0;
            }
            else {
                prop.left = centerX;
            }

            // Calculate available position
            const available = this.calculateAvailablePosition(element, parent);

            // Constraint position
            if (prop.left < available.minX) {
                prop.left = available.minX;
            }
            else if (prop.left > available.maxX) {
                prop.left = available.maxX;
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

            let targetHeight;
            let targetWidth;
            let targetOffset;

            // Target is a coordinate (x, y)
            if (target instanceof Array && target.length === 2) {
                targetHeight = 1;
                targetWidth = 1;
                targetOffset = {
                    left: target[0],
                    top: target[1]
                };
            }
            // Target is an element
            else {
                target = this.element(target);
                targetHeight = target.outerHeight();
                targetWidth = target.outerWidth();
                targetOffset = target.offset();
            }

            let elWidth = element.outerWidth(true);
            let elHeight = element.outerHeight(true);
            let elCenterX = (elWidth / 2);
            let elCenterY = (elHeight / 2);
            let targetCenterX = (targetWidth / 2);
            let targetCenterY = (targetHeight / 2);

            // fixme elHeight can be less if animated (resized), which leads to wrong elCenterY
            // fixme the problem is with element with scale(0) or display:none

            // const disp = element.css('display');
            // const cls = element.getClasses().join(' ');
            // // element.css('display', '');
            // element.removeClass(cls);
            // let compHeight = this.getComputedStyle(element, 'height');
            // let compBorder = element.border();
            // let compPadding = element.padding();
            // let compMargin = element.margin();
            // let total = compPadding.vertical + compBorder.vertical + compMargin.vertical;
            // console.log('elCenterY', elCenterY, 'outerHeight:', elHeight, 'compHeight:', compHeight, 'compTotal:', total);
            // console.log('height', element.height())
            // console.log('innerHeight', element.innerHeight())
            // console.log('outerHeight', element.outerHeight())
            // element.addClass(cls);
            // // element.css(disp);
            // element.hide();

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
                prop.top = targetOffset.top - elHeight;
            }
            else {
                prop.top = targetOffset.top + targetCenterY - elCenterY;
            }

            // Horizontal positioning
            if (position.indexOf('left') !== -1) {
                prop.left = targetOffset.left - elWidth;
            }
            else if (position.indexOf('right') !== -1) {
                prop.left = targetOffset.left + targetWidth;
            }
            else {
                prop.left = targetOffset.left + targetCenterX - elCenterX;
            }

            // Use window for positioning
            if (element.css('position') === 'fixed') {
                prop.left -= window.scrollX;
                prop.top -= window.scrollY;
            }

            // todo constraint element to be inside visible area of the screen

            return prop;
        },

        /**
         * Returns the available position inside a container
         * @param element
         * @param parent
         * @return {{height, width}}
         */
        calculateAvailablePosition(element, parent) {
            element = this.element(element);
            parent = parent ? this.element(parent) : element.offsetParent();

            let prop = {
                minX: 0,
                minY: 0,
                maxX: Math.max(0, parent.width() - element.outerWidth(true)),
                maxY: Math.max(0, parent.height() - element.outerHeight(true))
            };

            // Adjust limits depending of element position
            switch (element.css('position')) {
                case 'absolute':
                case 'fixed':
                    const prPadding = parent.padding();
                    // const elMargin = element.margin();
                    prop.maxX += prPadding.horizontal;
                    prop.maxY += prPadding.vertical;
                    // prop.maxX -= elMargin.horizontal;
                    // prop.maxY -= elMargin.vertical;
                    // fixme max is wrong sometimes
                    break;
            }
            return prop;
        },

        /**
         * Returns the available space inside a container
         * @param element
         * @param parent
         * @return {{height, width}}
         */
        calculateAvailableSpace(element, parent) {
            element = this.element(element);
            parent = parent ? this.element(parent) : element.offsetParent();

            const elMargin = element.margin();

            let prop = {
                height: parent.height(),
                width: parent.width()
            };

            // Adjust limits depending of element position
            switch (element.css('position')) {
                case 'absolute':
                case 'fixed':
                    const prPadding = parent.padding();
                    prop.height += prPadding.vertical;
                    prop.width += prPadding.horizontal;
                    prop.height -= elMargin.vertical;
                    prop.width -= elMargin.horizontal;
                    break;
                case 'relative':
                    prop.height -= elMargin.vertical;
                    prop.width -= elMargin.horizontal;
                    break;
            }
            return prop;
        },

        /**
         * Calculates maximized properties
         * @param element
         * @return {*}
         */
        calculateMaximize(element) {
            element = this.element(element);
            const parent = element.offsetParent();
            const parentPadding = parent.padding();
            const elMargin = element.margin();
            let prop = {
                bottom: '',
                height: parent.innerHeight() - parentPadding.vertical,
                left: '',
                right: '',
                top: '',
                width: parent.innerWidth() - parentPadding.horizontal
            };

            // Adjust dimensions
            switch (element.css('position')) {
                case 'absolute':
                case 'fixed':
                    prop.height += parentPadding.vertical;
                    prop.height -= elMargin.vertical;
                    prop.width += parentPadding.horizontal;
                    prop.width -= elMargin.horizontal;
                    break;

                case 'relative':
                    prop.height -= elMargin.vertical;
                    prop.width -= elMargin.horizontal;
                    break;
            }

            // Horizontal position
            if (element.isAligned('right')) {
                prop.right = 0;
            } else {
                prop.left = 0;
            }
            // Vertical position
            if (element.isAligned('bottom')) {
                prop.bottom = 0;
            } else {
                prop.top = 0;
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
            element = this.element(element);
            position = position || '';

            // Create a clone with minimal size
            const clone = element.clone();
            clone.css({height: 'auto', width: 'auto'});
            clone.appendTo(element.parent());

            // Calculate minimized size
            let prop = this.calculateAlign(clone, position);
            prop.height = clone.outerHeight();
            prop.width = clone.outerWidth();
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
         * Displays a message in the console
         */
        debug() {
            if (this.options.debug && console !== undefined) {
                (console.debug || console.log).apply(this, Array.prototype.slice.call(arguments));
            }
        },

        /**
         * Returns a Cuic element if possible
         * @param element
         * @return {*|Cuic.Element}
         */
        element(element) {
            if (element instanceof this.Element) {
                return element;
            }
            if (this.isNode(element)) {
                return new this.Element(element);
            }
            if (element instanceof Window) {
                return new this.Element(element);
            }
            if (element instanceof jQuery) {
                return new this.Element(element.get(0));
            }
            if (typeof element === 'string') {
                return this.find(element).eq(0);
            }
            return element;
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
         * Returns all elements matching the selector
         * @param selector
         * @param context
         * @return {Cuic.Elements}
         */
        find(selector, context) {
            context = this.node(context || document);
            return this.element(context).find(selector);
        },

        /**
         * Returns the computed style of the element
         * @param element
         * @param style
         * @return {*}
         */
        getComputedStyle(element, style) {
            element = this.node(element);
            return window.getComputedStyle(element, null).getPropertyValue(style);
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
         * Checks if the element is an instance of Element
         * @param o
         * @return {*}
         */
        isElement(o) {
            return (
                typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
                    o
                    && typeof o === 'object'
                    && o !== null
                    && o.nodeType === 1
                    && typeof o.nodeName === 'string'
            );
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
         * Checks if the element is an instance of Node
         * @param o
         * @return {*}
         */
        isNode(o) {
            return (
                typeof Node === 'object' ? o instanceof Node :
                    o
                    && typeof o === 'object'
                    && typeof o.nodeType === 'number'
                    && typeof o.nodeName === 'string'
            );
        },

        /**
         * Creates a namespace helper
         * @param ns
         * @return {Function}
         */
        namespace(ns) {
            return (event, id) => {
                id = Cuic.slug(id);
                return `${event}.cuic.${ns}` + (id ? `.${id}` : '');
            };
        },

        /**
         * Returns the HTML node from the element
         * @param element
         * @return {null|HTMLDocument|HTMLElement|Window}
         */
        node(element) {
            if (this.isNode(element)) {
                return element;
            }
            if (element instanceof Window) {
                return element;
            }
            if (element instanceof this.Element) {
                return element.node();
            }
            if (element instanceof jQuery) {
                return element.get(0);
            }
            if (typeof element === 'string') {
                return this.find(element).get(0);
            }
            console.info(element);
            throw new TypeError(`cannot get HTMLElement from element.`);
        },

        /**
         * Removes an event listener
         * @param event
         * @param element
         * @param callback
         * @return {*}
         */
        off(event, element, callback) {
            if (element instanceof this.Element) {
                element = element.node();
            }
            else if (element instanceof jQuery) {
                element = element.get(0);
            }
            else if (!this.isNode(element) && !(element instanceof Window)) {
                console.info(event, element);
                throw new TypeError(`Cannot add event listener on unsupported element.`);
            }
            const browserEvent = this.whichEvent(event);

            // Check if event is supported
            if (!browserEvent) {
                console.warn(`Event "${event}" is not supported by this browser.`);
            }

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
            if (element instanceof this.Element) {
                element = element.node();
            }
            else if (element instanceof jQuery) {
                element = element.get(0);
            }
            else if (!this.isNode(element) && !(element instanceof Window)) {
                console.info(event, element);
                throw new TypeError(`Cannot add event listener on unsupported element.`);
            }
            const browserEvent = this.whichEvent(event);

            // Check if event is supported
            if (!browserEvent) {
                console.warn(`Event "${event}" is not supported by this browser.`);
            }

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
            if (element instanceof this.Element) {
                element = element.node();
            }
            else if (element instanceof jQuery) {
                element = element.get(0);
            }
            else if (!this.isNode(element) && !(element instanceof Window)) {
                console.info(event, element);
                throw new TypeError(`Cannot add event listener on unsupported element.`);
            }
            const browserEvent = this.whichEvent(event);

            // Check if event is supported
            if (!browserEvent) {
                console.warn(`Event "${event}" is not supported by this browser.`);
            }

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
            const listener = (ev) => {
                Cuic.removeEventListener(element, browserEvent, listener);
                Cuic.apply(callback, this, Array.prototype.slice.call(arguments));
            };
            return this.addEventListener(element, browserEvent, listener);
        },

        /**
         * Executes a callback when the window is resized
         * @param callback
         * @param delay
         */
        onWindowResized(callback, delay = 100) {
            let timer;
            this.on('resize', window, function (ev) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    callback.call(this, ev);
                }, delay);
            });
        },

        /**
         * Returns the value as boolean
         * @param val
         * @return {null|boolean}
         */
        parseBoolean  (val) {
            if (/^true$/i.test(val)) {
                return true;
            }
            if (/^false$/i.test(val)) {
                return false;
            }
            return null;
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
         * Executes the callback when the DOM is ready
         * @param callback
         */
        ready(callback) {
            document.addEventListener('DOMContentLoaded', callback);
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
         * Returns the string converted to CamelCase
         * @param str
         * @return {string}
         */
        toCamelCase(str) {
            // Lower cases the string
            return str.toLowerCase()
            // Replaces any - or _ characters with a space
                .replace(/[-_]+/g, ' ')
                // Removes any non alphanumeric characters
                .replace(/[^\w\s]/g, '')
                // Uppercases the first character in each group immediately following a space
                // (delimited by spaces)
                .replace(/ (.)/g, ($1) => {
                    return $1.toUpperCase();
                })
                // Removes spaces
                .replace(/ /g, '');
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
            // Check in window
            if (window[event] !== undefined || window[`on${event}`] !== undefined) {
                return event;
            }
        },
    };

    if (window) {
        window.Cuic = Cuic;
    }

    Cuic.ready(() => {
        // Save mouse position on move
        Cuic.element(document).on('mousemove', (ev) => {
            Cuic.mouseX = ev.clientX;
            Cuic.mouseY = ev.clientY;
        });

        // Make root nodes fit screen,
        // that allow dialogs and other floating elements
        // to be positioned on all the screen.
        Cuic.find('html,body').css({height: '100%', minHeight: '100%'});
        // Make body the reference for positioning
        Cuic.find('body').css({position: 'relative'});
    });

})(window);
