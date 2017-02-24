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

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s);
        var i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
    };
}

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

    var Cuic = {

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
        addEventListener: function addEventListener(element, event, listener) {
            if (typeof element.addEventListener === 'function') {
                return element.addEventListener(event, listener);
            } else if (typeof element.attachEvent === 'function') {
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
        apply: function apply(fn, context, args) {
            if (typeof fn === 'function') {
                return fn.apply(context, args);
            }
        },


        /**
         * Adds pixel unit to numeric values if needed
         * @param styles
         * @return {*}
         */
        autoPixel: function autoPixel(styles) {
            var properties = [
            // positioning
            'bottom', 'left', 'padding', 'right', 'top',
            // dimension
            'max-height', 'max-width', 'height', 'width',
            // margin
            'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top',
            // padding
            'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top'];

            // Add pixel unit to numbers
            for (var style in styles) {
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
        calculateAlign: function calculateAlign(element, position, parent) {
            element = this.element(element);
            position = position || '';

            if (parent) {
                parent = this.element(parent);

                // Use body as parent
                if (parent.node().nodeName === 'HTML') {
                    parent = this.element(document.body);
                }
            } else {
                // Use parent node if no parent defined
                parent = element.offsetParent();
            }

            var elHeight = element.outerHeight(true);
            var elWidth = element.outerWidth(true);
            var parentHeight = parent.height();
            var parentWidth = parent.width();
            var relativeLeft = parent.node().scrollLeft; // todo use internal method scrollLeft
            var relativeTop = parent.node().scrollTop; // todo use internal method scrollTop
            var relativeBottom = -relativeTop;
            var relativeRight = -relativeLeft;
            var prop = {
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

            var centerX = relativeLeft + Math.max(0, parent.innerWidth() / 2 - elWidth / 2);
            var centerY = relativeTop + Math.max(0, parent.innerHeight() / 2 - elHeight / 2);

            // Vertical position
            if (position.indexOf('top') !== -1) {
                prop.top = 0;
            } else if (position.indexOf('bottom') !== -1) {
                prop.bottom = 0;
            } else {
                prop.top = centerY;
            }

            // Horizontal position
            if (position.indexOf('left') !== -1) {
                prop.left = 0;
            } else if (position.indexOf('right') !== -1) {
                prop.right = 0;
            } else {
                prop.left = centerX;
            }

            // Calculate available position
            var available = this.calculateAvailablePosition(element, parent);

            // Constraint position
            if (prop.left < available.minX) {
                prop.left = available.minX;
            } else if (prop.left > available.maxX) {
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
        calculateAnchor: function calculateAnchor(element, position, target) {
            position = position || '';
            element = this.element(element);

            var targetHeight = void 0;
            var targetWidth = void 0;
            var targetOffset = void 0;

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

            var elWidth = element.outerWidth(true);
            var elHeight = element.outerHeight(true);
            var elCenterX = elWidth / 2;
            var elCenterY = elHeight / 2;
            var targetCenterX = targetWidth / 2;
            var targetCenterY = targetHeight / 2;

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

            var prop = {
                bottom: '',
                left: '',
                right: '',
                top: ''
            };

            // Vertical positioning
            if (position.indexOf('bottom') !== -1) {
                prop.top = targetOffset.top + targetHeight;
            } else if (position.indexOf('top') !== -1) {
                prop.top = targetOffset.top - elHeight;
            } else {
                prop.top = targetOffset.top + targetCenterY - elCenterY;
            }

            // Horizontal positioning
            if (position.indexOf('left') !== -1) {
                prop.left = targetOffset.left - elWidth;
            } else if (position.indexOf('right') !== -1) {
                prop.left = targetOffset.left + targetWidth;
            } else {
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
        calculateAvailablePosition: function calculateAvailablePosition(element, parent) {
            element = this.element(element);
            parent = parent ? this.element(parent) : element.offsetParent();

            var prop = {
                minX: 0,
                minY: 0,
                maxX: Math.max(0, parent.width() - element.outerWidth(true)),
                maxY: Math.max(0, parent.height() - element.outerHeight(true))
            };

            // Adjust limits depending of element position
            switch (element.css('position')) {
                case 'absolute':
                case 'fixed':
                    var prPadding = parent.padding();
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
        calculateAvailableSpace: function calculateAvailableSpace(element, parent) {
            element = this.element(element);
            parent = parent ? this.element(parent) : element.offsetParent();

            var elMargin = element.margin();

            var prop = {
                height: parent.height(),
                width: parent.width()
            };

            // Adjust limits depending of element position
            switch (element.css('position')) {
                case 'absolute':
                case 'fixed':
                    var prPadding = parent.padding();
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
        calculateMaximize: function calculateMaximize(element) {
            element = this.element(element);
            var parent = element.offsetParent();
            var parentPadding = parent.padding();
            var elMargin = element.margin();
            var prop = {
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
        calculateMinimize: function calculateMinimize(element, position) {
            element = this.element(element);
            position = position || '';

            // Create a clone with minimal size
            var clone = element.clone();
            clone.css({ height: 'auto', width: 'auto' });
            clone.appendTo(element.parent());

            // Calculate minimized size
            var prop = this.calculateAlign(clone, position);
            prop.height = clone.outerHeight();
            prop.width = clone.outerWidth();
            clone.remove();

            return prop;
        },


        /**
         * Calls the function with arguments
         * @return {*}
         */
        call: function call() {
            var context = void 0;
            var fn = void 0;
            var args = Array.prototype.slice.call(arguments);

            if (args.length >= 2) {
                fn = args.shift();
                context = args.shift();
            } else if (args.length > 0) {
                fn = args.shift();
            }
            return this.apply(fn, context, args);
        },


        /**
         * Displays a message in the console
         */
        debug: function debug() {
            if (this.options.debug && console !== undefined) {
                (console.debug || console.log).apply(this, Array.prototype.slice.call(arguments));
            }
        },


        /**
         * Returns a Cuic element if possible
         * @param element
         * @return {*|Cuic.Element}
         */
        element: function element(_element) {
            if (_element instanceof this.Element) {
                return _element;
            }
            if (_element instanceof HTMLDocument) {
                return new this.Element(_element);
            }
            if (_element instanceof HTMLElement) {
                return new this.Element(_element);
            }
            if (_element instanceof Window) {
                return new this.Element(_element);
            }
            if (_element instanceof jQuery) {
                return new this.Element(_element.get(0));
            }
            if (typeof _element === 'string') {
                return this.find(_element).eq(0);
            }
            return _element;
        },


        /**
         * Exits full screen
         */
        exitFullScreen: function exitFullScreen() {
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
        extend: function extend() {
            var args = Array.prototype.slice.call(arguments);
            var recursive = false;
            var a = args.shift();

            if (typeof a === 'boolean') {
                recursive = a;
                a = args.shift();
            }

            for (var i = 0; i < args.length; i += 1) {
                var b = args[i];

                if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object' && b !== null && b !== undefined && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && a !== null && a !== undefined) {
                    for (var key in b) {
                        if (b.hasOwnProperty(key)) {
                            if (recursive && _typeof(b[key]) === 'object' && b[key] !== null && b[key] !== undefined) {
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
            return a;
        },


        /**
         * Returns all elements matching the selector
         * @param selector
         * @param context
         * @return {Cuic.Elements}
         */
        find: function find(selector, context) {
            context = this.node(context || document);
            return this.element(context).find(selector);
        },


        /**
         * Returns the computed style of the element
         * @param element
         * @param style
         * @return {*}
         */
        getComputedStyle: function getComputedStyle(element, style) {
            element = this.node(element);
            return window.getComputedStyle(element, null).getPropertyValue(style);
        },


        /**
         * Returns the CSS style prefix depending of the browser
         * @return {*}
         */
        getStylePrefix: function getStylePrefix() {
            var element = document.createElement('div');

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
         * Checks if the browser is Chrome 1+
         * @return {boolean}
         */
        isChrome: function isChrome() {
            return !!window.chrome && !!window.chrome.webstore;
        },


        /**
         * Checks if the browser is Edge 20+
         * @return {boolean}
         */
        isEdge: function isEdge() {
            return !isIE && !!window.StyleMedia;
        },


        /**
         * Checks if the browser is Firefox 1.0+
         * @return {boolean}
         */
        isFirefox: function isFirefox() {
            return typeof InstallTrigger !== 'undefined';
        },


        /**
         * Checks if full screen is enabled
         * @return {boolean}
         */
        isFullScreenEnabled: function isFullScreenEnabled() {
            return (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) === true;
        },


        /**
         * Checks if the browser is Internet Explorer 6-11
         * @return {boolean}
         */
        isIE: function isIE() {
            return (/*@cc_on!@*/!!document.documentMode
            );
        },


        /**
         * Checks if the browser is Opera 8.0+
         * @return {boolean}
         */
        isOpera: function isOpera() {
            return !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        },


        /**
         * Checks if the browser is Safari 3.0+
         * @return {boolean}
         */
        isSafari: function isSafari() {
            return (/constructor/i.test(window.HTMLElement) || function (p) {
                    return p.toString() === "[object SafariRemoteNotification]";
                }(!window['safari'] || safari.pushNotification)
            );
        },


        /**
         * Creates a namespace helper
         * @param ns
         * @return {Function}
         */
        namespace: function namespace(ns) {
            return function (event, id) {
                id = Cuic.slug(id);
                return event + '.cuic.' + ns + (id ? '.' + id : '');
            };
        },


        /**
         * Returns the HTML node from the element
         * @param element
         * @return {null|HTMLDocument|HTMLElement|Window}
         */
        node: function node(element) {
            if (element instanceof HTMLElement) {
                return element;
            }
            if (element instanceof HTMLDocument) {
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
            throw new TypeError('cannot get HTMLElement from element.');
        },


        /**
         * Removes an event listener
         * @param event
         * @param element
         * @param callback
         * @return {*}
         */
        off: function off(event, element, callback) {
            if (element instanceof this.Element) {
                element = element.node();
            } else if (element instanceof jQuery) {
                element = element.get(0);
            } else if (!(element instanceof HTMLElement) && !(element instanceof HTMLDocument) && !(element instanceof Window)) {
                console.info(event, element);
                throw new TypeError('Cannot add event listener on unsupported element.');
            }
            var browserEvent = this.whichEvent(event);

            // Check if event is supported
            if (!browserEvent) {
                console.warn('Event "' + event + '" is not supported by this browser.');
            }

            // Event is a animation
            if (event.indexOf('animation') !== -1) {
                var duration = this.prefixStyle('animation-duration');

                // Execute callback now
                if (!browserEvent && !('animation' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Event is a transition
            else if (event.indexOf('transition') !== -1) {
                    var _duration = this.prefixStyle('transition-duration');

                    // Execute callback now
                    if (!browserEvent && !('transition' in element.style) || getComputedStyle(element)[_duration] == '0s') {
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
        on: function on(event, element, callback) {
            if (element instanceof this.Element) {
                element = element.node();
            } else if (element instanceof jQuery) {
                element = element.get(0);
            } else if (!(element instanceof HTMLElement) && !(element instanceof HTMLDocument) && !(element instanceof Window)) {
                console.info(event, element);
                throw new TypeError('Cannot add event listener on unsupported element.');
            }
            var browserEvent = this.whichEvent(event);

            // Check if event is supported
            if (!browserEvent) {
                console.warn('Event "' + event + '" is not supported by this browser.');
            }

            // Event is a animation
            if (event.indexOf('animation') !== -1) {
                var duration = this.prefixStyle('animation-duration');

                // Execute callback now
                if (!browserEvent && !('animation' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Event is a transition
            else if (event.indexOf('transition') !== -1) {
                    var _duration2 = this.prefixStyle('transition-duration');

                    // Execute callback now
                    if (!browserEvent && !('transition' in element.style) || getComputedStyle(element)[_duration2] == '0s') {
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
        once: function once(event, element, callback) {
            var _this = this,
                _arguments = arguments;

            if (element instanceof this.Element) {
                element = element.node();
            } else if (element instanceof jQuery) {
                element = element.get(0);
            } else if (!(element instanceof HTMLElement) && !(element instanceof HTMLDocument) && !(element instanceof Window)) {
                console.info(event, element);
                throw new TypeError('Cannot add event listener on unsupported element.');
            }
            var browserEvent = this.whichEvent(event);

            // Check if event is supported
            if (!browserEvent) {
                console.warn('Event "' + event + '" is not supported by this browser.');
            }

            // Event is a animation
            if (event.indexOf('animation') !== -1) {
                var duration = this.prefixStyle('animation-duration');

                // Execute callback now
                if (!browserEvent && !('animation' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Event is a transition
            else if (event.indexOf('transition') !== -1) {
                    var _duration3 = this.prefixStyle('transition-duration');

                    // Execute callback now
                    if (!browserEvent && !('transition' in element.style) || getComputedStyle(element)[_duration3] == '0s') {
                        this.apply(callback, this, Array.prototype.slice.call(arguments));
                    }
                }
            var listener = function listener(ev) {
                Cuic.removeEventListener(element, browserEvent, listener);
                Cuic.apply(callback, _this, Array.prototype.slice.call(_arguments));
            };
            return this.addEventListener(element, browserEvent, listener);
        },


        /**
         * Returns the value as boolean
         * @param val
         * @return {null|boolean}
         */
        parseBoolean: function parseBoolean(val) {
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
        prefixStyle: function prefixStyle(style) {
            var prefix = this.getStylePrefix();
            return typeof prefix === 'string' && prefix.length ? prefix + style : style;
        },


        /**
         * Executes the callback when the DOM is ready
         * @param callback
         */
        ready: function ready(callback) {
            document.addEventListener('DOMContentLoaded', callback);
        },


        /**
         * Removes an event listener
         * @param element
         * @param event
         * @param listener
         * @return {*}
         */
        removeEventListener: function removeEventListener(element, event, listener) {
            if (typeof element.removeEventListener === 'function') {
                return element.removeEventListener(event, listener);
            } else if (typeof element.detachEvent === 'function') {
                return element.detachEvent(event, listener);
            }
        },


        /**
         * Removes all special characters
         * @param text
         * @return {string}
         */
        slug: function slug(text) {
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
        toCamelCase: function toCamelCase(str) {
            // Lower cases the string
            return str.toLowerCase()
            // Replaces any - or _ characters with a space
            .replace(/[-_]+/g, ' ')
            // Removes any non alphanumeric characters
            .replace(/[^\w\s]/g, '')
            // Uppercases the first character in each group immediately following a space
            // (delimited by spaces)
            .replace(/ (.)/g, function ($1) {
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
        valueOf: function valueOf(value, context) {
            switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
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
        whichEvent: function whichEvent(event) {
            var ev = void 0;
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
            // Check in resolver
            for (ev in resolver) {
                if (el.style[ev] !== undefined) {
                    return resolver[ev];
                }
            }
            // Check in document
            if (document[event] !== undefined || document['on' + event] !== undefined) {
                return event;
            }
            // Check in window
            if (window[event] !== undefined || window['on' + event] !== undefined) {
                return event;
            }
        }
    };

    if (window) {
        window.Cuic = Cuic;
    }

    Cuic.ready(function () {
        // Save mouse position on move
        Cuic.element(document).on('mousemove', function (ev) {
            Cuic.mouseX = ev.clientX;
            Cuic.mouseY = ev.clientY;
        });

        // Make root nodes fit screen,
        // that allow dialogs and other floating elements
        // to be positioned on all the screen.
        Cuic.find('html,body').css({ height: '100%', minHeight: '100%' });
        // Make body the reference for positioning
        Cuic.find('body').css({ position: 'relative' });
    });
})(window);

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

Cuic.Benchmark = function () {
    function _class() {
        _classCallCheck(this, _class);

        var startTime = null;
        var stopTime = null;
        var time = 0;

        /**
         * Returns benchmark time
         * @returns {number}
         */
        this.getTime = function () {
            if (startTime && stopTime) {
                return stopTime - startTime;
            } else if (startTime) {
                return Date.now() - startTime;
            } else {
                return 0;
            }
        };

        /**
         * Checks if benchmark is started
         * @returns {boolean}
         */
        this.isStarted = function () {
            return typeof startTime === 'number';
        };

        /**
         * Resets the benchmark
         */
        this.reset = function () {
            time = 0;
            startTime = null;
            stopTime = null;
        };

        /**
         * Starts the benchmark
         * @returns {*}
         */
        this.start = function () {
            startTime = Date.now();
            stopTime = null;
        };

        /**
         * Stops the benchmark
         * @returns {*}
         */
        this.stop = function () {
            startTime = null;
            stopTime = Date.now();
        };
    }

    return _class;
}();

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

Cuic.Collection = function () {
    function _class2(values) {
        _classCallCheck(this, _class2);

        this.events = new Cuic.Events();
        this.values = values instanceof Array ? values : [];
        this.length = this.values.length;
    }

    /**
     * Adds the value to the collection
     * @param value
     */


    _createClass(_class2, [{
        key: 'add',
        value: function add(value) {
            this.values.push(value);
            this.length += 1;
            this.events.trigger('added', value);
        }

        /**
         * Executes a callback on each values
         * @param callback
         */

    }, {
        key: 'each',
        value: function each(callback) {
            for (var i = 0; i < this.values.length; i += 1) {
                callback.call(this, this.values[i]);
            }
        }

        /**
         * Returns the specified value
         * @param index
         * @return {Array.<T>}
         */

    }, {
        key: 'get',
        value: function get(index) {
            return this.values[index];
        }

        /**
         * Returns the index of the value
         * @param value
         * @return {number}
         */

    }, {
        key: 'indexOf',
        value: function indexOf(value) {
            return this.values.indexOf(value);
        }

        /**
         * Called when a value is added
         * @param callback
         * @return {Cuic.Collection}
         */

    }, {
        key: 'onAdded',
        value: function onAdded(callback) {
            this.events.on('added', callback);
            return this;
        }

        /**
         * Called when a value is removed
         * @param callback
         * @return {Cuic.Collection}
         */

    }, {
        key: 'onRemoved',
        value: function onRemoved(callback) {
            this.events.on('removed', callback);
            return this;
        }

        /**
         * Removes the value from the collection
         * @param value
         */

    }, {
        key: 'remove',
        value: function remove(value) {
            var index = this.values.indexOf(value);

            if (index !== -1) {
                this.values.splice(index, 1);
                this.length -= 1;
                this.events.trigger('removed', value);
            }
        }

        /**
         * Returns the collection size
         */

    }, {
        key: 'size',
        value: function size() {
            return this.values.length;
        }
    }]);

    return _class2;
}();

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

Cuic.Events = function () {
    function _class3(context) {
        _classCallCheck(this, _class3);

        this.callbacks = {};
        this.context = context;
    }

    /**
     * Removes all event listeners
     */


    _createClass(_class3, [{
        key: 'clear',
        value: function clear() {
            this.callbacks = [];
        }

        /**
         * Removes the event listener
         * @param event
         * @param callback
         */

    }, {
        key: 'off',
        value: function off(event, callback) {
            if (this.callbacks[event] instanceof Array) {
                var cb = this.callbacks[event];

                for (var i = 0; i < cb.length; i += 1) {
                    if (cb[i] === callback) {
                        cb.splice(i, 1);
                        break;
                    }
                }
            }
        }

        /**
         * Executes the callback each time the event is triggered
         * @param event
         * @param callback
         */

    }, {
        key: 'on',
        value: function on(event, callback) {
            if (!(this.callbacks[event] instanceof Array)) {
                this.callbacks[event] = [];
            }
            this.callbacks[event].push(callback);
        }

        /**
         * Executes the callback once when the event is triggered
         * @param event
         * @param callback
         */

    }, {
        key: 'once',
        value: function once(event, callback) {
            var _arguments2 = arguments,
                _this2 = this;

            if (!(this.callbacks[event] instanceof Array)) {
                this.callbacks[event] = [];
            }
            var cb = function cb() {
                var args = Array.prototype.slice.call(_arguments2);
                var context = args.shift();
                callback.apply(context, args);
                _this2.off(event, cb);
            };
            this.callbacks[event].push(cb);
        }

        /**
         * Executes all event listeners
         * @param event
         */

    }, {
        key: 'trigger',
        value: function trigger(event) {
            if (this.callbacks[event] instanceof Array) {
                var cb = this.callbacks[event];
                var args = Array.prototype.slice.call(arguments, 1);

                for (var i = 0; i < cb.length; i += 1) {
                    cb[i].apply(this.context, args);
                }
            }
        }
    }]);

    return _class3;
}();

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

/**
 * Returns the form fields
 * @param parent
 * @param options
 * @returns {Object}
 */
Cuic.getFields = function (parent, options) {
    parent = this.element(parent);

    // Default options
    options = Cuic.extend(true, {
        dynamicTyping: true,
        filter: null,
        ignoreButtons: true,
        ignoreEmpty: false,
        ignoreUnchecked: false,
        smartTyping: true
    }, options);

    var fields = {};

    parent.find('[name]').not(':disabled').each(function (el) {
        var field = el.node();
        var name = field.name;
        var type = field.type;
        var isButton = ['button', 'reset', 'submit'].indexOf(type) !== -1;
        var isCheckbox = ['checkbox', 'radio'].indexOf(type) !== -1;

        // Check if node is a form field
        if (!Cuic.isFormField(field)) {
            return;
        }
        // Check if field matches the filter
        if (!Cuic.isNodeFiltered(field, options.filter)) {
            return;
        }
        // Ignore buttons
        if (options.ignoreButtons && isButton) {
            return;
        }
        // Ignore unchecked input
        if (options.ignoreUnchecked && isCheckbox && !field.checked) {
            return;
        }
        var value = Cuic.getFieldValue(field, options);

        if (value !== null && value !== undefined || !options.ignoreEmpty) {

            // Handle multiple select specific case
            if (field.multiple === true) {
                name = name.replace(/\[]$/g, '');
            }

            // Check if field is an array or object
            if (name.indexOf('[') !== -1) {
                var rootName = name.substr(0, name.indexOf('['));
                var tree = name.substr(name.indexOf('['));
                fields[rootName] = Cuic.resolveDimensionsTree(tree, fields[rootName], value);
                return;
            }

            // Add field
            if (isCheckbox) {
                if (field.checked) {
                    fields[name] = value;
                } else if (['true', 'TRUE'].indexOf(value) !== -1) {
                    fields[name] = false;
                } else if (fields[name] === undefined) {
                    fields[name] = null;
                }
            } else {
                fields[name] = value;
            }
        }
    });
    return fields;
};

/**
 * Returns the value of the field
 * @param field
 * @param options
 * @returns {*}
 */
Cuic.getFieldValue = function (field, options) {
    options = Cuic.extend({
        dynamicTyping: true,
        smartTyping: true
    }, options);

    var value = field.value;
    var node = field.nodeName.toUpperCase();

    switch (node) {
        case 'INPUT':
            var type = typeof field.type === 'string' ? field.type.toLowerCase() : '';

            // Field is checkable
            if (['checkbox', 'radio'].indexOf(type) !== -1) {
                if (field.checked) {
                    // If value is not set but the field is checked, the browser returns 'on'
                    value = value === 'on' ? true : value;
                } else {
                    // We don't want to return the value if the field is not checked
                    value = undefined; //todo return false
                }
            }
            // Field is a button
            else if (['button', 'reset', 'submit'].indexOf(type) !== -1) {}
                // Field is a number
                else if (['number'].indexOf(type) !== -1) {
                        if (options.smartTyping) {
                            value = Cuic.parseValue(value);
                        }
                    }
            break;

        case 'SELECT':
            if (field.multiple) {
                value = [];

                // Get selected options
                this.element(field).find('option').each(function (el) {
                    var option = el.node();

                    if (option.selected) {
                        value.push(option.value);
                    }
                });
            }
            break;

        case 'TEXTAREA':
            break;
    }

    if (options.dynamicTyping && value !== null && value !== undefined) {
        // Add field value
        if (value instanceof Array) {
            for (var i = 0; i < value.length; i += 1) {
                value[i] = Cuic.parseValue(value[i]);
            }
        } else {
            value = Cuic.parseValue(value);
        }
    }
    return value;
};

/**
 * Checks if node is a field
 * @param node
 * @return {boolean}
 */
Cuic.isFormField = function (node) {
    var nodeName = node.nodeName.toUpperCase();
    return nodeName === 'TEXTAREA' || nodeName === 'SELECT' || nodeName === 'INPUT' && ['checkbox', 'color', 'date', 'datetime', 'email', 'hidden', 'month', 'number', 'password', 'radio', 'range', 'search', 'tel', 'text', 'time', 'url', 'week'].indexOf(node.type) !== -1;
};

/**
 * Checks if node is filtered
 * @param node
 * @param filter
 * @return {boolean}
 */
Cuic.isNodeFiltered = function (node, filter) {
    return filter === undefined || filter === null || filter instanceof Array && filter.indexOf(node.name) !== -1 || typeof filter === 'function' && filter.call(node, node.name);
};

/**
 * Returns the typed value of a string value
 * @param val
 * @returns {*}
 */
Cuic.parseValue = function (val) {
    if (typeof val === 'string') {
        val = val.trim();
        // Boolean
        var bool = this.parseBoolean(val);
        if (bool === true || bool === false) {
            return bool;
        }
        // Number
        if (/^-?[0-9]+$/.test(val)) {
            return parseInt(val);
        }
        if (/^-?[0-9]+\.[0-9]+$/.test(val)) {
            return parseFloat(val);
        }
    }
    return val === '' ? null : val;
};

/**
 * Resolves a dimensions tree (ex: [colors][0][code])
 * @param tree
 * @param obj
 * @param value
 * @return {*}
 */
Cuic.resolveDimensionsTree = function (tree, obj, value) {
    if (tree.length === 0) {
        return value;
    }

    // Check missing brackets
    if (obj === undefined || obj === null) {
        var opening = tree.match(/\[/g).length;
        var closing = tree.match(/]/g).length;

        if (opening > closing) {
            throw new SyntaxError("Missing closing ']' in '" + tree + "'");
        } else if (closing < opening) {
            throw new SyntaxError("Missing opening '[' in '" + tree + "'");
        }
    }

    var index = tree.indexOf('[');

    if (index !== -1) {
        var end = tree.indexOf(']', index + 1);
        var subtree = tree.substr(end + 1);
        var key = tree.substring(index + 1, end);
        var keyLen = key.length;

        // Object
        if (keyLen && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
            if (obj === undefined || obj === null) {
                obj = {};
            }
            var result = this.resolveDimensionsTree(subtree, obj[key], value);

            if (result !== undefined) {
                obj[key] = result;
            }
        }
        // Array
        else {
                if (obj === undefined || obj === null) {
                    obj = [];
                }
                // Dynamic index
                if (keyLen === 0) {
                    var _result = this.resolveDimensionsTree(subtree, obj[key], value);

                    if (_result !== undefined) {
                        obj.push(_result);
                    }
                }
                // Static index
                else if (/^[0-9]+$/.test(key)) {
                        var _result2 = this.resolveDimensionsTree(subtree, obj[key], value);

                        if (_result2 !== undefined) {
                            obj[parseInt(key)] = _result2;
                        }
                    }
            }
    }
    return obj;
};

/**
 * Returns the serialized query params
 * @param args
 * @returns {string}
 */
Cuic.serializeQueryParams = function (args) {
    var output = '';

    if (args != null) {
        if (typeof args === 'string') {
            output = args;
        } else if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object') {
            var arr = [];

            for (var key in args) {
                if (args.hasOwnProperty(key)) {
                    if (args[key] != null) {
                        arr.push('&');
                        arr.push(encodeURIComponent(key).trim());
                        arr.push('=');
                        arr.push(encodeURIComponent(args[key]).trim());
                    }
                }
            }
            if (arr.length > 0) {
                arr.unshift(arr);
                output = arr.join('');
            }
        }
    }
    return output;
};

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

Cuic.Shortcut = function () {
    function _class4(options) {
        _classCallCheck(this, _class4);

        // Set default options
        options = Cuic.extend({}, Cuic.Shortcut.prototype.options, options);
        this.options = options;

        // Get the element
        this.options.element = Cuic.node(options.element);

        // Check options
        if (typeof this.options.callback !== 'function') {
            throw new TypeError('Shortcut.options.callback is not a function.');
        }

        // Init options
        if (this.options.active) {
            this.activate();
        }
    }

    /**
     * Activates the shortcut
     */


    _createClass(_class4, [{
        key: 'activate',
        value: function activate() {
            var _this3 = this;

            var options = this.options;
            var element = this.node();
            Cuic.on('keydown', element, function (ev) {
                if ((options.keyCode === ev.keyCode || options.key === ev.key || options.key === ev.code) && options.altKey === ev.altKey && options.ctrlKey === ev.ctrlKey && options.shiftKey === ev.shiftKey) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    options.callback.call(_this3, element, ev);
                    return false;
                }
            });
        }

        /**
         * Deactivates the shortcut
         */

    }, {
        key: 'deactivate',
        value: function deactivate() {
            Cuic.off('keydown', this.node(), this.options.callback);
        }

        /**
         * Returns the element
         * @return {HTMLElement}
         */

    }, {
        key: 'node',
        value: function node() {
            return Cuic.node(this.options.element);
        }
    }]);

    return _class4;
}();

Cuic.Shortcut.prototype.options = {
    active: true,
    altKey: false,
    callback: null,
    ctrlKey: false,
    element: document.body,
    key: null,
    keyCode: null,
    shiftKey: false
};

Cuic.keys = {
    BACKSPACE: 8,
    DEL: 46,
    DOWN: 40,
    ENTER: 13,
    ESC: 27,
    INSERT: 45,
    LEFT: 37,
    MINUS: 109,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    PLUS: 107,
    RIGHT: 39,
    TAB: 9,
    UP: 38
};

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

Cuic.Element = function () {
    function _class5(node, attributes, options) {
        _classCallCheck(this, _class5);

        // Set default attributes
        attributes = Cuic.extend({}, attributes);

        // Set default options
        this.options = Cuic.extend({}, Cuic.Element.prototype.options, options);

        // Use existing node
        if (this.options.element) {
            this.element = Cuic.node(this.options.element);
        }
        // Create node
        else if (typeof node === 'string') {
                this.element = document.createElement(node);
            }
            // Use HTML node
            else if (node instanceof HTMLElement || node instanceof HTMLDocument || node instanceof Window) {
                    this.element = node;
                }
                // Use node from Cuic.Element
                else if (node instanceof Cuic.Element) {
                        this.element = node.node();
                    }
                    // Use the first node of a Cuic.Elements object
                    else if (node instanceof Cuic.Elements) {
                            this.element = node.get(0);
                        }
                        // Use the first node of a jQuery object
                        else if (node instanceof jQuery) {
                                this.element = node.get(0);
                            } else {
                                console.info(node);
                                throw new TypeError('Cannot create element using given node.');
                            }

        // Set element attributes
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                var value = attributes[attr];

                if (value !== null && value !== undefined) {
                    // Do not override classes
                    if (attr === 'className') {
                        this.addClass(value);
                        continue;
                    }

                    // Apply CSS styles
                    if (attr === 'css') {
                        this.css(value);
                        continue;
                    }

                    // Set attribute
                    if (this.element[attr] !== undefined) {
                        this.element[attr] = value;
                    } else if (attr === 'html') {
                        this.html(value);
                    } else if (attr === 'text') {
                        this.text(value);
                    }
                }
            }
        }

        // Define Z-Index
        if (typeof this.options.zIndex === 'number') {
            this.css({ 'z-index': parseInt(this.options.zIndex) });
        }

        // Set element styles
        if (this.options.css) {
            this.css(this.options.css);
        }

        // Add debug class
        if (this.options.debug) {
            this.addClass('debug');
        }

        // Add main class
        if (this.options.mainClass) {
            this.addClass(this.options.mainClass);
        }

        // Add default events
        this.events = new Cuic.Events(this);

        // Append element to parent node
        if (this.options.parent) {
            this.appendTo(this.options.parent);
            Cuic.element(this.options.parent).append(this);
        }

        // Position the element
        if (this.options.position && this.hasParent()) {
            this.align(this.options.position);
        }
    }

    /**
     * Displays element for calculation (positioning, parenting...)
     * @return {Cuic.Element}
     * @private
     */


    _createClass(_class5, [{
        key: '_display',
        value: function _display() {
            if (!this.hasClass('computing')) {
                this._previousDisplay = this.css('display');

                if (this._previousDisplay === 'none') {
                    this.addClass('computing');
                    this.css({ display: '' });

                    if (this.hasClass('hidden')) {
                        this.removeClass('hidden');
                        this._previousClass = 'hidden';
                    }
                }
            }
            return this;
        }

        /**
         * Restores element previous display state
         * @return {Cuic.Element}
         * @private
         * @private
         */

    }, {
        key: '_restoreDisplay',
        value: function _restoreDisplay() {
            if (this.hasClass('computing')) {
                if (this._previousClass) {
                    this.addClass(this._previousClass);
                }
                this.removeClass('computing');
                this.css({ display: this._previousDisplay });
                this._previousDisplay = null;
                this._previousClass = null;
            }
            return this;
        }

        /**
         * Adds the class
         * @param className
         * @return {Cuic.Element}
         */

    }, {
        key: 'addClass',
        value: function addClass(className) {
            this.debug('addClass', className);
            var classes = this.getClasses();
            var target = (className || '').split(' ');

            for (var i = 0; i < target.length; i += 1) {
                // Check if class is already assigned
                if (classes.indexOf(target[i]) === -1) {
                    classes.push(target[i]);
                }
            }
            this.node().className = classes.join(' ');
            return this;
        }

        /**
         * Adds position class
         * @param position
         * @param prefix
         * @return {Cuic.Element}
         */

    }, {
        key: 'addPositionClass',
        value: function addPositionClass(position, prefix) {
            this.debug('addPositionClass', position, prefix);
            var pfx = function pfx(str) {
                return prefix ? prefix + '-' + str : str;
            };

            // Remove previous classes
            this.removeClass([pfx('bottom'), pfx('center'), pfx('left'), pfx('right'), pfx('top')].join(' '));

            // Vertical position
            if (position.indexOf('bottom') !== -1) {
                this.addClass(pfx('bottom'));
            } else if (position.indexOf('top') !== -1) {
                this.addClass(pfx('top'));
            } else {
                this.addClass(pfx('center'));
            }

            // Horizontal position
            if (position.indexOf('left') !== -1) {
                this.addClass(pfx('left'));
            } else if (position.indexOf('right') !== -1) {
                this.addClass(pfx('right'));
            } else {
                this.addClass(pfx('center'));
            }
            return this;
        }

        /**
         * Sets the position of the element inside its parent
         * @param position
         * @return {Cuic.Element}
         */

    }, {
        key: 'align',
        value: function align(position) {
            var pos = this.css('position');

            if (pos === 'absolute' || pos === 'fixed') {
                this.debug('align', position);
                this.css(Cuic.calculateAlign(this, position));
                this.addPositionClass(position, 'aligned');
                this.options.position = position;
                this.events.trigger('aligned', position);
            }
            return this;
        }

        /**
         * Sets the position of the element toward another element
         * @param position
         * @param target
         * @return {Cuic.Element}
         */

    }, {
        key: 'anchor',
        value: function anchor(position, target) {
            this.debug('anchor', position, target);
            target = Cuic.element(target || this.options.target);
            this.css(Cuic.calculateAnchor(this, position, target));
            this.addPositionClass(position, 'anchored');
            this.options.anchor = position;
            this.options.target = target;
            this.events.trigger('anchored', position);
            return this;
        }

        /**
         * Appends the element
         * @param element
         * @return {Cuic.Element}
         */

    }, {
        key: 'append',
        value: function append(element) {
            this.debug('append', element);
            this.node().append(Cuic.node(element));
            return this;
        }

        /**
         * Appends to the element
         * @param element
         * @return {Cuic.Element}
         */

    }, {
        key: 'appendTo',
        value: function appendTo(element) {
            this.debug('appendTo', element);
            Cuic.node(element).append(this.node());
            return this;
        }

        /**
         * Sets or returns the element attribute
         * @param name
         * @param value
         * @return {Cuic.Element|*}
         */

    }, {
        key: 'attr',
        value: function attr(name, value) {
            var node = this.node();

            if (value !== undefined) {
                if (name in node) {
                    node[name] = value;
                }
                return this;
            } else {
                return node[name];
            }
        }

        /**
         * Auto align element in its parent
         * @return {Cuic.Element}
         */

    }, {
        key: 'autoAlign',
        value: function autoAlign() {
            this.debug('autoAlign');
            var available = Cuic.calculateAvailablePosition(this, this.parent());
            var alignments = ['bottom', 'left', 'right', 'top'];
            var prop = this.position();

            // Only keep properties that are styled
            for (var i = 0; i < alignments.length; i += 1) {
                if (!this.css(alignments[i])) {
                    prop[alignments[i]] = '';
                }
            }

            // Limit horizontal align
            if (typeof prop.left === 'number') {
                if (prop.left < available.minX) {
                    prop.left = available.minX;
                } else if (prop.left > available.maxX) {
                    prop.left = available.maxX;
                }
            }
            if (typeof prop.right === 'number') {
                if (prop.right < available.minX) {
                    prop.right = available.minX;
                } else if (prop.right > available.maxX) {
                    prop.right = available.maxX;
                }
            }

            // Limit vertical align
            if (typeof prop.top === 'number') {
                if (prop.top < available.minY) {
                    prop.top = available.minY;
                } else if (prop.top > available.maxY) {
                    prop.top = available.maxY;
                }
            }
            if (typeof prop.bottom === 'number') {
                if (prop.bottom < available.minY) {
                    prop.bottom = available.minY;
                } else if (prop.bottom > available.maxY) {
                    prop.bottom = available.maxY;
                }
            }

            // Apply alignment
            this.css(prop);

            return this;
        }

        /**
         * Auto fits element in its parent
         * @return {Cuic.Element}
         */

    }, {
        key: 'autoFit',
        value: function autoFit() {
            this.autoAlign();
            this.autoResize();
            return this;
        }

        /**
         * Auto resize element in its parent
         * @return {Cuic.Element}
         */

    }, {
        key: 'autoResize',
        value: function autoResize() {
            this.debug('autoResize');
            var available = Cuic.calculateAvailableSpace(this, this.parent());

            var prop = {
                height: this.outerHeight(),
                width: this.outerWidth()
            };

            // Limit to max width
            if (prop.width && prop.width > available.width) {
                prop.width = available.width;
            }
            // Limit to max height
            if (prop.height && prop.height > available.height) {
                prop.height = available.height;
            }
            // Apply size
            this.css(prop);

            return this;
        }

        /**
         * Returns element border widths
         * @return {*|{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */

    }, {
        key: 'border',
        value: function border() {
            var bottom = parseFloat(Cuic.getComputedStyle(this, 'border-bottom-width'));
            var left = parseFloat(Cuic.getComputedStyle(this, 'border-left-width'));
            var right = parseFloat(Cuic.getComputedStyle(this, 'border-right-width'));
            var top = parseFloat(Cuic.getComputedStyle(this, 'border-top-width'));
            return {
                bottom: bottom,
                horizontal: left + right,
                left: left,
                right: right,
                top: top,
                vertical: bottom + top
            };
        }

        /**
         * Returns element child nodes
         * @param selector
         * @return {Cuic.Elements}
         */

    }, {
        key: 'children',
        value: function children(selector) {
            var children = [];
            var nodes = this.node().children || this.node().childNodes;

            for (var i = 0; i < nodes.length; i += 1) {
                if (nodes[i] instanceof HTMLElement) {
                    if (!selector || nodes[i].matches(selector)) {
                        children.push(nodes[i]);
                    }
                }
            }
            return new Cuic.Elements(children, this.node(), selector);
        }

        /**
         * Returns a clone of the element
         * @return {*|Cuic.Element}
         */

    }, {
        key: 'clone',
        value: function clone() {
            this.debug('clone');
            return Cuic.element(this.node().cloneNode(true));
        }

        /**
         * Returns the closest parent element matching the selector
         * @param selector
         * @return {Cuic.Element|null}
         */

    }, {
        key: 'closest',
        value: function closest(selector) {
            this._display();
            var node = this.node().closest(selector);
            this._restoreDisplay();
            return node ? Cuic.element(node) : null;
        }

        /**
         * Set styles
         * @param styles
         * @return {Cuic.Element|*}
         */

    }, {
        key: 'css',
        value: function css(styles) {
            var node = this.node();

            // Writing styles
            if (styles) {
                if ((typeof styles === 'undefined' ? 'undefined' : _typeof(styles)) === 'object') {
                    this.debug('css', styles);

                    // Add pixel unit where needed
                    Cuic.autoPixel(styles);

                    // Add new styles
                    for (var style in styles) {
                        if (styles.hasOwnProperty(style)) {
                            var value = styles[style];

                            // Check if style is supported
                            if (!(style in node.style)) {
                                console.warn('Style "' + style + '" is not supported by element.', node);
                            }
                            node.style[style] = value;
                        }
                    }
                    return this;
                } else if (typeof styles === 'string') {
                    // Set styles
                    if (styles.indexOf(':') !== -1) {
                        this.debug('css', styles);
                        node.style = styles;
                        return this;
                    } else {
                        // Return computed version for some properties
                        // that would return nothing.
                        switch (styles) {
                            case 'display':
                            case 'position':
                                return Cuic.getComputedStyle(node, styles);
                        }
                        // Return specific style
                        return node.style[styles];
                    }
                }
            }
            // Return all styles
            return node.style;
        }

        /**
         * Sets or returns the element data
         * @param key
         * @param value
         * @return {Cuic.Element|*}
         */

    }, {
        key: 'data',
        value: function data(key, value) {
            this.debug('data', key, value);
            var dataSet = this.node().dataset;

            if (value !== undefined) {
                dataSet[Cuic.toCamelCase(key)] = value;
                return this;
            } else if (key) {
                return dataSet[key];
            } else {
                return dataSet;
            }
        }

        /**
         * Displays debug message if debug mode is active
         */

    }, {
        key: 'debug',
        value: function debug() {
            if (Cuic.options.debug || this.options.debug) {
                var args = Array.prototype.slice.call(arguments);
                (console.debug || console.log).apply(this, args);
            }
        }

        /**
         * Disables the element
         * @return {Cuic.Element}
         */

    }, {
        key: 'disable',
        value: function disable() {
            this.debug('disable');
            this.node().disabled = true;
            this.addClass('disabled');
            this.events.trigger('disabled');
            return this;
        }

        /**
         * Removes element content
         * @return {Cuic.Element}
         */

    }, {
        key: 'empty',
        value: function empty() {
            this.debug('empty');
            this.text('');
            return this;
        }

        /**
         * Enables the element
         * @return {Cuic.Element}
         */

    }, {
        key: 'enable',
        value: function enable() {
            this.debug('enable');
            this.node().disabled = false;
            this.removeClass('disabled');
            this.events.trigger('enabled');
            return this;
        }

        /**
         * Enters full screen
         * @return {Cuic.Element}
         */

    }, {
        key: 'enterFullScreen',
        value: function enterFullScreen() {
            var node = this.node();

            if (node.requestFullscreen) {
                node.requestFullscreen();
            } else if (node.webkitRequestFullscreen) {
                node.webkitRequestFullscreen();
            } else if (node.mozRequestFullScreen) {
                node.mozRequestFullScreen();
            } else if (node.msRequestFullscreen) {
                node.msRequestFullscreen();
            }
            return this;
        }

        /**
         * Returns the first element that matches the selector
         * @param selector
         * @return {Cuic.Elements}
         */

    }, {
        key: 'find',
        value: function find(selector) {
            var context = this.node();
            var elements = context.querySelectorAll(selector);
            return new Cuic.Elements(elements, context, selector);
        }

        /**
         * Returns element CSS classes
         * @return {Array}
         */

    }, {
        key: 'getClasses',
        value: function getClasses() {
            return this.node().className.split(' ');
        }

        /**
         * Checks if the element has the class
         * @param className
         * @return {boolean}
         */

    }, {
        key: 'hasClass',
        value: function hasClass(className) {
            var classes = this.getClasses();
            var classNames = (className || '').split(' ');
            var result = classNames.length > 0;

            for (var i = 0; i < classNames.length; i += 1) {
                if (classes.indexOf(classNames[i]) === -1) {
                    result = false;
                    break;
                }
            }
            return result;
        }

        /**
         * Checks if the element has a parent
         * @return {boolean}
         */

    }, {
        key: 'hasParent',
        value: function hasParent() {
            return !!this.parentNode();
        }

        /**
         * Returns the element height without margins and borders
         * @return {number}
         */

    }, {
        key: 'height',
        value: function height() {
            var node = this.node();
            var height = void 0;

            if (node instanceof Window) {
                height = node.screen.height;
            } else {
                height = node.clientHeight - this.padding().vertical;
            }
            return height;
        }

        /**
         * Hides the element
         * @return {Cuic.Element}
         */

    }, {
        key: 'hide',
        value: function hide() {
            this.debug('hide');
            // this.css({display: 'none'});
            this.addClass('hidden');
            this.events.trigger('hidden');
            return this;
        }

        /**
         * Gets or sets HTML content
         * @param html
         * @return {Cuic.Element|string}
         */

    }, {
        key: 'html',
        value: function html(_html) {
            if (_html !== undefined) {
                // Get HTML from object
                if (_html && (typeof _html === 'undefined' ? 'undefined' : _typeof(_html)) === 'object') {
                    if (_html instanceof HTMLElement) {
                        this.empty();
                        this.append(_html);
                    }
                    // Replace content keeping attached events on nodes
                    else if (_html instanceof Cuic.Element) {
                            this.empty();
                            this.append(_html.node());
                        } else if (_html instanceof jQuery) {
                            this.empty();
                            this.append(_html.get(0));
                        }
                } else {
                    this.node().innerHTML = _html;
                }
                return this;
            } else {
                return this.node().innerHTML;
            }
        }

        /**
         * Returns the element height including padding
         * @return {number}
         */

    }, {
        key: 'innerHeight',
        value: function innerHeight() {
            var node = this.node();
            var height = void 0;

            if (node instanceof Window) {
                height = node.screen.height;
            } else {
                // todo subtract vertical scrollbar width
                height = node.clientHeight;
            }
            return height;
        }

        /**
         * Returns the element width including padding
         * @return {number}
         */

    }, {
        key: 'innerWidth',
        value: function innerWidth() {
            var node = this.node();
            var width = void 0;

            if (node instanceof Window) {
                width = node.screen.width;
            } else {
                // todo subtract horizontal scrollbar width
                width = node.clientWidth;
            }
            return width;
        }

        /**
         * Inserts an element after
         * @param element
         * @return {Cuic.Element}
         */

    }, {
        key: 'insertAfter',
        value: function insertAfter(element) {
            this.debug('insertAfter', element);
            element = Cuic.node(element);
            var parent = this.node().parentNode;
            parent.insertBefore(element, this.node().nextSibling);
            return this;
        }

        /**
         * Inserts an element before
         * @param element
         * @return {Cuic.Element}
         */

    }, {
        key: 'insertBefore',
        value: function insertBefore(element) {
            this.debug('insertBefore', element);
            element = Cuic.node(element);
            var parent = this.node().parentNode;
            parent.insertBefore(element, this.node());
            return this;
        }

        /**
         * Checks the element alignment
         * @param position
         * @return {boolean}
         */

    }, {
        key: 'isAligned',
        value: function isAligned(position) {
            var result = false;

            if (this.options.position) {
                var pos = (position || '').split(' ');
                result = true;

                for (var i = 0; i < pos.length; i += 1) {
                    if (this.options.position.indexOf(pos[i]) === -1) {
                        result = false;
                        break;
                    }
                }
            }
            return result;
        }

        /**
         * Checks the element anchor
         * @param position
         * @return {boolean}
         */

    }, {
        key: 'isAnchored',
        value: function isAnchored(position) {
            var result = false;

            if (this.options.anchor) {
                var pos = (position || '').split(' ');
                result = true;

                for (var i = 0; i < pos.length; i += 1) {
                    if (this.options.anchor.indexOf(pos[i]) === -1) {
                        result = false;
                        break;
                    }
                }
            }
            return result;
        }

        /**
         * Checks if the element is parent of the current element
         * @param parent
         * @return {boolean}
         */

    }, {
        key: 'isChildOf',
        value: function isChildOf(parent) {
            parent = Cuic.node(parent);
            var node = this.node();

            do {
                node = node.parentNode;

                if (node === parent) {
                    return true;
                }
            } while (node);

            return false;
        }

        /**
         * Checks if the element is disabled
         * @return {boolean}
         */

    }, {
        key: 'isDisabled',
        value: function isDisabled() {
            return this.node().disabled || this.hasClass('disabled');
        }

        /**
         * Checks if the element is enabled
         * @return {boolean}
         */

    }, {
        key: 'isEnabled',
        value: function isEnabled() {
            return this.node().disabled !== true || !this.hasClass('disabled');
        }

        /**
         * Checks if the element is hidden
         * @return {boolean}
         */

    }, {
        key: 'isHidden',
        value: function isHidden() {
            return this.hasClass('hidden') || this.css('display') === 'none';
        }

        /**
         * Checks if the element is at the position
         * @param position
         * @return {boolean}
         */

    }, {
        key: 'isPosition',
        value: function isPosition(position) {
            var pos = this.position();

            if (position.indexOf('center') !== -1) {
                return pos.top == pos.bottom || pos.left == pos.right;
            }
            if (position.indexOf('bottom') !== -1) {
                return pos.bottom < pos.top;
            }
            if (position.indexOf('top') !== -1) {
                return pos.top < pos.bottom;
            }
            if (position.indexOf('left') !== -1) {
                return pos.left < pos.right;
            }
            if (position.indexOf('right') !== -1) {
                return pos.right < pos.left;
            }
            return false;
        }

        /**
         * Checks if the element is removed from the DOM
         * @return {boolean}
         */

    }, {
        key: 'isRemoved',
        value: function isRemoved() {
            var parent = this.node().parentNode;
            return parent === null || parent === undefined;
        }

        /**
         * Checks if the element is shown
         * @return {boolean}
         */

    }, {
        key: 'isShown',
        value: function isShown() {
            return !this.hasClass('hidden') && this.css('display') !== 'none';
        }

        /**
         * Returns the element margins
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */

    }, {
        key: 'margin',
        value: function margin() {
            var bottom = 0;
            var left = 0;
            var right = 0;
            var top = 0;

            if (!(this.node() instanceof Window)) {
                bottom = parseFloat(Cuic.getComputedStyle(this, 'margin-bottom'));
                left = parseFloat(Cuic.getComputedStyle(this, 'margin-left'));
                right = parseFloat(Cuic.getComputedStyle(this, 'margin-right'));
                top = parseFloat(Cuic.getComputedStyle(this, 'margin-top'));
            }
            return {
                bottom: bottom,
                horizontal: left + right,
                left: left,
                right: right,
                top: top,
                vertical: bottom + top
            };
        }

        /**
         * Returns the HTML element
         * @return {HTMLDocument|HTMLElement}
         */

    }, {
        key: 'node',
        value: function node() {
            return this.element;
        }

        /**
         * Remove the callback attached to the event
         * @param event
         * @param callback
         * @return {Cuic.Element}
         */

    }, {
        key: 'off',
        value: function off(event, callback) {
            Cuic.off(event, this.node(), callback);
            return this;
        }

        /**
         * Returns the element offset
         * @return {{left: *, top: *}}
         */

    }, {
        key: 'offset',
        value: function offset() {
            var node = this.node();
            this._display();
            var offset = { left: node.offsetLeft, top: node.offsetTop };
            this._restoreDisplay();
            return offset;
        }

        /**
         * Returns the first positioned parent element
         * @return {Cuic.Element|null}
         */

    }, {
        key: 'offsetParent',
        value: function offsetParent() {
            var parent = this.offsetParentNode();
            return parent ? Cuic.element(parent) : null;
        }

        /**
         * Returns the first positioned parent node
         * @return {HTMLDocument|HTMLElement|null}
         */

    }, {
        key: 'offsetParentNode',
        value: function offsetParentNode() {
            this._display();
            var parent = this.node().offsetParent;
            this._restoreDisplay();
            return parent;
        }

        /**
         * Executes the callback each time the event is triggered
         * @param event
         * @param callback
         * @return {Cuic.Element}
         */

    }, {
        key: 'on',
        value: function on(event, callback) {
            Cuic.on(event, this.node(), callback);
            return this;
        }

        /**
         * Executes the callback once when the event is triggered
         * @param event
         * @param callback
         * @return {Cuic.Element}
         */

    }, {
        key: 'once',
        value: function once(event, callback) {
            Cuic.once(event, this.node(), callback);
            return this;
        }

        /**
         * Called when element is aligned
         * @param callback
         * @return {Cuic.Element}
         */

    }, {
        key: 'onAligned',
        value: function onAligned(callback) {
            this.events.on('aligned', callback);
            return this;
        }

        /**
         * Called when element is positioned towards another element
         * @param callback
         * @return {Cuic.Element}
         */

    }, {
        key: 'onAnchored',
        value: function onAnchored(callback) {
            this.events.on('anchored', callback);
            return this;
        }

        /**
         * Called when element is removed from the DOM
         * @param callback
         * @return {Cuic.Element}
         */

    }, {
        key: 'onRemoved',
        value: function onRemoved(callback) {
            this.events.on('removed', callback);
            return this;
        }

        /**
         * Returns the element height including padding, borders and eventually margin
         * @param includeMargin
         * @return {number}
         */

    }, {
        key: 'outerHeight',
        value: function outerHeight() {
            var includeMargin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var node = this.node();
            var height = void 0;

            if (node instanceof Window) {
                height = node.screen.height;
            } else {
                height = node.offsetHeight + (includeMargin ? this.margin().vertical : 0);
            }
            return height;
        }

        /**
         * Returns the element width including padding, borders and eventually margin
         * @param includeMargin
         * @return {number}
         */

    }, {
        key: 'outerWidth',
        value: function outerWidth() {
            var includeMargin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var node = this.node();
            var width = void 0;

            if (node instanceof Window) {
                width = node.screen.width;
            } else {
                width = node.offsetWidth + (includeMargin ? this.margin().horizontal : 0);
            }
            return width;
        }

        /**
         * Returns element padding
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */

    }, {
        key: 'padding',
        value: function padding() {
            var bottom = 0;
            var left = 0;
            var right = 0;
            var top = 0;

            if (!(this.node() instanceof Window)) {
                bottom = parseFloat(Cuic.getComputedStyle(this, 'padding-bottom'));
                left = parseFloat(Cuic.getComputedStyle(this, 'padding-left'));
                right = parseFloat(Cuic.getComputedStyle(this, 'padding-right'));
                top = parseFloat(Cuic.getComputedStyle(this, 'padding-top'));
            }
            return {
                bottom: bottom,
                horizontal: left + right,
                left: left,
                right: right,
                top: top,
                vertical: bottom + top
            };
        }

        /**
         * Returns the parent element
         * @return {Cuic.Element|null}
         */

    }, {
        key: 'parent',
        value: function parent() {
            var parent = this.parentNode();
            return parent ? Cuic.element(parent) : null;
        }

        /**
         * Returns the parent of the element
         * @return {HTMLDocument|HTMLElement|null}
         */

    }, {
        key: 'parentNode',
        value: function parentNode() {
            return this.node().parentNode;
        }

        /**
         * Returns the element position
         * @return {{bottom: Number, left: Number, right: Number, top: Number}}
         */

    }, {
        key: 'position',
        value: function position() {
            this._display();
            var bottom = parseFloat(Cuic.getComputedStyle(this, 'bottom'));
            var left = parseFloat(Cuic.getComputedStyle(this, 'left'));
            var right = parseFloat(Cuic.getComputedStyle(this, 'right'));
            var top = parseFloat(Cuic.getComputedStyle(this, 'top'));
            this._restoreDisplay();
            return {
                bottom: bottom,
                left: left,
                right: right,
                top: top
            };
        }

        /**
         * Prepends the element
         * @param element
         * @return {Cuic.Element}
         */

    }, {
        key: 'prepend',
        value: function prepend(element) {
            this.debug('prepend', element);
            this.node().prepend(Cuic.node(element));
            return this;
        }

        /**
         * Prepends to the element
         * @param element
         * @return {Cuic.Element}
         */

    }, {
        key: 'prependTo',
        value: function prependTo(element) {
            this.debug('prependTo', element);
            Cuic.node(element).prepend(this.node());
            return this;
        }

        /**
         * Removes the element from the DOM
         * @return {Cuic.Element}
         */

    }, {
        key: 'remove',
        value: function remove() {
            this.debug('remove');
            this.node().remove();
            this.events.trigger('removed');
            return this;
        }

        /**
         * Removes classes from the element
         * @param className
         * @return {Cuic.Element}
         */

    }, {
        key: 'removeClass',
        value: function removeClass(className) {
            this.debug('removeClass', className);
            var classes = this.getClasses();
            var classNames = (className || '').split(' ');

            for (var i = 0; i < classNames.length; i += 1) {
                var index = classes.indexOf(classNames[i]);

                if (index !== -1) {
                    classes.splice(index, 1);
                }
            }
            this.node().className = classes.join(' ');
            return this;
        }

        /**
         * Shows the element
         * @return {Cuic.Element}
         */

    }, {
        key: 'show',
        value: function show() {
            this.debug('show');
            this.css({ display: '' });
            this.removeClass('hidden');
            this.events.trigger('shown');
            return this;
        }

        /**
         * Gets or sets element content as text
         * @param text
         * @return {Cuic.Element|string}
         */

    }, {
        key: 'text',
        value: function text(_text) {
            this.debug('text', _text);

            if (_text !== undefined) {
                this.node().innerText = _text;
                return this;
            } else {
                return this.node().innerText;
            }
        }

        /**
         * Returns or sets element value
         * @param value
         * @return {Cuic.Element|*}
         */

    }, {
        key: 'val',
        value: function val(value) {
            this.debug('val', value);

            if (value !== undefined) {
                this.node().value = value;
                return this;
            } else {
                return this.node().value;
            }
        }

        /**
         * Returns the element width
         * @return {number}
         */

    }, {
        key: 'width',
        value: function width() {
            var node = this.node();
            var width = void 0;

            if (node instanceof Window) {
                width = node.screen.width;
            } else {
                width = node.clientWidth - this.padding().horizontal;
            }
            return width;
        }
    }]);

    return _class5;
}();

Cuic.Element.prototype.options = {
    className: null,
    css: null,
    debug: false,
    namespace: null,
    parent: null
};

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

Cuic.Component = function (_Cuic$Element) {
    _inherits(_class6, _Cuic$Element);

    function _class6(node, attributes, options) {
        _classCallCheck(this, _class6);

        // Set default options
        options = Cuic.extend({}, Cuic.Component.prototype.options, options);

        // Add component classes
        var _this4 = _possibleConstructorReturn(this, (_class6.__proto__ || Object.getPrototypeOf(_class6)).call(this, node, attributes, options));

        _this4.addClass('component');

        // Add closable class
        if (_this4.options.closable) {
            _this4.addClass('closable');
        }

        // Set the panel visibility
        // Since the visible option is used to check if the panel is visible
        // we force the panel to show or hide by setting visible to the inverse value.
        if (_this4.options.opened !== undefined) {
            if (_this4.options.opened) {
                _this4.open();
            } else {
                _this4.hide(); // Hide to avoid animations
                _this4.close();
            }
        }

        if (_this4.hasParent()) {
            // Maximize the panel
            if (_this4.options.maximized) {
                _this4.maximize();
            }
            if (_this4.options.maximizedX) {
                _this4.maximizeX();
            }
            if (_this4.options.maximizedY) {
                _this4.maximizeY();
            }
        }
        return _this4;
    }

    /**
     * Closes the component
     * @param callback
     * @return {Cuic.Component}
     */


    _createClass(_class6, [{
        key: 'close',
        value: function close(callback) {
            var _this5 = this;

            this.debug('close');
            this.events.trigger('close');
            this.removeClass('opened');
            this.addClass('closed');
            this.once('transitionend', function (ev) {
                if (!_this5.isOpened()) {
                    _this5.debug('closed');
                    _this5.events.trigger('closed', ev);
                    _this5.hide();

                    if (typeof callback === 'function') {
                        callback.call(_this5, ev);
                    }
                }
            });
            return this;
        }

        /**
         * Checks if the component is maximized
         * @return {boolean}
         */

    }, {
        key: 'isMaximized',
        value: function isMaximized() {
            return this.hasClass('maximized') || this.hasClass('maximized-x maximized-y') || this.css('width') === '100%' && this.css('height') === '100%';
        }

        /**
         * Checks if the component width is maximized
         * @return {boolean}
         */

    }, {
        key: 'isMaximizedX',
        value: function isMaximizedX() {
            return this.hasClass('maximized-x') || this.css('width') === '100%';
        }

        /**
         * Checks if the component height is maximized
         * @return {boolean}
         */

    }, {
        key: 'isMaximizedY',
        value: function isMaximizedY() {
            return this.hasClass('maximized-y') || this.css('height') === '100%';
        }

        /**
         * Checks if the component is minimized
         * @return {boolean}
         */

    }, {
        key: 'isMinimized',
        value: function isMinimized() {
            return this.hasClass('minimized');
        }

        /**
         * Checks if the component is opened
         * @return {boolean}
         */

    }, {
        key: 'isOpened',
        value: function isOpened() {
            return this.hasClass('opened');
        }

        /**
         * Maximizes the component in its container
         * @param callback
         * @return {Cuic.Element}
         */

    }, {
        key: 'maximize',
        value: function maximize(callback) {
            var _this6 = this;

            this.debug('maximize');
            this.events.trigger('maximize');
            this.removeClass('minimized');
            this.addClass('maximized');
            this.css(Cuic.calculateMaximize(this));
            // this.autoAlign();
            this.once('transitionend', function (ev) {
                if (_this6.isMaximized()) {
                    _this6.debug('maximized');
                    _this6.events.trigger('maximized', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this6, ev);
                    }
                }
            });
            return this;
        }

        /**
         * Maximizes element width
         * @param callback
         * @return {Cuic.Element}
         */

    }, {
        key: 'maximizeX',
        value: function maximizeX(callback) {
            var _this7 = this;

            this.debug('maximizeX');
            this.events.trigger('maximizeX');
            this.removeClass('minimized');
            this.addClass('maximized-x');
            this.css({ width: Cuic.calculateMaximize(this).width });
            this.autoAlign();
            this.once('transitionend', function (ev) {
                if (_this7.isMaximizedX()) {
                    _this7.debug('maximizedX');
                    _this7.events.trigger('maximizedX', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this7, ev);
                    }
                }
            });
            return this;
        }

        /**
         * Maximizes element height
         * @param callback
         * @return {Cuic.Element}
         */

    }, {
        key: 'maximizeY',
        value: function maximizeY(callback) {
            var _this8 = this;

            this.debug('maximizeY');
            this.events.trigger('maximizeY');
            this.removeClass('minimized');
            this.addClass('maximized-y');
            this.css({ height: Cuic.calculateMaximize(this).height });
            this.autoAlign();
            this.once('transitionend', function (ev) {
                if (_this8.isMaximizedY()) {
                    _this8.debug('maximizedY');
                    _this8.events.trigger('maximizedY', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this8, ev);
                    }
                }
            });
            return this;
        }

        /**
         * Minimizes the component in its container
         * @param callback
         * @return {Cuic.Element}
         */

    }, {
        key: 'minimize',
        value: function minimize(callback) {
            var _this9 = this;

            this.debug('minimize');
            this.events.trigger('minimize');
            this.removeClass('maximized maximized-x maximized-y');
            this.addClass('minimized');
            this.css(Cuic.calculateMinimize(this, this.options.position));
            this.once('transitionend', function (ev) {
                if (_this9.isMinimized()) {
                    _this9.debug('minimized');
                    _this9.events.trigger('minimized', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this9, ev);
                    }
                }
            });
            return this;
        }

        /**
         * Called when the component is closing
         * @param callback
         */

    }, {
        key: 'onClose',
        value: function onClose(callback) {
            this.events.on('close', callback);
        }

        /**
         * Called when the component is closed
         * @param callback
         */

    }, {
        key: 'onClosed',
        value: function onClosed(callback) {
            this.events.on('closed', callback);
        }

        /**
         * Called when the component is maximizing
         * @param callback
         */

    }, {
        key: 'onMaximize',
        value: function onMaximize(callback) {
            this.events.on('maximize', callback);
        }

        /**
         * Called when the component is maximized
         * @param callback
         */

    }, {
        key: 'onMaximized',
        value: function onMaximized(callback) {
            this.events.on('maximized', callback);
        }

        /**
         * Called when the component is minimizing
         * @param callback
         */

    }, {
        key: 'onMinimize',
        value: function onMinimize(callback) {
            this.events.on('minimize', callback);
        }

        /**
         * Called when the component is minimized
         * @param callback
         */

    }, {
        key: 'onMinimized',
        value: function onMinimized(callback) {
            this.events.on('minimized', callback);
        }

        /**
         * Called when the component is opened
         * @param callback
         */

    }, {
        key: 'onOpen',
        value: function onOpen(callback) {
            this.events.on('open', callback);
        }

        /**
         * Called when the component is opened
         * @param callback
         */

    }, {
        key: 'onOpened',
        value: function onOpened(callback) {
            this.events.on('opened', callback);
        }

        /**
         * Opens the component
         * @param callback
         * @return {Cuic.Component}
         */

    }, {
        key: 'open',
        value: function open(callback) {
            var _this10 = this;

            this.debug('open');
            this.show();
            this.events.trigger('open');
            this.removeClass('closed');
            this.addClass('opened');
            this.once('transitionend', function (ev) {
                if (_this10.isOpened()) {
                    _this10.debug('opened');
                    _this10.events.trigger('opened', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this10, ev);
                    }
                }
            });
            return this;
        }

        /**
         * Toggles the component
         * @param callback
         * @return {Cuic.Component}
         */

    }, {
        key: 'toggle',
        value: function toggle(callback) {
            if (this.isOpened()) {
                this.close(callback);
            } else {
                this.open(callback);
            }
            return this;
        }
    }]);

    return _class6;
}(Cuic.Element);

Cuic.Component.prototype.options = {
    opened: true,
    maximized: false,
    maximizedX: false,
    maximizedY: false
};

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

Cuic.Group = function (_Cuic$Component) {
    _inherits(_class7, _Cuic$Component);

    function _class7(node, attributes, options) {
        _classCallCheck(this, _class7);

        // Set default options
        options = Cuic.extend({}, Cuic.Group.prototype.options, options);

        // Create element

        // Add component classes
        var _this11 = _possibleConstructorReturn(this, (_class7.__proto__ || Object.getPrototypeOf(_class7)).call(this, node, Cuic.extend({
            className: options.className,
            role: 'group'
        }, attributes), options));

        _this11.addClass('component-group');

        // Prepare components collection
        _this11.components = new Cuic.Collection();
        return _this11;
    }

    /**
     * Add the component to the group
     * @param component
     * @return {Cuic.Group}
     */


    _createClass(_class7, [{
        key: 'addComponent',
        value: function addComponent(component) {
            if (!(component instanceof Cuic.Element)) {
                throw new TypeError('Cannot add object to the group.');
            }
            this.events.trigger('addComponent', component);

            if (this.isAligned('top')) {
                component.prependTo(this);
            } else {
                component.appendTo(this);
            }
            this.components.add(component);
            return this;
        }

        /**
         * Called before adding a component
         * @param callback
         * @return {Cuic.Group}
         */

    }, {
        key: 'onAddComponent',
        value: function onAddComponent(callback) {
            this.events.on('addComponent', callback);
            return this;
        }

        /**
         * Called when a component is added
         * @param callback
         * @return {Cuic.Group}
         */

    }, {
        key: 'onComponentAdded',
        value: function onComponentAdded(callback) {
            this.components.onAdded(callback);
            return this;
        }

        /**
         * Called when a component is removed
         * @param callback
         * @return {Cuic.Group}
         */

    }, {
        key: 'onComponentRemoved',
        value: function onComponentRemoved(callback) {
            this.components.onRemoved(callback);
            return this;
        }

        /**
         * Called before removing a component
         * @param callback
         * @return {Cuic.Group}
         */

    }, {
        key: 'onRemoveComponent',
        value: function onRemoveComponent(callback) {
            this.events.on('removeComponent', callback);
            return this;
        }

        /**
         * Removes the component from the group
         * @param component
         * @return {Cuic.Group}
         */

    }, {
        key: 'removeComponent',
        value: function removeComponent(component) {
            this.events.trigger('removeComponent', component);
            this.components.remove(component);
            return this;
        }
    }]);

    return _class7;
}(Cuic.Component);

Cuic.Group.prototype.options = {
    namespace: 'group'
};

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

Cuic.Elements = function () {
    function _class8(elements, context, selector) {
        _classCallCheck(this, _class8);

        var i = void 0;

        for (i = 0; i < elements.length; i += 1) {
            if (elements.hasOwnProperty(i)) {
                this[i] = Cuic.element(elements[i]);
            }
        }

        // Public attributes
        this.length = i;
        this.context = context;
        this.selector = selector;
    }

    /**
     * Adds class to all elements
     * @param className
     * @return {Cuic.Elements}
     */


    _createClass(_class8, [{
        key: 'addClass',
        value: function addClass(className) {
            return this.each(function (el) {
                el.addClass(className);
            });
        }

        /**
         * Aligns all elements
         * @param position
         * @return {Cuic.Elements}
         */

    }, {
        key: 'align',
        value: function align(position) {
            return this.each(function (el) {
                el.align(position);
            });
        }

        /**
         * Anchors all elements
         * @param position
         * @param target
         * @return {Cuic.Elements}
         */

    }, {
        key: 'anchor',
        value: function anchor(position, target) {
            return this.each(function (el) {
                el.anchor(position, target);
            });
        }

        /**
         * Defines attribute for all elements
         * @return {Cuic.Elements}
         * @param name
         * @param value
         */

    }, {
        key: 'attr',
        value: function attr(name, value) {
            return this.each(function (el) {
                el.attr(name, value);
            });
        }

        /**
         * Removes all elements
         * @param styles
         * @return {Cuic.Elements}
         */

    }, {
        key: 'css',
        value: function css(styles) {
            return this.each(function (el) {
                el.css(styles);
            });
        }

        /**
         * Executes a callback on each elements
         * @param callback
         * @return {Cuic.Elements}
         */

    }, {
        key: 'each',
        value: function each(callback) {
            for (var _i = 0; _i < this.length; _i += 1) {
                callback.call(this[_i], this[_i], this);
            }
            return this;
        }

        /**
         * Removes elements content
         * @return {Cuic.Elements}
         */

    }, {
        key: 'empty',
        value: function empty() {
            return this.each(function (el) {
                el.empty();
            });
        }

        /**
         * Returns the element at the specified index
         * @param index
         * @return {Cuic.Element}
         */

    }, {
        key: 'eq',
        value: function eq(index) {
            return this[index];
        }

        /**
         * Returns elements from the list matching the selector
         * @param selector
         * @return {Cuic.Elements}
         */

    }, {
        key: 'filter',
        value: function filter(selector) {
            var elements = [];

            if (typeof selector === 'string') {
                this.each(function (el) {
                    if (el.node().matches(selector)) {
                        elements.push(el);
                    }
                });
            }
            return new Cuic.Elements(elements, this.context, selector);
        }

        /**
         * Returns elements matching the selector
         * @param selector
         * @return {Cuic.Elements}
         */

    }, {
        key: 'find',
        value: function find(selector) {
            var elements = [];

            if (typeof selector === 'string') {
                this.each(function (el) {
                    el.find(selector).each(function (el2) {
                        elements.push(el2);
                    });
                });
            }
            return new Cuic.Elements(elements, this.context, selector);
        }

        /**
         * Returns the first element in the list
         * @return {Cuic.Element|null}
         */

    }, {
        key: 'first',
        value: function first() {
            return this.length ? this[0] : null;
        }

        /**
         * Returns the HTML element at the specified index
         * @param index
         * @return {HTMLDocument|HTMLElement|null}
         */

    }, {
        key: 'get',
        value: function get(index) {
            return this[index].node();
        }

        /**
         * Hides all elements
         * @return {Cuic.Elements}
         */

    }, {
        key: 'hide',
        value: function hide() {
            return this.each(function (el) {
                el.hide();
            });
        }

        /**
         * Sets elements content
         * @param html
         * @return {Cuic.Elements}
         */

    }, {
        key: 'html',
        value: function html(_html2) {
            return this.each(function (el) {
                el.html(_html2);
            });
        }

        /**
         * Returns the index of the element
         * @param element
         * @return {number}
         */

    }, {
        key: 'index',
        value: function index(element) {
            for (var _i2 = 0; _i2 < this.length; _i2 += 1) {
                if (this.eq(_i2) === element || this.get(_i2) === element) {
                    return _i2;
                }
            }
            return -1;
        }

        /**
         * Returns the last element in the list
         * @return {Cuic.Element|null}
         */

    }, {
        key: 'last',
        value: function last() {
            return this.length ? this[this.length - 1] : null;
        }

        /**
         * Returns elements from the list not matching the selector
         * @param selector
         * @return {Cuic.Elements}
         */

    }, {
        key: 'not',
        value: function not(selector) {
            var elements = [];

            if (typeof selector === 'string') {
                this.each(function (el) {
                    if (!el.node().matches(selector)) {
                        elements.push(el);
                    }
                });
            }
            return new Cuic.Elements(elements, this.context);
        }

        /**
         * Removes all elements
         * @return {Cuic.Elements}
         */

    }, {
        key: 'remove',
        value: function remove() {
            return this.each(function (el) {
                el.remove();
            });
        }

        /**
         * Removes class from all elements
         * @param className
         * @return {Cuic.Elements}
         */

    }, {
        key: 'removeClass',
        value: function removeClass(className) {
            return this.each(function (el) {
                el.removeClass(className);
            });
        }

        /**
         * Shows all elements
         * @return {Cuic.Elements}
         */

    }, {
        key: 'show',
        value: function show() {
            return this.each(function (el) {
                el.show();
            });
        }

        /**
         * Toggles class from all elements
         * @param className
         * @return {Cuic.Elements}
         */

    }, {
        key: 'toggleClass',
        value: function toggleClass(className) {
            return this.each(function (el) {
                el.toggleClass(className);
            });
        }

        /**
         * Sets elements value
         * @param value
         * @return {Cuic.Elements}
         */

    }, {
        key: 'val',
        value: function val(value) {
            return this.each(function (el) {
                el.val(value);
            });
        }
    }]);

    return _class8;
}();

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

Cuic.Hook = function (_Cuic$Element2) {
    _inherits(_class9, _Cuic$Element2);

    function _class9(options) {
        _classCallCheck(this, _class9);

        // Set default options
        options = Cuic.extend({}, Cuic.Hook.prototype.options, options);

        // Create element

        // Add component classes
        var _this12 = _possibleConstructorReturn(this, (_class9.__proto__ || Object.getPrototypeOf(_class9)).call(this, 'div', { className: options.className }, options));

        _this12.addClass('hook');

        // This is a fix to avoid offsetTop > 0
        _this12.css({
            position: 'relative',
            top: '',
            width: ''
        });

        // Create the spacer item that will replace
        // the bar when it is scrolled
        _this12.space = new Cuic.Element('div', {
            className: 'hook-space'
        });

        // Get the element's offset
        var offset = _this12.offset();

        var onScroll = function onScroll() {
            var fitsInScreen = _this12.outerHeight(true) <= window.screen.availHeight;

            if (fitsInScreen) {
                if (_this12.options.fixed) {
                    _this12.hook();
                } else {
                    var margin = _this12.margin();

                    if (window.scrollY > offset.top - margin.top) {
                        _this12.hook();
                    } else {
                        _this12.unhook();
                    }
                }
            } else {
                _this12.unhook();
            }
        };

        // If the window is scrolled when reloading the page,
        // the bar must be shown
        onScroll();

        window.onscroll = function () {
            onScroll();
        };
        window.onresize = function () {
            onScroll();
        };
        return _this12;
    }

    /**
     * Hooks the element
     */


    _createClass(_class9, [{
        key: 'hook',
        value: function hook() {
            console.log('hook');

            if (this.css('position') !== 'fixed') {
                var offset = this.offset();
                var margin = this.margin();

                if (this.options.fixed) {
                    this.options.offsetTop = offset.top;
                }

                // Replace element with invisible space
                this.space.css({
                    display: this.css('display'),
                    float: this.css('float'),
                    height: this.outerHeight(),
                    width: this.outerWidth(),
                    'margin-bottom': margin.bottom,
                    'margin-left': margin.left,
                    'margin-right': margin.right,
                    'margin-top': margin.top
                });
                this.insertBefore(this.space);
                this.space.show();

                // Make element scroll
                this.css({
                    position: 'fixed',
                    left: offset.left,
                    top: this.options.offsetTop,
                    height: this.space.height(),
                    width: this.space.width(),
                    zIndex: this.options.zIndex
                });
                this.addClass('hooked');

                // Execute the hooked listener
                this.onHook(this);
            }
            // else if (this.space) {
            //     const offset = this.space.offset();
            //     this.css({
            //         left: offset.left,
            //         width: this.space.width()
            //     });
            // }
        }

        /**
         * Checks if the element is hooked
         * @return {*|boolean}
         */

    }, {
        key: 'isHooked',
        value: function isHooked() {
            return this.hasClass('hooked');
        }
    }, {
        key: 'onHook',
        value: function onHook() {}
    }, {
        key: 'onUnhook',
        value: function onUnhook() {}

        /**
         * Unhooks the element
         */

    }, {
        key: 'unhook',
        value: function unhook() {
            console.log('unhook');

            if (this.css('position') !== 'relative') {
                this.space.hide();
                this.css({
                    position: 'relative',
                    bottom: '',
                    left: '',
                    right: '',
                    top: '',
                    width: ''
                });
                this.removeClass('hooked');

                // Execute the unhooked listener
                this.onUnhook(this);
            }
        }
    }]);

    return _class9;
}(Cuic.Element);

Cuic.Hook.prototype.options = {
    fixed: true,
    hookedClass: 'hooked',
    // offsetBottom: 0,
    // offsetLeft: 0,
    // offsetRight: 0,
    // offsetTop: 0,
    zIndex: 4
};

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

Cuic.Movable = function (_Cuic$Element3) {
    _inherits(_class10, _Cuic$Element3);

    function _class10(options) {
        _classCallCheck(this, _class10);

        // Set default options
        options = Cuic.extend({}, Cuic.Movable.prototype.options, options);

        // Create element

        // Add component class
        var _this13 = _possibleConstructorReturn(this, (_class10.__proto__ || Object.getPrototypeOf(_class10)).call(this, 'div', { className: options.className }, options));

        _this13.addClass('movable');

        // Force the target to be the relative parent
        if (_this13.css('position') === 'static') {
            _this13.css({ position: 'relative' });
        }

        // Group handles
        _this13.handles = new Cuic.Collection();

        // Set the moving area
        _this13.addMoveHandle(options.handle || _this13.node());
        return _this13;
    }

    /**
     * Sets the moving area
     * @param handle
     * @return {Cuic.Component}
     */


    _createClass(_class10, [{
        key: 'addMoveHandle',
        value: function addMoveHandle(handle) {
            var _this14 = this;

            handle = Cuic.element(handle);

            this.handles.add(handle);

            // Add the handle class
            handle.addClass('movable-handle');

            // Start moving
            Cuic.on('mousedown', handle, function (ev) {
                // Ignore moving if the target is not the root
                if (_this14.options.rootOnly && ev.target !== ev.currentTarget) return;

                // Execute callback
                if (_this14.events.trigger('moveStart', ev) === false) return;

                // Prevent text selection
                ev.preventDefault();

                // Add moving class
                _this14.addClass('moving');

                var startPosition = _this14.position();
                var startX = ev.clientX;
                var startY = ev.clientY;

                var onMouseMove = function onMouseMove(ev) {
                    // Execute callback
                    if (_this14.events.trigger('move', ev) === false) return;

                    var prop = {};

                    // Move horizontally
                    if (_this14.options.horizontal) {
                        var diffX = ev.clientX - startX;
                        prop.left = startPosition.left + diffX;
                        prop.right = '';
                    }

                    // Move vertically
                    if (_this14.options.vertical) {
                        var diffY = ev.clientY - startY;
                        prop.top = startPosition.top + diffY;
                        prop.bottom = '';
                    }

                    // Move element
                    _this14.css(prop);
                    _this14.autoAlign();
                };

                // Moving
                Cuic.on('mousemove', document, onMouseMove);

                // Stop moving
                Cuic.once('mouseup', document, function (ev) {
                    Cuic.off('mousemove', document, onMouseMove);
                    _this14.removeClass('moving');
                    _this14.events.trigger('moveEnd', ev);
                });
            });
            return this;
        }

        /**
         * Called when moving
         * @param callback
         * @return {Cuic.Movable}
         */

    }, {
        key: 'onMove',
        value: function onMove(callback) {
            this.events.on('move', callback);
            return this;
        }

        /**
         * Called when move end
         * @param callback
         * @return {Cuic.Movable}
         */

    }, {
        key: 'onMoveEnd',
        value: function onMoveEnd(callback) {
            this.events.on('moveEnd', callback);
            return this;
        }

        /**
         * Called when move start
         * @param callback
         * @return {Cuic.Movable}
         */

    }, {
        key: 'onMoveStart',
        value: function onMoveStart(callback) {
            this.events.on('moveStart', callback);
            return this;
        }
    }]);

    return _class10;
}(Cuic.Element);

Cuic.Movable.prototype.options = {
    handle: null,
    handleClassName: 'movable-handle',
    horizontal: true,
    namespace: 'movable',
    rootOnly: true,
    vertical: true
};

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

Cuic.Resizable = function (_Cuic$Element4) {
    _inherits(_class11, _Cuic$Element4);

    function _class11(options) {
        _classCallCheck(this, _class11);

        // Set default options
        options = Cuic.extend({}, Cuic.Resizable.prototype.options, options);

        // Create element

        // Add component classes
        var _this15 = _possibleConstructorReturn(this, (_class11.__proto__ || Object.getPrototypeOf(_class11)).call(this, 'div', { className: options.className }, options));

        _this15.addClass('resizable');

        // Force the target to be the relative parent
        if (_this15.css('position') === 'static') {
            _this15.css('position', 'relative');
        }

        // Add Bottom handle
        _this15.bottomHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-s',
            css: { height: options.handleSize }
        }).appendTo(_this15);

        // Add Right handler
        _this15.rightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-e',
            css: { width: options.handleSize }
        }).appendTo(_this15);

        // Add Bottom-Right handler
        _this15.bottomRightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-se',
            css: {
                height: options.handleSize,
                width: options.handleSize
            }
        }).appendTo(_this15);

        // Group handles
        _this15.handles = new Cuic.Collection([_this15.rightHandle, _this15.bottomHandle, _this15.bottomRightHandle]);

        // Group horizontal handles
        _this15.horizontalHandles = new Cuic.Collection([_this15.rightHandle, _this15.bottomRightHandle]);

        // Group vertical handles
        _this15.verticalHandles = new Cuic.Collection([_this15.bottomHandle, _this15.bottomRightHandle]);

        _this15.handles.each(function (handle) {
            // Start resizing
            handle.on('mousedown', function (ev) {
                // Execute callback
                if (_this15.events.trigger('resizeStart', ev) === false) return;

                // Prevent text selection
                ev.preventDefault();

                // Add resizing class
                _this15.addClass('resizing');

                var startX = ev.clientX;
                var startY = ev.clientY;
                var initialHeight = _this15.outerHeight();
                var initialWidth = _this15.outerWidth();
                var handleTarget = ev.currentTarget;

                // Calculate initial ratio
                var ratio = initialHeight / initialWidth;

                var onMouseMove = function onMouseMove(ev) {
                    // Execute callback
                    if (_this15.events.trigger('resize', ev) === false) return;

                    var prop = {};

                    // Resize horizontally
                    if (_this15.options.horizontal) {
                        for (var _i3 = 0; _i3 < _this15.horizontalHandles.length; _i3 += 1) {
                            if (_this15.horizontalHandles.get(_i3).node() === handleTarget) {
                                var diffX = ev.clientX - startX;
                                var width = initialWidth + diffX;

                                // Width is between min and max
                                if ((!Number(_this15.options.maxWidth) || width <= _this15.options.maxWidth) && (!Number(_this15.options.minWidth) || width >= _this15.options.minWidth)) {
                                    prop.width = width;
                                }
                                break;
                            }
                        }
                    }

                    // Resize vertically
                    if (_this15.options.vertical) {
                        for (var _i4 = 0; _i4 < _this15.verticalHandles.length; _i4 += 1) {
                            if (_this15.verticalHandles.get(_i4).node() === handleTarget) {
                                var diffY = ev.clientY - startY;
                                var height = initialHeight + diffY;

                                // Height is between min and max
                                if ((!Number(_this15.options.maxHeight) || height <= _this15.options.maxHeight) && (!Number(_this15.options.minHeight) || height >= _this15.options.minHeight)) {
                                    prop.height = height;
                                }
                                break;
                            }
                        }
                    }

                    // fixme element can be resized more than parent size if keep ratio is active

                    // Keep ratio
                    if (_this15.options.keepRatio) {
                        if (prop.height) {
                            prop.width = prop.height / ratio;
                        } else if (prop.width) {
                            prop.height = prop.width * ratio;
                        }
                    }

                    // Apply new size
                    _this15.css(prop);
                    _this15.autoResize();
                };

                // Resizing
                Cuic.on('mousemove', document, onMouseMove);

                // Stop resizing
                Cuic.once('mouseup', document, function (ev) {
                    Cuic.off('mousemove', document, onMouseMove);
                    _this15.removeClass('resizing');
                    _this15.events.trigger('resizeEnd', ev);
                });
            });
        });
        return _this15;
    }

    /**
     * Called when resizing
     * @param callback
     * @return {Cuic.Resizable}
     */


    _createClass(_class11, [{
        key: 'onResize',
        value: function onResize(callback) {
            this.events.on('resize', callback);
            return this;
        }

        /**
         * Called when resize end
         * @param callback
         * @return {Cuic.Resizable}
         */

    }, {
        key: 'onResizeEnd',
        value: function onResizeEnd(callback) {
            this.events.on('resizeEnd', callback);
            return this;
        }

        /**
         * Called when resize start
         * @param callback
         * @return {Cuic.Resizable}
         */

    }, {
        key: 'onResizeStart',
        value: function onResizeStart(callback) {
            this.events.on('resizeStart', callback);
            return this;
        }
    }]);

    return _class11;
}(Cuic.Element);

Cuic.Resizable.prototype.options = {
    handleSize: 10,
    horizontal: true,
    keepRatio: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 1,
    minWidth: 1,
    namespace: 'resizable',
    vertical: true
};

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

Cuic.Selectable = function (_Cuic$Element5) {
    _inherits(_class12, _Cuic$Element5);

    function _class12(options) {
        _classCallCheck(this, _class12);

        // Set default options
        options = Cuic.extend({}, Cuic.Selectable.prototype.options, options);

        // Create element

        // Add component class
        var _this16 = _possibleConstructorReturn(this, (_class12.__proto__ || Object.getPrototypeOf(_class12)).call(this, 'div', { className: options.className }, options));

        _this16.addClass('selectable');

        // Add selected class
        if (_this16.options.selected) {
            _this16.addClass('selected');
        }

        // Add or remove selected class
        _this16.on('click', function () {
            if (_this16.hasClass('selected')) {
                _this16.deselect();
            } else {
                _this16.select();
            }
        });
        return _this16;
    }

    /**
     * Deselect element
     * @param callback
     * @return {Cuic.Selectable}
     */


    _createClass(_class12, [{
        key: 'deselect',
        value: function deselect(callback) {
            var _this17 = this;

            this.removeClass('selected');
            this.once('transitionend', function (ev) {
                if (!_this17.isSelected()) {
                    _this17.events.trigger('deselected', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this17, ev);
                    }
                }
            });
            return this;
        }

        /**
         * Checks if the element is selected
         * @return {boolean}
         */

    }, {
        key: 'isSelected',
        value: function isSelected() {
            return (this.hasClass('selected') || this.attr('selected')) === true;
        }

        /**
         * Called when element is deselected
         * @param callback
         * @return {Cuic.Selectable}
         */

    }, {
        key: 'onDeselected',
        value: function onDeselected(callback) {
            this.events.on('deselected', callback);
            return this;
        }

        /**
         * Called when element is selected
         * @param callback
         * @return {Cuic.Selectable}
         */

    }, {
        key: 'onSelected',
        value: function onSelected(callback) {
            this.events.on('selected', callback);
            return this;
        }

        /**
         * Select element
         * @param callback
         * @return {Cuic.Selectable}
         */

    }, {
        key: 'select',
        value: function select(callback) {
            var _this18 = this;

            this.addClass('selected');
            this.once('transitionend', function (ev) {
                if (_this18.isSelected()) {
                    _this18.events.trigger('selected', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this18, ev);
                    }
                }
            });
            return this;
        }
    }]);

    return _class12;
}(Cuic.Element);

Cuic.Selectable.prototype.options = {
    namespace: 'selectable'
};

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

Cuic.Button = function (_Cuic$Component2) {
    _inherits(_class13, _Cuic$Component2);

    function _class13(options) {
        _classCallCheck(this, _class13);

        // Set default options
        options = Cuic.extend({}, Cuic.Button.prototype.options, options, {
            mainClass: 'btn'
        });

        // Create element

        // Create shortcut
        var _this19 = _possibleConstructorReturn(this, (_class13.__proto__ || Object.getPrototypeOf(_class13)).call(this, 'button', {
            className: options.className,
            disabled: false,
            html: options.label,
            title: options.title,
            type: options.type
        }, options));

        if (typeof options.shortcut === 'number') {
            _this19.shortcut = new Cuic.Shortcut({
                keyCode: options.shortcut,
                target: _this19.element,
                callback: function callback() {
                    this.node().click();
                }
            });
        }
        return _this19;
    }

    return _class13;
}(Cuic.Component);

Cuic.Button.prototype.options = {
    className: 'btn-default',
    disabled: false,
    shortcut: null,
    title: null,
    type: 'button'
};

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

Cuic.Dialog = function (_Cuic$Component3) {
    _inherits(_class14, _Cuic$Component3);

    function _class14(options) {
        _classCallCheck(this, _class14);

        // Set default options
        options = Cuic.extend({}, Cuic.Dialog.prototype.options, options, {
            mainClass: 'dialog'
        });

        // Create element

        // Set dialog position
        var _this20 = _possibleConstructorReturn(this, (_class14.__proto__ || Object.getPrototypeOf(_class14)).call(this, 'div', {
            className: options.className,
            role: 'dialog'
        }, options));

        if (_this20.parentNode() === document.body) {
            _this20.css({ position: 'absolute' });
        }

        // Create the fader
        _this20.fader = new Cuic.Fader({
            className: 'fader dialog-fader',
            autoClose: false,
            autoRemove: false,
            opened: false
        }).appendTo(_this20.options.parent);

        // Add header
        _this20.header = new Cuic.Element('header', {
            className: 'dialog-header',
            css: { display: _this20.options.title != null ? 'block' : 'none' }
        }).appendTo(_this20);

        // Add title
        _this20.title = new Cuic.Element('h3', {
            className: 'dialog-title',
            html: _this20.options.title
        }).appendTo(_this20.header);

        // Add content
        _this20.content = new Cuic.Element('section', {
            className: 'dialog-content',
            html: _this20.options.content
        }).appendTo(_this20);

        // Add footer
        _this20.footer = new Cuic.Element('footer', {
            className: 'dialog-footer',
            css: { display: _this20.options.buttons != null ? 'block' : 'none' }
        }).appendTo(_this20);

        // Add buttons group
        _this20.buttons = new Cuic.Group('div', {
            className: 'btn-group'
        }).appendTo(_this20.footer);

        // Add close button
        _this20.closeButton = new Cuic.Element('span', {
            className: _this20.options.closeButtonClass,
            html: _this20.options.closeButton,
            role: 'button'
        }).addClass('btn-close').appendTo(_this20.header);

        // Show footer if not empty
        _this20.buttons.onComponentAdded(function () {
            if (_this20.buttons.components.length > 0) {
                _this20.footer.show();
            }
        });

        // Hide footer if empty
        _this20.buttons.onComponentRemoved(function () {
            if (_this20.buttons.components.length < 1) {
                _this20.footer.hide();
            }
        });

        // Add buttons
        if (_this20.options.buttons instanceof Array) {
            for (var _i5 = 0; _i5 < _this20.options.buttons.length; _i5 += 1) {
                _this20.addButton(_this20.options.buttons[_i5]);
            }
        }

        // Set content height
        if (parseFloat(options.contentHeight) > 0) {
            _this20.content.css({ height: options.contentHeight });
        }

        // Set content width
        if (parseFloat(options.contentWidth) > 0) {
            _this20.content.css({ width: options.contentWidth });
        }

        /**
         * Movable interface
         * @type {Cuic.Movable}
         */
        if (_this20.options.movable) {
            _this20.movable = new Cuic.Movable({
                enabled: _this20.options.movable,
                element: _this20.node(),
                handle: _this20.title,
                rootOnly: false
            });
        }

        /**
         * Resizable interface
         * @type {Cuic.Resizable}
         */
        if (_this20.options.resizable) {
            _this20.resizable = new Cuic.Resizable({
                enabled: _this20.options.resizable,
                element: _this20.node()
            });
        }

        /**
         * Dialog shortcuts
         * @type {{close: *}}
         */
        _this20.shortcuts = {
            close: new Cuic.Shortcut({
                element: _this20,
                keyCode: Cuic.keys.ESC,
                callback: function callback() {
                    _this20.close();
                }
            })
        };

        // Close dialog when fader is clicked
        _this20.fader.on('click', function () {
            if (_this20.options.autoClose) {
                _this20.close();
            }
        });

        _this20.on('click', function (ev) {
            // Close button
            if (Cuic.element(ev.target).hasClass('btn-close')) {
                ev.preventDefault();
                _this20.close();
            }
        });

        // Called when dialog is closing
        _this20.onClose(function () {
            _this20.fader.options.autoRemove = _this20.options.autoRemove;
            _this20.fader.close();
        });

        // Called when dialog is closed
        _this20.onClosed(function () {
            if (_this20.options.autoRemove) {
                _this20.remove();
                _this20.fader.remove();
            }
        });

        // Called when dialog is opening
        _this20.onOpen(function () {
            // Calculate z-index
            var zIndex = Math.max(_this20.options.zIndex, Cuic.dialogs.getCurrentZIndex() + 1);

            // Find current top dialog z-index
            _this20.css({ 'z-index': zIndex });
            _this20.resizeContent();

            // Open fader
            if (_this20.options.modal) {
                _this20.css({ 'z-index': zIndex + 1 });
                _this20.fader.css({ 'z-index': zIndex });
                _this20.fader.open();
            }

            // Maximize or position the dialog
            if (_this20.options.maximized) {
                _this20.maximize();
            } else {
                _this20.align(_this20.options.position);
            }

            // Focus the last button
            var buttons = _this20.buttons.children();

            if (buttons.length > 0) {
                buttons.last().node().focus();
            }
        });

        // Called when dialog is opened
        _this20.onOpened(function (ev) {
            // // todo wait images to be loaded to resize content
            var images = _this20.find('img');
            //
            // if (images.length > 0) {
            //     // Position the dialog when images are loaded
            //     images.off(ns('load')).on(ns('load'), () => {
            //         this.resizeContent();
            //     });
            // } else {
            //     // Position the dialog in the wrapper
            //     this.resizeContent();
            // }
        });

        // Remove dialog from list
        _this20.onRemoved(function () {
            Cuic.dialogs.remove(_this20);
        });

        Cuic.on('resize', window, function () {
            _this20.resizeContent();
        });

        // Add element to collection
        Cuic.dialogs.add(_this20);
        return _this20;
    }

    /**
     * Adds a button to the dialog
     * @param button
     * @return {Cuic.Button}
     */


    _createClass(_class14, [{
        key: 'addButton',
        value: function addButton(button) {
            var _this21 = this;

            if (!(button instanceof Cuic.Button)) {
                (function () {
                    var callback = button.callback;

                    // Create button
                    button = new Cuic.Button({
                        className: 'btn btn-default',
                        label: button.label
                    });

                    // Set button callback
                    if (typeof callback === 'function') {
                        button.on('click', function (ev) {
                            callback.call(_this21, ev);
                        });
                    } else if (callback === 'close') {
                        button.on('click', function () {
                            _this21.close();
                        });
                    }
                })();
            }

            // Add button in footer
            this.buttons.addComponent(button);
            return button;
        }

        /**
         * Returns the content
         * @deprecated
         * @return {Cuic.Element}
         */

    }, {
        key: 'getBody',
        value: function getBody() {
            return this.content;
        }

        /**
         * Returns the content
         * @return {Cuic.Element}
         */

    }, {
        key: 'getContent',
        value: function getContent() {
            return this.content;
        }

        /**
         * Returns the footer
         * @return {Cuic.Element}
         */

    }, {
        key: 'getFooter',
        value: function getFooter() {
            return this.footer;
        }

        /**
         * Returns the header
         * @return {Cuic.Element}
         */

    }, {
        key: 'getHeader',
        value: function getHeader() {
            return this.header;
        }

        /**
         * Resizes the content
         * @return {Cuic.Dialog}
         */

    }, {
        key: 'resizeContent',
        value: function resizeContent() {
            // Calculate available space
            var availableSpace = Cuic.calculateAvailableSpace(this);

            // Set panel max height
            this.css({ 'max-height': availableSpace.height });

            // Calculate content max height
            var maxHeight = availableSpace.height;

            // Subtract header height
            if (this.header instanceof Cuic.Element) {
                maxHeight -= this.header.outerHeight(true);
            }
            // Subtract footer height
            if (this.footer instanceof Cuic.Element) {
                maxHeight -= this.footer.outerHeight(true);
            }
            // Subtract content margin
            maxHeight -= this.content.margin().vertical;

            // Set content max height
            this.content.css({ 'max-height': maxHeight });
            return this;
        }

        /**
         * Sets dialog content
         * @param html
         * @return {Cuic.Dialog}
         */

    }, {
        key: 'setContent',
        value: function setContent(html) {
            this.content.html(html);
            return this;
        }

        /**
         * Sets dialog footer
         * @param html
         * @return {Cuic.Dialog}
         */

    }, {
        key: 'setFooter',
        value: function setFooter(html) {
            this.footer.html(html);
            return this;
        }

        /**
         * Sets dialog title
         * @param html
         * @return {Cuic.Dialog}
         */

    }, {
        key: 'setTitle',
        value: function setTitle(html) {
            this.title.html(html);
            return this;
        }
    }]);

    return _class14;
}(Cuic.Component);

Cuic.Dialog.prototype.options = {
    autoClose: false,
    autoRemove: true,
    autoResize: true,
    buttons: [],
    closable: true,
    closeButton: null,
    closeButtonClass: 'glyphicon glyphicon-remove-sign',
    content: null,
    contentHeight: null,
    contentWidth: null,
    movable: true,
    maximized: false,
    modal: true,
    namespace: 'dialog',
    opened: false,
    parent: document.body,
    position: 'center',
    resizable: false,
    title: null,
    zIndex: 10
};

Cuic.dialogs = new Cuic.Collection();

/**
 * Returns the z-index of the highest dialog
 * @return {number}
 */
Cuic.dialogs.getCurrentZIndex = function () {
    var zIndex = 0;

    Cuic.dialogs.each(function (dialog) {
        var index = parseInt(dialog.css('z-index'));

        if (index > zIndex) {
            zIndex = index;
        }
    });
    return zIndex;
};

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

Cuic.Fader = function (_Cuic$Component4) {
    _inherits(_class15, _Cuic$Component4);

    function _class15(options) {
        _classCallCheck(this, _class15);

        // Set default options
        options = Cuic.extend({}, Cuic.Fader.prototype.options, options, {
            mainClass: 'fader'
        });

        // Create element

        // Auto close when fader is clicked
        var _this22 = _possibleConstructorReturn(this, (_class15.__proto__ || Object.getPrototypeOf(_class15)).call(this, 'div', { className: options.className }, options));

        _this22.on('click', function () {
            if (_this22.options.autoClose) {
                _this22.close();
            }
        });

        // Called when fader is closed
        _this22.onClosed(function () {
            if (_this22.options.autoRemove) {
                _this22.remove();
            }
        });
        return _this22;
    }

    return _class15;
}(Cuic.Component);

Cuic.Fader.prototype.options = {
    autoClose: false,
    autoRemove: false,
    namespace: 'fader',
    opened: false,
    zIndex: 1
};

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

    var counter = 0;

    /**
     * Creates a Grid
     * @param options
     * @constructor
     */
    Cuic.Grid = function (options) {
        var grid = this;

        // Default options
        options = Cuic.extend(true, Cuic.Grid.prototype.options, options);

        // Set the options
        grid.animSpeed = parseInt(options.animSpeed);
        grid.autoResize = options.autoResize === true;
        grid.colsWidth = parseFloat(options.colsWidth);
        grid.editable = options.editable === true;
        grid.fps = parseInt(options.fps);
        grid.maxCols = parseInt(options.maxCols);
        grid.maxRows = parseInt(options.maxRows);
        grid.minCols = parseInt(options.minCols);
        grid.minRows = parseInt(options.minRows);
        grid.rowsHeight = parseFloat(options.rowsHeight);
        grid.spacing = parseFloat(options.spacing);
        grid.widgets = {};

        // Get the grid
        grid.element = $(options.target);

        // Set the grid style
        grid.element.css({
            display: 'block',
            minHeight: options.height,
            minWidth: options.width
        });

        // Set the grid size
        grid.resize(options.cols, options.rows);

        // Set the grid resizable
        new Cuic.Resizable({ target: grid.element }).onResizeEnd(function () {
            var cols = grid.getSizeX(grid.element.outerWidth());
            var rows = grid.getSizeY(grid.element.outerHeight());
            grid.maxCols = cols;
            grid.maxRows = rows;
            grid.maximize();
        });

        // Create the widget preview
        grid.preview = $('<div>', {
            'class': 'preview',
            css: {
                'box-sizing': 'border-box',
                height: grid.rowsHeight,
                left: grid.spacing,
                position: 'absolute',
                top: grid.spacing,
                width: grid.colsWidth,
                zIndex: 1
            }
        });

        // Add widgets to the grid
        grid.element.children(options.widgetSelector).each(function () {
            var id = this.id || 'widget-' + (counter += 1);
            grid.addWidget(id, new Cuic.Grid.Widget({
                target: this
            }));
        });

        if (grid.autoResize) {
            grid.minimize();
        }
    };

    /**
     * Adds a widget to the grid
     * @param id
     * @param widget
     * @return {Cuic.Widget}
     */
    Cuic.Grid.prototype.addWidget = function (id, widget) {
        var grid = this;
        var element = widget.element;
        var preview = grid.preview;

        // Remove any widget having the same id
        grid.removeWidget(id);

        // Keep a reference to the widget
        grid.widgets[id] = widget;

        // Add the widget to the grid
        grid.element.append(widget.element);

        // Set the widget id
        widget.element.attr('id', id);

        // Override widget style
        widget.element.css({
            'box-sizing': 'border-box',
            display: 'block',
            margin: 0,
            overflow: 'hidden',
            position: 'absolute'
        });

        // Position the widget
        grid.moveWidget(widget, widget.col, widget.row);

        // Resize the widget
        grid.resizeWidget(widget, widget.sizeX, widget.sizeY);

        // Extend the grid if needed
        if (widget.col - 1 + widget.sizeX > grid.cols) {
            grid.resize(widget.col - 1 + widget.sizeX, widget.sizeY);
        }
        if (widget.row - 1 + widget.sizeY > grid.rows) {
            grid.resize(widget.sizeX, widget.row - 1 + widget.sizeY);
        }

        var height;
        var width;

        // Make the widget resizable
        var resizable = new Cuic.Resizable({
            target: widget.element,
            container: grid.element
        });

        // Set behavior when resizing widget
        resizable.onResize = function () {
            var tmpHeight = element.outerHeight();
            var tmpWidth = element.outerWidth();
            var sizeX = Math.round(tmpWidth / (grid.colsWidth + grid.spacing));
            var sizeY = Math.round(tmpHeight / (grid.rowsHeight + grid.spacing));

            // Make sure the widget does not overlap the grid
            if (sizeX + widget.col - 1 > grid.maxCols) {
                sizeX = grid.maxCols - (widget.col - 1);
            } else if (sizeX < widget.minSizeX) {
                sizeX = widget.minSizeX;
            }
            // Make sure the widget does not overlap the grid
            if (sizeY + widget.row - 1 > grid.maxRows) {
                sizeY = grid.maxRows - (widget.row - 1);
            } else if (sizeY < widget.minSizeY) {
                sizeY = widget.minSizeY;
            }

            // Resize the preview
            preview.css({
                height: grid.calculateHeight(sizeY),
                width: grid.calculateWidth(sizeX)
            });
        };

        // Set behavior when resizing starts
        resizable.onResizeStart = function () {
            if (grid.editable && widget.resizable && !widget.isDragging()) {
                height = element.outerHeight();
                width = element.outerWidth();

                // Move widget to foreground
                element.css({ zIndex: 2 });

                // Display the widget preview
                grid.element.append(preview.css({
                    left: element.css('left'),
                    height: height,
                    top: element.css('top'),
                    width: width
                }));

                // Maximize the grid
                if (grid.autoResize) {
                    grid.maximize();
                }
                return true;
            }
            return false;
        };

        // Set behavior when resizing stops
        resizable.onResizeEnd(function () {
            // Remove the preview
            preview.detach();

            // Resize the widget
            var sizeX = grid.getSizeX(preview.outerWidth());
            var sizeY = grid.getSizeY(preview.outerHeight());
            grid.resizeWidget(widget, sizeX, sizeY);

            // Fit the grid to its content
            if (grid.autoResize) {
                grid.minimize();
            }
        });

        // Make the widget movable
        var movable = new Cuic.Movable({
            target: widget.element,
            rootOnly: true,
            container: grid.element
        });

        // Set behavior when dragging widget
        movable.onMove = function () {
            var left = parseFloat(element.css('left'));
            var top = parseFloat(element.css('top'));
            var col = grid.getPositionX(left);
            var row = grid.getPositionY(top);

            if (!(col > 0 && col + widget.sizeX <= grid.cols + 1 && row > 0 && row + widget.sizeY <= grid.rows + 1)) {
                col = widget.col;
                row = widget.row;
            }
            preview.css({
                left: grid.calculateLeft(col),
                top: grid.calculateTop(row)
            });
        };

        // Set behavior when dragging starts
        movable.onMoveStart = function (ev) {
            if (grid.editable && widget.movable && !widget.isResizing()) {
                height = element.outerHeight();
                width = element.outerWidth();

                // Move widget to foreground
                element.css({ zIndex: 2 });

                // Display the widget preview
                grid.element.append(preview.css({
                    left: element.css('left'),
                    height: height,
                    top: element.css('top'),
                    width: width
                }));

                // Maximize the grid
                if (grid.autoResize) {
                    grid.maximize();
                }
                return true;
            }
            return false;
        };

        // Set behavior when dragging stops
        movable.onMoveEnd = function () {
            // Remove the preview
            preview.detach();

            // Position the widget
            var left = parseFloat(element.css('left'));
            var top = parseFloat(element.css('top'));
            var col = grid.getSizeX(left) + 1;
            var row = grid.getSizeY(top) + 1;
            grid.moveWidget(widget, col, row);

            // Fit the grid to its content
            if (grid.autoResize) {
                grid.minimize();
            }
        };
        return widget;
    };

    /**
     * Returns the height of a size
     * @param sizeY
     * @return {number}
     */
    Cuic.Grid.prototype.calculateHeight = function (sizeY) {
        return parseInt(sizeY) * (this.rowsHeight + this.spacing) - this.spacing;
    };

    /**
     * Returns the left offset of a position
     * @param posX
     * @return {number}
     */
    Cuic.Grid.prototype.calculateLeft = function (posX) {
        return parseInt(posX) * (this.colsWidth + this.spacing) - this.colsWidth;
    };

    /**
     * Returns the top offset of a position
     * @param posY
     * @return {number}
     */
    Cuic.Grid.prototype.calculateTop = function (posY) {
        return parseInt(posY) * (this.rowsHeight + this.spacing) - this.rowsHeight;
    };

    /**
     * Returns the width of a size
     * @param sizeX
     * @return {number}
     */
    Cuic.Grid.prototype.calculateWidth = function (sizeX) {
        return parseInt(sizeX) * (this.colsWidth + this.spacing) - this.spacing;
    };

    /**
     * Removes all widgets from the grid
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.clear = function () {
        for (var id in this.widgets) {
            if (this.widgets.hasOwnProperty(id)) {
                this.removeWidget(id);
            }
        }
        return this;
    };

    /**
     * Returns the column and row of a position
     * @param left
     * @param top
     * @return {number[]}
     */
    Cuic.Grid.prototype.getPosition = function (left, top) {
        return [this.getPositionX(left), this.getPositionY(top)];
    };

    /**
     * Returns the column of a position
     * @param posX
     * @return {number}
     */
    Cuic.Grid.prototype.getPositionX = function (posX) {
        return Math.round(parseFloat(posX) / (this.colsWidth + this.spacing)) + 1;
    };

    /**
     * Returns the row of a position
     * @param posY
     * @return {number}
     */
    Cuic.Grid.prototype.getPositionY = function (posY) {
        return Math.round(parseFloat(posY) / (this.rowsHeight + this.spacing)) + 1;
    };

    /**
     * Returns a size from a width and height
     * @param width
     * @param height
     * @return {number[]}
     */
    Cuic.Grid.prototype.getSize = function (width, height) {
        return [this.getSizeX(width), this.getSizeY(height)];
    };

    /**
     * Returns a size from a width
     * @param width
     * @return {number}
     */
    Cuic.Grid.prototype.getSizeX = function (width) {
        return Math.round(parseFloat(width) / (this.colsWidth + this.spacing));
    };

    /**
     * Returns a size from a height
     * @param height
     * @return {number}
     */
    Cuic.Grid.prototype.getSizeY = function (height) {
        return Math.round(parseFloat(height) / (this.rowsHeight + this.spacing));
    };

    /**
     * Returns a widget
     * @param id
     * @return {Cuic.Grid.Widget}
     */
    Cuic.Grid.prototype.getWidget = function (id) {
        return this.widgets[id];
    };

    /**
     * Makes the grid as big as possible
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.maximize = function () {
        return this.resize(this.maxCols, this.maxRows);
    };

    /**
     * Makes the grid fit its content
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.minimize = function () {
        var col = this.minCols || 1;
        var row = this.minRows || 1;

        for (var id in this.widgets) {
            if (this.widgets.hasOwnProperty(id)) {
                var widget = this.widgets[id];

                if (widget.col + widget.sizeX - 1 > col) {
                    col = widget.col + widget.sizeX - 1;
                }
                if (widget.row + widget.sizeY - 1 > row) {
                    row = widget.row + widget.sizeY - 1;
                }
            }
        }
        return this.resize(col, row);
    };

    /**
     * Moves a widget to a new position
     * @param widget
     * @param col
     * @param row
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.moveWidget = function (widget, col, row) {
        var grid = this;

        if (!(col > 0 && col - 1 + widget.sizeX <= grid.cols && row > 0 && row - 1 + widget.sizeY <= grid.rows)) {
            col = widget.col;
            row = widget.row;
        }

        if (col > 0 && row > 0) {
            widget.col = col;
            widget.row = row;
            widget.element.css({ zIndex: 2 });
            widget.element.animate({
                left: grid.calculateLeft(col),
                top: grid.calculateTop(row)
            }, {
                complete: function complete() {
                    widget.element.removeClass('dragging');
                    widget.element.css({ zIndex: 1 });

                    // Execute callback
                    if (typeof grid.onWidgetMoved === 'function') {
                        grid.onWidgetMoved.call(grid, widget);
                    }
                },

                duration: grid.animSpeed,
                queue: false
            });
        }
        return grid;
    };

    /**
     * Removes the widget from the grid
     * @param id
     * @return {Cuic.Grid.Widget}
     */
    Cuic.Grid.prototype.removeWidget = function (id) {
        var widget = this.widgets[id];

        if (widget) {
            delete this.widgets[id];
            widget.element.stop(true, false).animate({
                height: 0,
                width: 0
            }, {
                complete: function complete() {
                    $(this).remove();
                },

                duration: this.animSpeed,
                queue: false
            });
        }
        return widget;
    };

    /**
     * Sets the grid size
     * @param cols
     * @param rows
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.resize = function (cols, rows) {
        cols = parseInt(cols);
        rows = parseInt(rows);

        if (cols < 1) {
            cols = 1;
        }
        if (rows < 1) {
            rows = 1;
        }

        if (cols > 0 && cols <= this.maxCols && rows > 0 && rows <= this.maxRows) {
            this.cols = cols;
            this.rows = rows;
            this.element.stop(true, false).animate({
                height: this.calculateHeight(rows) + this.spacing * 2,
                width: this.calculateWidth(cols) + this.spacing * 2
            }, {
                duration: this.animSpeed,
                queue: false
            });
        }
        return this;
    };

    /**
     * Sets the size of a widget
     * @param widget
     * @param sizeX
     * @param sizeY
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.resizeWidget = function (widget, sizeX, sizeY) {
        var grid = this;
        sizeX = parseInt(sizeX);
        sizeY = parseInt(sizeY);

        if (sizeX < widget.minSizeX) {
            sizeX = widget.minSizeX;
        }
        if (sizeY < widget.minSizeY) {
            sizeY = widget.minSizeY;
        }

        if ((!grid.maxSizeX || sizeX <= grid.maxSizeX) && (!grid.maxSizeY || sizeY >= grid.maxSizeY)) {
            widget.sizeX = sizeX;
            widget.sizeY = sizeY;
            widget.element.css({ zIndex: 2 });
            widget.element.animate({
                height: sizeY * (grid.rowsHeight + grid.spacing) - grid.spacing,
                width: sizeX * (grid.colsWidth + grid.spacing) - grid.spacing
            }, {
                complete: function complete() {
                    widget.element.removeClass('resizing');
                    widget.element.css({ zIndex: 1 });

                    // Execute callback
                    if (typeof grid.onWidgetResized === 'function') {
                        grid.onWidgetResized.call(grid, widget);
                    }
                },

                duration: grid.animSpeed,
                queue: false
            });
        }
        return grid;
    };

    /**
     * Called when widget has been moved
     * @type {function}
     */
    Cuic.Grid.prototype.onWidgetMoved = null;

    /**
     * Called when widget has been resized
     * @type {function}
     */
    Cuic.Grid.prototype.onWidgetResized = null;

    /**
     * Default options
     * @type {*}
     */
    Cuic.Grid.prototype.options = {
        animSpeed: 200,
        autoResize: true,
        cols: null,
        colsWidth: 100,
        editable: true,
        fps: 30,
        maxCols: null,
        maxRows: null,
        minCols: null,
        minRows: null,
        rows: null,
        rowsHeight: 100,
        spacing: 10,
        widgetSelector: '.widget'
    };

    /**
     * Creates a grid widget
     * @param options
     * @constructor
     */
    Cuic.Grid.Widget = function (options) {
        var self = this;

        // Default options
        options = Cuic.extend(true, {}, Cuic.Grid.Widget.prototype.options, options);

        // Set the options
        self.col = parseInt(options.col);
        self.movable = options.movable === true;
        self.resizable = options.resizable === true;
        self.row = parseInt(options.row);
        self.maxSizeX = parseInt(options.maxSizeX);
        self.maxSizeY = parseInt(options.maxSizeY);
        self.minSizeX = parseInt(options.minSizeX);
        self.minSizeY = parseInt(options.minSizeY);
        self.sizeX = parseInt(options.sizeX);
        self.sizeY = parseInt(options.sizeY);

        // Find the target
        if (options.target) {
            self.element = $(options.target);

            if (self.element.length > 0) {
                self.col = parseInt(self.element.attr('data-col')) || options.col;
                self.movable = !!self.element.attr('data-movable') ? /^true$/gi.test(self.element.attr('data-movable')) : options.movable;
                self.maxSizeX = parseInt(self.element.attr('data-max-size-x')) || options.maxSizeX;
                self.maxSizeY = parseInt(self.element.attr('data-max-size-y')) || options.maxSizeY;
                self.minSizeX = parseInt(self.element.attr('data-min-size-x')) || options.minSizeX;
                self.minSizeY = parseInt(self.element.attr('data-min-size-y')) || options.minSizeY;
                self.resizable = !!self.element.attr('data-resizable') ? /^true$/gi.test(self.element.attr('data-resizable')) : options.resizable;
                self.row = parseInt(self.element.attr('data-row')) || options.row;
                self.sizeX = parseInt(self.element.attr('data-size-x')) || options.sizeX;
                self.sizeY = parseInt(self.element.attr('data-size-y')) || options.sizeY;
            }
        }

        // Create the element HTML node
        if (!self.element || self.element.length < 1) {
            self.element = $('<div>', {
                html: options.content
            });
        }

        // Set the style
        self.element.addClass('widget');
    };

    /**
     * Checks if the widget is dragging
     * @return {Boolean}
     */
    Cuic.Grid.Widget.prototype.isDragging = function () {
        return this.element.hasClass('dragging');
    };

    /**
     * Checks if the widget is resizing
     * @return {Boolean}
     */
    Cuic.Grid.Widget.prototype.isResizing = function () {
        return this.element.hasClass('resizing');
    };

    /**
     * Default options
     * @type {*}
     */
    Cuic.Grid.Widget.prototype.options = {
        col: 1,
        content: null,
        movable: true,
        maxSizeX: null,
        maxSizeY: null,
        minSizeX: 1,
        minSizeY: 1,
        resizable: true,
        row: 1,
        sizeX: 1,
        sizeY: 1,
        target: null
    };
})(jQuery);

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

Cuic.Notification = function (_Cuic$Component5) {
    _inherits(_class16, _Cuic$Component5);

    function _class16(options) {
        _classCallCheck(this, _class16);

        // Set default options
        options = Cuic.extend({}, Cuic.Notification.prototype.options, options, {
            mainClass: 'notification'
        });

        // Create element

        // Public attributes
        var _this23 = _possibleConstructorReturn(this, (_class16.__proto__ || Object.getPrototypeOf(_class16)).call(this, 'div', { className: options.className }, options));

        _this23.closeTimer = null;

        // Add content
        _this23.content = new Cuic.Element('div', {
            className: 'notification-content',
            html: options.content
        }).appendTo(_this23);

        // Add close button
        _this23.closeButton = new Cuic.Element('span', {
            className: _this23.options.closeButtonClass,
            html: _this23.options.closeButton,
            role: 'button'
        }).addClass('btn-close').appendTo(_this23);

        // Avoid closing notification when mouse is over
        _this23.on('mouseenter', function (ev) {
            clearTimeout(_this23.closeTimer);
        });

        // Close notification when mouse is out
        _this23.on('mouseleave', function (ev) {
            if (ev.currentTarget === _this23.node()) {
                _this23.autoClose();
            }
        });

        _this23.on('click', function (ev) {
            // Close button
            if (Cuic.element(ev.target).hasClass('btn-close')) {
                ev.preventDefault();
                _this23.close();
            }
        });

        _this23.onClosed(function () {
            if (_this23.options.autoRemove) {
                _this23.remove();
            }
        });

        _this23.onOpen(function () {
            if (_this23.options.position) {
                _this23.align(_this23.options.position);
            }
        });

        _this23.onOpened(function () {
            _this23.autoClose();
        });

        // Remove dialog from list
        _this23.onRemoved(function () {
            Cuic.notifications.remove(_this23);
        });

        // Add element to collection
        Cuic.notifications.add(_this23);
        return _this23;
    }

    /**
     * Auto closes the notification
     */


    _createClass(_class16, [{
        key: 'autoClose',
        value: function autoClose() {
            var _this24 = this;

            clearTimeout(this.closeTimer);
            this.closeTimer = setTimeout(function () {
                if (_this24.options.autoClose) {
                    _this24.close();
                }
            }, this.options.duration);
        }

        /**
         * Sets notification content
         * @param html
         * @return {Cuic.Notification}
         */

    }, {
        key: 'setContent',
        value: function setContent(html) {
            this.content.html(html);
            return this;
        }
    }]);

    return _class16;
}(Cuic.Component);

Cuic.Notification.prototype.options = {
    autoClose: true,
    autoRemove: true,
    closable: true,
    closeButton: null,
    closeButtonClass: 'glyphicon glyphicon-remove-sign',
    content: null,
    duration: 2000,
    namespace: 'notification',
    opened: false,
    parent: document.body,
    position: 'center',
    zIndex: 10
};

Cuic.notifications = new Cuic.Collection();

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

Cuic.NotificationStack = function (_Cuic$Group) {
    _inherits(_class17, _Cuic$Group);

    function _class17(options) {
        _classCallCheck(this, _class17);

        // Set default options
        options = Cuic.extend({}, Cuic.NotificationStack.prototype.options, options, {
            mainClass: 'notification-stack'
        });

        // Create element

        // Set position
        var _this25 = _possibleConstructorReturn(this, (_class17.__proto__ || Object.getPrototypeOf(_class17)).call(this, 'div', { className: options.className }, options));

        if (_this25.options.position) {
            _this25.align(_this25.options.position);
        }

        // Display the notification when it's added to the stack
        _this25.onComponentAdded(function (component) {
            if (component instanceof Cuic.Notification) {
                // fixme Not using a timeout to open blocks the animation
                setTimeout(function () {
                    component.open();
                }, 10);
            }
        });

        // Display the notification when it's added to the stack
        _this25.onComponentRemoved(function (component) {
            if (component instanceof Cuic.Notification) {
                component.close();
            }
        });
        return _this25;
    }

    return _class17;
}(Cuic.Group);

Cuic.NotificationStack.prototype.options = {
    namespace: 'notification-stack',
    position: 'right top',
    zIndex: 10
};

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

Cuic.Panel = function (_Cuic$Component6) {
    _inherits(_class18, _Cuic$Component6);

    function _class18(options) {
        _classCallCheck(this, _class18);

        // Set default options
        options = Cuic.extend({}, Cuic.Panel.prototype.options, options, {
            mainClass: 'panel'
        });

        // Create element

        var _this26 = _possibleConstructorReturn(this, (_class18.__proto__ || Object.getPrototypeOf(_class18)).call(this, 'div', { className: options.className }, options));

        if (options.element) {
            _this26.header = _this26.find('.panel-header').eq(0);
            _this26.title = _this26.find('.panel-title').eq(0);
            _this26.content = _this26.find('.panel-content').eq(0);
            _this26.footer = _this26.find('.panel-footer').eq(0);
            _this26.closeButton = _this26.find('.panel-header .btn-close').eq(0);
        } else {
            // Add the header
            _this26.header = new Cuic.Element('header', {
                className: 'panel-header'
            }).prependTo(_this26);

            // Add the title
            _this26.title = new Cuic.Element('h5', {
                className: 'panel-title',
                html: options.title
            }).appendTo(_this26.header);

            // Add close button
            _this26.closeButton = new Cuic.Element('span', {
                className: _this26.options.closeButtonClass,
                html: _this26.options.closeButton,
                role: 'button'
            }).addClass('btn-close').appendTo(_this26.header);

            // Add the body
            _this26.content = new Cuic.Element('section', {
                className: 'panel-content',
                html: options.content
            }).appendTo(_this26);

            // Add the footer
            _this26.footer = new Cuic.Element('footer', {
                className: 'panel-footer',
                html: options.footer
            }).appendTo(_this26);

            // Hide the header if not used
            if (!options.title) {
                _this26.header.hide();
            }

            // Hide the footer if not used
            if (!options.footer) {
                _this26.footer.hide();
            }
        }

        if (_this26.isOpened()) {
            _this26.align(_this26.options.position);
            _this26.resizeContent();
        }

        // To hide the panel in the container,
        // the container must have a hidden overflow
        if (_this26.hasParent()) {
            _this26.parent().css({ overflow: 'hidden' });
        }

        // todo avoid closing panel if button is from another component
        _this26.on('click', function (ev) {
            // Close button
            if (Cuic.element(ev.target).hasClass('btn-close')) {
                ev.preventDefault();
                _this26.close();
            }
            // Toggle button
            if (Cuic.element(ev.target).hasClass('btn-toggle')) {
                ev.preventDefault();
                _this26.toggle();
            }
        });

        _this26.onClose(function () {
            var height = _this26.outerHeight(true);
            var width = _this26.outerWidth(true);
            var prop = {};

            // Horizontal position
            if (_this26.isAligned('left')) {
                prop.left = -width;
                prop.right = '';
            } else if (_this26.isAligned('right')) {
                prop.right = -width;
                prop.left = '';
            }

            // Vertical position
            if (_this26.isAligned('bottom')) {
                prop.bottom = -height;
                prop.top = '';
            } else if (_this26.isAligned('top')) {
                prop.top = -height;
                prop.bottom = '';
            }

            // Centered
            if (prop.left === undefined && prop.right === undefined && prop.bottom === undefined && prop.top === undefined) {}
            // todo Handle centered panel opening/closing


            // Animate panel
            _this26.css(prop);
        });

        var autoClose = function autoClose(ev) {
            if (_this26.isOpened() && _this26.options.autoClose) {
                if (ev.target !== _this26.node() && !Cuic.element(ev.target).isChildOf(_this26)) {
                    _this26.close();
                }
            }
        };

        _this26.onClosed(function () {
            Cuic.off('click', document, autoClose);
        });

        _this26.onMinimize(function () {
            var clone = _this26.clone();
            clone.css({ height: 'auto', width: 'auto' });
            clone.appendTo(_this26.parent());

            // Calculate minimized size
            var prop = Cuic.calculateAlign(clone, _this26.options.position);
            prop.height = clone.height();
            prop.width = clone.width();
            clone.remove();

            if (!_this26.isOpened()) {
                // Horizontal position
                if (_this26.isPosition('left')) {
                    prop.left = -_this26.outerWidth(true);
                    prop.right = '';
                } else if (_this26.isPosition('right')) {
                    prop.right = -_this26.outerWidth(true);
                    prop.left = '';
                }
                // Vertical position
                if (_this26.isPosition('bottom')) {
                    prop.bottom = -_this26.outerHeight(true);
                    prop.top = '';
                } else if (_this26.isPosition('top')) {
                    prop.top = -_this26.outerHeight(true);
                    prop.bottom = '';
                }
            }
            // Minimize panel
            _this26.css(prop);
        });

        _this26.onOpen(function () {
            _this26.resizeContent();
            _this26.align(_this26.options.position);
        });

        _this26.onOpened(function () {
            // Close the panel when the user clicks outside of it
            Cuic.on('click', document, autoClose);
        });

        Cuic.on('resize', window, function () {
            _this26.resizeContent();
        });

        // Add element to collection
        Cuic.panels.add(_this26);
        return _this26;
    }

    /**
     * Returns the content
     * @deprecated
     * @return {Cuic.Element}
     */


    _createClass(_class18, [{
        key: 'getBody',
        value: function getBody() {
            return this.content;
        }

        /**
         * Returns the content
         * @return {Cuic.Element}
         */

    }, {
        key: 'getContent',
        value: function getContent() {
            return this.content;
        }

        /**
         * Returns the footer
         * @return {Cuic.Element}
         */

    }, {
        key: 'getFooter',
        value: function getFooter() {
            return this.footer;
        }

        /**
         * Returns the header
         * @return {Cuic.Element}
         */

    }, {
        key: 'getHeader',
        value: function getHeader() {
            return this.header;
        }

        /**
         * Resizes the content
         * @return {Cuic.Panel}
         */

    }, {
        key: 'resizeContent',
        value: function resizeContent() {
            // Calculate available space
            var availableSpace = Cuic.calculateAvailableSpace(this);

            // Set panel max height
            this.css({ 'max-height': availableSpace.height });

            // Calculate content max height
            var maxHeight = availableSpace.height;

            // Subtract header height
            if (this.header instanceof Cuic.Element) {
                maxHeight -= this.header.outerHeight(true);
            }
            // Subtract footer height
            if (this.footer instanceof Cuic.Element) {
                maxHeight -= this.footer.outerHeight(true);
            }
            // Subtract content margin
            maxHeight -= this.content.margin().vertical;

            // Set content max height
            this.content.css({ 'max-height': maxHeight });
            return this;
        }

        /**
         * Sets panel content
         * @param html
         * @return {Cuic.Panel}
         */

    }, {
        key: 'setContent',
        value: function setContent(html) {
            this.content.html(html);
            return this;
        }

        /**
         * Sets panel footer
         * @param html
         * @return {Cuic.Panel}
         */

    }, {
        key: 'setFooter',
        value: function setFooter(html) {
            this.footer.html(html);
            return this;
        }

        /**
         * Sets panel title
         * @param html
         * @return {Cuic.Panel}
         */

    }, {
        key: 'setTitle',
        value: function setTitle(html) {
            this.title.html(html);
            this.header.show();
            return this;
        }
    }]);

    return _class18;
}(Cuic.Component);

Cuic.Panel.prototype.options = {
    autoClose: false,
    closable: true,
    closeButton: null,
    closeButtonClass: 'glyphicon glyphicon-remove-sign',
    content: null,
    footer: null,
    maximized: false,
    namespace: 'panel',
    opened: false,
    parent: null,
    position: 'left top',
    title: null,
    zIndex: 1
};

Cuic.panels = new Cuic.Collection();

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

Cuic.Popup = function (_Cuic$Component7) {
    _inherits(_class19, _Cuic$Component7);

    function _class19(options) {
        _classCallCheck(this, _class19);

        // Set default options
        options = Cuic.extend({}, Cuic.Popup.prototype.options, options, {
            mainClass: 'popup'
        });

        // Create element

        // Add content
        var _this27 = _possibleConstructorReturn(this, (_class19.__proto__ || Object.getPrototypeOf(_class19)).call(this, 'div', { className: options.className }, options));

        _this27.content = new Cuic.Element('div', {
            className: 'popup-content',
            html: options.content
        }).appendTo(_this27);

        // Add tail
        _this27.tail = new Cuic.Element('span', {
            className: 'popup-tail'
        }).appendTo(_this27);

        // Add close button
        _this27.closeButton = new Cuic.Element('span', {
            className: _this27.options.closeButtonClass,
            html: _this27.options.closeButton,
            role: 'button'
        }).addClass('btn-close').appendTo(_this27);

        /**
         * Popup shortcuts
         * @type {{close: *}}
         */
        _this27.shortcuts = {
            close: new Cuic.Shortcut({
                element: _this27,
                keyCode: Cuic.keys.ESC,
                callback: function callback() {
                    _this27.close();
                }
            })
        };

        var autoClose = function autoClose(ev) {
            if (_this27.isOpened() && _this27.options.autoClose) {
                if (ev.target !== _this27.node() && !Cuic.element(ev.target).isChildOf(_this27)) {
                    _this27.close();
                }
            }
        };

        _this27.on('click', function (ev) {
            // Close button
            if (Cuic.element(ev.target).hasClass('btn-close')) {
                ev.preventDefault();
                _this27.close();
            }
        });

        // Reposition tail when popup position change
        _this27.onAnchored(function () {
            _this27.updateTail();
        });

        _this27.onClosed(function () {
            Cuic.off('click', document, autoClose);

            if (_this27.options.autoRemove) {
                _this27.remove();
            }
        });

        _this27.onOpen(function () {
            var targetParent = Cuic.node(_this27.options.target).parentNode;
            _this27.appendTo(targetParent);
            _this27.anchor(_this27.options.anchor, _this27.options.target);
        });

        _this27.onOpened(function () {
            // Close the popup when the user clicks outside of it
            Cuic.on('click', document, autoClose);
        });

        // Add element to collection
        Cuic.popups.add(_this27);
        return _this27;
    }

    /**
     * Sets popup content
     * @param html
     * @return {Cuic.Popup}
     */


    _createClass(_class19, [{
        key: 'setContent',
        value: function setContent(html) {
            this.content.html(html);
            return this;
        }

        /**
         * Position the tail
         * @return {Cuic.Popup}
         */

    }, {
        key: 'updateTail',
        value: function updateTail() {
            var prop = {
                bottom: '',
                left: '',
                right: '',
                top: ''
            };

            // todo copy popup background color
            // prop['border-color'] = this.css('background-color');

            // Remove previous classes
            this.tail.removeClass('popup-tail-bottom popup-tail-left popup-tail-right popup-tail-top');

            // Top tail
            if (this.isAnchored('bottom')) {
                this.tail.addClass('popup-tail-top');
            }
            // Bottom tail
            if (this.isAnchored('top')) {
                this.tail.addClass('popup-tail-bottom');
            }
            // Right tail
            if (this.isAnchored('left')) {
                this.tail.addClass('popup-tail-right');
            }
            // Left tail
            if (this.isAnchored('right')) {
                this.tail.addClass('popup-tail-left');
            }

            // Apply CSS
            this.tail.css(prop);

            return this;
        }
    }]);

    return _class19;
}(Cuic.Component);

Cuic.Popup.prototype.options = {
    anchor: 'top',
    autoClose: true,
    autoRemove: false,
    closable: true,
    closeButton: null,
    closeButtonClass: 'glyphicon glyphicon-remove-sign',
    content: null,
    namespace: 'popup',
    opened: false,
    target: null,
    zIndex: 9
};

Cuic.popups = new Cuic.Collection();

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

Cuic.Switcher = function (_Cuic$Component8) {
    _inherits(_class20, _Cuic$Component8);

    function _class20(options) {
        _classCallCheck(this, _class20);

        // Set default options
        options = Cuic.extend({}, Cuic.Switcher.prototype.options, options, {
            mainClass: 'switcher'
        });

        // Create element

        // Public attributes
        var _this28 = _possibleConstructorReturn(this, (_class20.__proto__ || Object.getPrototypeOf(_class20)).call(this, 'div', {
            className: options.className,
            html: options.content
        }, options));

        _this28.activeElement = null;
        _this28.index = 0;
        _this28.timer = null;

        // Display first element
        _this28.goTo(0);

        // Auto start timer
        if (_this28.options.autoStart) {
            _this28.start();
        }

        // Add element to collection
        Cuic.switchers.add(_this28);
        return _this28;
    }

    /**
     * Displays the first element
     */


    _createClass(_class20, [{
        key: 'first',
        value: function first() {
            this.goTo(0);
        }

        /**
         * Returns the active element
         * @return {Cuic.Element}
         */

    }, {
        key: 'getActiveElement',
        value: function getActiveElement() {
            return this.activeElement;
        }

        /**
         * Returns the element at the specified index
         * @param index
         * @return {Cuic.Element}
         */

    }, {
        key: 'getElementAt',
        value: function getElementAt(index) {
            return this.children().eq(index);
        }

        /**
         * Returns the index of the visible element
         * @return {number}
         */

    }, {
        key: 'getIndex',
        value: function getIndex() {
            return this.children().index(this.activeElement);
        }

        /**
         * Displays the element at the specified index
         * @param position
         */

    }, {
        key: 'goTo',
        value: function goTo(position) {
            var children = this.children();
            var repeat = this.options.repeat;

            // Go to first element if end of list
            if (position >= children.length) {
                this.index = repeat ? 0 : children.length - 1;
            } else if (position < 0) {
                this.index = repeat ? children.length - 1 : 0;
            } else {
                this.index = position;
            }

            if (this.index !== this.getIndex()) {
                var started = this.isStarted();
                this.stop();

                // Hide visible elements
                for (var _i6 = 0; _i6 < children.length; _i6 += 1) {
                    var child = Cuic.element(children[_i6]);

                    if (this.index === _i6) {
                        child.addClass('visible');
                        child.removeClass('hidden');
                    } else {
                        child.addClass('hidden');
                        child.removeClass('visible');
                    }
                }

                // Get the visible element
                this.activeElement = children.eq(this.index);
                this.activeElement.addClass('visible');
                this.activeElement.removeClass('hidden');

                // Show the active element
                if (started) {
                    this.start();
                }
            }
        }

        /**
         * Checks if the switcher is started
         * @return {boolean}
         */

    }, {
        key: 'isStarted',
        value: function isStarted() {
            return this.timer !== null && this.timer !== undefined;
        }

        /**
         * Displays the last element
         */

    }, {
        key: 'last',
        value: function last() {
            this.goTo(this.children().length - 1);
        }

        /**
         * Displays the next element
         */

    }, {
        key: 'next',
        value: function next() {
            this.goTo(this.index + 1);
        }

        /**
         * Displays the previous element
         */

    }, {
        key: 'previous',
        value: function previous() {
            this.goTo(this.index - 1);
        }

        /**
         * Starts the started
         */

    }, {
        key: 'start',
        value: function start() {
            var _this29 = this;

            if (!this.isStarted()) {
                this.timer = setInterval(function () {
                    _this29.next();
                }, this.options.delay);
            }
        }

        /**
         * Stops the started
         */

    }, {
        key: 'stop',
        value: function stop() {
            if (this.isStarted()) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    }]);

    return _class20;
}(Cuic.Component);

Cuic.Switcher.prototype.options = {
    autoStart: true,
    delay: 3000,
    namespace: 'switcher',
    repeat: true
};

Cuic.switchers = new Cuic.Collection();

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

    var ns = Cuic.namespace('table');

    /**
     * Enables interactions on a table
     * @todo create an object
     * @param options
     * @return {jQuery}
     */
    Cuic.Table = function (options) {
        // Set default options
        options = Cuic.extend(true, {
            onSorted: null,
            selectedClass: 'selected',
            selectRowOnClick: false,
            sortableClass: 'sortable',
            sortColumn: 0,
            sortOrder: 'asc',
            target: null
        }, options);

        // Get target
        var table = $(options.target);

        if (table.length > 1) {
            throw 'Only one table is expected as target';
        } else if (table.length === 0) {
            throw 'Invalid table target';
        }

        // Check if the element table
        if (!table.is('table')) {
            throw 'The target is not a table : ' + options.target;
        }

        // Get the table zones
        var thead = table.children('thead');
        var tbody = table.children('tbody');
        var tfoot = table.children('tfoot');

        // Mark selected rows when clicked
        if (options.selectRowOnClick) {
            tbody.children('tr').off(ns('click')).on(ns('click'), function (ev) {
                if (ev.target.nodeName === 'TD') {
                    $(this).toggleClass(options.selectedClass);
                }
            });
        }

        /**
         * Sorts the table rows
         * @param index
         * @param order
         */
        table.sort = function (index, order) {
            var rows = [];

            // Get all rows
            tbody.children('tr').each(function () {
                rows.push($(this));
            });

            // Removes order from other columns
            var column = thead.find('tr > th').eq(index);
            thead.find('tr > th').not(column).removeClass('ascendant descendant sorted');

            // Add the sorted class to the column
            column.addClass('sorted');
            tbody.find('tr > td').removeClass('sorted');
            tbody.find('tr').each(function () {
                $(this).children().eq(index).addClass('sorted');
            });

            if (rows.length > 1) {
                // Sort the rows
                rows.sort(function (row1, row2) {
                    if (row1 !== undefined && row1 !== null && row2 !== undefined && row2 !== null) {
                        var value1 = row1.children('td').eq(index).html();
                        var value2 = row2.children('td').eq(index).html();

                        if (typeof value1 === 'string') {
                            value1 = value1.toLowerCase();
                        }

                        if (typeof value2 === 'string') {
                            value2 = value2.toLowerCase();
                        }

                        if (value1 > value2) {
                            return 1;
                        }

                        if (value1 === value2) {
                            return 0;
                        }
                    }
                    return -1;
                });

                // Reverse the order
                if (order === 'desc' || order == -1) {
                    rows.reverse();
                }

                // Sort all rows
                for (var i = 0; i < rows.length; i += 1) {
                    rows[i].appendTo(tbody);
                }

                // Calls the listener
                if (typeof options.onSorted === 'function') {
                    options.onSorted(index, order);
                }
            }
        };

        // Sort the table
        var defaultColumn = thead.find('.default');
        defaultColumn = defaultColumn.length === 1 ? defaultColumn : thead.find('.sortable:first');

        table.sort(defaultColumn.index(), defaultColumn.hasClass('descendant') ? 'desc' : 'asc');

        // Handle clicks on sortable columns
        thead.find('tr > .' + options.sortableClass).off(ns('click')).on(ns('click'), function (ev) {
            if (ev.currentTarget === ev.target) {
                var column = $(this);
                var index = column.index();
                var order;

                if (column.hasClass('ascendant')) {
                    column.removeClass('ascendant');
                    column.addClass('descendant');
                    order = 'desc';
                } else {
                    column.removeClass('descendant');
                    column.addClass('ascendant');
                    order = 'asc';
                }

                // Sort the column
                table.sort(index, order);
            }
        });

        return table;
    };
})(jQuery);

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

    var ns = Cuic.namespace('tabs');
    var tabIndex = 0;

    /**
     * Creates a group of tabs
     * @param options
     * @constructor
     */
    Cuic.Tabs = function (options) {
        var self = this;

        // Set default options
        options = Cuic.extend(true, {
            content: null,
            defaultTab: 0,
            target: null
        }, options);

        // Get the tabs
        var target = $(options.target);
        self.tabs = target.children('.tab');
        self.content = $(options.content);

        var defaultTab = self.tabs.filter('.default');

        if (defaultTab.length === 1) {
            // Set the default tab
            self.defaultTab = defaultTab.index();
        } else {
            // Set the first tab as default if the default tab is not defined in the HTML
            self.defaultTab = options.defaultTab;
            self.tabs.eq(self.defaultTab).addClass('default');
        }

        // Set default tab as active
        self.tabs.filter('.default').addClass('active');

        self.tabs.each(function () {
            var tab = $(this);
            var tabContent = self.content.find('#' + tab.attr('data-content'));

            // Set the tabindex for keyboard tabulation
            tab.attr('tabindex', tabIndex += 1);

            // Hide all tabs but not the default tab
            if (!tab.hasClass('default')) {
                tabContent.hide();
            }
        });

        // Display the content of the tab when it is focused
        self.tabs.off(ns('focus')).on(ns('focus'), function (ev) {
            self.selectTab($(ev.currentTarget).index());
        });
    };

    /**
     * Disables a tab
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.disableTab = function (index) {
        if (index == this.getActiveTabIndex()) {
            this.selectPreviousTab();
        }
        return this.getTab(index).addClass('disabled');
    };

    /**
     * Enables a tab
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.enableTab = function (index) {
        return this.getTab(index).removeClass('disabled');
    };

    /**
     * Returns the active tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.getActiveTab = function () {
        return this.tabs.filter('.active:first');
    };

    /**
     * Returns the index of the active tab
     * @return {number}
     */
    Cuic.Tabs.prototype.getActiveTabIndex = function () {
        return this.getActiveTab().index();
    };

    /**
     * Returns a tab
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.getTab = function (index) {
        return this.tabs.eq(index);
    };

    /**
     * Returns a tab content
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.getTabContent = function (index) {
        var tab = this.getTab(index);
        return this.content.find('#' + tab.attr('data-content'));
    };

    /**
     * Selects the default tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectDefaultTab = function () {
        return this.selectTab(this.defaultTab);
    };

    /**
     * Selects the next tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectNextTab = function () {
        return this.selectTab(this.getActiveTab().next(':not(.disabled)').index());
    };

    /**
     * Selects the previous tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectPreviousTab = function () {
        return this.selectTab(this.getActiveTab().prev(':not(.disabled)').index());
    };

    /**
     * Selects a tab by index
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectTab = function (index) {
        var tab = this.getTab(index);
        var tabContent = this.getTabContent(index);

        if (!tab.hasClass('disabled')) {
            this.tabs.removeClass('active');
            tab.addClass('active');
            this.content.children().not(tabContent).hide();
            tabContent.stop(true, false).fadeIn(200);
        }
    };
})(jQuery);

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

Cuic.Tooltip = function (_Cuic$Component9) {
    _inherits(_class21, _Cuic$Component9);

    function _class21(options) {
        _classCallCheck(this, _class21);

        // Set default options
        options = Cuic.extend({}, Cuic.Tooltip.prototype.options, options, {
            mainClass: 'tooltip'
        });

        // Create element

        // Public attributes
        var _this30 = _possibleConstructorReturn(this, (_class21.__proto__ || Object.getPrototypeOf(_class21)).call(this, 'div', { className: options.className }, options));

        _this30.currentTarget = null;

        // Add content
        _this30.content = new Cuic.Element('div', {
            className: 'tooltip-content'
        }).appendTo(_this30);

        // Add tail
        _this30.tail = new Cuic.Element('span', {
            className: 'tooltip-tail'
        }).appendTo(_this30);

        // Find tooltip targets
        var targets = Cuic.find(_this30.options.selector);

        targets.each(function (target) {
            // Open tooltip when mouse enter area
            target.on('mouseenter', function (ev) {
                // Get stored tooltip content
                var content = target.data('tooltip');

                if (!content || !content.length) {
                    // Get tooltip content from attribute
                    content = target.attr(_this30.options.attribute);
                    // Avoid tooltip conflict
                    target.attr(_this30.options.attribute, '');
                    // Store tooltip content
                    target.data('tooltip', content);
                }

                // Update tooltip content
                if (content && content.length) {
                    _this30.content.html(content);
                }

                _this30.currentTarget = ev.currentTarget;

                // Position tooltip
                if (!_this30.options.followPointer) {
                    if (_this30.parentNode() !== ev.currentTarget.parentNode) {
                        _this30.appendTo(ev.currentTarget.parentNode);
                    }
                }
                _this30.open();
            });

            // Close tooltip when mouse leaves area
            target.on('mouseleave', function () {
                _this30.close();
            });
        });

        // Move tooltip when mouse moves and tooltip is opened
        Cuic.on('mousemove', document, function (ev) {
            if (_this30.options.followPointer && !_this30.isHidden()) {
                if (_this30.parentNode() !== document.body) {
                    _this30.appendTo(document.body);
                }
                _this30.anchor(_this30.options.anchor, [ev.pageX, ev.pageY]);
            }
        });

        var autoClose = function autoClose(ev) {
            if (_this30.isOpened() && _this30.options.autoClose) {
                if (ev.target !== _this30.node() && !Cuic.element(ev.target).isChildOf(_this30)) {
                    _this30.close();
                }
            }
        };

        // Reposition tail when tooltip position change
        _this30.onAnchored(function () {
            _this30.updateTail();
        });

        _this30.onClosed(function () {
            Cuic.off('click', document, autoClose);

            if (_this30.options.autoRemove) {
                _this30.remove();
            }
        });

        _this30.onOpen(function () {
            if (!_this30.options.followPointer) {
                _this30.anchor(_this30.options.anchor, _this30.currentTarget);
            }
        });

        _this30.onOpened(function () {
            // Close the popup when the user clicks outside of it
            Cuic.on('click', document, autoClose);
        });

        // Add element to collection
        Cuic.tooltips.add(_this30);
        return _this30;
    }

    /**
     * Sets tooltip content
     * @param html
     * @return {Cuic.Tooltip}
     */


    _createClass(_class21, [{
        key: 'setContent',
        value: function setContent(html) {
            this.content.html(html);
            return this;
        }

        /**
         * Position the tail
         * @return {Cuic.Tooltip}
         */

    }, {
        key: 'updateTail',
        value: function updateTail() {
            var prop = {
                bottom: '',
                left: '',
                right: '',
                top: ''
            };

            // todo copy tooltip background color
            // prop['border-color'] = this.css('background-color');

            // Remove previous classes
            this.tail.removeClass('tooltip-tail-bottom tooltip-tail-left tooltip-tail-right tooltip-tail-top');

            // Top tail
            if (this.isAnchored('bottom')) {
                this.tail.addClass('tooltip-tail-top');
            }
            // Bottom tail
            if (this.isAnchored('top')) {
                this.tail.addClass('tooltip-tail-bottom');
            }
            // Right tail
            if (this.isAnchored('left')) {
                this.tail.addClass('tooltip-tail-right');
            }
            // Left tail
            if (this.isAnchored('right')) {
                this.tail.addClass('tooltip-tail-left');
            }

            // Apply CSS
            this.tail.css(prop);

            return this;
        }
    }]);

    return _class21;
}(Cuic.Component);

Cuic.Tooltip.prototype.options = {
    anchor: 'right',
    attribute: 'title',
    followPointer: true,
    namespace: 'tooltip',
    opened: false,
    selector: '[title]',
    zIndex: 100
};

Cuic.tooltips = new Cuic.Collection();

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

    var ns = Cuic.namespace('tree');

    /**
     * Enables interactions on a tree
     * @todo create an object
     * @param options
     * @return {jQuery}
     */
    Cuic.Tree = function (options) {
        // Set default options
        options = Cuic.extend(true, {
            collapsed: true,
            itemClass: 'tree-item',
            itemContentClass: 'tree-item-content',
            itemNameClass: 'tree-item-name',
            target: null
        }, options);

        var tree = $(options.target);

        if (tree.length !== 1) {
            throw new Error('Target not found : ' + options.target);
        }

        var items = tree.find('.' + options.itemClass);

        // Set the first item as default
        if (items.filter('.default').length == 0) {
            items.first().addClass('default');
        }

        items.filter('.default').addClass('active');

        if (options.collapsed) {
            tree.find('.' + options.itemClass).not('.expanded').not('.default').children('.' + options.itemContentClass).hide();
        } else {
            tree.find('.collapsed').children('.' + options.itemContentClass).hide();
        }

        items.each(function () {
            var item = $(this);
            var name = item.children('.' + options.itemNameClass);
            var content = item.children('.' + options.itemContentClass);

            // Apply the class corresponding to the state
            if (content.length == 1) {
                item.addClass(content.is(':visible') ? 'expanded' : 'collapsed');
            }

            item.children('.' + options.itemNameClass).off(ns('click')).on(ns('click'), function () {
                if (!item.hasClass('disabled')) {
                    if (content.length === 1) {
                        // Update the active item
                        tree.find('.active').removeClass('active');

                        if (content.is(':visible')) {
                            item.removeClass('expanded').addClass('collapsed');
                        } else {
                            item.addClass('active');
                            item.removeClass('collapsed').addClass('expanded');
                        }
                        content.toggle(200);
                    }
                }
            });
        });
        return tree;
    };
})(jQuery);
