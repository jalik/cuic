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
         * Constraints position to limits
         * @param prop
         * @param limit
         * @return {*}
         */
        constraintPosition: function constraintPosition(prop, limit) {
            // Limit horizontal align
            if (typeof prop.left === 'number') {
                if (prop.left < limit.minX) {
                    prop.left = limit.minX;
                } else if (prop.left > limit.maxX) {
                    prop.left = limit.maxX;
                }
            }
            if (typeof prop.right === 'number') {
                if (prop.right < limit.minX) {
                    prop.right = limit.minX;
                } else if (prop.right > limit.maxX) {
                    prop.right = limit.maxX;
                }
            }

            // Limit vertical align
            if (typeof prop.top === 'number') {
                if (prop.top < limit.minY) {
                    prop.top = limit.minY;
                } else if (prop.top > limit.maxY) {
                    prop.top = limit.maxY;
                }
            }
            if (typeof prop.bottom === 'number') {
                if (prop.bottom < limit.minY) {
                    prop.bottom = limit.minY;
                } else if (prop.bottom > limit.maxY) {
                    prop.bottom = limit.maxY;
                }
            }
            return prop;
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
            if (this.isNode(_element)) {
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
                        if (recursive && _typeof(b[key]) === 'object' && b[key] !== null && b[key] !== undefined) {
                            a[key] = this.extend(a[key], b[key]);
                        } else {
                            a[key] = b[key];
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
         * Checks if the element is an instance of Element
         * @param o
         * @return {*}
         */
        isElement: function isElement(o) {
            return (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object' ? o instanceof HTMLElement : //DOM2
            o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
        },


        /**
         * Checks if full screen is enabled
         * @return {boolean}
         */
        isFullScreenEnabled: function isFullScreenEnabled() {
            return (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) === true;
        },


        /**
         * Checks if the element is an instance of Node
         * @param o
         * @return {*}
         */
        isNode: function isNode(o) {
            return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? o instanceof Node : o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string';
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
            } else if (!this.isNode(element) && !(element instanceof Window)) {
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
            } else if (!this.isNode(element) && !(element instanceof Window)) {
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
            } else if (!this.isNode(element) && !(element instanceof Window)) {
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
         * Executes a callback when the window is resized
         * @param callback
         * @param delay
         */
        onWindowResized: function onWindowResized(callback) {
            var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

            var timer = void 0;
            this.on('resize', window, function (ev) {
                var _this2 = this;

                clearTimeout(timer);
                timer = setTimeout(function () {
                    callback.call(_this2, ev);
                }, delay);
            });
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

Cuic.browser = {

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
    }
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
                _this3 = this;

            if (!(this.callbacks[event] instanceof Array)) {
                this.callbacks[event] = [];
            }
            var cb = function cb() {
                var args = Array.prototype.slice.call(_arguments2);
                var context = args.shift();
                callback.apply(context, args);
                _this3.off(event, cb);
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
            var _this4 = this;

            var options = this.options;
            var element = this.node();
            Cuic.on('keydown', element, function (ev) {
                if ((options.keyCode === ev.keyCode || options.key === ev.key || options.key === ev.code) && options.altKey === ev.altKey && options.ctrlKey === ev.ctrlKey && options.shiftKey === ev.shiftKey) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    options.callback.call(_this4, element, ev);
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
            else if (Cuic.isNode(node) || node instanceof Window) {
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

        if (this.hasParent()) {
            // Maximize the panel
            if (this.options.maximized) {
                this.maximize();
            }
            if (this.options.maximizedX) {
                this.maximizeX();
            }
            if (this.options.maximizedY) {
                this.maximizeY();
            }
        }
    }

    /**
     * Calculates the alignment of the element inside its parent
     * @param position
     * @param parent
     * @return {{bottom: string, left: string, right: string, top: string}}
     * @protected
     */


    _createClass(_class5, [{
        key: '_calculateAlign',
        value: function _calculateAlign(position, parent) {
            position = position || '';

            if (parent) {
                parent = Cuic.element(parent);

                // Use body as parent
                if (parent.node().nodeName === 'HTML') {
                    parent = Cuic.element(document.body);
                }
            } else {
                // Use parent node if no parent defined
                parent = this.offsetParent();
            }

            var elHeight = this.outerHeight(true);
            var elWidth = this.outerWidth(true);
            var parentHeight = parent.height();
            var parentWidth = parent.width();
            var relativeLeft = parent.scrollLeft();
            var relativeTop = parent.scrollTop();
            var relativeBottom = -relativeTop;
            var relativeRight = -relativeLeft;
            var prop = {
                bottom: '',
                left: '',
                right: '',
                top: ''
            };

            // If the target is fixed, we use the window as parent
            switch (this.css('position')) {
                case 'fixed':
                    parent = Cuic.element(window);
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
            var available = this._calculateAvailablePosition(parent);

            // Constraint position
            if (prop.left < available.minX) {
                prop.left = available.minX;
            } else if (prop.left > available.maxX) {
                prop.left = available.maxX;
            }
            return prop;
        }

        /**
         * Calculates the position of the element around its parent
         * @param position
         * @param target
         * @param attach todo attach to
         * @return {{bottom: string, left: string, right: string, top: string}}
         * @protected
         */

    }, {
        key: '_calculateAnchor',
        value: function _calculateAnchor(position, target, attach) {
            position = position || '';

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
                    target = Cuic.element(target);
                    targetHeight = target.outerHeight();
                    targetWidth = target.outerWidth();
                    targetOffset = target.offset();
                }

            var elWidth = this.outerWidth(true);
            var elHeight = this.outerHeight(true);
            var elCenterX = elWidth / 2;
            var elCenterY = elHeight / 2;
            var targetCenterX = targetWidth / 2;
            var targetCenterY = targetHeight / 2;

            // fixme elHeight can be less if animated (resized), which leads to wrong elCenterY
            // fixme the problem is with element with scale(0) or display:none

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
            if (this.css('position') === 'fixed') {
                prop.left -= window.scrollX;
                prop.top -= window.scrollY;
            }

            // Calculate available position
            // const limit = this._calculateAvailablePosition(target.offsetParent());
            // prop = this.constraintPosition(prop, limit);

            return prop;
        }

        /**
         * Returns the available position inside a container
         * @param parent
         * @return {{minX: number, minY: number, maxX: number, maxY: number}}
         * @protected
         */

    }, {
        key: '_calculateAvailablePosition',
        value: function _calculateAvailablePosition(parent) {
            parent = parent ? Cuic.element(parent) : this.offsetParent();

            var prop = {
                minX: 0,
                minY: 0,
                maxX: Math.max(0, parent.width() - this.outerWidth(true)),
                maxY: Math.max(0, parent.height() - this.outerHeight(true))
            };

            // Adjust limits depending of element position
            switch (this.css('position')) {
                case 'absolute':
                case 'fixed':
                    var prPadding = parent.padding();
                    // const elMargin = this.margin();
                    prop.maxX += prPadding.horizontal;
                    prop.maxY += prPadding.vertical;
                    // prop.maxX -= elMargin.horizontal;
                    // prop.maxY -= elMargin.vertical;
                    // fixme max is wrong sometimes
                    break;
            }
            return prop;
        }

        /**
         * Returns the available space inside a container
         * @param parent
         * @return {{height, width}}
         * @protected
         */

    }, {
        key: '_calculateAvailableSpace',
        value: function _calculateAvailableSpace(parent) {
            parent = parent ? Cuic.element(parent) : this.offsetParent();
            var elMargin = this.margin();

            var prop = {
                height: parent.height(),
                width: parent.width()
            };

            // Adjust limits depending of element position
            switch (this.css('position')) {
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
        }

        /**
         * Calculates maximized properties
         * @return {{bottom: string, height: number, left: string, right: string, top: string, width: number}}
         * @protected
         */

    }, {
        key: '_calculateMaximize',
        value: function _calculateMaximize() {
            var parent = this.offsetParent();
            var parentPadding = parent.padding();
            var elMargin = this.margin();
            var prop = {
                bottom: '',
                left: '',
                right: '',
                top: '',
                height: parent.innerHeight() - parentPadding.vertical,
                width: parent.innerWidth() - parentPadding.horizontal
            };

            // Adjust dimensions
            switch (this.css('position')) {
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
            if (this.isAligned('right')) {
                prop.right = 0;
            } else {
                prop.left = 0;
            }
            // Vertical position
            if (this.isAligned('bottom')) {
                prop.bottom = 0;
            } else {
                prop.top = 0;
            }
            return prop;
        }

        /**
         * Calculates minimized properties
         * @param position
         * @return {{height, width}}
         * @protected
         */

    }, {
        key: '_calculateMinimize',
        value: function _calculateMinimize(position) {
            position = position || '';

            // Create a clone with minimal size
            var clone = this.clone();
            clone.css({ height: 'auto', width: 'auto' });
            clone.show().appendTo(this.parent());

            // Calculate minimized size
            var prop = clone._calculateAlign(position);
            prop.height = clone.outerHeight();
            prop.width = clone.outerWidth();
            clone.remove();

            return prop;
        }

        /**
         * Displays element for calculation (positioning, parenting...)
         * @return {Cuic.Element}
         * @protected
         */

    }, {
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
         * @protected
         */

    }, {
        key: '_restoreDisplay',
        value: function _restoreDisplay() {
            if (this.hasClass('computing')) {
                this.removeClass('computing');

                if (this._previousClass) {
                    this.addClass(this._previousClass);
                    this.css({ display: this._previousDisplay });
                    this._previousDisplay = null;
                    this._previousClass = null;
                }
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
            if (this.isInDOM()) {
                var pos = this.css('position');

                if (['absolute', 'fixed'].indexOf(pos) !== -1) {
                    this.debug('align', position);
                    this.css(this._calculateAlign(position));
                    this.addPositionClass(position, 'aligned');
                    this.options.position = position;
                    this.events.trigger('aligned', position);
                }
            }
            return this;
        }

        /**
         * Aligns element in its parent
         * @return {Cuic.Element}
         */

    }, {
        key: 'alignInParent',
        value: function alignInParent() {
            if (this.isInDOM()) {
                this.debug('alignInParent');
                var alignments = ['bottom', 'left', 'right', 'top'];
                var _prop = this.position();

                // Only keep properties that are styled
                for (var i = 0; i < alignments.length; i += 1) {
                    if (!this.css(alignments[i])) {
                        _prop[alignments[i]] = '';
                    }
                }

                // Limit position to parent available position
                var available = this._calculateAvailablePosition();
                _prop = Cuic.constraintPosition(_prop, available);

                // Apply alignment
                this.css(_prop);
            }
            return this;
        }

        /**
         * Aligns element in screen
         * @return {Cuic.Element}
         */

    }, {
        key: 'alignInScreen',
        value: function alignInScreen() {
            if (this.isInDOM()) {
                this.debug('alignInScreen');
                var alignments = ['bottom', 'left', 'right', 'top'];
                var _prop2 = this.position();

                // Only keep properties that are styled
                for (var i = 0; i < alignments.length; i += 1) {
                    if (!this.css(alignments[i])) {
                        _prop2[alignments[i]] = '';
                    }
                }

                // Limit position to screen
                var screen = {
                    minX: 0, maxX: Cuic.element(window).width(),
                    minY: 0, maxY: Cuic.element(window).height()
                };
                var rect = this.positionOnScreen();
                var elWidth = this.outerWidth(true);
                var elHeight = this.outerHeight(true);

                // todo
                // console.log('screen', screen);
                // console.log('rect', rect);
                // console.log('prop', prop);
                // console.log('size', {width: elWidth, height: elHeight});

                for (var _i = 0; _i < alignments.length; _i += 1) {
                    var location = alignments[_i];
                    var screenPos = rect[location];

                    if (typeof _prop2[location] === 'number') {
                        // negative
                        if (screenPos < 0) {
                            _prop2[location] += Math.abs(screenPos);
                        }
                        // positive
                        else if (['bottom', 'top'].indexOf(location) !== -1) {
                                if (screenPos + elHeight > screen.maxY) {
                                    // console.log(location + ': ' + (screenPos + elHeight) + " > " + available.maxY);
                                    // const extraSpace = Math.abs(available.maxY - Math.abs(prop[location]) - elHeight);
                                    var extraSpace = Math.abs(screen.maxY - Math.abs(rect[location]) - elHeight);
                                    _prop2[location] -= extraSpace;
                                    // console.log(available.maxY + '-' + extraSpace + ' = ', prop[location]);
                                }
                            } else if (['left', 'right'].indexOf(location) !== -1) {
                                if (screenPos + elWidth > screen.maxX) {
                                    // console.log(location + ': ' + (screenPos + elWidth) + " > " + available.maxX);
                                    var _extraSpace = Math.abs(screen.maxX - Math.abs(rect[location]) - elWidth);
                                    _prop2[location] -= _extraSpace;
                                    // console.log(available.maxX + '-' + extraSpace + ' = ', prop[location]);
                                }
                            }
                    }
                }
                // console.log('prop', prop);

                // Apply alignment
                this.css(_prop2);
            }
            return this;
        }

        /**
         * Sets the position of the element toward another element
         * @param position
         * @param target
         * @param attach
         * @return {Cuic.Element}
         */

    }, {
        key: 'anchor',
        value: function anchor(position, target, attach) {
            if (this.isInDOM()) {
                this.debug('anchor', position, target);
                target = Cuic.element(target || this.options.target);
                this.css(this._calculateAnchor(position, target, attach));
                this.addPositionClass(position, 'anchored');
                this.options.anchor = position;
                this.options.target = target;
                this.events.trigger('anchored', position);
            }
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
         * Auto fits element in its parent
         * @return {Cuic.Element}
         */

    }, {
        key: 'autoFit',
        value: function autoFit() {
            this.alignInParent();
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
            if (this.isInDOM()) {
                this.debug('autoResize');
                var available = this._calculateAvailableSpace();

                var _prop3 = {
                    height: this.outerHeight(),
                    width: this.outerWidth()
                };

                // Limit to max width
                if (_prop3.width && _prop3.width > available.width) {
                    _prop3.width = available.width;
                }
                // Limit to max height
                if (_prop3.height && _prop3.height > available.height) {
                    _prop3.height = available.height;
                }
                // Apply size
                this.css(_prop3);
            }
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
                if (Cuic.isNode(nodes[i])) {
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
                height = node.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
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
                    if (Cuic.isNode(_html)) {
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
         * Checks if the element has an absolute position
         * @return {boolean}
         */

    }, {
        key: 'isAbsolute',
        value: function isAbsolute() {
            return this.css('position') === 'absolute';
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
         * Checks if the element has a fixed position
         * @return {boolean}
         */

    }, {
        key: 'isFixed',
        value: function isFixed() {
            return this.css('position') === 'fixed';
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
         * Checks if the element is in the DOM
         * @return {boolean}
         */

    }, {
        key: 'isInDOM',
        value: function isInDOM() {
            return document.body.contains(this.node()) || !!this.offsetParent();
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
         * Checks if the element has a relative position
         * @return {boolean}
         */

    }, {
        key: 'isRelative',
        value: function isRelative() {
            return this.css('position') === 'relative';
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
         * Checks if the element has a static position
         * @return {boolean}
         */

    }, {
        key: 'isStatic',
        value: function isStatic() {
            return this.css('position') === 'static';
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
         * Maximizes the component in its container
         * @param callback
         * @return {Cuic.Element}
         */

    }, {
        key: 'maximize',
        value: function maximize(callback) {
            var _this5 = this;

            this.debug('maximize');
            this.events.trigger('maximize');
            this.removeClass('minimized');
            this.addClass('maximized');
            this.css(this._calculateMaximize());
            this.once('transitionend', function (ev) {
                if (_this5.isMaximized()) {
                    _this5.debug('maximized');
                    _this5.events.trigger('maximized', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this5, ev);
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
            var _this6 = this;

            this.debug('maximizeX');
            this.events.trigger('maximizeX');
            this.removeClass('minimized');
            this.addClass('maximized-x');
            var prop = this._calculateMaximize();
            this.css({ width: prop.width, left: prop.left, right: prop.right });
            this.once('transitionend', function (ev) {
                if (_this6.isMaximizedX()) {
                    _this6.debug('maximizedX');
                    _this6.events.trigger('maximizedX', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this6, ev);
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
            var _this7 = this;

            this.debug('maximizeY');
            this.events.trigger('maximizeY');
            this.removeClass('minimized');
            this.addClass('maximized-y');
            var prop = this._calculateMaximize();
            this.css({ height: prop.height, top: prop.top, bottom: prop.bottom });
            this.once('transitionend', function (ev) {
                if (_this7.isMaximizedY()) {
                    _this7.debug('maximizedY');
                    _this7.events.trigger('maximizedY', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this7, ev);
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
            var _this8 = this;

            this.debug('minimize');
            this.events.trigger('minimize');
            this.removeClass('maximized maximized-x maximized-y');
            this.addClass('minimized');
            this.css(this._calculateMinimize(this.options.position));
            this.once('transitionend', function (ev) {
                if (_this8.isMinimized()) {
                    _this8.debug('minimized');
                    _this8.events.trigger('minimized', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this8, ev);
                    }
                }
            });
            return this;
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
         * Returns position of element in the screen
         * @return {*}
         */

    }, {
        key: 'positionOnScreen',
        value: function positionOnScreen() {
            return Cuic.extend({}, this.node().getBoundingClientRect());
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
         * Returns element scroll left
         * @return {number|*}
         */

    }, {
        key: 'scrollLeft',
        value: function scrollLeft() {
            return this.node().scrollLeft;
        }

        /**
         * Returns element scroll top
         * @return {number|*}
         */

    }, {
        key: 'scrollTop',
        value: function scrollTop() {
            return this.node().scrollTop;
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
                width = node.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
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
        var _this9 = _possibleConstructorReturn(this, (_class6.__proto__ || Object.getPrototypeOf(_class6)).call(this, node, attributes, options));

        _this9.addClass('component');

        // Add closable class
        if (_this9.options.closable) {
            _this9.addClass('closable');
        }

        // Set the panel visibility
        // Since the visible option is used to check if the panel is visible
        // we force the panel to show or hide by setting visible to the inverse value.
        if (_this9.options.opened !== undefined) {
            if (_this9.options.opened) {
                _this9.open();
            } else {
                _this9.hide(); // Hide to avoid animations
                _this9.close();
            }
        }
        return _this9;
    }

    /**
     * Closes the component
     * @param callback
     * @return {Cuic.Component}
     */


    _createClass(_class6, [{
        key: 'close',
        value: function close(callback) {
            var _this10 = this;

            this.debug('close');
            this.events.trigger('close');
            this.removeClass('opened');
            this.addClass('closed');
            this.once('transitionend', function (ev) {
                if (!_this10.isOpened()) {
                    _this10.debug('closed');
                    _this10.events.trigger('closed', ev);
                    _this10.hide();

                    if (typeof callback === 'function') {
                        callback.call(_this10, ev);
                    }
                }
            });
            return this;
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
            var _this11 = this;

            this.debug('open');
            this.show();
            this.events.trigger('open');
            this.removeClass('closed');
            this.addClass('opened');
            this.once('transitionend', function (ev) {
                if (_this11.isOpened()) {
                    _this11.debug('opened');
                    _this11.events.trigger('opened', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this11, ev);
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
        var _this12 = _possibleConstructorReturn(this, (_class7.__proto__ || Object.getPrototypeOf(_class7)).call(this, node, Cuic.extend({
            className: options.className,
            role: 'group'
        }, attributes), options));

        _this12.addClass('component-group');

        // Prepare components collection
        _this12.components = new Cuic.Collection();
        return _this12;
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
            for (var _i2 = 0; _i2 < this.length; _i2 += 1) {
                callback.call(this[_i2], this[_i2], this);
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
            for (var _i3 = 0; _i3 < this.length; _i3 += 1) {
                if (this.eq(_i3) === element || this.get(_i3) === element) {
                    return _i3;
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
         * Removes an event listener from elements
         * @param event
         * @param callback
         * @return {Cuic.Elements}
         */

    }, {
        key: 'off',
        value: function off(event, callback) {
            return this.each(function (el) {
                el.off(event, callback);
            });
        }

        /**
         * Adds a unique event listener to elements
         * @param event
         * @param callback
         * @return {Cuic.Elements}
         */

    }, {
        key: 'once',
        value: function once(event, callback) {
            return this.each(function (el) {
                el.once(event, callback);
            });
        }

        /**
         * Adds an event listener to elements
         * @param event
         * @param callback
         * @return {Cuic.Elements}
         */

    }, {
        key: 'on',
        value: function on(event, callback) {
            return this.each(function (el) {
                el.on(event, callback);
            });
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
        var _this13 = _possibleConstructorReturn(this, (_class9.__proto__ || Object.getPrototypeOf(_class9)).call(this, 'div', { className: options.className }, options));

        _this13.addClass('hook');

        // This is a fix to avoid offsetTop > 0
        _this13.css({
            position: 'relative',
            top: '',
            width: ''
        });

        // Create the spacer item that will replace
        // the bar when it is scrolled
        _this13.space = new Cuic.Element('div', {
            className: 'hook-space'
        });

        // Get the element's offset
        var offset = _this13.offset();

        var onScroll = function onScroll() {
            var fitsInScreen = _this13.outerHeight(true) <= window.screen.availHeight;

            if (fitsInScreen) {
                if (_this13.options.fixed) {
                    _this13.hook();
                } else {
                    var margin = _this13.margin();

                    if (window.scrollY > offset.top - margin.top) {
                        _this13.hook();
                    } else {
                        _this13.unhook();
                    }
                }
            } else {
                _this13.unhook();
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
        return _this13;
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
        var _this14 = _possibleConstructorReturn(this, (_class10.__proto__ || Object.getPrototypeOf(_class10)).call(this, 'div', { className: options.className }, options));

        _this14.addClass('movable');

        // Force the target to be the relative parent
        if (_this14.css('position') === 'static') {
            _this14.css({ position: 'relative' });
        }

        // Group handles
        _this14.handles = new Cuic.Collection();

        // Set the moving area
        _this14.addMoveHandle(options.handle || _this14.node());
        return _this14;
    }

    /**
     * Sets the moving area
     * @param handle
     * @return {Cuic.Component}
     */


    _createClass(_class10, [{
        key: 'addMoveHandle',
        value: function addMoveHandle(handle) {
            var _this15 = this;

            handle = Cuic.element(handle);

            this.handles.add(handle);

            // Add the handle class
            handle.addClass('movable-handle');

            // Start moving
            Cuic.on('mousedown', handle, function (ev) {
                // Ignore moving if the target is not the root
                if (_this15.options.rootOnly && ev.target !== ev.currentTarget) return;

                // Execute callback
                if (_this15.events.trigger('moveStart', ev) === false) return;

                // Prevent text selection
                ev.preventDefault();

                // Add moving class
                _this15.addClass('moving');

                var startPosition = _this15.position();
                var startX = ev.clientX;
                var startY = ev.clientY;

                var onMouseMove = function onMouseMove(ev) {
                    // Execute callback
                    if (_this15.events.trigger('move', ev) === false) return;

                    var prop = {};

                    // Move horizontally
                    if (_this15.options.horizontal) {
                        var diffX = ev.clientX - startX;
                        prop.left = startPosition.left + diffX;
                        prop.right = '';
                    }

                    // Move vertically
                    if (_this15.options.vertical) {
                        var diffY = ev.clientY - startY;
                        prop.top = startPosition.top + diffY;
                        prop.bottom = '';
                    }

                    // Limit position to parent available position
                    if (_this15.options.constraintToParent) {
                        var available = _this15._calculateAvailablePosition();
                        prop = Cuic.constraintPosition(prop, available);
                        _this15.alignInParent();
                    }

                    // Move element
                    _this15.css(prop);
                };

                // Moving
                Cuic.on('mousemove', document, onMouseMove);

                // Stop moving
                Cuic.once('mouseup', document, function (ev) {
                    Cuic.off('mousemove', document, onMouseMove);
                    _this15.removeClass('moving');
                    _this15.events.trigger('moveEnd', ev);
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
    constraintToParent: true,
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
        var _this16 = _possibleConstructorReturn(this, (_class11.__proto__ || Object.getPrototypeOf(_class11)).call(this, 'div', { className: options.className }, options));

        _this16.addClass('resizable');

        // Force the target to be the relative parent
        if (_this16.css('position') === 'static') {
            _this16.css('position', 'relative');
        }

        // Add Bottom handle
        _this16.bottomHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-s',
            css: { height: options.handleSize }
        }).appendTo(_this16);

        // Add Right handler
        _this16.rightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-e',
            css: { width: options.handleSize }
        }).appendTo(_this16);

        // Add Bottom-Right handler
        _this16.bottomRightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-se',
            css: {
                height: options.handleSize,
                width: options.handleSize
            }
        }).appendTo(_this16);

        // Group handles
        _this16.handles = new Cuic.Collection([_this16.rightHandle, _this16.bottomHandle, _this16.bottomRightHandle]);

        // Group horizontal handles
        _this16.horizontalHandles = new Cuic.Collection([_this16.rightHandle, _this16.bottomRightHandle]);

        // Group vertical handles
        _this16.verticalHandles = new Cuic.Collection([_this16.bottomHandle, _this16.bottomRightHandle]);

        _this16.handles.each(function (handle) {
            // Start resizing
            handle.on('mousedown', function (ev) {
                // Execute callback
                if (_this16.events.trigger('resizeStart', ev) === false) return;

                // Prevent text selection
                ev.preventDefault();

                // Add resizing class
                _this16.addClass('resizing');

                var startX = ev.clientX;
                var startY = ev.clientY;
                var initialHeight = _this16.outerHeight();
                var initialWidth = _this16.outerWidth();
                var handleTarget = ev.currentTarget;

                // Calculate initial ratio
                var ratio = initialHeight / initialWidth;

                var onMouseMove = function onMouseMove(ev) {
                    // Execute callback
                    if (_this16.events.trigger('resize', ev) === false) return;

                    var prop = {};

                    // Resize horizontally
                    if (_this16.options.horizontal) {
                        for (var _i4 = 0; _i4 < _this16.horizontalHandles.length; _i4 += 1) {
                            if (_this16.horizontalHandles.get(_i4).node() === handleTarget) {
                                var diffX = ev.clientX - startX;
                                var width = initialWidth + diffX;

                                // Width is between min and max
                                if ((!Number(_this16.options.maxWidth) || width <= _this16.options.maxWidth) && (!Number(_this16.options.minWidth) || width >= _this16.options.minWidth)) {
                                    prop.width = width;
                                }
                                break;
                            }
                        }
                    }

                    // Resize vertically
                    if (_this16.options.vertical) {
                        for (var _i5 = 0; _i5 < _this16.verticalHandles.length; _i5 += 1) {
                            if (_this16.verticalHandles.get(_i5).node() === handleTarget) {
                                var diffY = ev.clientY - startY;
                                var height = initialHeight + diffY;

                                // Height is between min and max
                                if ((!Number(_this16.options.maxHeight) || height <= _this16.options.maxHeight) && (!Number(_this16.options.minHeight) || height >= _this16.options.minHeight)) {
                                    prop.height = height;
                                }
                                break;
                            }
                        }
                    }

                    // fixme element can be resized more than parent size if keep ratio is active

                    // Keep ratio
                    if (_this16.options.keepRatio) {
                        if (prop.height) {
                            prop.width = prop.height / ratio;
                        } else if (prop.width) {
                            prop.height = prop.width * ratio;
                        }
                    }

                    // Apply new size
                    _this16.css(prop);
                    _this16.autoResize();
                };

                // Resizing
                Cuic.on('mousemove', document, onMouseMove);

                // Stop resizing
                Cuic.once('mouseup', document, function (ev) {
                    Cuic.off('mousemove', document, onMouseMove);
                    _this16.removeClass('resizing');
                    _this16.events.trigger('resizeEnd', ev);
                });
            });
        });
        return _this16;
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
        var _this17 = _possibleConstructorReturn(this, (_class12.__proto__ || Object.getPrototypeOf(_class12)).call(this, 'div', { className: options.className }, options));

        _this17.addClass('selectable');

        // Add selected class
        if (_this17.options.selected) {
            _this17.addClass('selected');
        }

        // Add or remove selected class
        _this17.on('click', function () {
            if (_this17.hasClass('selected')) {
                _this17.deselect();
            } else {
                _this17.select();
            }
        });
        return _this17;
    }

    /**
     * Deselect element
     * @param callback
     * @return {Cuic.Selectable}
     */


    _createClass(_class12, [{
        key: 'deselect',
        value: function deselect(callback) {
            var _this18 = this;

            this.removeClass('selected');
            this.once('transitionend', function (ev) {
                if (!_this18.isSelected()) {
                    _this18.events.trigger('deselected', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this18, ev);
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
            var _this19 = this;

            this.addClass('selected');
            this.once('transitionend', function (ev) {
                if (_this19.isSelected()) {
                    _this19.events.trigger('selected', ev);

                    if (typeof callback === 'function') {
                        callback.call(_this19, ev);
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
        var _this20 = _possibleConstructorReturn(this, (_class13.__proto__ || Object.getPrototypeOf(_class13)).call(this, 'button', {
            className: options.className,
            disabled: false,
            html: options.label,
            title: options.title,
            type: options.type
        }, options));

        if (typeof options.shortcut === 'number') {
            _this20.shortcut = new Cuic.Shortcut({
                keyCode: options.shortcut,
                target: _this20.element,
                callback: function callback() {
                    this.node().click();
                }
            });
        }
        return _this20;
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
        var _this21 = _possibleConstructorReturn(this, (_class14.__proto__ || Object.getPrototypeOf(_class14)).call(this, 'div', {
            className: options.className,
            role: 'dialog'
        }, options));

        if (_this21.parentNode() === document.body) {
            _this21.css({ position: 'absolute' });
        }

        // Create the fader
        _this21.fader = new Cuic.Fader({
            className: 'fader dialog-fader',
            autoClose: false,
            autoRemove: false,
            opened: false
        }).appendTo(_this21.options.parent);

        // Add header
        _this21.header = new Cuic.Element('header', {
            className: 'dialog-header',
            css: { display: _this21.options.title != null ? 'block' : 'none' }
        }).appendTo(_this21);

        // Add title
        _this21.title = new Cuic.Element('h3', {
            className: 'dialog-title',
            html: _this21.options.title
        }).appendTo(_this21.header);

        // Add content
        _this21.content = new Cuic.Element('section', {
            className: 'dialog-content',
            html: _this21.options.content
        }).appendTo(_this21);

        // Add footer
        _this21.footer = new Cuic.Element('footer', {
            className: 'dialog-footer',
            css: { display: _this21.options.buttons != null ? 'block' : 'none' }
        }).appendTo(_this21);

        // Add buttons group
        _this21.buttons = new Cuic.Group('div', {
            className: 'btn-group'
        }).appendTo(_this21.footer);

        // Add close button
        _this21.closeButton = new Cuic.Element('span', {
            className: _this21.options.closeButtonClass,
            html: _this21.options.closeButton,
            role: 'button'
        }).addClass('btn-close').appendTo(_this21.header);

        // Show footer if not empty
        _this21.buttons.onComponentAdded(function () {
            if (_this21.buttons.components.length > 0) {
                _this21.footer.show();
            }
        });

        // Hide footer if empty
        _this21.buttons.onComponentRemoved(function () {
            if (_this21.buttons.components.length < 1) {
                _this21.footer.hide();
            }
        });

        // Add buttons
        if (_this21.options.buttons instanceof Array) {
            for (var _i6 = 0; _i6 < _this21.options.buttons.length; _i6 += 1) {
                _this21.addButton(_this21.options.buttons[_i6]);
            }
        }

        // Set content height
        if (parseFloat(options.contentHeight) > 0) {
            _this21.content.css({ height: options.contentHeight });
        }

        // Set content width
        if (parseFloat(options.contentWidth) > 0) {
            _this21.content.css({ width: options.contentWidth });
        }

        /**
         * Movable interface
         * @type {Cuic.Movable}
         */
        if (_this21.options.movable) {
            _this21.movable = new Cuic.Movable({
                constraintToParent: true,
                enabled: _this21.options.movable,
                element: _this21.node(),
                handle: _this21.title,
                rootOnly: false
            });
        }

        /**
         * Resizable interface
         * @type {Cuic.Resizable}
         */
        if (_this21.options.resizable) {
            _this21.resizable = new Cuic.Resizable({
                enabled: _this21.options.resizable,
                element: _this21.node()
            });
        }

        /**
         * Dialog shortcuts
         * @type {{close: *}}
         */
        _this21.shortcuts = {
            close: new Cuic.Shortcut({
                element: _this21,
                keyCode: Cuic.keys.ESC,
                callback: function callback() {
                    _this21.close();
                }
            })
        };

        // Close dialog when fader is clicked
        _this21.fader.on('click', function () {
            if (_this21.options.autoClose) {
                _this21.close();
            }
        });

        _this21.on('click', function (ev) {
            // Close button
            if (Cuic.element(ev.target).hasClass('btn-close')) {
                ev.preventDefault();
                _this21.close();
            }
        });

        // Called when dialog is closing
        _this21.onClose(function () {
            _this21.fader.options.autoRemove = _this21.options.autoRemove;
            _this21.fader.close();
        });

        // Called when dialog is closed
        _this21.onClosed(function () {
            if (_this21.options.autoRemove) {
                _this21.remove();
                _this21.fader.remove();
            }
        });

        // Called when dialog is opening
        _this21.onOpen(function () {
            // Calculate z-index
            var zIndex = Math.max(_this21.options.zIndex, Cuic.dialogs.getCurrentZIndex() + 1);

            // Find current top dialog z-index
            _this21.css({ 'z-index': zIndex });
            _this21.resizeContent();

            // Open fader
            if (_this21.options.modal) {
                _this21.css({ 'z-index': zIndex + 1 });
                _this21.fader.css({ 'z-index': zIndex });
                _this21.fader.open();
            }

            // Maximize or position the dialog
            if (_this21.options.maximized) {
                _this21.maximize();
            } else {
                _this21.align(_this21.options.position);
            }

            // Focus the last button
            var buttons = _this21.buttons.children();

            if (buttons.length > 0) {
                buttons.last().node().focus();
            }
        });

        // Called when dialog is opened
        _this21.onOpened(function (ev) {
            // // todo wait images to be loaded to resize content
            var images = _this21.find('img');
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
        _this21.onRemoved(function () {
            Cuic.dialogs.remove(_this21);
        });

        // Add element to collection
        Cuic.dialogs.add(_this21);
        return _this21;
    }

    /**
     * Adds a button to the dialog
     * @param button
     * @return {Cuic.Button}
     */


    _createClass(_class14, [{
        key: 'addButton',
        value: function addButton(button) {
            var _this22 = this;

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
                            callback.call(_this22, ev);
                        });
                    } else if (callback === 'close') {
                        button.on('click', function () {
                            _this22.close();
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
            var available = this._calculateAvailableSpace();

            // Set dialog max dimensions
            this.css({
                'max-height': available.height,
                'max-width': available.width
            });

            // Calculate content max height
            var maxHeight = available.height;

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

Cuic.onWindowResized(function () {
    Cuic.dialogs.each(function (dialog) {
        dialog.resizeContent();
    });
});

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
        var _this23 = _possibleConstructorReturn(this, (_class15.__proto__ || Object.getPrototypeOf(_class15)).call(this, 'div', { className: options.className }, options));

        _this23.on('click', function () {
            if (_this23.options.autoClose) {
                _this23.close();
            }
        });

        // Called when fader is closed
        _this23.onClosed(function () {
            if (_this23.options.autoRemove) {
                _this23.remove();
            }
        });
        return _this23;
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
        var _this24 = _possibleConstructorReturn(this, (_class16.__proto__ || Object.getPrototypeOf(_class16)).call(this, 'div', { className: options.className }, options));

        _this24.closeTimer = null;

        // Add content
        _this24.content = new Cuic.Element('div', {
            className: 'notification-content',
            html: options.content
        }).appendTo(_this24);

        // Add close button
        _this24.closeButton = new Cuic.Element('span', {
            className: _this24.options.closeButtonClass,
            html: _this24.options.closeButton,
            role: 'button'
        }).addClass('btn-close').appendTo(_this24);

        // Avoid closing notification when mouse is over
        _this24.on('mouseenter', function (ev) {
            clearTimeout(_this24.closeTimer);
        });

        // Close notification when mouse is out
        _this24.on('mouseleave', function (ev) {
            if (ev.currentTarget === _this24.node()) {
                _this24.autoClose();
            }
        });

        _this24.on('click', function (ev) {
            // Close button
            if (Cuic.element(ev.target).hasClass('btn-close')) {
                ev.preventDefault();
                _this24.close();
            }
        });

        _this24.onClosed(function () {
            if (_this24.options.autoRemove) {
                _this24.remove();
            }
        });

        _this24.onOpen(function () {
            if (_this24.options.position) {
                _this24.align(_this24.options.position);
            }
        });

        _this24.onOpened(function () {
            _this24.autoClose();
        });

        // Remove dialog from list
        _this24.onRemoved(function () {
            Cuic.notifications.remove(_this24);
        });

        // Add element to collection
        Cuic.notifications.add(_this24);
        return _this24;
    }

    /**
     * Auto closes the notification
     */


    _createClass(_class16, [{
        key: 'autoClose',
        value: function autoClose() {
            var _this25 = this;

            clearTimeout(this.closeTimer);
            this.closeTimer = setTimeout(function () {
                if (_this25.options.autoClose) {
                    _this25.close();
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
        var _this26 = _possibleConstructorReturn(this, (_class17.__proto__ || Object.getPrototypeOf(_class17)).call(this, 'div', { className: options.className }, options));

        if (_this26.options.position) {
            _this26.align(_this26.options.position);
        }

        // Display the notification when it's added to the stack
        _this26.onComponentAdded(function (component) {
            if (component instanceof Cuic.Notification) {
                // fixme Not using a timeout to open blocks the animation
                setTimeout(function () {
                    component.open();
                }, 10);
            }
        });

        // Display the notification when it's added to the stack
        _this26.onComponentRemoved(function (component) {
            if (component instanceof Cuic.Notification) {
                component.close();
            }
        });
        return _this26;
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

        var _this27 = _possibleConstructorReturn(this, (_class18.__proto__ || Object.getPrototypeOf(_class18)).call(this, 'div', { className: options.className }, options));

        if (options.element) {
            _this27.header = _this27.find('.panel-header').eq(0);
            _this27.title = _this27.find('.panel-title').eq(0);
            _this27.content = _this27.find('.panel-content').eq(0);
            _this27.footer = _this27.find('.panel-footer').eq(0);
            _this27.closeButton = _this27.find('.panel-header .btn-close').eq(0);
        } else {
            // Add the header
            _this27.header = new Cuic.Element('header', {
                className: 'panel-header'
            }).prependTo(_this27);

            // Add the title
            _this27.title = new Cuic.Element('h5', {
                className: 'panel-title',
                html: options.title
            }).appendTo(_this27.header);

            // Add close button
            _this27.closeButton = new Cuic.Element('span', {
                className: _this27.options.closeButtonClass,
                html: _this27.options.closeButton,
                role: 'button'
            }).addClass('btn-close').appendTo(_this27.header);

            // Add the body
            _this27.content = new Cuic.Element('section', {
                className: 'panel-content',
                html: options.content
            }).appendTo(_this27);

            // Add the footer
            _this27.footer = new Cuic.Element('footer', {
                className: 'panel-footer',
                html: options.footer
            }).appendTo(_this27);

            // Hide the header if not used
            if (!options.title) {
                _this27.header.hide();
            }

            // Hide the footer if not used
            if (!options.footer) {
                _this27.footer.hide();
            }
        }

        if (_this27.isOpened()) {
            _this27.align(_this27.options.position);
            _this27.resizeContent();
        }

        // To hide the panel in the container,
        // the container must have a hidden overflow
        if (_this27.hasParent()) {
            _this27.parent().css({ overflow: 'hidden' });
        }

        var autoClose = function autoClose(ev) {
            if (_this27.isOpened() && _this27.options.autoClose) {
                if (ev.target !== _this27.node() && !Cuic.element(ev.target).isChildOf(_this27)) {
                    _this27.close();
                }
            }
        };

        // todo avoid closing panel if button is from another component
        _this27.on('click', function (ev) {
            // Close button
            if (Cuic.element(ev.target).hasClass('btn-close')) {
                ev.preventDefault();
                _this27.close();
            }
            // Toggle button
            if (Cuic.element(ev.target).hasClass('btn-toggle')) {
                ev.preventDefault();
                _this27.toggle();
            }
        });

        _this27.onClose(function () {
            var height = _this27.outerHeight(true);
            var width = _this27.outerWidth(true);
            var prop = {};

            // Horizontal position
            if (_this27.isAligned('right')) {
                prop.right = -width;
                prop.left = '';
            } else if (_this27.isAligned('left')) {
                prop.left = -width;
                prop.right = '';
            }

            // Vertical position
            if (_this27.isAligned('bottom')) {
                prop.bottom = -height;
                prop.top = '';
            } else {
                prop.top = -height;
                prop.bottom = '';
            }

            // Animate panel
            _this27.css(prop);
        });

        _this27.onClosed(function () {
            Cuic.off('click', document, autoClose);
        });

        _this27.onMaximized(function () {
            // Realign if panel is closed
            if (!_this27.isOpened()) {
                // Horizontal position
                if (_this27.isAligned('left')) {
                    prop.left = -_this27.outerWidth(true);
                    prop.right = '';
                } else if (_this27.isAligned('right')) {
                    prop.right = -_this27.outerWidth(true);
                    prop.left = '';
                }
                // Vertical position
                if (_this27.isAligned('bottom')) {
                    prop.bottom = -_this27.outerHeight(true);
                    prop.top = '';
                } else if (_this27.isAligned('top')) {
                    prop.top = -_this27.outerHeight(true);
                    prop.bottom = '';
                }
                _this27.css(prop);
            }
        });

        _this27.onMinimize(function () {
            // Realign if panel is closed
            if (!_this27.isOpened()) {
                var _prop4 = {};

                // Horizontal position
                if (_this27.isAligned('left')) {
                    _prop4.left = -_this27.outerWidth(true);
                    _prop4.right = '';
                } else if (_this27.isAligned('right')) {
                    _prop4.right = -_this27.outerWidth(true);
                    _prop4.left = '';
                }
                // Vertical position
                if (_this27.isAligned('bottom')) {
                    _prop4.bottom = -_this27.outerHeight(true);
                    _prop4.top = '';
                } else if (_this27.isAligned('top')) {
                    _prop4.top = -_this27.outerHeight(true);
                    _prop4.bottom = '';
                }
                _this27.css(_prop4);
            }
        });

        _this27.onOpen(function () {
            _this27.resizeContent();
            _this27.align(_this27.options.position);
        });

        _this27.onOpened(function () {
            // Close the panel when the user clicks outside of it
            Cuic.on('click', document, autoClose);
        });

        // Add element to collection
        Cuic.panels.add(_this27);
        return _this27;
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
            var available = this._calculateAvailableSpace();

            // Set panel max dimensions
            this.css({
                'max-height': available.height,
                'max-width': available.width
            });

            // Calculate content max height
            var maxHeight = available.height;

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

Cuic.onWindowResized(function () {
    Cuic.panels.each(function (panel) {
        panel.resizeContent();
    });
});

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
        var _this28 = _possibleConstructorReturn(this, (_class19.__proto__ || Object.getPrototypeOf(_class19)).call(this, 'div', { className: options.className }, options));

        _this28.content = new Cuic.Element('div', {
            className: 'popup-content',
            html: options.content
        }).appendTo(_this28);

        // Add tail
        _this28.tail = new Cuic.Element('span', {
            className: 'popup-tail'
        }).appendTo(_this28);

        // Add close button
        _this28.closeButton = new Cuic.Element('span', {
            className: _this28.options.closeButtonClass,
            html: _this28.options.closeButton,
            role: 'button'
        }).addClass('btn-close').appendTo(_this28);

        /**
         * Popup shortcuts
         * @type {{close: *}}
         */
        _this28.shortcuts = {
            close: new Cuic.Shortcut({
                element: _this28,
                keyCode: Cuic.keys.ESC,
                callback: function callback() {
                    _this28.close();
                }
            })
        };

        var autoClose = function autoClose(ev) {
            if (_this28.isOpened() && _this28.options.autoClose) {
                if (ev.target !== _this28.node() && !Cuic.element(ev.target).isChildOf(_this28)) {
                    _this28.close();
                }
            }
        };

        _this28.on('click', function (ev) {
            // Close button
            if (Cuic.element(ev.target).hasClass('btn-close')) {
                ev.preventDefault();
                _this28.close();
            }
        });

        // Reposition tail when popup position change
        _this28.onAnchored(function () {
            _this28.updateTail();
        });

        _this28.onClosed(function () {
            Cuic.off('click', document, autoClose);

            if (_this28.options.autoRemove) {
                _this28.remove();
            }
        });

        _this28.onOpen(function () {
            var targetParent = Cuic.node(_this28.options.target).parentNode;
            _this28.appendTo(targetParent);
            _this28.anchor(_this28.options.anchor, _this28.options.target);
        });

        _this28.onOpened(function () {
            // Close the popup when the user clicks outside of it
            Cuic.on('click', document, autoClose);
        });

        // Add element to collection
        Cuic.popups.add(_this28);
        return _this28;
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
        var _this29 = _possibleConstructorReturn(this, (_class20.__proto__ || Object.getPrototypeOf(_class20)).call(this, 'div', {
            className: options.className,
            html: options.content
        }, options));

        _this29.activeElement = null;
        _this29.index = 0;
        _this29.timer = null;

        // Display first element
        _this29.goTo(0);

        // Auto start timer
        if (_this29.options.autoStart) {
            _this29.start();
        }

        // Add element to collection
        Cuic.switchers.add(_this29);
        return _this29;
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
                for (var _i7 = 0; _i7 < children.length; _i7 += 1) {
                    var child = Cuic.element(children[_i7]);

                    if (this.index === _i7) {
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
            var _this30 = this;

            if (!this.isStarted()) {
                this.timer = setInterval(function () {
                    _this30.next();
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
        var _this31 = _possibleConstructorReturn(this, (_class21.__proto__ || Object.getPrototypeOf(_class21)).call(this, 'div', { className: options.className }, options));

        _this31.currentTarget = null;

        // Add content
        _this31.content = new Cuic.Element('div', {
            className: 'tooltip-content'
        }).appendTo(_this31);

        // Add tail
        _this31.tail = new Cuic.Element('span', {
            className: 'tooltip-tail'
        }).appendTo(_this31);

        // Find tooltip targets
        var targets = Cuic.find(_this31.options.selector);

        targets.each(function (target) {
            // Open tooltip when mouse enter area
            target.on('mouseenter', function (ev) {
                // Get stored tooltip content
                var content = target.data('tooltip');

                if (!content || !content.length) {
                    // Get tooltip content from attribute
                    content = target.attr(_this31.options.attribute);
                    // Avoid tooltip conflict
                    target.attr(_this31.options.attribute, '');
                    // Store tooltip content
                    target.data('tooltip', content);
                }

                // Update tooltip content
                if (content && content.length) {
                    _this31.content.html(content);
                }

                _this31.currentTarget = ev.currentTarget;

                // Position tooltip
                if (!_this31.options.followPointer) {
                    if (_this31.parentNode() !== ev.currentTarget.parentNode) {
                        _this31.appendTo(ev.currentTarget.parentNode);
                    }
                }
                _this31.open();
            });

            // Close tooltip when mouse leaves area
            target.on('mouseleave', function () {
                _this31.close();
            });
        });

        // Move tooltip when mouse moves and tooltip is opened
        Cuic.on('mousemove', document, function (ev) {
            if (_this31.options.followPointer && !_this31.isHidden()) {
                if (_this31.parentNode() !== document.body) {
                    _this31.appendTo(document.body);
                }
                _this31.anchor(_this31.options.anchor, [ev.pageX, ev.pageY]);
            }
        });

        var autoClose = function autoClose(ev) {
            if (_this31.isOpened() && _this31.options.autoClose) {
                if (ev.target !== _this31.node() && !Cuic.element(ev.target).isChildOf(_this31)) {
                    _this31.close();
                }
            }
        };

        // Reposition tail when tooltip position change
        _this31.onAnchored(function () {
            // Constraint tooltip in screen
            if (_this31.isAbsolute() || _this31.isFixed()) {
                _this31.alignInScreen();
            }
            _this31.updateTail();
        });

        _this31.onClosed(function () {
            Cuic.off('click', document, autoClose);

            if (_this31.options.autoRemove) {
                _this31.remove();
            }
        });

        _this31.onOpen(function () {
            if (!_this31.options.followPointer) {
                _this31.anchor(_this31.options.anchor, _this31.currentTarget);
            }
        });

        _this31.onOpened(function () {
            // Close the popup when the user clicks outside of it
            Cuic.on('click', document, autoClose);
            // Constraint tooltip in screen
            if (_this31.isAbsolute() || _this31.isFixed()) {
                _this31.alignInScreen();
            }
        });

        // Add element to collection
        Cuic.tooltips.add(_this31);
        return _this31;
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
