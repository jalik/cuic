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
         * Adds CSS class to the element
         * @param element
         * @param className
         * @return {Array|*}
         */
        addClass: function addClass(element, className) {
            element = this.getElement(element);

            var classes = this.getClasses(element);
            var target = (className || '').split(' ');

            for (var i = 0; i < target.length; i += 1) {
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
        addEventListener: function addEventListener(element, event, listener) {
            element = this.getElement(element);

            if (typeof element.addEventListener === 'function') {
                return element.addEventListener(event, listener);
            } else if (typeof element.attachEvent === 'function') {
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
        align: function align(element, position, parent) {
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
        anchor: function anchor(element, position, target) {
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
        apply: function apply(fn, context, args) {
            if (typeof fn === 'function') {
                return fn.apply(context, args);
            }
        },


        /**
         * Returns element border widths
         * @param element
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        border: function border(element) {
            var bottom = parseInt(this.getComputedStyle(element, 'border-bottom-width'));
            var left = parseInt(this.getComputedStyle(element, 'border-left-width'));
            var right = parseInt(this.getComputedStyle(element, 'border-right-width'));
            var top = parseInt(this.getComputedStyle(element, 'border-top-width'));
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
        calculateAlign: function calculateAlign(element, position, parent) {
            var _this = this;

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
            } else {
                // Use parent node if no parent defined
                parent = element.parentNode;
            }

            var elmHeight = this.outerHeight(element, true);
            var elmWidth = this.outerWidth(element, true);
            var elmMargin = this.margin(element);
            var parentHeight = this.innerHeight(parent);
            var parentWidth = this.innerWidth(parent);
            var parentPadding = this.padding(parent);
            var relativeLeft = parent.scrollLeft;
            var relativeTop = parent.scrollTop;
            var relativeBottom = -relativeTop; // todo maybe subtract element height ?
            var relativeRight = -relativeLeft; // todo maybe subtract element width ?
            var prop = {
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

            var getCenterX = function getCenterX() {
                return relativeLeft + (_this.width(parent) / 2 - elmWidth / 2);
            };

            var getCenterY = function getCenterY() {
                return relativeTop + (_this.height(parent) / 2 - elmHeight / 2);
            };

            // Limit element size to parent size
            if (elmWidth > parentWidth) {
                prop.width = parentWidth - (elmWidth - this.width(element));
            }
            if (elmHeight > parentHeight) {
                prop.height = parentHeight - (elmHeight - this.height(element));
            }

            // Vertical position
            if (position.indexOf('bottom') !== -1) {
                prop.bottom = Math.max(parentPadding.bottom, elmMargin.bottom);
            } else if (position.indexOf('top') !== -1) {
                prop.top = Math.max(parentPadding.top, elmMargin.top);
            } else {
                prop.top = getCenterY() + Math.max(parentPadding.top, elmMargin.top);
            }

            // Horizontal position
            if (position.indexOf('left') !== -1) {
                prop.left = Math.max(parentPadding.left, elmMargin.left);
            } else if (position.indexOf('right') !== -1) {
                prop.right = Math.max(parentPadding.right, elmMargin.right);
            } else {
                prop.left = getCenterX() + Math.max(parentPadding.left, elmMargin.left);
            }

            // Add pixel unit to numbers
            for (var attr in prop) {
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
        calculateAnchor: function calculateAnchor(element, position, target) {
            position = position || '';
            element = this.element(element);

            var targetHeight = 1;
            var targetWidth = 1;
            var targetOffset = { left: target[0], top: target[1] };

            if (!(target instanceof Array && target.length === 2)) {
                target = this.element(target);
                targetHeight = target.outerHeight();
                targetWidth = target.outerWidth();
                targetOffset = target.offset();
            }

            var objWidth = element.outerWidth(true);
            var objHeight = element.outerHeight(true);
            var objCenterX = parseInt(objWidth / 2);
            var objCenterY = parseInt(objHeight / 2);
            var targetCenterX = parseInt(targetWidth / 2);
            var targetCenterY = parseInt(targetHeight / 2);

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
                prop.top = targetOffset.top - objHeight;
            } else {
                prop.top = targetOffset.top + targetCenterY - objCenterY;
            }

            // Horizontal positioning
            if (position.indexOf('left') !== -1) {
                prop.left = targetOffset.left - objWidth;
            } else if (position.indexOf('right') !== -1) {
                prop.left = targetOffset.left + targetWidth;
            } else {
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
            for (var attr in prop) {
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
        calculateMaximize: function calculateMaximize(element) {
            element = this.getElement(element);
            var parent = element.parentNode;
            var ctnPadding = this.padding(parent);
            var elmMargin = this.margin(element);
            var prop = {
                bottom: '',
                height: this.height(parent) - elmMargin.vertical + 'px',
                left: '',
                right: '',
                top: '',
                width: this.width(parent) - elmMargin.horizontal + 'px'
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
        calculateMinimize: function calculateMinimize(element, position) {
            element = this.getElement(element);
            position = position || '';

            // Create a clone with minimal size
            var clone = element.cloneNode(true);
            this.css(clone, { height: 'auto', width: 'auto' });

            // Calculate minimized size
            var prop = this.calculateAlign(clone, position, element.parentNode);
            prop.height = this.outerHeight(clone) + 'px';
            prop.width = this.outerWidth(clone) + 'px';
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
         * Returns the closest parent element matching the selector
         * @param element
         * @param selector
         * @return {*}
         */
        closest: function closest(element, selector) {
            element = this.getElement(element);
            return element.closest(selector);
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
         * Applies the styles to the target.
         * Styles can be a string or an object.
         * @param element
         * @param styles
         * @return {*}
         */
        css: function css(element, styles) {
            element = this.getElement(element);

            // Writing styles
            if (styles) {
                if ((typeof styles === 'undefined' ? 'undefined' : _typeof(styles)) === 'object') {
                    var mergedStyles = '';

                    // Add pixel unit where needed
                    this.autoPixel(styles);

                    // Get current styles
                    for (var i = 0; i < element.style.length; i += 1) {
                        var property = element.style[i];

                        // Ignore properties that are overwritten
                        if (!(property in styles)) {
                            var value = element.style[property];
                            if (typeof value === 'string' && value === '') {
                                value = '""';
                            }
                            mergedStyles += property + ': ' + value + ';';
                        }
                    }
                    // Add new styles
                    for (var style in styles) {
                        if (styles.hasOwnProperty(style)) {
                            var _value = styles[style];

                            // Check if style is supported
                            if (!(style in element.style)) {
                                console.warn('Style "' + style + '" is not supported by element.', element);
                            }
                            if (typeof _value === 'string' && _value === '') {
                                _value = '""';
                            }
                            mergedStyles += style + ': ' + _value + ';';
                        }
                    }
                    element.style = mergedStyles;
                } else if (typeof styles === 'string') {
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
        debug: function debug() {
            if (this.DEBUG && console !== undefined) {
                console.log.apply(this, Array.prototype.slice.call(arguments));
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
            if (_element instanceof HTMLElement) {
                return new this.Element(_element);
            }
            if (_element instanceof jQuery) {
                return new this.Element(_element.get(0));
            }
            if (typeof _element === 'string') {
                return new this.Element(document.querySelector(_element));
            }
            return _element;
        },


        /**
         * Enters full screen
         * @param element
         */
        enterFullScreen: function enterFullScreen(element) {
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
         * Returns CSS classes
         * @param element
         * @return {Array}
         */
        getClasses: function getClasses(element) {
            element = this.getElement(element);
            return element.className.split(' ');
        },


        /**
         * Returns the computed style of the element
         * @param element
         * @param style
         * @return {*}
         */
        getComputedStyle: function getComputedStyle(element, style) {
            element = this.getElement(element);
            return window.getComputedStyle(element, null).getPropertyValue(style);
        },


        /**
         * Returns the HTML element from various objects (Cuic, jQuery...)
         * @param element
         * @return {*|HTMLElement|HTMLDocument}
         */
        getElement: function getElement(element) {
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
            throw new TypeError('element is not supported (HTMLElement, Cuic.Element or jQuery)');
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
         * Checks if the element has the CSS class
         * @param element
         * @param className
         * @return {boolean}
         */
        hasClass: function hasClass(element, className) {
            element = this.getElement(element);
            var classes = this.getClasses(element);
            var classNames = (className || '').split(' ');
            var result = classNames.length > 0;

            for (var i = 0; i < classNames.length; i += 1) {
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
        height: function height(element) {
            element = this.getElement(element);
            var padding = this.padding(element);
            return element.clientHeight - padding.vertical;
        },


        /**
         * Returns the element width including padding
         * @param element
         * @return {number}
         */
        innerHeight: function innerHeight(element) {
            element = this.getElement(element);
            // todo subtract vertical scrollbar width
            return element.clientHeight;
        },


        /**
         * Returns the element width including padding
         * @param element
         * @return {number}
         */
        innerWidth: function innerWidth(element) {
            element = this.getElement(element);
            // todo subtract horizontal scrollbar width
            return element.clientWidth;
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
         * Checks if the element is a parent node
         * @param parent
         * @param element
         * @return {boolean}
         */
        isParent: function isParent(parent, element) {
            parent = this.getElement(parent);
            element = this.getElement(element);
            var elm = element;

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
        isPosition: function isPosition(position, element) {
            element = this.getElement(element);
            var style = element.style;

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
        isSafari: function isSafari() {
            return (/constructor/i.test(window.HTMLElement) || function (p) {
                    return p.toString() === "[object SafariRemoteNotification]";
                }(!window['safari'] || safari.pushNotification)
            );
        },


        /**
         * Returns the element margins
         * @param element
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        margin: function margin(element) {
            var bottom = parseInt(this.getComputedStyle(element, 'margin-bottom'));
            var left = parseInt(this.getComputedStyle(element, 'margin-left'));
            var right = parseInt(this.getComputedStyle(element, 'margin-right'));
            var top = parseInt(this.getComputedStyle(element, 'margin-top'));
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
        maximize: function maximize(element) {
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
        minimize: function minimize(element, position) {
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
        namespace: function namespace(ns) {
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
        off: function off(event, element, callback) {
            element = this.getElement(element);
            var browserEvent = this.whichEvent(event);

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
            // Check if event is supported
            if (!browserEvent) {
                console.warn('Event "' + event + '" is not supported by this browser.');
            }
            return this.removeEventListener(element, browserEvent, callback);
        },


        /**
         * Returns the element offset
         * @param element
         * @return {{left: Number, top: Number}}
         */
        offset: function offset(element) {
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
        on: function on(event, element, callback) {
            element = this.getElement(element);
            var browserEvent = this.whichEvent(event);

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
            // Check if event is supported
            if (!browserEvent) {
                console.warn('Event "' + event + '" is not supported by this browser.');
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
            element = this.getElement(element);
            var browserEvent = this.whichEvent(event);

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
            // Check if event is supported
            if (!browserEvent) {
                console.warn('Event "' + event + '" is not supported by this browser.');
            }
            var listener = function listener(ev) {
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
        outerHeight: function outerHeight(element, includeMargin) {
            element = this.getElement(element);
            var margin = this.margin(element);
            return element.offsetHeight + (includeMargin ? margin.vertical : 0);
        },


        /**
         * Returns the element width including padding, border and margin
         * @param element
         * @param includeMargin
         * @return {number}
         */
        outerWidth: function outerWidth(element, includeMargin) {
            element = this.getElement(element);
            var margin = this.margin(element);
            return element.offsetWidth + (includeMargin ? margin.horizontal : 0);
        },


        /**
         * Returns the element padding
         * @param element
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        padding: function padding(element) {
            var bottom = parseInt(this.getComputedStyle(element, 'padding-bottom'));
            var left = parseInt(this.getComputedStyle(element, 'padding-left'));
            var right = parseInt(this.getComputedStyle(element, 'padding-right'));
            var top = parseInt(this.getComputedStyle(element, 'padding-top'));
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
        position: function position(element) {
            var bottom = parseInt(this.getComputedStyle(element, 'bottom'));
            var left = parseInt(this.getComputedStyle(element, 'left'));
            var right = parseInt(this.getComputedStyle(element, 'right'));
            var top = parseInt(this.getComputedStyle(element, 'top'));
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
        prefixStyle: function prefixStyle(style) {
            var prefix = this.getStylePrefix();
            return typeof prefix === 'string' && prefix.length ? prefix + style : style;
        },


        /**
         * Removes CSS class from the element
         * @param element
         * @param className
         * @return {*|Array}
         */
        removeClass: function removeClass(element, className) {
            element = this.getElement(element);
            var classes = this.getClasses(element);
            var classNames = (className || '').split(' ');

            for (var i = 0; i < classNames.length; i += 1) {
                var index = classes.indexOf(classNames[i]);

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
        removeEventListener: function removeEventListener(element, event, listener) {
            element = this.getElement(element);

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
        },


        /**
         * Returns the element width
         * @param element
         * @return {number}
         */
        width: function width(element) {
            element = this.getElement(element);
            var padding = this.padding(element);
            return element.clientWidth - padding.horizontal;
        }
    };

    if (window) {
        window.Cuic = Cuic;
    }

    $(document).ready(function () {
        // Save mouse position on move
        Cuic.on('mousemove', document, function (ev) {
            Cuic.mouseX = ev.clientX;
            Cuic.mouseY = ev.clientY;
        });

        // Make root nodes fit screen,
        // that allow dialogs and other floating elements
        // to be positioned on all the screen.
        $('html,body').css({ height: '100%', minHeight: '100%' });
    });
})(jQuery, window);

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
 * Benchmark tool to monitor code execution time
 */
Cuic.Benchmark = function () {
    function _class() {
        _classCallCheck(this, _class);

        var self = this;
        var startTime = null;
        var stopTime = null;
        var time = 0;

        /**
         * Returns benchmark time
         * @returns {number}
         */
        self.getTime = function () {
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
        self.isStarted = function () {
            return typeof startTime === 'number';
        };

        /**
         * Resets the benchmark
         */
        self.reset = function () {
            time = 0;
            startTime = null;
            stopTime = null;
        };

        /**
         * Starts the benchmark
         * @returns {*}
         */
        self.start = function () {
            startTime = Date.now();
            stopTime = null;
        };

        /**
         * Stops the benchmark
         * @returns {*}
         */
        self.stop = function () {
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
            this.onAdded(value);
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
         * Called when a value is added
         * @param value
         */

    }, {
        key: 'onAdded',
        value: function onAdded(value) {}

        /**
         * Called when a value is removed
         * @param value
         */

    }, {
        key: 'onRemoved',
        value: function onRemoved(value) {}

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
                this.onRemoved(value);
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

(function ($) {
    'use strict';

    var inputTypes = ['' + 'checkbox', 'color', 'date', 'datetime', 'email', 'hidden', 'month', 'number', 'password', 'radio', 'range', 'search', 'tel', 'text', 'time', 'url', 'week'];

    /**
     * Checks all form fields
     * @param form
     * @param options
     * @return {boolean}
     */
    Cuic.checkForm = function (form, options) {
        form = $(form);

        // Default options
        options = Cuic.extend(true, {
            errorClass: 'error',
            filter: null,
            onError: null
        }, options);

        var errors = 0;

        // Removes all errors
        form.find('.' + options.errorClass).removeClass(options.errorClass);

        function errorFound(field) {
            if (typeof options.onError === 'function') {
                field = $(field);
                field.addClass(options.errorClass);
                options.onError.call(field, field.attr('name'), field.val());
                errors += 1;
            }
        }

        // Removes all errors
        form.find('.' + options.errorClass).removeClass(options.errorClass);

        // Get enabled elements
        form.find('[name]').not(':disabled').each(function () {
            var value = this.value;

            if (!Cuic.isField(this)) {
                return;
            }
            if (!Cuic.isNodeFiltered(this, options.filter)) {
                return;
            }

            // Checks if required
            if (this.required && value !== undefined && value !== null) {
                errorFound(this);
            } else {
                // Test pattern
                if (this.pattern && !new RegExp(this.pattern).test(value)) {
                    errorFound(this);
                }
            }
        });
        return errors === 0;
    };

    /**
     * Returns the form fields
     * @param container
     * @param options
     * @returns {Object}
     */
    Cuic.getFields = function (container, options) {
        var fields = {};
        container = $(container);

        options = Cuic.extend(true, {
            dynamicTyping: true,
            filter: null,
            ignoreButtons: true,
            ignoreEmpty: false,
            ignoreUnchecked: false,
            smartTyping: true
        }, options);

        container.find('[name]').not(':disabled').each(function () {
            var field = this;
            var name = field.name;
            var type = field.type;
            var isButton = ['button', 'reset', 'submit'].indexOf(type) !== -1;
            var isCheckbox = ['checkbox', 'radio'].indexOf(type) !== -1;

            // Check if node is a form field
            if (!Cuic.isField(field)) {
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
                    $(field).find('option').each(function () {
                        var option = this;

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
    Cuic.isField = function (node) {
        var nodeName = node.nodeName.toUpperCase();
        return nodeName === 'TEXTAREA' || nodeName === 'SELECT' || nodeName === 'INPUT' && inputTypes.indexOf(node.type) !== -1;
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
     * Returns the value as a boolean
     * @param val
     * @return {null|boolean}
     */
    Cuic.parseBoolean = function (val) {
        if (/^true$/i.test(val)) {
            return true;
        }
        if (/^false$/i.test(val)) {
            return false;
        }
        return null;
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

Cuic.Shortcut = function () {
    function _class3(options) {
        _classCallCheck(this, _class3);

        var self = this;

        // Set default options
        options = Cuic.extend({}, Cuic.Shortcut.prototype.options, options);
        self.options = options;

        // Get the element
        self.options.element = Cuic.getElement(options.element);

        // Check options
        if (typeof self.options.callback !== 'function') {
            throw new TypeError('Shortcut.options.callback is not a function.');
        }

        // Init options
        if (self.options.active) {
            self.activate();
        }
    }

    /**
     * Activates the shortcut
     */


    _createClass(_class3, [{
        key: 'activate',
        value: function activate() {
            var self = this;
            var options = this.options;
            var element = this.getElement();
            Cuic.on('keydown', element, function (ev) {
                if ((options.keyCode === ev.keyCode || options.key === ev.key || options.key === ev.code) && options.altKey === ev.altKey && options.ctrlKey === ev.ctrlKey && options.shiftKey === ev.shiftKey) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    options.callback.call(self, element, ev);
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
            Cuic.off('keydown', this.getElement(), this.options.callback);
        }

        /**
         * Returns the element
         * @return {HTMLElement}
         */

    }, {
        key: 'getElement',
        value: function getElement() {
            return Cuic.getElement(this.options.element);
        }
    }]);

    return _class3;
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
    function _class4(node, attributes, options) {
        _classCallCheck(this, _class4);

        var self = this;

        // Set default attributes
        attributes = Cuic.extend({}, attributes, options);

        // Set default options
        self.options = Cuic.extend({}, Cuic.Element.prototype.options, options);

        // Use existing element
        if (self.options.element) {
            self.element = Cuic.getElement(self.options.element);
        }
        // Create element
        else if (typeof node === 'string') {
                self.element = document.createElement(node);
            }
            // Use HTML element
            else if (node instanceof HTMLElement) {
                    self.element = node;
                }
                // Use Cuic element
                else if (node instanceof Cuic.Element) {
                        self.element = node.getElement();
                    }
                    // Use jQuery element
                    else if (node instanceof jQuery) {
                            self.element = node.get(0);
                        } else {
                            throw new TypeError('Cannot create element.');
                        }

        // Get parent element
        if (self.options.parent) {
            self.options.parent = Cuic.getElement(self.options.parent);
        }

        // Set element attributes
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                var value = attributes[attr];

                // Do not override existing classes
                if (attr === 'className') {
                    self.addClass(value);
                    continue;
                }

                if (value !== null && value !== undefined) {
                    if (self.element[attr] !== undefined) {
                        self.element[attr] = value;
                    } else if (attr === 'html') {
                        self.element.innerHTML = value;
                    } else if (attr === 'text') {
                        self.element.innerText = value;
                    } else if (attr === 'zIndex') {
                        self.css({ 'z-index': parseInt(value) });
                    }
                }
            }
        }

        // Set element styles
        if (attributes.css) {
            self.css(attributes.css);
        }

        // Add debug class
        if (self.options.debug) {
            self.addClass('debug');
        }

        // Element is not in the DOM
        if (!self.element.parentNode) {
            // Put element in parent node
            if (self.options.parent instanceof HTMLElement) {
                self.appendTo(self.options.parent);

                // Position the element
                if (self.options.position) {
                    self.align(self.options.position);
                }
            }
        }
    }

    /**
     * Adds the class
     * @param className
     * @return {Cuic.Element}
     */


    _createClass(_class4, [{
        key: 'addClass',
        value: function addClass(className) {
            Cuic.addClass(this.getElement(), className);
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
            Cuic.align(this.getElement(), position);
            this.options.position = position;
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
            target = target || this.options.target;
            Cuic.anchor(this.getElement(), position, target);
            this.options.anchor = position;
            this.options.target = target;
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
            this.getElement().append(Cuic.getElement(element));
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
            Cuic.getElement(element).append(this.getElement());
            return this;
        }

        /**
         * Sets or returns the element attribute
         * @param name
         * @param value
         * @return {*}
         */

    }, {
        key: 'attr',
        value: function attr(name, value) {
            if (value !== undefined) {
                if (name in this.getElement()) {
                    this.getElement()[name] = value;
                }
            } else {
                return this.getElement()[name];
            }
        }

        /**
         * Returns element border widths
         * @return {*|{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */

    }, {
        key: 'border',
        value: function border() {
            return Cuic.border(this);
        }

        /**
         * Returns element child nodes
         * @return {Array}
         */

    }, {
        key: 'children',
        value: function children() {
            var children = [];
            var nodes = this.getElement().children || this.getElement().childNodes;

            for (var i = 0; i < nodes.length; i += 1) {
                if (nodes[i] instanceof HTMLElement) {
                    children.push(nodes[i]);
                }
            }
            return children;
        }

        /**
         * Set styles
         * @param styles
         * @return {*}
         */

    }, {
        key: 'css',
        value: function css(styles) {
            return Cuic.css(this.getElement(), styles);
        }

        /**
         * Disables the element
         * @return {Cuic.Element}
         */

    }, {
        key: 'disable',
        value: function disable() {
            this.getElement().disabled = true;
            this.addClass('disabled');
            return this;
        }

        /**
         * Enables the element
         * @return {Cuic.Element}
         */

    }, {
        key: 'enable',
        value: function enable() {
            this.getElement().disabled = false;
            this.removeClass('disabled');
            return this;
        }

        /**
         * Returns the first element that matches the selector
         * @param selector
         * @return {*}
         */

    }, {
        key: 'find',
        value: function find(selector) {
            return Cuic.element(this.getElement().querySelector(selector));
        }

        /**
         * Returns all elements that match the selector
         * @param selector
         * @return {*}
         */

    }, {
        key: 'findAll',
        value: function findAll(selector) {
            return this.getElement().querySelectorAll(selector);
        }

        /**
         * Returns element CSS classes
         * @return {Array}
         */

    }, {
        key: 'getClasses',
        value: function getClasses() {
            return Cuic.getClasses(this.getElement());
        }

        /**
         * Returns the HTML element
         * @return {HTMLElement}
         */

    }, {
        key: 'getElement',
        value: function getElement() {
            return this.element;
        }

        /**
         * Returns the parent of the element
         * @return {HTMLElement}
         */

    }, {
        key: 'getParentElement',
        value: function getParentElement() {
            return this.getElement().parentNode;
        }

        /**
         * Checks if the element has the class
         * @param className
         * @return {boolean}
         */

    }, {
        key: 'hasClass',
        value: function hasClass(className) {
            return Cuic.hasClass(this.getElement(), className);
        }

        /**
         * Returns the element height without margins and borders
         * @return {number}
         */

    }, {
        key: 'height',
        value: function height() {
            return Cuic.height(this);
        }

        /**
         * Hides the element
         * @return {Cuic.Element}
         */

    }, {
        key: 'hide',
        value: function hide() {
            this.css({ display: 'none' });
            return this;
        }

        /**
         * Sets HTML content
         * @param html
         * @return {Cuic.Element|string}
         */

    }, {
        key: 'html',
        value: function html(_html) {
            if (_html) {
                this.getElement().innerHTML = _html;
                return this;
            } else {
                return this.getElement().innerHTML;
            }
        }

        /**
         * Returns the element height including padding
         * @return {number}
         */

    }, {
        key: 'innerHeight',
        value: function innerHeight() {
            return Cuic.innerHeight(this);
        }

        /**
         * Returns the element width including padding
         * @return {number}
         */

    }, {
        key: 'innerWidth',
        value: function innerWidth() {
            return Cuic.innerWidth(this);
        }

        /**
         * Inserts an element after
         * @param element
         * @return {Cuic.Element}
         */

    }, {
        key: 'insertAfter',
        value: function insertAfter(element) {
            element = Cuic.getElement(element);
            var parent = this.getElement().parentNode;
            parent.insertBefore(element, this.getElement().nextSibling);
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
            element = Cuic.getElement(element);
            var parent = this.getElement().parentNode;
            parent.insertBefore(element, this.getElement());
            return this;
        }

        /**
         * Checks if the element is enabled
         * @return {boolean}
         */

    }, {
        key: 'isEnabled',
        value: function isEnabled() {
            return this.getElement().disabled !== true || !this.hasClass('disabled');
        }

        /**
         * Checks if the element is removed from the DOM
         * @return {boolean}
         */

    }, {
        key: 'isRemoved',
        value: function isRemoved() {
            var parent = this.getElement().parentNode;
            return parent === null || parent === undefined;
        }

        /**
         * Returns element margin
         * @return {*|{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */

    }, {
        key: 'margin',
        value: function margin() {
            return Cuic.margin(this);
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
            Cuic.off(event, this.getElement(), callback);
            return this;
        }

        /**
         * Returns the element offset
         * @return {*|{left: Number, top: Number}}
         */

    }, {
        key: 'offset',
        value: function offset() {
            return Cuic.offset(this.getElement());
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
            Cuic.on(event, this.getElement(), callback);
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
            Cuic.once(event, this.getElement(), callback);
            return this;
        }

        /**
         * Called when the element is removed from the DOM
         */

    }, {
        key: 'onRemove',
        value: function onRemove() {}

        /**
         * Returns the element height including padding, borders and eventually margin
         * @param includeMargin
         * @return {number}
         */

    }, {
        key: 'outerHeight',
        value: function outerHeight(includeMargin) {
            return Cuic.outerHeight(this, includeMargin);
        }

        /**
         * Returns the element width including padding, borders and eventually margin
         * @param includeMargin
         * @return {number}
         */

    }, {
        key: 'outerWidth',
        value: function outerWidth(includeMargin) {
            return Cuic.outerWidth(this, includeMargin);
        }

        /**
         * Returns element padding
         * @return {*|{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */

    }, {
        key: 'padding',
        value: function padding() {
            return Cuic.padding(this);
        }

        /**
         * Returns the parent element
         * @return {*|Cuic.Element}
         */

    }, {
        key: 'parent',
        value: function parent() {
            var parent = this.getElement().parentNode;
            return parent ? Cuic.element(parent) : parent;
        }

        /**
         * Returns the element position
         * @return {*|{bottom: Number, left: Number, right: Number, top: Number}}
         */

    }, {
        key: 'position',
        value: function position() {
            return Cuic.position(this.getElement());
        }

        /**
         * Prepends the element
         * @param element
         * @return {Cuic.Element}
         */

    }, {
        key: 'prepend',
        value: function prepend(element) {
            this.getElement().prepend(Cuic.getElement(element));
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
            Cuic.getElement(element).prepend(this.getElement());
            return this;
        }

        /**
         * Removes the element from the DOM
         * @return {Cuic.Element}
         */

    }, {
        key: 'remove',
        value: function remove() {
            this.onRemove();
            this.getElement().remove();
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
            Cuic.removeClass(this.getElement(), className);
            return this;
        }

        /**
         * Sets the content
         * @param html
         * @deprecated
         * @return {Cuic.Element}
         */

    }, {
        key: 'setContent',
        value: function setContent(html) {
            this.setHtml(html);
            return this;
        }
    }, {
        key: 'setHtml',


        /**
         * Sets content HTML
         * @param html
         * @return {Cuic.Element}
         */
        value: function setHtml(html) {
            this.getElement().innerHTML = html;
            return this;
        }

        /**
         * Sets content text
         * @param text
         * @return {Cuic.Element}
         */

    }, {
        key: 'setText',
        value: function setText(text) {
            this.getElement().innerText = text;
            return this;
        }

        /**
         * Shows the element
         * @return {Cuic.Element}
         */

    }, {
        key: 'show',
        value: function show() {
            this.css({ display: '' });
            return this;
        }

        /**
         * Returns or sets element value
         * @param value
         * @return {Cuic.Element|*}
         */

    }, {
        key: 'val',
        value: function val(value) {
            if (value !== undefined) {
                this.getElement().value = value;
                return this;
            } else {
                return this.getElement().value;
            }
        }

        /**
         * Returns the element width
         * @return {number}
         */

    }, {
        key: 'width',
        value: function width() {
            return Cuic.width(this);
        }
    }]);

    return _class4;
}();

Cuic.Element.prototype.options = {
    className: null,
    css: null,
    namespace: 'cuic',
    parent: null,
    position: null
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

/**
 * Generic component
 */
Cuic.Component = function (_Cuic$Element) {
    _inherits(_class5, _Cuic$Element);

    function _class5(node, attributes, options) {
        _classCallCheck(this, _class5);

        // Set default options
        options = Cuic.extend({}, Cuic.Component.prototype.options, options);

        var _this2 = _possibleConstructorReturn(this, (_class5.__proto__ || Object.getPrototypeOf(_class5)).call(this, node, attributes, options));

        var self = _this2;

        // Add component classes
        self.addClass('component');
        return _this2;
    }

    /**
     * Closes the component
     * @param callback
     * @return {Cuic.Component}
     */


    _createClass(_class5, [{
        key: 'close',
        value: function close(callback) {
            var _this3 = this;

            this.onClose();
            this.removeClass('opened');
            this.addClass('closed');
            this.once('transitionend', function (ev) {
                _this3.onClosed(ev);
                _this3.css({ display: 'none' });

                if (typeof callback === 'function') {
                    callback.call(_this3, ev);
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
         * Maximizes the component in its container
         * @param callback
         */

    }, {
        key: 'maximize',
        value: function maximize(callback) {
            var _this4 = this;

            this.onMaximize();
            this.removeClass('minimized');
            this.addClass('maximized');
            Cuic.maximize(this.getElement());
            this.once('transitionend', function (ev) {
                _this4.onMaximized(ev);

                if (typeof callback === 'function') {
                    callback.call(_this4, ev);
                }
            });
        }

        /**
         * Minimizes the component in its container
         * @param callback
         */

    }, {
        key: 'minimize',
        value: function minimize(callback) {
            var _this5 = this;

            this.onMinimize();
            this.removeClass('maximized');
            this.addClass('minimized');
            Cuic.minimize(this.getElement(), this.options.position);
            this.once('transitionend', function (ev) {
                _this5.onMinimized(ev);

                if (typeof callback === 'function') {
                    callback.call(_this5, ev);
                }
            });
        }

        /**
         * Called when the component is closing
         */

    }, {
        key: 'onClose',
        value: function onClose() {}

        /**
         * Called when the component is closed
         */

    }, {
        key: 'onClosed',
        value: function onClosed() {}

        /**
         * Called when the component is maximizing
         */

    }, {
        key: 'onMaximize',
        value: function onMaximize() {}

        /**
         * Called when the component is maximized
         */

    }, {
        key: 'onMaximized',
        value: function onMaximized() {}

        /**
         * Called when the component is minimizing
         */

    }, {
        key: 'onMinimize',
        value: function onMinimize() {}

        /**
         * Called when the component is minimized
         */

    }, {
        key: 'onMinimized',
        value: function onMinimized() {}

        /**
         * Called when the component is opened
         */

    }, {
        key: 'onOpen',
        value: function onOpen() {}

        /**
         * Called when the component is opened
         */

    }, {
        key: 'onOpened',
        value: function onOpened() {}

        /**
         * Opens the component
         * @param callback
         * @return {Cuic.Component}
         */

    }, {
        key: 'open',
        value: function open(callback) {
            var _this6 = this;

            this.css({ display: '' });
            this.onOpen();
            this.removeClass('closed');
            this.addClass('opened');
            this.once('transitionend', function (ev) {
                _this6.onOpened(ev);

                if (typeof callback === 'function') {
                    callback.call(_this6, ev);
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

    return _class5;
}(Cuic.Element);

Cuic.Component.prototype.options = {
    className: null,
    css: null,
    parent: null,
    position: null
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

Cuic.GroupComponent = function (_Cuic$Component) {
    _inherits(_class6, _Cuic$Component);

    function _class6(node, attributes, options) {
        _classCallCheck(this, _class6);

        // Set default options
        options = Cuic.extend({}, Cuic.GroupComponent.prototype.options, options);

        // Create element

        var _this7 = _possibleConstructorReturn(this, (_class6.__proto__ || Object.getPrototypeOf(_class6)).call(this, node, Cuic.extend({
            className: options.className,
            role: 'group'
        }, attributes), options));

        var self = _this7;

        // Add component classes
        self.addClass('component-group');

        // Prepare components collection
        _this7.components = new Cuic.Collection();

        _this7.components.onAdded = function (component) {
            _this7.onComponentAdded(component);
        };
        _this7.components.onRemoved = function (component) {
            _this7.onComponentRemoved(component);
        };
        return _this7;
    }

    /**
     * Add the component to the group
     * @param component
     * @return {Cuic.Component}
     */


    _createClass(_class6, [{
        key: 'add',
        value: function add(component) {
            if (!(component instanceof Cuic.Component)) {
                throw new TypeError('Cannot add non component to a GroupComponent.');
            }
            if (Cuic.isPosition('top', this.getElement())) {
                component.prependTo(this);
            } else {
                component.appendTo(this);
            }
            this.components.add(component);
            return component;
        }

        /**
         * Called when component is added
         * @param component
         */

    }, {
        key: 'onComponentAdded',
        value: function onComponentAdded(component) {}

        /**
         * Called when component is removed
         * @param component
         */

    }, {
        key: 'onComponentRemoved',
        value: function onComponentRemoved(component) {}

        /**
         * Removes the component from the group
         * @param component
         * @return {Cuic.Component}
         */

    }, {
        key: 'remove',
        value: function remove(component) {
            this.components.remove(component);
            return component;
        }
    }]);

    return _class6;
}(Cuic.Component);

Cuic.GroupComponent.prototype.options = {
    className: 'group'
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

Cuic.Hook = function (_Cuic$Component2) {
    _inherits(_class7, _Cuic$Component2);

    function _class7(options) {
        _classCallCheck(this, _class7);

        // Set default options
        options = Cuic.extend({}, Cuic.Hook.prototype.options, options);

        // Create element

        var _this8 = _possibleConstructorReturn(this, (_class7.__proto__ || Object.getPrototypeOf(_class7)).call(this, 'div', { className: options.className }, options));

        var self = _this8;

        // Add component classes
        self.addClass('hook');

        // This is a fix to avoid offsetTop > 0
        self.css({
            position: 'relative',
            top: '',
            width: ''
        });

        // Create the spacer item that will replace
        // the bar when it is scrolled
        self.space = new Cuic.Element('div', {
            className: 'hook-space'
        });

        // Get the element's offset
        var offset = self.offset();

        var onScroll = function onScroll() {
            var fitsInScreen = self.outerHeight(true) <= window.screen.availHeight;

            if (fitsInScreen) {
                if (self.options.fixed) {
                    self.hook();
                } else {
                    var margin = self.margin();

                    if (window.scrollY > offset.top - margin.top) {
                        self.hook();
                    } else {
                        self.unhook();
                    }
                }
            } else {
                self.unhook();
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
        return _this8;
    }

    /**
     * Hooks the element
     */


    _createClass(_class7, [{
        key: 'hook',
        value: function hook() {
            var self = this;
            console.log('hook');

            if (self.css('position') !== 'fixed') {
                var offset = self.offset();
                var margin = self.margin();

                if (self.options.fixed) {
                    self.options.offsetTop = offset.top;
                }

                // Replace element with invisible space
                self.space.css({
                    display: self.css('display'),
                    float: self.css('float'),
                    height: self.outerHeight() + 'px',
                    width: self.outerWidth() + 'px',
                    'margin-bottom': margin.bottom + 'px',
                    'margin-left': margin.left + 'px',
                    'margin-right': margin.right + 'px',
                    'margin-top': margin.top + 'px'
                });
                self.insertBefore(self.space);
                self.space.show();

                // Make element scroll
                self.css({
                    position: 'fixed',
                    left: offset.left + 'px',
                    top: self.options.offsetTop + 'px',
                    height: self.space.height() + 'px',
                    width: self.space.width() + 'px',
                    zIndex: self.options.zIndex
                });
                self.addClass('hooked');

                // Execute the hooked listener
                self.onHook(self);
            }
            // else if (self.space) {
            //     const offset = self.space.offset();
            //     self.css({
            //         left: offset.left,
            //         width: self.space.width()
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
            var self = this;
            console.log('unhook');

            if (self.css('position') !== 'relative') {
                self.space.hide();
                self.css({
                    position: 'relative',
                    bottom: '',
                    left: '',
                    right: '',
                    top: '',
                    width: ''
                });
                self.removeClass('hooked');

                // Execute the unhooked listener
                self.onUnhook(self);
            }
        }
    }]);

    return _class7;
}(Cuic.Component);

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

Cuic.Movable = function (_Cuic$Component3) {
    _inherits(_class8, _Cuic$Component3);

    function _class8(options) {
        _classCallCheck(this, _class8);

        // Set default options
        options = Cuic.extend({}, Cuic.Movable.prototype.options, options);

        // Create element

        var _this9 = _possibleConstructorReturn(this, (_class8.__proto__ || Object.getPrototypeOf(_class8)).call(this, 'div', { className: options.className }, options));

        var self = _this9;

        // Add component class
        self.addClass('movable');

        // Force the target to be the relative parent
        if (self.css('position') === 'static') {
            self.css({ position: 'relative' });
        }

        // Set the dragging area
        _this9.setDragHandle(options.handle || self.getElement());
        return _this9;
    }

    /**
     * Called when dragging
     */


    _createClass(_class8, [{
        key: 'onMove',
        value: function onMove() {}

        /**
         * Called when drag start
         */

    }, {
        key: 'onMoveStart',
        value: function onMoveStart() {}

        /**
         * Called when drag stop
         */

    }, {
        key: 'onMoveStop',
        value: function onMoveStop() {}

        /**
         * Sets the dragging area
         * @param handle
         * @return {Cuic.Component}
         */

    }, {
        key: 'setDragHandle',
        value: function setDragHandle(handle) {
            var self = this;

            // Add the movable classes
            Cuic.addClass(handle, 'movable-handle');

            // Start dragging
            Cuic.on('mousedown', handle, function (ev) {
                // Ignore dragging if the target is not the root
                if (self.options.rootOnly && ev.target !== ev.currentTarget) return;

                // Execute callback
                if (self.onMoveStart(ev) === false) return;

                // Prevent text selection
                ev.preventDefault();

                // Add moving class
                self.addClass('moving');

                var parent = self.parent();
                var startOffset = self.position();
                var startX = ev.clientX;
                var startY = ev.clientY;

                var onMouseMove = function onMouseMove(ev) {
                    var margin = self.margin();
                    var height = self.outerHeight();
                    var width = self.outerWidth();
                    var parentPadding = parent.padding();
                    var parentHeight = parent.innerHeight();
                    var parentWidth = parent.innerWidth();
                    var prop = {};

                    // Calculate minimal values
                    var minX = 0;
                    var minY = 0;

                    // Calculate maximal values
                    var maxX = parentWidth - parentPadding.horizontal;
                    var maxY = parentHeight - parentPadding.vertical;

                    if (self.css('position') === 'relative') {
                        maxX -= margin.horizontal;
                        maxY -= margin.vertical;
                    }

                    var diffX = ev.clientX - startX;
                    var diffY = ev.clientY - startY;
                    var left = startOffset.left + diffX;
                    var top = startOffset.top + diffY;

                    // Check horizontal location
                    if (left < minX) {
                        left = minX;
                    } else if (left + width > maxX) {
                        left = maxX - width;
                    }

                    // Check vertical location
                    if (top < minY) {
                        top = minY;
                    } else if (top + height > maxY) {
                        top = maxY - height;
                    }

                    // Execute callback
                    if (self.onMove(ev, { x: left, y: top }) === false) {
                        return;
                    }

                    // Move horizontally
                    if (self.options.horizontal) {
                        prop.left = left;
                        prop.right = '';
                    }
                    // Move vertically
                    if (self.options.vertical) {
                        prop.top = top;
                        prop.bottom = '';
                    }
                    // Move element
                    self.css(prop);
                };

                // Moving
                Cuic.on('mousemove', document, onMouseMove);

                // Stop moving
                Cuic.once('mouseup', document, function (ev) {
                    Cuic.off('mousemove', document, onMouseMove);
                    self.removeClass('moving');
                    self.onMoveStop(ev);
                });
            });
            return self;
        }
    }]);

    return _class8;
}(Cuic.Component);

Cuic.Movable.prototype.options = {
    className: 'movable',
    fps: 60,
    handle: null,
    handleClassName: 'movable-handle',
    horizontal: true,
    rootOnly: true,
    stepX: 1,
    stepY: 1,
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

Cuic.Resizable = function (_Cuic$Component4) {
    _inherits(_class9, _Cuic$Component4);

    function _class9(options) {
        _classCallCheck(this, _class9);

        // Set default options
        options = Cuic.extend({}, Cuic.Resizable.prototype.options, options);

        // Create element

        var _this10 = _possibleConstructorReturn(this, (_class9.__proto__ || Object.getPrototypeOf(_class9)).call(this, 'div', { className: options.className }, options));

        var self = _this10;

        // Add component classes
        self.addClass('resizable');

        // Force the target to be the relative parent
        if (self.css('position') === 'static') {
            self.css('position', 'relative');
        }

        // Add Bottom handle
        self.bottomHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-s',
            css: { height: options.handlerSize + 'px' }
        }).appendTo(self);

        // Add Right handler
        self.rightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-e',
            css: { width: options.handlerSize + 'px' }
        }).appendTo(self);

        // Add Bottom-Right handler
        self.bottomRightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-se',
            css: {
                height: options.handlerSize + 'px',
                width: options.handlerSize + 'px'
            }
        }).appendTo(self);

        // Group handles
        self.handles = [self.rightHandle, self.bottomHandle, self.bottomRightHandle];

        // Group horizontal handles
        self.horizontalHandles = [self.rightHandle, self.bottomRightHandle];

        // Group vertical handles
        self.verticalHandles = [self.bottomHandle, self.bottomRightHandle];

        /**
         * This method is called the element is resizing
         * @param ev
         */
        var startResize = function startResize(ev) {
            // Execute callback
            if (self.onResizeStart && self.onResizeStart.call(self, ev) === false) {
                return;
            }

            // Prevent text selection
            ev.preventDefault();

            // Change element style
            self.addClass('resizing');

            var parent = self.parent();
            var parentOffset = parent.offset();
            var elmHeight = self.outerHeight();
            var elmWidth = self.outerWidth();
            var elmPadding = self.padding();

            // Calculate initial ratio
            var ratio = elmHeight / elmWidth;

            // Stop resizing
            Cuic.once('mouseup', document, function (ev) {
                clearInterval(timer);
                self.removeClass('resizing');
                self.onResizeStop.call(self, ev);
            });

            var timer = setInterval(function () {
                var prop = {};

                // Execute callback
                if (self.onResize && self.onResize.call(self) === false) {
                    return;
                }

                // Resize horizontally
                if (self.options.horizontal) {
                    for (var i = 0; i < self.horizontalHandles.length; i += 1) {
                        if (self.horizontalHandles[i].getElement() === ev.target) {
                            var diffX = Cuic.mouseX - ev.clientX;
                            var offset = self.offset();
                            var parentWidth = parent.innerWidth();
                            var maxWidth = parentWidth - (offset.left - parentOffset.left + elmPadding.horizontal);
                            var width = elmWidth + diffX;

                            // Limit to max width
                            if (width > maxWidth) {
                                width = maxWidth;
                            }
                            // Width is between min and max
                            if ((!Number(_this10.options.maxWidth) || width <= _this10.options.maxWidth) && (!Number(_this10.options.minWidth) || width >= _this10.options.minWidth)) {
                                width = Math.round(width / self.options.stepX) * self.options.stepX;
                                prop.width = width;
                            }
                            break;
                        }
                    }
                }

                // Resize vertically
                if (self.options.vertical) {
                    for (var _i = 0; _i < self.verticalHandles.length; _i += 1) {
                        if (self.verticalHandles[_i].getElement() === ev.target) {
                            var diffY = Cuic.mouseY - ev.clientY;
                            var _offset = self.offset();
                            var parentHeight = parent.innerHeight();
                            var maxHeight = parentHeight - (_offset.top - parentOffset.top + elmPadding.vertical);
                            var height = elmHeight + diffY;

                            // Limit to max height
                            if (height > maxHeight) {
                                height = maxHeight;
                            }
                            // Height is between min and max
                            if ((!Number(_this10.options.maxHeight) || height <= _this10.options.maxHeight) && (!Number(_this10.options.minHeight) || height >= _this10.options.minHeight)) {
                                height = Math.round(height / self.options.stepY) * self.options.stepY;
                                prop.height = height;
                            }
                            break;
                        }
                    }
                }

                // Keep ratio
                if (self.options.keepRatio) {
                    if (prop.height) {
                        prop.width = prop.height / ratio;
                    } else if (prop.width) {
                        prop.height = prop.width * ratio;
                    }
                }

                // Apply new size
                self.css(prop);
            }, Math.round(1000 / self.options.fps));
        };

        // Resize element on resize with handles
        self.bottomHandle.on('mousedown', startResize);
        self.rightHandle.on('mousedown', startResize);
        self.bottomRightHandle.on('mousedown', startResize);
        return _this10;
    }

    _createClass(_class9, [{
        key: 'onResize',
        value: function onResize() {}
    }, {
        key: 'onResizeStart',
        value: function onResizeStart() {}
    }, {
        key: 'onResizeStop',
        value: function onResizeStop() {}
    }]);

    return _class9;
}(Cuic.Component);

Cuic.Resizable.prototype.options = {
    className: 'resizable',
    fps: 30,
    handlerSize: 10,
    horizontal: true,
    keepRatio: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 1,
    minWidth: 1,
    namespace: 'resizable',
    stepX: 1,
    stepY: 1,
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

Cuic.Button = function (_Cuic$Component5) {
    _inherits(_class10, _Cuic$Component5);

    function _class10(options) {
        _classCallCheck(this, _class10);

        // Set default options
        options = Cuic.extend({}, Cuic.Button.prototype.options, options);

        // Create element

        var _this11 = _possibleConstructorReturn(this, (_class10.__proto__ || Object.getPrototypeOf(_class10)).call(this, 'button', {
            className: options.className,
            disabled: false,
            html: options.label,
            title: options.title,
            type: options.type
        }, options));

        var self = _this11;

        // Add component classes
        self.addClass('btn');

        // Create shortcut
        if (typeof options.shortcut === 'number') {
            self.shortcut = new Cuic.Shortcut({
                keyCode: options.shortcut,
                target: self.element,
                callback: function callback() {
                    self.getElement().click();
                }
            });
        }
        return _this11;
    }

    return _class10;
}(Cuic.Component);

Cuic.Button.prototype.options = {
    className: 'btn btn-default',
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

var dialogZIndex = 0;

/**
 * Collection of dialogs
 */
Cuic.dialogs = new Cuic.Collection();

Cuic.dialogs.onAdded = function () {
    dialogZIndex += 1;
};

Cuic.dialogs.onRemoved = function () {
    dialogZIndex -= 1;
};

/**
 * Basic dialog
 */
Cuic.Dialog = function (_Cuic$Component6) {
    _inherits(_class11, _Cuic$Component6);

    function _class11(options) {
        _classCallCheck(this, _class11);

        // Set default options
        options = Cuic.extend({}, Cuic.Dialog.prototype.options, options);

        // Create element

        var _this12 = _possibleConstructorReturn(this, (_class11.__proto__ || Object.getPrototypeOf(_class11)).call(this, 'div', {
            className: options.className,
            role: 'dialog'
        }, options));

        var self = _this12;

        // Add component classes
        self.addClass('dialog');

        var buttons = void 0; //todo use a GroupComponent

        // Public attributes
        self.buttons = new Cuic.Collection();

        /**
         * Adds a button to the dialog
         * @return {Cuic.Button}
         * @param button
         */
        self.addButton = function (button) {
            if (!(button instanceof Cuic.Button)) {
                (function () {
                    var callback = button.callback;

                    button = new Cuic.Button({
                        className: 'btn btn-default',
                        label: button.label
                    });

                    // Set button callback
                    if (typeof callback === 'function') {
                        button.on('click', function (ev) {
                            callback.call(self, ev);
                        });
                    } else if (callback === 'close') {
                        button.on('click', function () {
                            self.close();
                        });
                    }
                })();
            }

            // Add button in footer
            buttons.append(button.getElement());
            self.buttons.add(button);

            // Show footer if not empty
            if (self.buttons.length > 0) {
                _this12.footer.show();
            }
            // Hide footer if empty
            else {
                    _this12.footer.hide();
                }
            return button;
        };

        // Set dialog position
        var fixed = self.getParentElement() === document.body;
        self.css({ position: fixed ? 'fixed' : 'absolute' });

        // Create the fader
        self.fader = new Cuic.Fader({
            className: 'fader dialog-fader',
            autoClose: false,
            autoRemove: false
        }).appendTo(options.parent);

        // Add header
        self.header = new Cuic.Element('header', {
            className: 'dialog-header',
            css: { display: options.title != null ? 'block' : 'none' }
        }).appendTo(self);

        // Add title
        self.title = new Cuic.Element('h3', {
            className: 'dialog-title',
            html: options.title
        }).appendTo(self.header);

        // Add content
        self.content = new Cuic.Element('section', {
            className: 'dialog-content',
            html: options.content
        }).appendTo(self);

        // Add footer
        self.footer = new Cuic.Element('footer', {
            className: 'dialog-footer',
            css: { display: options.buttons != null ? 'block' : 'none' }
        }).appendTo(self);

        // Add buttons group
        buttons = new Cuic.Element('div', {
            className: 'btn-group',
            role: 'group'
        }).appendTo(self.footer);

        // Add close button
        self.closeButton = new Cuic.Element('span', {
            className: 'btn-close glyphicon glyphicon-remove-sign',
            html: self.options.closeButton,
            role: 'button'
        }).appendTo(self.header);

        if (self.options.closeable) {
            self.closeButton.show();
        } else {
            self.closeButton.hide();
        }

        // Add buttons
        if (options.buttons instanceof Array) {
            for (var i = 0; i < options.buttons.length; i += 1) {
                self.addButton(options.buttons[i]);
            }
        }

        // Set content height
        if (parseFloat(options.contentHeight) > 0) {
            content.css('height', options.contentHeight);
        }

        // Set content width
        if (parseFloat(options.contentWidth) > 0) {
            content.css('width', options.contentWidth);
        }

        // Close dialog when fader is clicked
        self.fader.on('click', function () {
            if (self.options.autoClose) {
                self.close();
            }
        });

        self.on('click', function (ev) {
            // Close button
            if (Cuic.hasClass(ev.target, 'btn-close')) {
                ev.preventDefault();
                self.close();
            }
        });

        // // Close the dialog when the user clicks outside of it
        // Cuic.on('click', document, (ev) => {
        //     const elm = self.getElement();
        //
        //     if (ev.target !== elm && !Cuic.isParent(elm, ev.target)) {
        //         if (self.options.autoClose) {
        //             self.close();
        //         }
        //     }
        // });

        // Make the dialog movable
        if (self.options.movable) {
            self.movable = new Cuic.Movable({
                element: self.getElement(),
                handle: self.title,
                parent: self.getParentElement(),
                rootOnly: false
            });
        }

        /**
         * Dialog shortcuts
         * @type {{close: *}}
         */
        self.shortcuts = {
            close: new Cuic.Shortcut({
                element: self,
                keyCode: Cuic.keys.ESC,
                callback: function callback() {
                    self.close();
                }
            })
        };

        // Add dialog to collection
        Cuic.dialogs.add(self);
        return _this12;
    }

    /**
     * Returns the content
     * @deprecated
     * @return {Cuic.Element}
     */


    _createClass(_class11, [{
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
         * Called when dialog is closing
         */

    }, {
        key: 'onClose',
        value: function onClose() {
            this.fader.options.autoRemove = this.options.autoRemove;
            this.fader.close();
        }

        /**
         * Called when dialog is closed
         */

    }, {
        key: 'onClosed',
        value: function onClosed() {
            if (this.options.autoRemove) {
                this.remove();
            }
        }

        /**
         * Called when dialog is opening
         */

    }, {
        key: 'onOpen',
        value: function onOpen() {
            // Calculate z-index
            var zIndex = this.options.zIndex + dialogZIndex;
            this.css({ 'z-index': zIndex });

            this.resizeContent();

            // Open fader
            if (this.options.modal) {
                this.css({ 'z-index': zIndex + 1 });
                this.fader.css({ 'z-index': zIndex });
                this.fader.open();
            }
            // Maximize or position the dialog
            if (this.options.maximized) {
                this.maximize();
            } else {
                this.align(this.options.position);
            }
            // Focus the last button
            if (this.buttons.length > 0) {
                var button = this.buttons.get(this.buttons.length - 1);
                button.getElement().focus();
            }
        }

        /**
         * Called when dialog is opened
         */

    }, {
        key: 'onOpened',
        value: function onOpened() {}
        // // todo Find images
        // let images = this.find('img');
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


        /**
         * Called when dialog is removed
         */

    }, {
        key: 'onRemove',
        value: function onRemove() {
            Cuic.dialogs.remove(this);
        }

        /**
         * Resizes the content
         * @return {Cuic.Dialog}
         */

    }, {
        key: 'resizeContent',
        value: function resizeContent() {
            var parent = this.getParentElement();
            var display = this.css('display');
            var maxHeight = window.innerHeight;

            // Use parent for max height
            if (parent && parent !== document.body) {
                maxHeight = Cuic.height(parent);
            }

            // Set panel max height
            var border = this.border();
            var margin = this.margin();
            maxHeight -= margin.vertical;
            maxHeight -= border.vertical;
            this.css({ 'max-height': maxHeight + 'px' });

            // Calculate content max height
            var contentMaxHeight = maxHeight;

            if (this.header instanceof Cuic.Element) {
                contentMaxHeight -= this.header.outerHeight(true);
            }
            if (this.footer instanceof Cuic.Element) {
                contentMaxHeight -= this.footer.outerHeight(true);
            }

            // Set content max height
            this.content.css({
                'max-height': contentMaxHeight + 'px',
                overflow: 'auto'
            });

            // Restore initial display state
            this.css({ display: display });

            return this;
        }

        /**
         * Sets the title
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

    return _class11;
}(Cuic.Component);

Cuic.Dialog.prototype.options = {
    autoClose: false,
    autoRemove: true,
    autoResize: true,
    buttons: [],
    className: 'dialog',
    closeable: true,
    closeButton: null,
    content: null,
    contentHeight: null,
    contentWidth: null,
    movable: true,
    maximized: false,
    modal: true,
    namespace: 'dialog',
    parent: document.body,
    position: 'center',
    title: null,
    zIndex: 5
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

Cuic.Fader = function (_Cuic$Component7) {
    _inherits(_class12, _Cuic$Component7);

    function _class12(options) {
        _classCallCheck(this, _class12);

        // Set default options
        options = Cuic.extend({}, Cuic.Fader.prototype.options, options);

        // Create element

        var _this13 = _possibleConstructorReturn(this, (_class12.__proto__ || Object.getPrototypeOf(_class12)).call(this, 'div', { className: options.className }, options));

        var self = _this13;

        // Add component classes
        self.addClass('fader');

        var fixed = _this13.getParentElement() === document.body;

        // Set position
        if (fixed) {
            _this13.css({ position: 'fixed' });
        }

        // Auto close when fader is clicked
        _this13.on('click', function () {
            if (_this13.options.autoClose) {
                _this13.close();
            }
        });
        return _this13;
    }

    /**
     * Called when the fader is closed
     */


    _createClass(_class12, [{
        key: 'onClosed',
        value: function onClosed() {
            if (this.options.autoRemove) {
                this.remove();
            }
        }
    }]);

    return _class12;
}(Cuic.Component);

Cuic.Button.prototype.options = {
    autoClose: false,
    autoRemove: false,
    className: 'fader',
    namespace: 'fader',
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
        new Cuic.Resizable({
            target: grid.element

        }).onResizeStop = function () {
            var cols = grid.getSizeX(grid.element.outerWidth());
            var rows = grid.getSizeY(grid.element.outerHeight());
            grid.maxCols = cols;
            grid.maxRows = rows;
            grid.maximize();
        };

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
        resizable.onResizeStop = function () {
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
        };

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
        movable.onMoveStop = function () {
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

/**
 * Collection of notifications
 */
Cuic.notifications = new Cuic.Collection();

/**
 * Notification component
 */
Cuic.Notification = function (_Cuic$Component8) {
    _inherits(_class13, _Cuic$Component8);

    function _class13(options) {
        _classCallCheck(this, _class13);

        // Set default options
        options = Cuic.extend({}, Cuic.Notification.prototype.options, options);

        // Create element

        var _this14 = _possibleConstructorReturn(this, (_class13.__proto__ || Object.getPrototypeOf(_class13)).call(this, 'div', {
            className: options.className,
            html: options.content
        }, options));

        var self = _this14;

        // Add component classes
        self.addClass('notification');

        // Public attributes
        self.closeTimer = null;

        // Add close button
        self.closeButton = new Cuic.Element('span', {
            className: 'btn-close glyphicon glyphicon-remove-sign',
            html: self.options.closeButton,
            role: 'button'
        }).appendTo(self);

        if (self.options.closeable) {
            self.closeButton.show();
        } else {
            self.closeButton.hide();
        }

        // Avoid closing notification when mouse is over
        self.on('mouseenter', function (ev) {
            clearTimeout(self.closeTimer);
        });

        // Close notification when mouse is out
        self.on('mouseleave', function (ev) {
            if (ev.currentTarget === self.getElement()) {
                self.autoClose();
            }
        });

        self.on('click', function (ev) {
            // Close button
            if (Cuic.hasClass(ev.target, 'btn-close')) {
                ev.preventDefault();
                self.close();
            }
        });

        // Add dialog to collection
        Cuic.notifications.add(self);
        return _this14;
    }

    /**
     * Auto closes the notification
     */


    _createClass(_class13, [{
        key: 'autoClose',
        value: function autoClose() {
            var _this15 = this;

            clearTimeout(this.closeTimer);
            this.closeTimer = setTimeout(function () {
                if (_this15.options.autoClose) {
                    _this15.close();
                }
            }, this.options.duration);
        }

        /**
         * Called when the notification is closed
         */

    }, {
        key: 'onClosed',
        value: function onClosed() {
            if (this.options.autoRemove) {
                this.remove();
            }
        }

        /**
         * Called when the notification is opening
         */

    }, {
        key: 'onOpen',
        value: function onOpen() {
            // Place the component if a position is set
            if (this.options.position) {
                var isFixed = this.getParentElement() === document.body;
                this.css({ position: isFixed ? 'fixed' : 'absolute' });
                this.align(this.options.position);
            }
        }

        /**
         * Called when the notification is opened
         */

    }, {
        key: 'onOpened',
        value: function onOpened() {
            this.autoClose();
        }
    }, {
        key: 'onRemove',
        value: function onRemove() {
            Cuic.notifications.remove(this);
        }
    }]);

    return _class13;
}(Cuic.Component);

Cuic.Notification.prototype.options = {
    autoClose: true,
    autoRemove: true,
    className: 'notification',
    closeable: true,
    closeButton: '',
    content: null,
    duration: 2000,
    parent: document.body,
    position: 'center',
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

Cuic.NotificationStack = function (_Cuic$GroupComponent) {
    _inherits(_class14, _Cuic$GroupComponent);

    function _class14(options) {
        _classCallCheck(this, _class14);

        // Set default options
        options = Cuic.extend({}, Cuic.NotificationStack.prototype.options, options);

        // Create element

        var _this16 = _possibleConstructorReturn(this, (_class14.__proto__ || Object.getPrototypeOf(_class14)).call(this, 'div', {
            className: options.className,
            html: options.content
        }, options));

        var self = _this16;

        // Add component classes
        self.addClass('notification-stack');

        // Set position
        if (self.options.position) {
            var isFixed = self.getParentElement() === document.body;
            self.css({ position: isFixed ? 'fixed' : 'absolute' });
            self.align(self.options.position);
        }
        return _this16;
    }

    _createClass(_class14, [{
        key: 'onComponentAdded',
        value: function onComponentAdded(component) {
            // Display the notification when it's added to the stack
            if (component instanceof Cuic.Notification) {
                // fixme Not using a timeout to open blocks the animation
                setTimeout(function () {
                    component.open();
                }, 10);
            }
        }
    }, {
        key: 'onComponentRemoved',
        value: function onComponentRemoved(component) {
            // Display the notification when it's added to the stack
            if (component instanceof Cuic.Notification) {
                component.close();
            }
        }
    }]);

    return _class14;
}(Cuic.GroupComponent);

Cuic.NotificationStack.prototype.options = {
    className: 'notification-stack',
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

Cuic.Panel = function (_Cuic$Component9) {
    _inherits(_class15, _Cuic$Component9);

    function _class15(options) {
        _classCallCheck(this, _class15);

        // Set default options
        options = Cuic.extend({}, Cuic.Panel.prototype.options, options);

        // Create element

        var _this17 = _possibleConstructorReturn(this, (_class15.__proto__ || Object.getPrototypeOf(_class15)).call(this, 'div', {
            className: options.className
        }, options));

        var self = _this17;

        // Add component classes
        self.addClass('panel');

        if (options.element) {
            self.header = self.find('.panel-header');
            self.title = self.find('.panel-title');
            self.content = self.find('.panel-content');
            self.footer = self.find('.panel-footer');
            self.closeButton = self.find('.panel-header .btn-close');
        } else {
            // Add the header
            self.header = new Cuic.Element('header', {
                className: 'panel-header'
            }).prependTo(self);

            // Add the title
            self.title = new Cuic.Element('h5', {
                className: 'panel-title',
                html: options.title
            }).appendTo(self.header);

            // Add close button
            self.closeButton = new Cuic.Element('span', {
                className: 'btn-close glyphicon glyphicon-remove-sign',
                html: self.options.closeButton,
                role: 'button'
            }).appendTo(self.header);

            // Add the body
            self.content = new Cuic.Element('section', {
                className: 'panel-content',
                html: options.content
            }).appendTo(self);

            // Add the footer
            self.footer = new Cuic.Element('footer', {
                className: 'panel-footer',
                html: options.footer
            }).appendTo(self);

            // Hide the header if not used
            if (!options.title) {
                self.header.hide();
            }

            // Hide the footer if not used
            if (!options.footer) {
                self.footer.hide();
            }
        }

        // Set panel position
        var fixed = self.getParentElement() === document.body;
        self.css({ position: fixed ? 'fixed' : 'absolute' });

        self.align(self.options.position);
        self.resizeContent();

        // To hide the panel in the container,
        // the container must have a hidden overflow
        Cuic.css(self.getParentElement(), { overflow: 'hidden' });

        // Set the panel visibility
        // Since the visible option is used to check if the panel is visible
        // we force the panel to show or hide by setting visible to the inverse value.
        if (self.options.visible) {
            self.open();
        } else {
            self.close();
        }

        // Maximize the panel
        if (self.options.maximized) {
            self.maximize();
        }

        if (self.closeButton) {
            if (self.options.closeable) {
                self.closeButton.show();
            } else {
                self.closeButton.hide();
            }
        }

        self.on('click', function (ev) {
            // Close button
            if (Cuic.hasClass(ev.target, 'btn-close')) {
                ev.preventDefault();
                self.close();
            }
            // Toggle button
            if (Cuic.hasClass(ev.target, 'btn-toggle')) {
                ev.preventDefault();
                self.toggle();
            }
        });

        // Close the panel when the user clicks outside of it
        Cuic.on('click', document, function (ev) {
            var elm = self.getElement();

            if (ev.target !== elm && !Cuic.isParent(elm, ev.target)) {
                if (self.options.autoClose && self.isOpened()) {
                    // self.close(); // todo find how to avoid closing when opening from exterior (eg: button)
                }
            }
        });
        return _this17;
    }

    /**
     * Returns the content
     * @deprecated
     * @return {Cuic.Element}
     */


    _createClass(_class15, [{
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
         * Called when the panel is closing
         */

    }, {
        key: 'onClose',
        value: function onClose() {
            var height = this.outerHeight(true);
            var width = this.outerWidth(true);
            var prop = {};

            // Horizontal position
            if (Cuic.isPosition('left', this)) {
                prop.left = -width + 'px';
                prop.right = '';
            } else if (Cuic.isPosition('right', this)) {
                prop.right = -width + 'px';
                prop.left = '';
            } else {}
            // todo center


            // Vertical position
            if (Cuic.isPosition('bottom', this)) {
                prop.bottom = -height + 'px';
                prop.top = '';
            } else if (Cuic.isPosition('top', this)) {
                prop.top = -height + 'px';
                prop.bottom = '';
            } else {}
            // todo center


            // Hide panel
            this.css(prop);
        }

        /**
         * Called when the panel is minimized
         */

    }, {
        key: 'onMinimize',
        value: function onMinimize() {
            var elm = this.getElement();
            var parent = elm.parentNode;
            var clone = elm.cloneNode(true);
            Cuic.css(clone, { height: 'auto', width: 'auto' });

            // Calculate minimized size
            var prop = Cuic.calculateAlign(clone, this.options.position, parent);
            prop.height = Cuic.height(clone);
            prop.width = Cuic.width(clone);
            clone.remove();

            if (!this.isOpened()) {
                // Horizontal position
                if (Cuic.isPosition('left', this)) {
                    prop.left = -this.outerWidth(true);
                    prop.right = '';
                } else if (Cuic.isPosition('right', this)) {
                    prop.right = -this.outerWidth(true);
                    prop.left = '';
                }
                // Vertical position
                if (Cuic.isPosition('bottom', this)) {
                    prop.bottom = -this.outerHeight(true);
                    prop.top = '';
                } else if (Cuic.isPosition('top', this)) {
                    prop.top = -this.outerHeight(true);
                    prop.bottom = '';
                }
            }

            this.resizeContent();

            // Minimize panel
            this.css(prop);
        }

        /**
         * Called when the panel is opening
         */

    }, {
        key: 'onOpen',
        value: function onOpen() {
            // Resize content
            this.resizeContent();
            // Recalculate position
            this.align(this.options.position);
        }

        //     // todo position panel when closed
        // const pos = Cuic.offset(self);

        // // Panel is hidden
        // if (pos.bottom < 0 || pos.left < 0 || pos.right < 0 || pos.top < 0) {
        //     const elm = self.getElement();
        //     let prop = Cuic.calculateAlign(elm, position);
        //
        //     // Horizontal position
        //     if (position.indexOf('left') !== -1) {
        //         prop.left = -self.outerWidth(true) + 'px';
        //         prop.right = '';
        //     } else if (position.indexOf('right') !== -1) {
        //         prop.right = -self.outerWidth(true) + 'px';
        //         prop.left = '';
        //     }
        //     // Vertical position
        //     if (position.indexOf('bottom') !== -1) {
        //         prop.bottom = -self.outerHeight(true) + 'px';
        //         prop.top = '';
        //     } else if (position.indexOf('top') !== -1) {
        //         prop.top = -self.outerHeight(true) + 'px';
        //         prop.bottom = '';
        //     }
        //
        //     self.css(prop);
        //     self.options.position = position;
        // }

        /**
         * Resizes the content
         * @return {Cuic.Panel}
         */

    }, {
        key: 'resizeContent',
        value: function resizeContent() {
            var parent = this.getParentElement();
            var display = this.css('display');
            var maxHeight = window.innerHeight;

            // Use parent for max height
            if (parent && parent !== document.body) {
                maxHeight = Cuic.height(parent);
            }

            // Set panel max height
            var border = this.border();
            var margin = this.margin();
            maxHeight -= margin.vertical;
            maxHeight -= border.vertical;
            this.css({ 'max-height': maxHeight + 'px' });

            // Calculate content max height
            var contentMaxHeight = maxHeight;

            if (this.header instanceof Cuic.Element) {
                contentMaxHeight -= this.header.outerHeight(true);
            }
            if (this.footer instanceof Cuic.Element) {
                contentMaxHeight -= this.footer.outerHeight(true);
            }

            // Set content max height
            this.content.css({
                'max-height': contentMaxHeight + 'px',
                overflow: 'auto'
            });

            // Restore initial display state
            this.css({ display: display });

            return this;
        }

        /**
         * Sets the title
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

    return _class15;
}(Cuic.Component);

Cuic.Panel.prototype.options = {
    autoClose: false,
    className: 'panel',
    closeable: true,
    closeButton: '',
    parent: null,
    content: null,
    css: null,
    footer: null,
    maximized: false,
    namespace: 'panel',
    position: 'left top',
    title: null,
    visible: false,
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

Cuic.Popup = function (_Cuic$Component10) {
    _inherits(_class16, _Cuic$Component10);

    function _class16(options) {
        _classCallCheck(this, _class16);

        // Set default options
        options = Cuic.extend({}, Cuic.Popup.prototype.options, options);

        // Create element

        var _this18 = _possibleConstructorReturn(this, (_class16.__proto__ || Object.getPrototypeOf(_class16)).call(this, 'div', { className: options.className }, options));

        var self = _this18;

        // Add component classes
        self.addClass('popup');

        // Add content
        self.content = new Cuic.Element('div', {
            className: 'popup-content',
            html: options.content
        }).appendTo(self);

        // Add close button
        self.closeButton = new Cuic.Element('span', {
            className: 'btn-close glyphicon glyphicon-remove-sign',
            html: self.options.closeButton,
            role: 'button'
        }).appendTo(self);

        if (self.options.closeable) {
            self.closeButton.show();
        } else {
            self.closeButton.hide();
        }

        self.on('click', function (ev) {
            // Close button
            if (Cuic.hasClass(ev.target, 'btn-close')) {
                ev.preventDefault();
                self.close();
            }
        });

        // Close the popup when the user clicks outside of it
        Cuic.on('click', document, function (ev) {
            var elm = self.getElement();

            if (ev.target !== elm && !Cuic.isParent(elm, ev.target)) {
                if (self.options.autoClose && self.isOpened()) {
                    self.close();
                }
            }
        });

        /**
         * Popup shortcuts
         * @type {{close: *}}
         */
        self.shortcuts = {
            close: new Cuic.Shortcut({
                element: self,
                keyCode: Cuic.keys.ESC,
                callback: function callback() {
                    self.close();
                }
            })
        };
        return _this18;
    }

    /**
     * Returns the content
     * @return {Cuic.Element}
     */


    _createClass(_class16, [{
        key: 'getContent',
        value: function getContent() {
            return this.content;
        }

        /**
         * Called when the popup is closed
         */

    }, {
        key: 'onClosed',
        value: function onClosed() {
            if (this.options.autoRemove) {
                this.remove();
            }
        }

        /**
         * Called when the popup is opening
         */

    }, {
        key: 'onOpen',
        value: function onOpen() {
            var targetParent = Cuic.getElement(this.options.target).parentNode;
            this.appendTo(targetParent);
            this.anchor(this.options.anchor, this.options.target);
        }

        /**
         * Sets the popup content
         * @param html
         * @return {Cuic.Popup}
         */

    }, {
        key: 'setContent',
        value: function setContent(html) {
            this.content.setHtml(html);
            return this;
        }
    }]);

    return _class16;
}(Cuic.Component);

Cuic.Popup.prototype.options = {
    anchor: 'top',
    autoClose: true,
    autoRemove: false,
    className: 'popup',
    closeable: true,
    closeButton: '',
    content: null,
    css: null,
    namespace: 'popup',
    target: null,
    zIndex: 9
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

Cuic.Switcher = function (_Cuic$Component11) {
    _inherits(_class17, _Cuic$Component11);

    function _class17(options) {
        _classCallCheck(this, _class17);

        // Set default options
        options = Cuic.extend({}, Cuic.Switcher.prototype.options, options);

        // Create element

        var _this19 = _possibleConstructorReturn(this, (_class17.__proto__ || Object.getPrototypeOf(_class17)).call(this, 'div', {
            className: options.className,
            html: options.content
        }, options));

        var self = _this19;

        // Add component classes
        self.addClass('switcher');

        // Public attributes
        self.activeElement = null;
        self.index = 0;
        self.timer = null;

        // Display first element
        self.goTo(0);

        // Auto start timer
        if (self.options.autoStart) {
            self.start();
        }
        return _this19;
    }

    /**
     * Displays the first element
     */


    _createClass(_class17, [{
        key: 'first',
        value: function first() {
            this.goTo(0);
        }

        /**
         * Returns the active element
         * @return {HTMLElement}
         */

    }, {
        key: 'getActiveElement',
        value: function getActiveElement() {
            return this.activeElement;
        }

        /**
         * Returns the element at the specified index
         * @param index
         * @return {HTMLElement}
         */

    }, {
        key: 'getElementAt',
        value: function getElementAt(index) {
            return this.children()[index];
        }

        /**
         * Returns the index of the visible element
         * @return {number}
         */

    }, {
        key: 'getIndex',
        value: function getIndex() {
            return this.children().indexOf(this.activeElement);
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

                // Get the visible element
                this.activeElement = children[this.index];

                // Hide visible elements
                for (var i = 0; i < children.length; i += 1) {
                    var child = Cuic.element(children[i]);

                    if (this.index === i) {
                        child.addClass('visible');
                        child.removeClass('hidden');
                    } else {
                        child.addClass('hidden');
                        child.removeClass('visible');
                    }
                }

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
            var _this20 = this;

            if (!this.isStarted()) {
                this.timer = setInterval(function () {
                    _this20.next();
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

    return _class17;
}(Cuic.Component);

Cuic.Switcher.prototype.options = {
    autoStart: true,
    delay: 3000,
    namespace: 'switcher',
    repeat: true,
    target: null
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

Cuic.tooltips = new Cuic.Collection();

Cuic.Tooltip = function (_Cuic$Component12) {
    _inherits(_class18, _Cuic$Component12);

    function _class18(options) {
        _classCallCheck(this, _class18);

        // Set default options
        options = Cuic.extend({}, Cuic.Tooltip.prototype.options, options);

        // Create element

        var _this21 = _possibleConstructorReturn(this, (_class18.__proto__ || Object.getPrototypeOf(_class18)).call(this, 'div', { className: options.className }, options));

        var self = _this21;

        // Add component classes
        self.addClass('tooltip');

        // Define attributes
        self.attribute = options.attribute;
        self.followPointer = options.followPointer === true;

        // Add content
        self.content = new Cuic.Element('div', {
            className: 'tooltip-content'
        }).appendTo(self);

        // Add tooltip tail
        self.tail = new Cuic.Element('span', {
            className: 'tooltip-tail'
        }).appendTo(self);

        //
        var targets = Cuic.element(self.options.selector);

        // Open tooltip when mouse enter area
        Cuic.element(targets).on('mouseenter', function (ev) {
            var target = Cuic.element(ev.currentTarget);
            var text = target.attr('data-tooltip');

            if (!text || !text.length) {
                text = target.attr(self.options.attribute);
            }

            if (text && text.length) {
                target.attr(self.attribute, '');
                target.attr('data-tooltip', text);
                self.content.setHtml(text);

                if (self.options.followPointer) {
                    self.appendTo(document.body);
                    self.anchor(self.options.anchor, [ev.pageX, ev.pageY]);
                } else {
                    self.appendTo(ev.target.parentNode);
                    self.anchor(self.options.anchor, ev.target);
                    self.refreshTail();
                }
            }
            self.open();
        });

        // Move tooltip when mouse moves over area
        Cuic.element(targets).on('mousemove', function (ev) {
            if (self.isOpened()) {
                if (self.options.followPointer) {
                    self.appendTo(document.body);
                    self.anchor(self.options.anchor, [ev.pageX, ev.pageY]);
                } else {
                    self.appendTo(ev.target.parentNode);
                    self.anchor(self.options.anchor, ev.target);
                    self.refreshTail();
                }
            }
        });

        // Close tooltip when mouse leaves area
        Cuic.element(targets).on('mouseleave', function () {
            self.close();
        });

        // Close the panel when the user clicks outside of it
        Cuic.on('click', document, function (ev) {
            var elm = self.getElement();

            if (ev.target !== elm && !Cuic.isParent(elm, ev.target)) {
                self.close();
            }
        });

        // Add the tooltip to the list
        Cuic.tooltips.add(self);
        return _this21;
    }

    /**
     * Called when the tooltip is closed
     */


    _createClass(_class18, [{
        key: 'onClosed',
        value: function onClosed() {
            if (this.options.autoRemove) {
                this.remove();
            }
        }
    }, {
        key: 'refreshTail',
        value: function refreshTail() {
            switch (this.options.position) {
                case 'top':
                    this.tail.removeClass('tail-top tail-left tail-right').addClass('tail-bottom');
                    this.tail.css({
                        left: '50%',
                        right: 'auto',
                        top: 'auto',
                        bottom: -this.tail.height() + 'px',
                        margin: '0 0 0 ' + -this.tail.width() / 2 + 'px'
                    });
                    break;

                case 'bottom':
                    this.tail.removeClass('tail-bottom tail-left tail-right').addClass('tail-top');
                    this.tail.css({
                        left: '50%',
                        right: 'auto',
                        top: -this.tail.height() + 'px',
                        bottom: 'auto',
                        margin: '0 0 0 ' + -this.tail.width() / 2 + 'px'
                    });
                    break;

                case 'right':
                    this.tail.removeClass('tail-top tail-bottom tail-right').addClass('tail-left');
                    this.tail.css({
                        left: -this.tail.width() + 'px',
                        right: 'auto',
                        top: '50%',
                        bottom: 'auto',
                        margin: -this.tail.height() / 2 + 'px 0 0 0'
                    });
                    break;

                case 'left':
                    this.tail.removeClass('tail-top tail-bottom tail-left').addClass('tail-right');
                    this.tail.css({
                        left: 'auto',
                        right: -this.tail.width() + 'px',
                        top: '50%',
                        bottom: 'auto',
                        margin: -this.tail.height() / 2 + 'px 0 0 0'
                    });
                    break;
            }
        }

        /**
         * Sets the popup content
         * @param html
         * @return {Cuic.Tooltip}
         */

    }, {
        key: 'setContent',
        value: function setContent(html) {
            this.content.setHtml(html);
            return this;
        }
    }]);

    return _class18;
}(Cuic.Component);

Cuic.Tooltip.prototype.options = {
    anchor: 'right bottom',
    attribute: 'title',
    className: 'tooltip',
    css: null,
    followPointer: true,
    namespace: 'tooltip',
    selector: '[title]',
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
