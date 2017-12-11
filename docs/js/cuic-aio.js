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

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _element2 = __webpack_require__(1);

var Cuic = {

    mouseX: 0,

    mouseY: 0,

    options: {
        debug: false
    },

    addEventListener: function addEventListener(element, event, listener) {
        if (typeof element.addEventListener === "function") {
            return element.addEventListener(event, listener);
        } else if (typeof element.attachEvent === "function") {
            return element.attachEvent(event, listener);
        }
    },
    apply: function apply(fn, context, args) {
        if (typeof fn === "function") {
            return fn.apply(context, args);
        }
    },
    autoPixel: function autoPixel(styles) {
        var properties = ["bottom", "left", "padding", "right", "top", "max-height", "max-width", "height", "width", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top"];

        for (var style in styles) {
            if (styles.hasOwnProperty(style)) {
                if (typeof styles[style] === "number" && properties.indexOf(style) !== -1) {
                    styles[style] = styles[style] + "px";
                }
            }
        }
        return styles;
    },
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
    constraintPosition: function constraintPosition(prop, limit) {

        if (typeof prop.left === "number") {
            if (prop.left < limit.minX) {
                prop.left = limit.minX;
            } else if (prop.left > limit.maxX) {
                prop.left = limit.maxX;
            }
        }
        if (typeof prop.right === "number") {
            if (prop.right < limit.minX) {
                prop.right = limit.minX;
            } else if (prop.right > limit.maxX) {
                prop.right = limit.maxX;
            }
        }

        if (typeof prop.top === "number") {
            if (prop.top < limit.minY) {
                prop.top = limit.minY;
            } else if (prop.top > limit.maxY) {
                prop.top = limit.maxY;
            }
        }
        if (typeof prop.bottom === "number") {
            if (prop.bottom < limit.minY) {
                prop.bottom = limit.minY;
            } else if (prop.bottom > limit.maxY) {
                prop.bottom = limit.maxY;
            }
        }
        return prop;
    },
    debug: function debug() {
        if (this.options.debug && console !== undefined) {
            var args = Array.prototype.slice.call(arguments);
            (console.debug || console.log).apply(this, args);
        }
    },
    element: function element(_element) {
        if (_element instanceof _element2.Element) {
            return _element;
        }
        if (this.isNode(_element)) {
            return new _element2.Element(_element);
        }
        if (_element instanceof Window) {
            return new _element2.Element(_element);
        }
        if (this.isJQuery(_element)) {
            return new _element2.Element(_element.get(0));
        }
        if (typeof _element === "string") {
            return this.find(_element).eq(0);
        }
        return _element;
    },
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
    extend: function extend() {
        var args = Array.prototype.slice.call(arguments);
        var recursive = false;
        var a = args.shift();

        if (typeof a === "boolean") {
            recursive = a;
            a = args.shift();
        }

        for (var i = 0; i < args.length; i += 1) {
            var b = args[i];

            if ((typeof b === "undefined" ? "undefined" : _typeof(b)) === "object" && b !== null && b !== undefined && (typeof a === "undefined" ? "undefined" : _typeof(a)) === "object" && a !== null && a !== undefined) {
                for (var key in b) {
                    if (b.hasOwnProperty(key)) {
                        if (recursive && _typeof(b[key]) === "object" && b[key] !== null && b[key] !== undefined) {
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
    find: function find(selector, context) {
        context = this.node(context || document);
        return this.element(context).find(selector);
    },
    getComputedStyle: function getComputedStyle(element, style) {
        element = this.node(element);
        return window.getComputedStyle(element, null).getPropertyValue(style);
    },
    getStylePrefix: function getStylePrefix() {
        var element = document.createElement("div");

        if (element.WebkitAnimation == "") return "-webkit-";
        if (element.MozAnimation == "") return "-moz-";
        if (element.OAnimation == "") return "-o-";

        if (element.WebkitTransition == "") return "-webkit-";
        if (element.MozTransition == "") return "-moz-";
        if (element.OTransition == "") return "-o-";

        return "";
    },
    isChrome: function isChrome() {
        return !!window.chrome && !!window.chrome.webstore;
    },
    isEdge: function isEdge() {
        return !this.isIE() && !!window.StyleMedia;
    },
    isElement: function isElement(obj) {
        return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === "object" ? obj instanceof HTMLElement : obj && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string";
    },
    isFirefox: function isFirefox() {
        return typeof InstallTrigger !== "undefined";
    },
    isFullScreenEnabled: function isFullScreenEnabled() {
        return (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) === true;
    },
    isIE: function isIE() {
        return !!document.documentMode;
    },
    isInstanceOf: function isInstanceOf(fn, obj) {
        return typeof fn !== "undefined" && fn !== null && obj instanceof fn;
    },
    isJQuery: function isJQuery(obj) {
        return typeof jQuery !== "undefined" && jQuery !== null && obj instanceof jQuery;
    },
    isNode: function isNode(obj) {
        return (typeof Node === "undefined" ? "undefined" : _typeof(Node)) === "object" ? obj instanceof Node : obj && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string";
    },
    isOpera: function isOpera() {
        return !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
    },
    isSafari: function isSafari() {
        return (/constructor/i.test(window.HTMLElement) || function (p) {
                return p.toString() === "[object SafariRemoteNotification]";
            }(!window["safari"] || safari.pushNotification)
        );
    },
    namespace: function namespace(ns) {
        return function (event, id) {
            id = Cuic.slug(id);
            return event + ".cuic." + ns + (id ? "." + id : "");
        };
    },
    node: function node(element) {
        if (this.isNode(element)) {
            return element;
        }
        if (element instanceof Window) {
            return element;
        }
        if (element instanceof _element2.Element) {
            return element.node();
        }
        if (this.isJQuery(element)) {
            return element.get(0);
        }
        if (typeof element === "string") {
            return this.find(element).get(0);
        }
        console.info(element);
        throw new TypeError("cannot get HTMLElement from element.");
    },
    off: function off(event, element, callback) {
        if (element instanceof _element2.Element) {
            element = element.node();
        } else if (this.isJQuery(element)) {
            element = element.get(0);
        } else if (!this.isNode(element) && !(element instanceof Window)) {
            console.info(event, element);
            throw new TypeError("Cannot add event listener on unsupported element.");
        }

        var browserEvent = this.whichEvent(event, element);

        if (!browserEvent) {
            console.warn("Event \"" + event + "\" is not supported by this browser.");
        }

        if (event.indexOf("animation") !== -1) {
            var duration = this.prefixStyle("animation-duration");

            if (!browserEvent && !("animation" in element.style) || getComputedStyle(element)[duration] === "0s") {
                this.apply(callback, element);
            }
        } else if (event.indexOf("transition") !== -1) {
            var _duration = this.prefixStyle("transition-duration");

            if (!browserEvent && !("transition" in element.style) || getComputedStyle(element)[_duration] === "0s") {
                this.apply(callback, element);
            }
        }
        return this.removeEventListener(element, browserEvent, callback);
    },
    on: function on(event, element, callback) {
        if (element instanceof _element2.Element) {
            element = element.node();
        } else if (this.isJQuery(element)) {
            element = element.get(0);
        } else if (!this.isNode(element) && !(element instanceof Window)) {
            console.info(event, element);
            throw new TypeError("Cannot add event listener on unsupported element.");
        }

        var browserEvent = this.whichEvent(event, element);

        if (!browserEvent) {
            console.warn("Event \"" + event + "\" is not supported by this browser.");
        }

        if (event.indexOf("animation") !== -1) {
            var duration = this.prefixStyle("animation-duration");

            if (!browserEvent && !("animation" in element.style) || getComputedStyle(element)[duration] === "0s") {
                this.apply(callback, element);
            }
        } else if (event.indexOf("transition") !== -1) {
            var _duration2 = this.prefixStyle("transition-duration");

            if (!browserEvent && !("transition" in element.style) || getComputedStyle(element)[_duration2] === "0s") {
                this.apply(callback, element);
            }
        }
        return this.addEventListener(element, browserEvent, callback);
    },
    once: function once(event, element, callback) {
        var _this = this;

        if (element instanceof _element2.Element) {
            element = element.node();
        } else if (this.isJQuery(element)) {
            element = element.get(0);
        } else if (!this.isNode(element) && !(element instanceof Window)) {
            console.info(event, element);
            throw new TypeError("Cannot add event listener on unsupported element.");
        }

        var browserEvent = this.whichEvent(event, element);

        if (!browserEvent) {
            console.warn("Event \"" + event + "\" is not supported by this browser.");
        }

        if (event.indexOf("animation") !== -1) {
            var duration = this.prefixStyle("animation-duration");

            if (!browserEvent && !("animation" in element.style) || getComputedStyle(element)[duration] === "0s") {
                this.apply(callback, element);
            }
        } else if (event.indexOf("transition") !== -1) {
            var _duration3 = this.prefixStyle("transition-duration");

            if (!browserEvent && !("transition" in element.style) || getComputedStyle(element)[_duration3] === "0s") {
                this.apply(callback, element);
            }
        }
        var listener = function listener(ev) {
            _this.removeEventListener(element, browserEvent, listener);
            _this.apply(callback, element, Array.prototype.slice.call(ev));
        };
        return this.addEventListener(element, browserEvent, listener);
    },
    onWindowResized: function onWindowResized(callback) {
        var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

        var timer = void 0;

        if (this.isInstanceOf(Window, window)) {
            this.on("resize", window, function (ev) {
                var _this2 = this;

                clearTimeout(timer);
                timer = setTimeout(function () {
                    callback.call(_this2, ev);
                }, delay);
            });
        }
    },
    parseBoolean: function parseBoolean(val) {
        if (/^true$/i.test(val)) {
            return true;
        }
        if (/^false$/i.test(val)) {
            return false;
        }
        return null;
    },
    prefixStyle: function prefixStyle(style) {
        var prefix = this.getStylePrefix();
        return typeof prefix === "string" && prefix.length ? prefix + style : style;
    },
    ready: function ready(callback) {
        document.addEventListener("DOMContentLoaded", callback);
    },
    removeEventListener: function removeEventListener(element, event, listener) {
        if (typeof element.removeEventListener === "function") {
            return element.removeEventListener(event, listener);
        } else if (typeof element.detachEvent === "function") {
            return element.detachEvent(event, listener);
        }
    },
    slug: function slug(text) {
        if (typeof text === "string") {
            text = text.replace(/ +/g, "-");
            text = text.replace(/[^a-zA-Z0-9_-]+/g, "");
        }
        return text;
    },
    stripTags: function stripTags(html) {
        if (typeof html === "string" && html.length) {

            html = html.replace(/<br[^>]>/gi, "\r\n");

            html = html.replace(/<[^>]+>/g, "");

            html = html.trim();
        }
        return html;
    },
    toCamelCase: function toCamelCase(str) {

        return str.toLowerCase().replace(/[-_]+/g, " ").replace(/[^\w\s]/g, "").replace(/ (.)/g, function ($1) {
            return $1.toUpperCase();
        }).replace(/ /g, "");
    },
    valueOf: function valueOf(value, context) {
        switch (typeof value === "undefined" ? "undefined" : _typeof(value)) {
            case "function":
                value = value.call(context);
                break;
        }
        return value;
    },
    whichEvent: function whichEvent(event, element) {
        var ev = void 0;
        var resolver = {};

        switch (event) {
            case "transitionend":
                resolver = {
                    "transition": "transitionend",
                    "OTransition": "oTransitionEnd",
                    "MozTransition": "transitionend",
                    "WebkitTransition": "webkitTransitionEnd"
                };
                break;

        }

        for (ev in resolver) {
            if (element.style[ev] !== undefined) {
                return resolver[ev];
            }
        }

        if (element[event] !== undefined) {
            return event;
        }
        if (element["on" + event] !== undefined) {
            return event;
        }

        if (document[event] !== undefined) {
            return event;
        }
        if (document["on" + event] !== undefined) {
            return event;
        }

        if (window[event] !== undefined) {
            return event;
        }
        if (window["on" + event] !== undefined) {
            return event;
        }
    }
};

exports.default = Cuic;


if (window !== undefined) {
    window.Cuic = Cuic;
}

Cuic.ready(function () {

    Cuic.element(document).on("mousemove", function (ev) {
        Cuic.mouseX = ev.clientX;
        Cuic.mouseY = ev.clientY;
    });

    Cuic.find("html,body").css({ height: "100%", minHeight: "100%" });

    Cuic.find("body").css({ position: "relative" });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Element = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _elements = __webpack_require__(9);

var _events = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = function () {
    function Element(node, attributes, options) {
        _classCallCheck(this, Element);

        attributes = _cuic2.default.extend({}, attributes);

        this.options = _cuic2.default.extend({}, Element.prototype.options, options);

        if (this.options.element) {
            this.element = _cuic2.default.node(this.options.element);
        } else if (typeof node === "string") {
            this.element = document.createElement(node);
        } else if (_cuic2.default.isNode(node) || node instanceof Window) {
            this.element = node;
        } else if (node instanceof Element) {
            this.element = node.node();
        } else if (node instanceof _elements.Elements) {
            this.element = node.get(0);
        } else if (_cuic2.default.isJQuery(node)) {
            this.element = node.get(0);
        } else {
            console.info(node);
            throw new TypeError("Cannot create element using given node.");
        }

        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                var value = attributes[attr];

                if (value !== null && value !== undefined) {

                    if (attr === "className") {
                        this.addClass(value);
                        continue;
                    }

                    if (attr === "css") {
                        this.css(value);
                        continue;
                    }

                    if (attr === "data") {
                        this.data(value);
                        continue;
                    }

                    if (this.element[attr] !== undefined) {
                        this.element[attr] = value;
                    } else if (attr === "html") {
                        this.html(value);
                    } else if (attr === "text") {
                        this.text(value);
                    }
                }
            }
        }

        if (typeof this.options.zIndex === "number") {
            this.css({ "z-index": parseInt(this.options.zIndex) });
        }

        if (this.options.css) {
            this.css(this.options.css);
        }

        if (this.options.debug) {
            this.addClass("debug");
        }

        if (this.options.mainClass) {
            this.addClass(this.options.mainClass);
        }

        this.events = new _events.Events(this);

        if (this.options.parent) {
            this.appendTo(this.options.parent);
            _cuic2.default.element(this.options.parent).append(this);
        }

        if (this.options.position && this.hasParent()) {
            this.align();
        }

        if (this.hasParent()) {

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

    _createClass(Element, [{
        key: "_calculateAlign",
        value: function _calculateAlign(position, parent) {
            if (!position || !position.length) {
                throw new TypeError("Cannot calculate alignment if no position defined");
            }

            if (parent) {
                parent = _cuic2.default.element(parent);

                if (parent.node().nodeName === "HTML") {
                    parent = _cuic2.default.element(document.body);
                }
            } else {

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
                bottom: "",
                left: "",
                right: "",
                top: ""
            };

            switch (this.css("position")) {
                case "fixed":
                    parent = _cuic2.default.element(window);
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

            if (position.indexOf("top") !== -1) {
                prop.top = 0;
            } else if (position.indexOf("bottom") !== -1) {
                prop.bottom = 0;
            } else {
                prop.top = centerY;
            }

            if (position.indexOf("left") !== -1) {
                prop.left = 0;
            } else if (position.indexOf("right") !== -1) {
                prop.right = 0;
            } else {
                prop.left = centerX;
            }

            var available = this._calculateAvailablePosition(parent);

            if (prop.left < available.minX) {
                prop.left = available.minX;
            } else if (prop.left > available.maxX) {
                prop.left = available.maxX;
            }
            return prop;
        }
    }, {
        key: "_calculateAnchor",
        value: function _calculateAnchor(anchor, anchorPoint, target) {
            if (!anchor || !anchor.length) {
                throw new TypeError("Cannot calculate anchor with no position defined");
            }

            var targetHeight = void 0;
            var targetWidth = void 0;
            var targetOffset = void 0;

            if (target instanceof Array && target.length === 2) {
                targetHeight = 1;
                targetWidth = 1;
                targetOffset = {
                    left: target[0],
                    top: target[1]
                };
            } else {
                target = _cuic2.default.element(target);
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
            var prop = {
                bottom: "",
                left: "",
                right: "",
                top: ""
            };

            if (anchorPoint) {

                if (anchor.indexOf("top") !== -1) {
                    prop.top = targetOffset.top - elCenterY;
                } else if (anchor.indexOf("bottom") !== -1) {
                    prop.top = targetOffset.top - elCenterY + targetHeight;
                } else {
                    prop.top = targetOffset.top - elCenterY + targetCenterY;
                }

                if (anchor.indexOf("left") !== -1) {
                    prop.left = targetOffset.left - elCenterX;
                } else if (anchor.indexOf("right") !== -1) {
                    prop.left = targetOffset.left - elCenterX + targetWidth;
                } else {
                    prop.left = targetOffset.left - elCenterX + targetCenterX;
                }
            } else {

                if (anchor.indexOf("bottom") !== -1) {
                    prop.top = targetOffset.top + targetHeight;
                } else if (anchor.indexOf("top") !== -1) {
                    prop.top = targetOffset.top - elHeight;
                } else {
                    prop.top = targetOffset.top + targetCenterY - elCenterY;
                }

                if (anchor.indexOf("left") !== -1) {
                    prop.left = targetOffset.left - elWidth;
                } else if (anchor.indexOf("right") !== -1) {
                    prop.left = targetOffset.left + targetWidth;
                } else {
                    prop.left = targetOffset.left + targetCenterX - elCenterX;
                }
            }

            if (anchorPoint) {

                if (anchorPoint.indexOf("top") !== -1) {
                    prop.top += elCenterY;
                } else if (anchorPoint.indexOf("bottom") !== -1) {
                    prop.top -= elCenterY;
                }

                if (anchorPoint.indexOf("left") !== -1) {
                    prop.left += elCenterX;
                } else if (anchorPoint.indexOf("right") !== -1) {
                    prop.left -= elCenterX;
                }
            }

            if (this.isFixed()) {
                prop.left -= window.scrollX;
                prop.top -= window.scrollY;
            }
            return prop;
        }
    }, {
        key: "_calculateAvailablePosition",
        value: function _calculateAvailablePosition(parent) {
            parent = parent ? _cuic2.default.element(parent) : this.offsetParent();

            var prop = {
                minX: 0,
                minY: 0,
                maxX: Math.max(0, parent.width() - this.outerWidth(true)),
                maxY: Math.max(0, parent.height() - this.outerHeight(true))
            };

            switch (this.css("position")) {
                case "absolute":
                case "fixed":
                    var prPadding = parent.padding();

                    prop.maxX += prPadding.horizontal;
                    prop.maxY += prPadding.vertical;

                    break;
            }
            return prop;
        }
    }, {
        key: "_calculateAvailableSpace",
        value: function _calculateAvailableSpace(parent) {
            parent = parent ? _cuic2.default.element(parent) : this.offsetParent();
            var elMargin = this.margin();

            var prop = {
                height: parent.height(),
                width: parent.width()
            };

            switch (this.css("position")) {
                case "absolute":
                case "fixed":
                    var prPadding = parent.padding();
                    prop.height += prPadding.vertical;
                    prop.width += prPadding.horizontal;
                    prop.height -= elMargin.vertical;
                    prop.width -= elMargin.horizontal;
                    break;
                case "relative":
                    prop.height -= elMargin.vertical;
                    prop.width -= elMargin.horizontal;
                    break;
            }
            return prop;
        }
    }, {
        key: "_calculateMaximize",
        value: function _calculateMaximize() {
            var parent = this.offsetParent();
            var parentPadding = parent.padding();
            var elMargin = this.margin();
            var prop = {
                bottom: "",
                left: "",
                right: "",
                top: "",
                height: parent.innerHeight() - parentPadding.vertical,
                width: parent.innerWidth() - parentPadding.horizontal
            };

            switch (this.css("position")) {
                case "absolute":
                case "fixed":
                    prop.height += parentPadding.vertical;
                    prop.height -= elMargin.vertical;
                    prop.width += parentPadding.horizontal;
                    prop.width -= elMargin.horizontal;
                    break;

                case "relative":
                    prop.height -= elMargin.vertical;
                    prop.width -= elMargin.horizontal;
                    break;
            }

            if (this.isAligned("right")) {
                prop.right = 0;
            } else {
                prop.left = 0;
            }

            if (this.isAligned("bottom")) {
                prop.bottom = 0;
            } else {
                prop.top = 0;
            }
            return prop;
        }
    }, {
        key: "_calculateMinimize",
        value: function _calculateMinimize(position) {
            position = position || "";

            var clone = this.clone();
            clone.css({ height: "auto", width: "auto" });
            clone.show().appendTo(this.parent());

            var prop = clone._calculateAlign(position);
            prop.height = clone.outerHeight();
            prop.width = clone.outerWidth();
            clone.remove();

            return prop;
        }
    }, {
        key: "_disableTransitions",
        value: function _disableTransitions() {
            this.addClass("no-transition");
            return this;
        }
    }, {
        key: "_display",
        value: function _display() {
            if (!this.hasClass("computing")) {
                this._previousDisplay = this.css("display");

                if (this._previousDisplay === "none") {
                    this.addClass("computing");
                    this.css({ display: "" });

                    if (this.hasClass("hidden")) {
                        this.removeClass("hidden");
                        this._previousClass = "hidden";
                    }
                }
            }
            return this;
        }
    }, {
        key: "_enableTransitions",
        value: function _enableTransitions() {
            this.removeClass("no-transition");
            return this;
        }
    }, {
        key: "_restoreDisplay",
        value: function _restoreDisplay() {
            if (this.hasClass("computing")) {
                this.removeClass("computing");

                if (this._previousClass) {
                    this.addClass(this._previousClass);
                    this.css({ display: this._previousDisplay });
                    this._previousDisplay = null;
                    this._previousClass = null;
                }
            }
            return this;
        }
    }, {
        key: "addClass",
        value: function addClass(className) {
            this.debug("addClass", className);
            var classes = this.getClasses();
            var target = (className || "").split(" ");

            for (var i = 0; i < target.length; i += 1) {

                if (classes.indexOf(target[i]) === -1) {
                    classes.push(target[i]);
                }
            }
            this.node().className = classes.join(" ");
            return this;
        }
    }, {
        key: "addPositionClass",
        value: function addPositionClass(position, prefix) {
            this.debug("addPositionClass", position, prefix);
            var pfx = function pfx(str) {
                return prefix ? prefix + "-" + str : str;
            };

            this.removeClass([pfx("bottom"), pfx("center"), pfx("left"), pfx("right"), pfx("top")].join(" "));

            if (position.indexOf("bottom") !== -1) {
                this.addClass(pfx("bottom"));
            } else if (position.indexOf("top") !== -1) {
                this.addClass(pfx("top"));
            } else {
                this.addClass(pfx("center"));
            }

            if (position.indexOf("left") !== -1) {
                this.addClass(pfx("left"));
            } else if (position.indexOf("right") !== -1) {
                this.addClass(pfx("right"));
            } else {
                this.addClass(pfx("center"));
            }
            return this;
        }
    }, {
        key: "align",
        value: function align() {
            var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options.position;

            if (this.isInDOM() && position) {
                var pos = this.css("position");

                if (["absolute", "fixed"].indexOf(pos) !== -1) {
                    this.debug("align", position);
                    this.css(this._calculateAlign(position));
                    this.addPositionClass(position, "aligned");
                    this.options.position = position;
                    this.events.trigger("aligned", position);
                }
            }
            return this;
        }
    }, {
        key: "alignInParent",
        value: function alignInParent() {
            if (this.isInDOM()) {
                this.debug("alignInParent");
                var alignments = ["bottom", "left", "right", "top"];
                var prop = this.position();

                for (var i = 0; i < alignments.length; i += 1) {
                    if (!this.css(alignments[i])) {
                        prop[alignments[i]] = "";
                    }
                }

                var available = this._calculateAvailablePosition();
                prop = _cuic2.default.constraintPosition(prop, available);

                this.css(prop);
            }
            return this;
        }
    }, {
        key: "alignInScreen",
        value: function alignInScreen() {
            if (this.isInDOM()) {
                this.debug("alignInScreen");
                var alignments = ["bottom", "left", "right", "top"];
                var prop = this.position();

                for (var i = 0; i < alignments.length; i += 1) {
                    if (!this.css(alignments[i])) {
                        prop[alignments[i]] = "";
                    }
                }

                var screen = {
                    minX: 0, maxX: _cuic2.default.element(window).width(),
                    minY: 0, maxY: _cuic2.default.element(window).height()
                };
                var rect = this.positionOnScreen();
                var elWidth = this.outerWidth(true);
                var elHeight = this.outerHeight(true);

                for (var _i = 0; _i < alignments.length; _i += 1) {
                    var location = alignments[_i];
                    var screenPos = rect[location];

                    if (typeof prop[location] === "number") {

                        if (screenPos < 0) {
                            prop[location] += Math.abs(screenPos);
                        } else if (["bottom", "top"].indexOf(location) !== -1) {
                            if (screenPos + elHeight > screen.maxY) {

                                var extraSpace = Math.abs(screen.maxY - Math.abs(rect[location]) - elHeight);
                                prop[location] -= extraSpace;
                            }
                        } else if (["left", "right"].indexOf(location) !== -1) {
                            if (screenPos + elWidth > screen.maxX) {

                                var _extraSpace = Math.abs(screen.maxX - Math.abs(rect[location]) - elWidth);
                                prop[location] -= _extraSpace;
                            }
                        }
                    }
                }

                this.css(prop);
            }
            return this;
        }
    }, {
        key: "anchor",
        value: function anchor(_anchor, anchorPoint, target) {
            if (this.isInDOM() && (_anchor || this.options.anchor)) {

                if (_anchor === undefined) {
                    _anchor = this.options.anchor;
                }

                if (anchorPoint === undefined) {
                    anchorPoint = this.options.anchorPoint;
                }

                if (target === undefined) {
                    target = this.options.target;
                }
                target = _cuic2.default.element(target);
                this.debug("anchor", _anchor, target);
                this.css(this._calculateAnchor(_anchor, anchorPoint, target));
                this.addPositionClass(_anchor, "anchored");
                this.options.anchor = _anchor;
                this.options.anchorPoint = anchorPoint;
                this.options.target = target;
                this.events.trigger("anchored", _anchor);
            }
            return this;
        }
    }, {
        key: "append",
        value: function append(element) {
            var node = this.node();
            this.debug("append", element);

            if (element instanceof _elements.Elements) {
                element.each(function (el) {
                    node.appendChild(el.node());
                });
            } else if (_cuic2.default.isJQuery(element)) {
                element.each(function () {
                    node.appendChild(this);
                });
            } else {
                node.appendChild(_cuic2.default.node(element));
            }
            return this;
        }
    }, {
        key: "appendTo",
        value: function appendTo(element) {
            this.debug("appendTo", element);
            _cuic2.default.node(element).appendChild(this.node());
            return this;
        }
    }, {
        key: "attr",
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
    }, {
        key: "autoFit",
        value: function autoFit() {
            this.alignInParent();
            this.autoResize();
            return this;
        }
    }, {
        key: "autoResize",
        value: function autoResize() {
            if (this.isInDOM()) {
                this.debug("autoResize");
                var available = this._calculateAvailableSpace();

                var prop = {
                    height: this.outerHeight(),
                    width: this.outerWidth()
                };

                if (prop.width && prop.width > available.width) {
                    prop.width = available.width;
                }

                if (prop.height && prop.height > available.height) {
                    prop.height = available.height;
                }

                this.css(prop);
            }
            return this;
        }
    }, {
        key: "border",
        value: function border() {
            var bottom = parseFloat(_cuic2.default.getComputedStyle(this, "border-bottom-width"));
            var left = parseFloat(_cuic2.default.getComputedStyle(this, "border-left-width"));
            var right = parseFloat(_cuic2.default.getComputedStyle(this, "border-right-width"));
            var top = parseFloat(_cuic2.default.getComputedStyle(this, "border-top-width"));
            return {
                bottom: bottom,
                horizontal: left + right,
                left: left,
                right: right,
                top: top,
                vertical: bottom + top
            };
        }
    }, {
        key: "children",
        value: function children(selector) {
            var children = [];
            var nodes = this.node().children || this.node().childNodes;

            for (var i = 0; i < nodes.length; i += 1) {
                if (_cuic2.default.isNode(nodes[i])) {
                    if (!selector || nodes[i].matches(selector)) {
                        children.push(nodes[i]);
                    }
                }
            }
            return new _elements.Elements(children, this.node(), selector);
        }
    }, {
        key: "click",
        value: function click() {
            this.node().click();
            return this;
        }
    }, {
        key: "clone",
        value: function clone() {
            this.debug("clone");
            return _cuic2.default.element(this.node().cloneNode(true));
        }
    }, {
        key: "closest",
        value: function closest(selector) {
            this._display();
            var node = this.node().closest(selector);
            this._restoreDisplay();
            return node ? _cuic2.default.element(node) : null;
        }
    }, {
        key: "css",
        value: function css(styles) {
            var node = this.node();

            if (styles) {
                if ((typeof styles === "undefined" ? "undefined" : _typeof(styles)) === "object") {
                    this.debug("css", styles);

                    _cuic2.default.autoPixel(styles);

                    for (var style in styles) {
                        if (styles.hasOwnProperty(style)) {
                            var value = styles[style];

                            if (!(style in node.style)) {
                                console.warn("Style \"" + style + "\" is not supported by element.", node);
                            }
                            node.style[style] = value;
                        }
                    }
                    return this;
                } else if (typeof styles === "string") {

                    if (styles.indexOf(":") !== -1) {
                        this.debug("css", styles);
                        node.style = styles;
                        return this;
                    } else {

                        switch (styles) {
                            case "display":
                            case "position":
                                return _cuic2.default.getComputedStyle(node, styles);
                        }

                        return node.style[styles];
                    }
                }
            }

            return node.style;
        }
    }, {
        key: "data",
        value: function data(key, value) {
            this.debug("data", key, value);
            var dataSet = this.node().dataset;

            if (value !== undefined) {
                dataSet[_cuic2.default.toCamelCase(key)] = value;
                return this;
            } else if (key) {
                if (typeof key === "string") {
                    return dataSet[_cuic2.default.toCamelCase(key)];
                }
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === "object" && key) {
                    for (var name in key) {
                        if (key.hasOwnProperty(name)) {
                            dataSet[_cuic2.default.toCamelCase(name)] = key[name];
                        }
                    }
                    return this;
                }
            } else {
                return dataSet;
            }
        }
    }, {
        key: "debug",
        value: function debug() {
            if (_cuic2.default.options.debug || this.options.debug) {
                var args = Array.prototype.slice.call(arguments);
                (console.debug || console.log).apply(this, args);
            }
        }
    }, {
        key: "disable",
        value: function disable() {
            this.debug("disable");
            this.node().disabled = true;
            this.addClass("disabled");
            this.events.trigger("disabled");
            return this;
        }
    }, {
        key: "empty",
        value: function empty() {
            this.debug("empty");
            this.html("");
            return this;
        }
    }, {
        key: "enable",
        value: function enable() {
            this.debug("enable");
            this.node().disabled = false;
            this.removeClass("disabled");
            this.events.trigger("enabled");
            return this;
        }
    }, {
        key: "enterFullScreen",
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
    }, {
        key: "find",
        value: function find(selector) {
            var context = this.node();
            var elements = context.querySelectorAll(selector);
            return new _elements.Elements(elements, context, selector);
        }
    }, {
        key: "getClasses",
        value: function getClasses() {
            return this.node().className.split(" ");
        }
    }, {
        key: "hasClass",
        value: function hasClass(className) {
            var classes = this.getClasses();
            var classNames = (className || "").split(" ");
            var result = classNames.length > 0;

            for (var i = 0; i < classNames.length; i += 1) {
                if (classes.indexOf(classNames[i]) === -1) {
                    result = false;
                    break;
                }
            }
            return result;
        }
    }, {
        key: "hasParent",
        value: function hasParent() {
            return !!this.parentNode();
        }
    }, {
        key: "height",
        value: function height() {
            var node = this.node();
            var height = void 0;

            if (node instanceof Window) {
                height = node.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            } else {
                this._display();
                height = node.clientHeight;
                this._restoreDisplay();
                height -= this.padding().vertical;
            }
            return height;
        }
    }, {
        key: "hide",
        value: function hide() {
            this.debug("hide");

            this.addClass("hidden");
            this.events.trigger("hidden");
            return this;
        }
    }, {
        key: "html",
        value: function html(_html) {
            if (_html !== undefined) {

                if (_html && (typeof _html === "undefined" ? "undefined" : _typeof(_html)) === "object") {
                    if (_cuic2.default.isNode(_html)) {
                        this.empty();
                        this.append(_html);
                    } else if (_html instanceof Element) {
                        this.empty();
                        this.append(_html.node());
                    } else if (_cuic2.default.isJQuery(_html)) {
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
    }, {
        key: "innerHeight",
        value: function innerHeight() {
            var node = this.node();
            var height = void 0;

            if (node instanceof Window) {
                height = this.height();
            } else {

                this._display();
                height = node.clientHeight;
                this._restoreDisplay();
            }
            return height;
        }
    }, {
        key: "innerWidth",
        value: function innerWidth() {
            var node = this.node();
            var width = void 0;

            if (node instanceof Window) {
                width = this.width();
            } else {

                this._display();
                width = node.clientWidth;
                this._restoreDisplay();
            }
            return width;
        }
    }, {
        key: "insertAfter",
        value: function insertAfter(element) {
            this.debug("insertAfter", element);
            var node = _cuic2.default.node(element);
            var parentNode = this.parentNode();
            parentNode.insertBefore(node, this.node().nextSibling);
            return this;
        }
    }, {
        key: "insertBefore",
        value: function insertBefore(element) {
            this.debug("insertBefore", element);
            var node = _cuic2.default.node(element);
            var parentNode = this.parentNode();
            parentNode.insertBefore(node, this.node());
            return this;
        }
    }, {
        key: "isAbsolute",
        value: function isAbsolute() {
            return this.css("position") === "absolute";
        }
    }, {
        key: "isAligned",
        value: function isAligned(position) {
            var result = false;

            if (this.options.position) {
                var pos = (position || "").split(" ");
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
    }, {
        key: "isAnchored",
        value: function isAnchored(position) {
            var result = false;

            if (this.options.anchor) {
                var pos = (position || "").split(" ");
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
    }, {
        key: "isChildOf",
        value: function isChildOf(parent) {
            parent = _cuic2.default.node(parent);
            var node = this.node();

            do {
                node = node.parentNode;

                if (node === parent) {
                    return true;
                }
            } while (node);

            return false;
        }
    }, {
        key: "isDisabled",
        value: function isDisabled() {
            return this.node().disabled || this.hasClass("disabled");
        }
    }, {
        key: "isEnabled",
        value: function isEnabled() {
            return this.node().disabled !== true || !this.hasClass("disabled");
        }
    }, {
        key: "isFixed",
        value: function isFixed() {
            return this.css("position") === "fixed";
        }
    }, {
        key: "isHidden",
        value: function isHidden() {
            return this.hasClass("hidden") || this.css("display") === "none";
        }
    }, {
        key: "isInDOM",
        value: function isInDOM() {
            return document.body.contains(this.node()) || !!this.offsetParent();
        }
    }, {
        key: "isMaximized",
        value: function isMaximized() {
            return this.hasClass("maximized") || this.hasClass("maximized-x maximized-y") || this.css("width") === "100%" && this.css("height") === "100%";
        }
    }, {
        key: "isMaximizedX",
        value: function isMaximizedX() {
            return this.hasClass("maximized-x") || this.css("width") === "100%";
        }
    }, {
        key: "isMaximizedY",
        value: function isMaximizedY() {
            return this.hasClass("maximized-y") || this.css("height") === "100%";
        }
    }, {
        key: "isMinimized",
        value: function isMinimized() {
            return this.hasClass("minimized");
        }
    }, {
        key: "isPosition",
        value: function isPosition(position) {
            var pos = this.position();

            if (position.indexOf("center") !== -1) {
                return pos.top === pos.bottom || pos.left === pos.right;
            }
            if (position.indexOf("bottom") !== -1) {
                return pos.bottom < pos.top;
            }
            if (position.indexOf("top") !== -1) {
                return pos.top < pos.bottom;
            }
            if (position.indexOf("left") !== -1) {
                return pos.left < pos.right;
            }
            if (position.indexOf("right") !== -1) {
                return pos.right < pos.left;
            }
            return false;
        }
    }, {
        key: "isRelative",
        value: function isRelative() {
            return this.css("position") === "relative";
        }
    }, {
        key: "isRemoved",
        value: function isRemoved() {
            var parent = this.node().parentNode;
            return parent === null || parent === undefined;
        }
    }, {
        key: "isShown",
        value: function isShown() {
            return !this.hasClass("hidden") && this.css("display") !== "none";
        }
    }, {
        key: "isStatic",
        value: function isStatic() {
            return this.css("position") === "static";
        }
    }, {
        key: "margin",
        value: function margin() {
            var bottom = 0;
            var left = 0;
            var right = 0;
            var top = 0;

            if (!(this.node() instanceof Window)) {
                bottom = parseFloat(_cuic2.default.getComputedStyle(this, "margin-bottom"));
                left = parseFloat(_cuic2.default.getComputedStyle(this, "margin-left"));
                right = parseFloat(_cuic2.default.getComputedStyle(this, "margin-right"));
                top = parseFloat(_cuic2.default.getComputedStyle(this, "margin-top"));
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
    }, {
        key: "maximize",
        value: function maximize(callback) {
            var _this = this;

            this.debug("maximize");
            this.events.trigger("maximize");
            this.removeClass("minimized");
            this.addClass("maximized");
            this.css(this._calculateMaximize());
            this.once("transitionend", function (ev) {
                if (_this.isMaximized()) {
                    _this.debug("maximized");
                    _this.events.trigger("maximized", ev);

                    if (typeof callback === "function") {
                        callback.call(_this, ev);
                    }
                }
            });
            return this;
        }
    }, {
        key: "maximizeX",
        value: function maximizeX(callback) {
            var _this2 = this;

            this.debug("maximizeX");
            this.events.trigger("maximizeX");
            this.removeClass("minimized");
            this.addClass("maximized-x");
            var prop = this._calculateMaximize();
            this.css({ width: prop.width, left: prop.left, right: prop.right });
            this.once("transitionend", function (ev) {
                if (_this2.isMaximizedX()) {
                    _this2.debug("maximizedX");
                    _this2.events.trigger("maximizedX", ev);

                    if (typeof callback === "function") {
                        callback.call(_this2, ev);
                    }
                }
            });
            return this;
        }
    }, {
        key: "maximizeY",
        value: function maximizeY(callback) {
            var _this3 = this;

            this.debug("maximizeY");
            this.events.trigger("maximizeY");
            this.removeClass("minimized");
            this.addClass("maximized-y");
            var prop = this._calculateMaximize();
            this.css({ height: prop.height, top: prop.top, bottom: prop.bottom });
            this.once("transitionend", function (ev) {
                if (_this3.isMaximizedY()) {
                    _this3.debug("maximizedY");
                    _this3.events.trigger("maximizedY", ev);

                    if (typeof callback === "function") {
                        callback.call(_this3, ev);
                    }
                }
            });
            return this;
        }
    }, {
        key: "minimize",
        value: function minimize(callback) {
            var _this4 = this;

            this.debug("minimize");
            this.events.trigger("minimize");
            this.removeClass("maximized maximized-x maximized-y");
            this.addClass("minimized");
            this.css(this._calculateMinimize(this.options.position));
            this.once("transitionend", function (ev) {
                if (_this4.isMinimized()) {
                    _this4.debug("minimized");
                    _this4.events.trigger("minimized", ev);

                    if (typeof callback === "function") {
                        callback.call(_this4, ev);
                    }
                }
            });
            return this;
        }
    }, {
        key: "node",
        value: function node() {
            return this.element;
        }
    }, {
        key: "off",
        value: function off(event, callback) {
            _cuic2.default.off(event, this.node(), callback);
            return this;
        }
    }, {
        key: "offset",
        value: function offset() {
            var node = this.node();
            this._display();
            var offset = { left: node.offsetLeft, top: node.offsetTop };
            this._restoreDisplay();
            return offset;
        }
    }, {
        key: "offsetParent",
        value: function offsetParent() {
            var parent = this.offsetParentNode();
            return parent ? _cuic2.default.element(parent) : null;
        }
    }, {
        key: "offsetParentNode",
        value: function offsetParentNode() {
            this._display();
            var parent = this.node().offsetParent || document.body;
            this._restoreDisplay();
            return parent;
        }
    }, {
        key: "on",
        value: function on(event, callback) {
            _cuic2.default.on(event, this.node(), callback);
            return this;
        }
    }, {
        key: "once",
        value: function once(event, callback) {
            _cuic2.default.once(event, this.node(), callback);
            return this;
        }
    }, {
        key: "onAligned",
        value: function onAligned(callback) {
            this.events.on("aligned", callback);
            return this;
        }
    }, {
        key: "onAnchored",
        value: function onAnchored(callback) {
            this.events.on("anchored", callback);
            return this;
        }
    }, {
        key: "onMaximize",
        value: function onMaximize(callback) {
            this.events.on("maximize", callback);
        }
    }, {
        key: "onMaximized",
        value: function onMaximized(callback) {
            this.events.on("maximized", callback);
        }
    }, {
        key: "onMinimize",
        value: function onMinimize(callback) {
            this.events.on("minimize", callback);
        }
    }, {
        key: "onMinimized",
        value: function onMinimized(callback) {
            this.events.on("minimized", callback);
        }
    }, {
        key: "onRemoved",
        value: function onRemoved(callback) {
            this.events.on("removed", callback);
            return this;
        }
    }, {
        key: "outerHeight",
        value: function outerHeight() {
            var includeMargin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var node = this.node();
            var height = void 0;

            if (node instanceof Window) {
                height = this.height();
            } else {
                this._display();
                height = node.offsetHeight;
                this._restoreDisplay();

                if (includeMargin) {
                    height += this.margin().vertical;
                }
            }
            return height;
        }
    }, {
        key: "outerWidth",
        value: function outerWidth() {
            var includeMargin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var node = this.node();
            var width = void 0;

            if (node instanceof Window) {
                width = this.width();
            } else {
                this._display();
                width = node.offsetWidth;
                this._restoreDisplay();

                if (includeMargin) {
                    width += this.margin().horizontal;
                }
            }
            return width;
        }
    }, {
        key: "padding",
        value: function padding() {
            var bottom = 0;
            var left = 0;
            var right = 0;
            var top = 0;

            if (!(this.node() instanceof Window)) {
                bottom = parseFloat(_cuic2.default.getComputedStyle(this, "padding-bottom"));
                left = parseFloat(_cuic2.default.getComputedStyle(this, "padding-left"));
                right = parseFloat(_cuic2.default.getComputedStyle(this, "padding-right"));
                top = parseFloat(_cuic2.default.getComputedStyle(this, "padding-top"));
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
    }, {
        key: "parent",
        value: function parent() {
            var parent = this.parentNode();
            return parent ? _cuic2.default.element(parent) : null;
        }
    }, {
        key: "parentNode",
        value: function parentNode() {
            return this.node().parentNode;
        }
    }, {
        key: "position",
        value: function position() {
            this._display();
            var bottom = parseFloat(_cuic2.default.getComputedStyle(this, "bottom"));
            var left = parseFloat(_cuic2.default.getComputedStyle(this, "left"));
            var right = parseFloat(_cuic2.default.getComputedStyle(this, "right"));
            var top = parseFloat(_cuic2.default.getComputedStyle(this, "top"));
            this._restoreDisplay();
            return {
                bottom: bottom,
                left: left,
                right: right,
                top: top
            };
        }
    }, {
        key: "positionOnScreen",
        value: function positionOnScreen() {
            return _cuic2.default.extend({}, this.node().getBoundingClientRect());
        }
    }, {
        key: "prepend",
        value: function prepend(element) {
            var self = this;

            this.debug("prepend", element);

            if (element instanceof _elements.Elements) {
                element.each(function (el) {
                    el.preprendTo(self);
                });
            } else if (_cuic2.default.isJQuery(element)) {
                element.each(function () {
                    _cuic2.default.element(this).preprendTo(self);
                });
            } else {
                _cuic2.default.element(element).preprendTo(self);
            }
            return this;
        }
    }, {
        key: "prependTo",
        value: function prependTo(element) {
            this.debug("prependTo", element);
            var el = _cuic2.default.element(element);

            if (el.children().length) {
                el.children().first().insertBefore(this.node());
            } else {
                el.append(this);
            }

            return this;
        }
    }, {
        key: "remove",
        value: function remove() {
            this.debug("remove");
            this.node().remove();
            this.events.trigger("removed");
            return this;
        }
    }, {
        key: "removeClass",
        value: function removeClass(className) {
            this.debug("removeClass", className);
            var classes = this.getClasses();
            var classNames = (className || "").split(" ");

            for (var i = 0; i < classNames.length; i += 1) {
                var index = classes.indexOf(classNames[i]);

                if (index !== -1) {
                    classes.splice(index, 1);
                }
            }
            this.node().className = classes.join(" ");
            return this;
        }
    }, {
        key: "scrollLeft",
        value: function scrollLeft() {
            return this.node().scrollLeft;
        }
    }, {
        key: "scrollTop",
        value: function scrollTop() {
            return this.node().scrollTop;
        }
    }, {
        key: "show",
        value: function show() {
            this.debug("show");
            this.css({ display: "" });
            this.removeClass("hidden");
            this.events.trigger("shown");
            return this;
        }
    }, {
        key: "text",
        value: function text(_text) {
            var node = this.node();
            this.debug("text", _text);

            if (_text !== undefined) {
                if (node.innerText !== undefined) {
                    node.innerText = _text;
                } else {
                    node.textContent = _text;
                }
                return this;
            } else if (node.hasOwnProperty("textContent")) {
                return node.textContent;
            } else {
                return _cuic2.default.stripTags(node.innerHTML);
            }
        }
    }, {
        key: "val",
        value: function val(value) {
            this.debug("val", value);

            if (value !== undefined) {
                this.node().value = value;
                return this;
            } else {
                return this.node().value;
            }
        }
    }, {
        key: "width",
        value: function width() {
            var node = this.node();
            var width = void 0;

            if (node instanceof Window) {
                width = node.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            } else {
                this._display();
                width = node.clientWidth;
                this._restoreDisplay();
                width -= this.padding().horizontal;
            }
            return width;
        }
    }]);

    return Element;
}();

exports.Element = Element;


Element.prototype.options = {
    className: null,
    css: null,
    debug: false,
    maximized: false,
    maximizedX: false,
    maximizedY: false,
    namespace: null,
    parent: null
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Collection = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(5);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = exports.Collection = function () {
    function Collection(values) {
        _classCallCheck(this, Collection);

        this.events = new _events.Events();
        this.values = values instanceof Array ? values : [];
        this.length = this.values.length;
    }

    _createClass(Collection, [{
        key: "add",
        value: function add(value) {
            this.values.push(value);
            this.length += 1;
            this.events.trigger("added", value);
        }
    }, {
        key: "each",
        value: function each(callback) {
            for (var i = 0; i < this.values.length; i += 1) {
                callback.call(this, this.values[i]);
            }
        }
    }, {
        key: "get",
        value: function get(index) {
            return this.values[index];
        }
    }, {
        key: "indexOf",
        value: function indexOf(value) {
            return this.values.indexOf(value);
        }
    }, {
        key: "onAdded",
        value: function onAdded(callback) {
            this.events.on("added", callback);
            return this;
        }
    }, {
        key: "onRemoved",
        value: function onRemoved(callback) {
            this.events.on("removed", callback);
            return this;
        }
    }, {
        key: "remove",
        value: function remove(value) {
            var index = this.values.indexOf(value);

            if (index !== -1) {
                this.values.splice(index, 1);
                this.length -= 1;
                this.events.trigger("removed", value);
            }
        }
    }, {
        key: "size",
        value: function size() {
            return this.values.length;
        }
    }]);

    return Collection;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Closable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _component = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Closable = exports.Closable = function (_Component) {
    _inherits(Closable, _Component);

    function Closable(node, attributes, options) {
        _classCallCheck(this, Closable);

        options = _cuic2.default.extend({}, Closable.prototype.options, options);

        var _this = _possibleConstructorReturn(this, (Closable.__proto__ || Object.getPrototypeOf(Closable)).call(this, node, attributes, options));

        if (_this.options.closable) {
            _this.addClass("closable");
        }

        if (_this.options.opened !== undefined) {
            if (_this.options.opened) {
                _this.open();
            } else {
                _this.hide(); // Hide to avoid animations
                _this.close();
            }
        }
        return _this;
    }

    _createClass(Closable, [{
        key: "close",
        value: function close(callback) {
            var _this2 = this;

            this.debug("close");
            this.events.trigger("close");
            this.removeClass("opened");
            this.addClass("closed");
            this.once("transitionend", function (ev) {
                if (!_this2.isOpened()) {
                    _this2.debug("closed");
                    _this2.events.trigger("closed", ev);
                    _this2.hide();

                    if (typeof callback === "function") {
                        callback.call(_this2, ev);
                    }
                }
            });
            return this;
        }
    }, {
        key: "isOpened",
        value: function isOpened() {
            return this.hasClass("opened");
        }
    }, {
        key: "onClose",
        value: function onClose(callback) {
            this.events.on("close", callback);
        }
    }, {
        key: "onClosed",
        value: function onClosed(callback) {
            this.events.on("closed", callback);
        }
    }, {
        key: "onOpen",
        value: function onOpen(callback) {
            this.events.on("open", callback);
        }
    }, {
        key: "onOpened",
        value: function onOpened(callback) {
            this.events.on("opened", callback);
        }
    }, {
        key: "open",
        value: function open(callback) {
            var _this3 = this;

            this.debug("open");
            this.show();
            this.events.trigger("open");
            this.removeClass("closed");
            this.addClass("opened");
            this.once("transitionend", function (ev) {
                if (_this3.isOpened()) {
                    _this3.debug("opened");
                    _this3.events.trigger("opened", ev);

                    if (typeof callback === "function") {
                        callback.call(_this3, ev);
                    }
                }
            });
            return this;
        }
    }, {
        key: "toggle",
        value: function toggle(callback) {
            if (this.isOpened()) {
                this.close(callback);
            } else {
                this.open(callback);
            }
            return this;
        }
    }]);

    return Closable;
}(_component.Component);

Closable.prototype.options = {
    closable: false,
    opened: true
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Component = undefined;

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _element = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = exports.Component = function (_Element) {
    _inherits(Component, _Element);

    function Component(node, attributes, options) {
        _classCallCheck(this, Component);

        options = _cuic2.default.extend({}, Component.prototype.options, options);

        var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, node, attributes, options));

        _this.addClass("component");
        return _this;
    }

    return Component;
}(_element.Element);

Component.prototype.options = {};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Events = exports.Events = function () {
    function Events(context) {
        _classCallCheck(this, Events);

        this.callbacks = {};
        this.context = context;
    }

    _createClass(Events, [{
        key: "clear",
        value: function clear() {
            this.callbacks = [];
        }
    }, {
        key: "off",
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
    }, {
        key: "on",
        value: function on(event, callback) {
            if (!(this.callbacks[event] instanceof Array)) {
                this.callbacks[event] = [];
            }
            this.callbacks[event].push(callback);
        }
    }, {
        key: "once",
        value: function once(event, callback) {
            var _arguments = arguments,
                _this = this;

            if (!(this.callbacks[event] instanceof Array)) {
                this.callbacks[event] = [];
            }
            var cb = function cb() {
                var args = Array.prototype.slice.call(_arguments);
                var context = args.shift();
                callback.apply(context, args);
                _this.off(event, cb);
            };
            this.callbacks[event].push(cb);
        }
    }, {
        key: "trigger",
        value: function trigger(event) {
            if (this.callbacks[event] instanceof Array) {
                var result = void 0;
                var cb = this.callbacks[event];
                var args = Array.prototype.slice.call(arguments, 1);

                for (var i = 0; i < cb.length; i += 1) {
                    result = cb[i].apply(this.context, args);
                }
                return result;
            }
        }
    }]);

    return Events;
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Group = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _closable = __webpack_require__(3);

var _collection = __webpack_require__(2);

var _element = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Group = exports.Group = function (_Closable) {
    _inherits(Group, _Closable);

    function Group(node, attributes, options) {
        _classCallCheck(this, Group);

        options = _cuic2.default.extend({}, Group.prototype.options, options);

        var _this = _possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).call(this, node, _cuic2.default.extend({
            className: options.className,
            role: "group"
        }, attributes), options));

        _this.addClass("component-group");

        _this.components = new _collection.Collection();
        return _this;
    }

    _createClass(Group, [{
        key: "addComponent",
        value: function addComponent(component) {
            if (!(component instanceof _element.Element)) {
                throw new TypeError("Cannot add object to the group.");
            }
            this.events.trigger("addComponent", component);

            if (this.isAligned("top")) {
                component.prependTo(this);
            } else {
                component.appendTo(this);
            }
            this.components.add(component);
            return this;
        }
    }, {
        key: "onAddComponent",
        value: function onAddComponent(callback) {
            this.events.on("addComponent", callback);
            return this;
        }
    }, {
        key: "onComponentAdded",
        value: function onComponentAdded(callback) {
            this.components.onAdded(callback);
            return this;
        }
    }, {
        key: "onComponentRemoved",
        value: function onComponentRemoved(callback) {
            this.components.onRemoved(callback);
            return this;
        }
    }, {
        key: "onRemoveComponent",
        value: function onRemoveComponent(callback) {
            this.events.on("removeComponent", callback);
            return this;
        }
    }, {
        key: "removeComponent",
        value: function removeComponent(component) {
            this.events.trigger("removeComponent", component);
            this.components.remove(component);
            return this;
        }
    }]);

    return Group;
}(_closable.Closable);

Group.prototype.options = {
    namespace: "group"
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Button = undefined;

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _component = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = exports.Button = function (_Component) {
    _inherits(Button, _Component);

    function Button(options) {
        _classCallCheck(this, Button);

        options = _cuic2.default.extend({}, Button.prototype.options, options, {
            mainClass: "btn"
        });

        var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, "button", {
            className: options.className,
            disabled: false,
            html: options.label,
            title: options.title,
            type: options.type
        }, options));

        if (typeof options.shortcut === "number") {
            _this.shortcut = new _cuic2.default.Shortcut({
                keyCode: options.shortcut,
                target: _this.element,
                callback: function callback() {
                    _this.click();
                }
            });
        }
        return _this;
    }

    return Button;
}(_component.Component);

Button.prototype.options = {
    className: "btn-default",
    disabled: false,
    label: null,
    shortcut: null,
    title: null,
    type: "button"
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Shortcut = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Shortcut = exports.Shortcut = function () {
    function Shortcut(options) {
        _classCallCheck(this, Shortcut);

        options = _cuic2.default.extend({}, Shortcut.prototype.options, options);
        this.options = options;

        this.options.element = _cuic2.default.node(options.element);

        if (typeof this.options.callback !== "function") {
            throw new TypeError("Shortcut.options.callback is not a function.");
        }

        if (this.options.active) {
            this.activate();
        }
    }

    _createClass(Shortcut, [{
        key: "activate",
        value: function activate() {
            var _this = this;

            var options = this.options;
            var element = this.node();
            _cuic2.default.on("keydown", element, function (ev) {
                if ((options.keyCode === ev.keyCode || options.key === ev.key || options.key === ev.code) && options.altKey === ev.altKey && options.ctrlKey === ev.ctrlKey && options.shiftKey === ev.shiftKey) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    options.callback.call(_this, element, ev);
                    return false;
                }
            });
        }
    }, {
        key: "deactivate",
        value: function deactivate() {
            _cuic2.default.off("keydown", this.node(), this.options.callback);
        }
    }, {
        key: "node",
        value: function node() {
            return _cuic2.default.node(this.options.element);
        }
    }]);

    return Shortcut;
}();

Shortcut.prototype.options = {
    active: true,
    altKey: false,
    callback: null,
    ctrlKey: false,
    element: document.body,
    key: null,
    keyCode: null,
    shiftKey: false
};

_cuic2.default.keys = {
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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Elements = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Elements = function () {
    function Elements(elements, context, selector) {
        _classCallCheck(this, Elements);

        var i = void 0;

        for (i = 0; i < elements.length; i += 1) {
            if (elements.hasOwnProperty(i)) {
                this[i] = _cuic2.default.element(elements[i]);
            }
        }

        this.length = i;
        this.context = context;
        this.selector = selector;
    }

    _createClass(Elements, [{
        key: "addClass",
        value: function addClass(className) {
            return this.each(function (el) {
                el.addClass(className);
            });
        }
    }, {
        key: "align",
        value: function align(position) {
            return this.each(function (el) {
                el.align(position);
            });
        }
    }, {
        key: "anchor",
        value: function anchor(position, anchorPoint, target) {
            return this.each(function (el) {
                el.anchor(position, anchorPoint, target);
            });
        }
    }, {
        key: "append",
        value: function append(element) {
            return this.each(function (el) {
                el.append(element);
            });
        }
    }, {
        key: "attr",
        value: function attr(name, value) {
            return this.each(function (el) {
                el.attr(name, value);
            });
        }
    }, {
        key: "click",
        value: function click() {
            return this.each(function (el) {
                el.click();
            });
        }
    }, {
        key: "css",
        value: function css(styles) {
            return this.each(function (el) {
                el.css(styles);
            });
        }
    }, {
        key: "each",
        value: function each(callback) {
            for (var _i = 0; _i < this.length; _i += 1) {
                callback.call(this[_i], this[_i], _i);
            }
            return this;
        }
    }, {
        key: "empty",
        value: function empty() {
            return this.each(function (el) {
                el.empty();
            });
        }
    }, {
        key: "eq",
        value: function eq(index) {
            return this[index];
        }
    }, {
        key: "filter",
        value: function filter(selector) {
            var elements = [];

            if (typeof selector === "string") {
                this.each(function (el) {
                    if (el.node().matches(selector)) {
                        elements.push(el);
                    }
                });
            }
            return new Elements(elements, this.context, selector);
        }
    }, {
        key: "find",
        value: function find(selector) {
            var elements = [];

            if (typeof selector === "string") {
                this.each(function (el) {
                    el.find(selector).each(function (el2) {
                        elements.push(el2);
                    });
                });
            }
            return new Elements(elements, this.context, selector);
        }
    }, {
        key: "first",
        value: function first() {
            return this.length ? this[0] : null;
        }
    }, {
        key: "get",
        value: function get(index) {
            return this[index].node();
        }
    }, {
        key: "hide",
        value: function hide() {
            return this.each(function (el) {
                el.hide();
            });
        }
    }, {
        key: "html",
        value: function html(_html) {
            return this.each(function (el) {
                el.html(_html);
            });
        }
    }, {
        key: "index",
        value: function index(element) {
            for (var _i2 = 0; _i2 < this.length; _i2 += 1) {
                if (this.eq(_i2) === element || this.get(_i2) === element) {
                    return _i2;
                }
            }
            return -1;
        }
    }, {
        key: "last",
        value: function last() {
            return this.length ? this[this.length - 1] : null;
        }
    }, {
        key: "not",
        value: function not(selector) {
            var elements = [];

            if (typeof selector === "string") {
                this.each(function (el) {
                    if (!el.node().matches(selector)) {
                        elements.push(el);
                    }
                });
            }
            return new Elements(elements, this.context);
        }
    }, {
        key: "off",
        value: function off(event, callback) {
            return this.each(function (el) {
                el.off(event, callback);
            });
        }
    }, {
        key: "once",
        value: function once(event, callback) {
            return this.each(function (el) {
                el.once(event, callback);
            });
        }
    }, {
        key: "on",
        value: function on(event, callback) {
            return this.each(function (el) {
                el.on(event, callback);
            });
        }
    }, {
        key: "prepend",
        value: function prepend(element) {
            return this.each(function (el) {
                el.prepend(element);
            });
        }
    }, {
        key: "remove",
        value: function remove() {
            return this.each(function (el) {
                el.remove();
            });
        }
    }, {
        key: "removeClass",
        value: function removeClass(className) {
            return this.each(function (el) {
                el.removeClass(className);
            });
        }
    }, {
        key: "show",
        value: function show() {
            return this.each(function (el) {
                el.show();
            });
        }
    }, {
        key: "text",
        value: function text(_text) {
            return this.each(function (el) {
                el.text(_text);
            });
        }
    }, {
        key: "toggleClass",
        value: function toggleClass(className) {
            return this.each(function (el) {
                el.toggleClass(className);
            });
        }
    }, {
        key: "val",
        value: function val(value) {
            if (value !== undefined) {
                return this.each(function (el) {
                    el.val(value);
                });
            } else if (this.length) {
                return this.eq(0).val();
            }
        }
    }]);

    return Elements;
}();

exports.Elements = Elements;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Overlay = undefined;

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _closable = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Overlay = exports.Overlay = function (_Closable) {
    _inherits(Overlay, _Closable);

    function Overlay(options) {
        _classCallCheck(this, Overlay);

        options = _cuic2.default.extend({}, Overlay.prototype.options, options, {
            mainClass: "overlay"
        });

        var _this = _possibleConstructorReturn(this, (Overlay.__proto__ || Object.getPrototypeOf(Overlay)).call(this, "div", { className: options.className }, options));

        _this.on("click", function () {
            if (_this.options.autoClose) {
                _this.close();
            }
        });

        _this.onClosed(function () {
            if (_this.options.autoRemove) {
                _this.remove();
            }
        });
        return _this;
    }

    return Overlay;
}(_closable.Closable);

Overlay.prototype.options = {
    autoClose: false,
    autoRemove: false,
    namespace: "overlay",
    opened: false,
    zIndex: 1
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Movable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _collection = __webpack_require__(2);

var _component = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Movable = exports.Movable = function (_Component) {
    _inherits(Movable, _Component);

    function Movable(options) {
        _classCallCheck(this, Movable);

        options = _cuic2.default.extend({}, Movable.prototype.options, options);

        var _this = _possibleConstructorReturn(this, (Movable.__proto__ || Object.getPrototypeOf(Movable)).call(this, "div", { className: options.className }, options));

        _this.addClass("movable");

        if (_this.isStatic()) {
            _this.css({ position: "relative" });
        }

        _this.handles = new _collection.Collection();

        _this.addMoveHandle(options.handle || _this.node());
        return _this;
    }

    _createClass(Movable, [{
        key: "addMoveHandle",
        value: function addMoveHandle(handle) {
            var _this2 = this;

            handle = _cuic2.default.element(handle);

            this.handles.add(handle);

            handle.addClass("movable-handle");

            _cuic2.default.on("mousedown", handle, function (ev) {

                if (_this2.options.rootOnly && ev.target !== ev.currentTarget) return;

                if (_this2.events.trigger("moveStart", ev) === false) return;

                ev.preventDefault();

                _this2.addClass("moving");

                var startPosition = _this2.position();
                var startX = ev.clientX;
                var startY = ev.clientY;

                var onMouseMove = function onMouseMove(ev) {

                    if (_this2.events.trigger("move", ev) === false) return;

                    var prop = { bottom: "auto" };

                    if (_this2.options.horizontally) {
                        var diffX = ev.clientX - startX;
                        prop.left = startPosition.left + diffX;
                        prop.right = "auto";
                    }

                    if (_this2.options.vertically) {
                        var diffY = ev.clientY - startY;
                        prop.top = startPosition.top + diffY;
                        prop.bottom = "auto";
                    }

                    if (_this2.options.constraintToParent) {
                        var available = _this2._calculateAvailablePosition();
                        prop = _cuic2.default.constraintPosition(prop, available);
                        _this2.alignInParent();
                    }

                    _this2.css(prop);
                };

                _cuic2.default.on("mousemove", document, onMouseMove);

                _cuic2.default.once("mouseup", document, function (ev) {
                    _cuic2.default.off("mousemove", document, onMouseMove);
                    _this2.removeClass("moving");
                    _this2.events.trigger("moveEnd", ev);
                });
            });
            return this;
        }
    }, {
        key: "onMove",
        value: function onMove(callback) {
            this.events.on("move", callback);
            return this;
        }
    }, {
        key: "onMoveEnd",
        value: function onMoveEnd(callback) {
            this.events.on("moveEnd", callback);
            return this;
        }
    }, {
        key: "onMoveStart",
        value: function onMoveStart(callback) {
            this.events.on("moveStart", callback);
            return this;
        }
    }]);

    return Movable;
}(_component.Component);

Movable.prototype.options = {
    constraintToParent: true,
    handle: null,
    handleClassName: "movable-handle",
    horizontally: true,
    namespace: "movable",
    rootOnly: true,
    vertically: true
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Resizable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _collection = __webpack_require__(2);

var _component = __webpack_require__(4);

var _element = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Resizable = exports.Resizable = function (_Component) {
    _inherits(Resizable, _Component);

    function Resizable(options) {
        _classCallCheck(this, Resizable);

        options = _cuic2.default.extend({}, Resizable.prototype.options, options);

        var _this = _possibleConstructorReturn(this, (Resizable.__proto__ || Object.getPrototypeOf(Resizable)).call(this, "div", { className: options.className }, options));

        _this.addClass("resizable");

        if (_this.isStatic()) {
            _this.css("position", "relative");
        }

        _this.bottomHandle = new _element.Element("div", {
            className: "resize-handle resize-handle-s",
            css: { height: options.handleSize }
        }).appendTo(_this);

        _this.rightHandle = new _element.Element("div", {
            className: "resize-handle resize-handle-e",
            css: { width: options.handleSize }
        }).appendTo(_this);

        _this.bottomRightHandle = new _element.Element("div", {
            className: "resize-handle resize-handle-se",
            css: {
                height: options.handleSize,
                width: options.handleSize
            }
        }).appendTo(_this);

        _this.handles = new _collection.Collection([_this.rightHandle, _this.bottomHandle, _this.bottomRightHandle]);

        _this.horizontalHandles = new _collection.Collection([_this.rightHandle, _this.bottomRightHandle]);

        _this.verticalHandles = new _collection.Collection([_this.bottomHandle, _this.bottomRightHandle]);

        _this.handles.each(function (handle) {

            handle.on("mousedown", function (ev) {

                if (_this.events.trigger("resizeStart", ev) === false) return;

                ev.preventDefault();

                _this.addClass("resizing");

                var startX = ev.clientX;
                var startY = ev.clientY;
                var initialHeight = _this.outerHeight();
                var initialWidth = _this.outerWidth();
                var handleTarget = ev.currentTarget;

                var ratio = initialHeight / initialWidth;

                var onMouseMove = function onMouseMove(ev) {

                    if (_this.events.trigger("resize", ev) === false) return;

                    var prop = {};

                    if (_this.options.horizontally) {
                        for (var i = 0; i < _this.horizontalHandles.length; i += 1) {
                            if (_this.horizontalHandles.get(i).node() === handleTarget) {
                                var diffX = ev.clientX - startX;
                                var width = initialWidth + diffX;

                                if ((!Number(_this.options.maxWidth) || width <= _this.options.maxWidth) && (!Number(_this.options.minWidth) || width >= _this.options.minWidth)) {
                                    prop.width = width;
                                }
                                break;
                            }
                        }
                    }

                    if (_this.options.vertically) {
                        for (var _i = 0; _i < _this.verticalHandles.length; _i += 1) {
                            if (_this.verticalHandles.get(_i).node() === handleTarget) {
                                var diffY = ev.clientY - startY;
                                var height = initialHeight + diffY;

                                if ((!Number(_this.options.maxHeight) || height <= _this.options.maxHeight) && (!Number(_this.options.minHeight) || height >= _this.options.minHeight)) {
                                    prop.height = height;
                                }
                                break;
                            }
                        }
                    }

                    if (_this.options.keepRatio) {
                        if (prop.height) {
                            prop.width = prop.height / ratio;
                        } else if (prop.width) {
                            prop.height = prop.width * ratio;
                        }
                    }

                    _this.css(prop);
                    _this.autoResize();
                };

                _cuic2.default.on("mousemove", document, onMouseMove);

                _cuic2.default.once("mouseup", document, function (ev) {
                    _cuic2.default.off("mousemove", document, onMouseMove);
                    _this.removeClass("resizing");
                    _this.events.trigger("resizeEnd", ev);
                });
            });
        });
        return _this;
    }

    _createClass(Resizable, [{
        key: "onResize",
        value: function onResize(callback) {
            this.events.on("resize", callback);
            return this;
        }
    }, {
        key: "onResizeEnd",
        value: function onResizeEnd(callback) {
            this.events.on("resizeEnd", callback);
            return this;
        }
    }, {
        key: "onResizeStart",
        value: function onResizeStart(callback) {
            this.events.on("resizeStart", callback);
            return this;
        }
    }]);

    return Resizable;
}(_component.Component);

Resizable.prototype.options = {
    handleSize: 10,
    horizontally: true,
    keepRatio: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 1,
    minWidth: 1,
    namespace: "resizable",
    vertically: true
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Popup = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _closable = __webpack_require__(3);

var _collection = __webpack_require__(2);

var _element = __webpack_require__(1);

var _shortcut = __webpack_require__(8);

var _group = __webpack_require__(6);

var _button = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Popup = exports.Popup = function (_Closable) {
    _inherits(Popup, _Closable);

    function Popup(options) {
        _classCallCheck(this, Popup);

        options = _cuic2.default.extend({}, Popup.prototype.options, options, {
            mainClass: "popup"
        });

        var _this = _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).call(this, "div", { className: options.className }, options));

        _this.tail = new _element.Element("span", {
            className: "popup-tail"
        }).appendTo(_this);

        _this.header = new _element.Element("header", {
            className: "popup-header",
            css: { display: !!_this.options.title ? "block" : "none" }
        }).appendTo(_this);

        _this.title = new _element.Element("h5", {
            className: "popup-title",
            html: _this.options.title
        }).appendTo(_this.header);

        _this.content = new _element.Element("div", {
            className: "popup-content",
            html: options.content
        }).appendTo(_this);

        _this.footer = new _element.Element("footer", {
            className: "popup-footer",
            css: { display: !!_this.options.buttons ? "block" : "none" }
        }).appendTo(_this);

        _this.buttons = new _group.Group("div", {
            className: "btn-group guide-buttons"
        }).appendTo(_this.footer);

        _this.buttons.onComponentAdded(function () {
            if (_this.buttons.components.length > 0) {
                _this.footer.show();
            }
        });

        _this.buttons.onComponentRemoved(function () {
            if (_this.buttons.components.length < 1) {
                _this.footer.hide();
            }
        });

        if (_this.options.buttons instanceof Array) {
            for (var i = 0; i < _this.options.buttons.length; i += 1) {
                _this.addButton(_this.options.buttons[i]);
            }
        }

        if (!(_this.options.buttons instanceof Array) || _this.options.buttons.length < 1) {
            _this.footer.hide();
        }

        _this.shortcuts = {
            close: new _shortcut.Shortcut({
                element: _this,
                keyCode: _cuic2.default.keys.ESC,
                callback: function callback() {
                    _this.close();
                }
            })
        };

        var autoClose = function autoClose(ev) {
            if (_this.isOpened() && _this.options.autoClose) {
                if (ev.target !== _this.node() && !_cuic2.default.element(ev.target).isChildOf(_this)) {
                    _this.close();
                }
            }
        };

        _this.on("click", function (ev) {

            if (_cuic2.default.element(ev.target).hasClass("btn-close")) {
                ev.preventDefault();
                _this.close();
            }
        });

        _this.onAnchored(function () {
            _this.updateTail();
        });

        _this.onClosed(function () {
            _cuic2.default.off("click", document, autoClose);

            if (_this.options.autoRemove) {
                _this.remove();
            }
        });

        _this.onOpen(function () {
            var target = _cuic2.default.element(_this.options.target);
            _this.appendTo(target.parent());

            var anchor = target.data("anchor") || _this.options.anchor;
            var anchorPoint = target.data("anchor-point") || _this.options.anchorPoint;
            _this.anchor(anchor, anchorPoint, target);
        });

        _this.onOpened(function () {

            _cuic2.default.on("click", document, autoClose);
        });

        _cuic2.default.popups.add(_this);
        return _this;
    }

    _createClass(Popup, [{
        key: "addButton",
        value: function addButton(button) {
            var _this2 = this;

            if (!(button instanceof _button.Button)) {
                var callback = button.callback;

                button = new _button.Button(_cuic2.default.extend({
                    className: "btn btn-default " + button.className,
                    label: button.label
                }, button));

                if (typeof callback === "function") {
                    button.on("click", function (ev) {
                        callback.call(_this2, ev);
                    });
                }
            }

            this.buttons.addComponent(button);
            return button;
        }
    }, {
        key: "getContent",
        value: function getContent() {
            return this.content;
        }
    }, {
        key: "getFooter",
        value: function getFooter() {
            return this.footer;
        }
    }, {
        key: "getHeader",
        value: function getHeader() {
            return this.header;
        }
    }, {
        key: "setContent",
        value: function setContent(html) {
            this.content.html(html);
            return this;
        }
    }, {
        key: "setFooter",
        value: function setFooter(html) {
            this.footer.html(html);
            return this;
        }
    }, {
        key: "setHeader",
        value: function setHeader(html) {
            this.header.html(html);
            return this;
        }
    }, {
        key: "setTitle",
        value: function setTitle(html) {
            this.title.html(html);

            if (html !== null) {
                this.header.show();
            }
            return this;
        }
    }, {
        key: "updateTail",
        value: function updateTail() {
            var prop = {
                bottom: "",
                left: "",
                right: "",
                top: ""
            };

            this.tail.removeClass("popup-tail-bottom popup-tail-left popup-tail-right popup-tail-top");

            if (this.isAnchored("bottom")) {
                this.tail.addClass("popup-tail-top");
            }

            if (this.isAnchored("top")) {
                this.tail.addClass("popup-tail-bottom");
            }

            if (this.isAnchored("left")) {
                this.tail.addClass("popup-tail-right");
            }

            if (this.isAnchored("right")) {
                this.tail.addClass("popup-tail-left");
            }

            this.tail.css(prop);

            return this;
        }
    }]);

    return Popup;
}(_closable.Closable);

Popup.prototype.options = {
    anchor: "top",
    autoClose: true,
    autoRemove: false,
    content: null,
    namespace: "popup",
    opened: false,
    target: null,
    zIndex: 9
};

_cuic2.default.popups = new _collection.Collection();

_cuic2.default.onWindowResized(function () {
    _cuic2.default.popups.each(function (popup) {
        if (popup.isInDOM() && popup.isShown()) {
            popup._disableTransitions();
            popup.anchor();
            popup._enableTransitions();
        }
    });
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Notification = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _closable = __webpack_require__(3);

var _collection = __webpack_require__(2);

var _element = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Notification = exports.Notification = function (_Closable) {
    _inherits(Notification, _Closable);

    function Notification(options) {
        _classCallCheck(this, Notification);

        options = _cuic2.default.extend({}, Notification.prototype.options, options, {
            mainClass: "notification"
        });

        var _this = _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).call(this, "div", { className: options.className }, options));

        _this.closeTimer = null;

        _this.content = new _element.Element("div", {
            className: "notification-content",
            html: options.content
        }).appendTo(_this);

        _this.closeButton = new _element.Element("span", {
            className: _this.options.closeButtonClass,
            html: _this.options.closeButton,
            role: "button"
        }).addClass("btn-close").appendTo(_this);

        _this.on("mouseenter", function (ev) {
            clearTimeout(_this.closeTimer);
        });

        _this.on("mouseleave", function (ev) {
            if (ev.currentTarget === _this.node()) {
                _this.autoClose();
            }
        });

        _this.on("click", function (ev) {

            if (_cuic2.default.element(ev.target).hasClass("btn-close")) {
                ev.preventDefault();
                _this.close();
            }
        });

        _this.onClosed(function () {
            if (_this.options.autoRemove) {
                _this.remove();
            }
        });

        _this.onOpen(function () {
            if (_this.options.position) {
                _this.align();
            }
        });

        _this.onOpened(function () {
            _this.autoClose();
        });

        _this.onRemoved(function () {
            _cuic2.default.notifications.remove(_this);
        });

        _cuic2.default.notifications.add(_this);
        return _this;
    }

    _createClass(Notification, [{
        key: "autoClose",
        value: function autoClose() {
            var _this2 = this;

            clearTimeout(this.closeTimer);
            this.closeTimer = setTimeout(function () {
                if (_this2.options.autoClose) {
                    _this2.close();
                }
            }, this.options.duration);
        }
    }, {
        key: "getContent",
        value: function getContent() {
            return this.content;
        }
    }, {
        key: "setContent",
        value: function setContent(html) {
            this.content.html(html);
            return this;
        }
    }]);

    return Notification;
}(_closable.Closable);

Notification.prototype.options = {
    autoClose: true,
    autoRemove: true,
    closable: true,
    closeButton: null,
    closeButtonClass: "glyphicon glyphicon-remove-sign",
    content: null,
    duration: 2000,
    namespace: "notification",
    opened: false,
    parent: document.body,
    position: "center",
    zIndex: 100
};

_cuic2.default.notifications = new _collection.Collection();

_cuic2.default.onWindowResized(function () {
    _cuic2.default.notifications.each(function (n) {
        if (n.isInDOM()) {
            n.align();
        }
    });
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _benchmark = __webpack_require__(16);

var _button = __webpack_require__(7);

var _closable = __webpack_require__(3);

var _collection = __webpack_require__(2);

var _dialog = __webpack_require__(17);

var _element = __webpack_require__(1);

var _elements = __webpack_require__(9);

var _events = __webpack_require__(5);

var _group = __webpack_require__(6);

var _guide = __webpack_require__(18);

var _hook = __webpack_require__(19);

var _movable = __webpack_require__(11);

var _notification = __webpack_require__(14);

var _notificationStack = __webpack_require__(20);

var _overlay = __webpack_require__(10);

var _panel = __webpack_require__(21);

var _popup = __webpack_require__(13);

var _resizable = __webpack_require__(12);

var _selectable = __webpack_require__(22);

var _shortcut = __webpack_require__(8);

var _switcher = __webpack_require__(23);

var _tooltip = __webpack_require__(24);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_cuic2.default.Button = _button.Button;
_cuic2.default.Closable = _closable.Closable;
_cuic2.default.Dialog = _dialog.Dialog;
_cuic2.default.Element = _element.Element;
_cuic2.default.Elements = _elements.Elements;
_cuic2.default.Group = _group.Group;
_cuic2.default.Guide = _guide.Guide;
_cuic2.default.Hook = _hook.Hook;
_cuic2.default.Movable = _movable.Movable;
_cuic2.default.Notification = _notification.Notification;
_cuic2.default.NotificationStack = _notificationStack.NotificationStack;
_cuic2.default.Overlay = _overlay.Overlay;
_cuic2.default.Panel = _panel.Panel;
_cuic2.default.Popup = _popup.Popup;
_cuic2.default.Resizable = _resizable.Resizable;
_cuic2.default.Selectable = _selectable.Selectable;
_cuic2.default.Switcher = _switcher.Switcher;
_cuic2.default.Tooltip = _tooltip.Tooltip;

_cuic2.default.Benchmark = _benchmark.Benchmark;
_cuic2.default.Collection = _collection.Collection;
_cuic2.default.Events = _events.Events;
_cuic2.default.Shortcut = _shortcut.Shortcut;

exports.default = _cuic2.default;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Benchmark = exports.Benchmark = function Benchmark() {
    _classCallCheck(this, Benchmark);

    var startTime = null;
    var stopTime = null;
    var time = 0;

    this.getTime = function () {
        if (startTime && stopTime) {
            return stopTime - startTime;
        } else if (startTime) {
            return Date.now() - startTime;
        } else {
            return 0;
        }
    };

    this.isStarted = function () {
        return typeof startTime === "number";
    };

    this.reset = function () {
        time = 0;
        startTime = null;
        stopTime = null;
    };

    this.start = function () {
        startTime = Date.now();
        stopTime = null;
    };

    this.stop = function () {
        startTime = null;
        stopTime = Date.now();
    };
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Dialog = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _button = __webpack_require__(7);

var _closable = __webpack_require__(3);

var _collection = __webpack_require__(2);

var _element = __webpack_require__(1);

var _overlay = __webpack_require__(10);

var _group = __webpack_require__(6);

var _movable = __webpack_require__(11);

var _resizable = __webpack_require__(12);

var _shortcut = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dialog = exports.Dialog = function (_Closable) {
    _inherits(Dialog, _Closable);

    function Dialog(options) {
        _classCallCheck(this, Dialog);

        options = _cuic2.default.extend({}, Dialog.prototype.options, options, {
            mainClass: "dialog"
        });

        var _this = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this, "div", {
            className: options.className,
            role: "dialog"
        }, options));

        if (_this.parentNode() === document.body) {
            _this.css({ position: "absolute" });
        }

        _this.overlay = new _overlay.Overlay({
            className: "overlay dialog-overlay",
            autoClose: false,
            autoRemove: false,
            opened: false
        }).appendTo(_this.options.parent);

        _this.header = new _element.Element("header", {
            className: "dialog-header",
            css: { display: !!_this.options.title ? "block" : "none" }
        }).appendTo(_this);

        _this.title = new _element.Element("h3", {
            className: "dialog-title",
            html: _this.options.title
        }).appendTo(_this.header);

        _this.content = new _element.Element("section", {
            className: "dialog-content",
            html: _this.options.content
        }).appendTo(_this);

        _this.footer = new _element.Element("footer", {
            className: "dialog-footer",
            css: { display: !!_this.options.buttons ? "block" : "none" }
        }).appendTo(_this);

        _this.buttons = new _group.Group("div", {
            className: "btn-group"
        }).appendTo(_this.footer);

        _this.closeButton = new _element.Element("span", {
            className: _this.options.closeButtonClass,
            html: _this.options.closeButton,
            role: "button"
        }).addClass("btn-close").appendTo(_this.header);

        _this.buttons.onComponentAdded(function () {
            if (_this.buttons.components.length > 0) {
                _this.footer.show();
            }
        });

        _this.buttons.onComponentRemoved(function () {
            if (_this.buttons.components.length < 1) {
                _this.footer.hide();
            }
        });

        if (_this.options.buttons instanceof Array) {
            for (var i = 0; i < _this.options.buttons.length; i += 1) {
                _this.addButton(_this.options.buttons[i]);
            }
        }

        if (!(_this.options.buttons instanceof Array) || _this.options.buttons.length < 1) {
            _this.footer.hide();
        }

        if (parseFloat(options.contentHeight) > 0) {
            _this.content.css({ height: options.contentHeight });
        }

        if (parseFloat(options.contentWidth) > 0) {
            _this.content.css({ width: options.contentWidth });
        }

        if (_this.options.movable) {
            _this.movable = new _movable.Movable({
                constraintToParent: true,
                enabled: _this.options.movable,
                element: _this.node(),
                handle: _this.header,
                rootOnly: false
            });
            _this.movable.onMoveStart(function (ev) {
                if (_cuic2.default.element(ev.target).hasClass("btn-close")) {
                    return false;
                }
            });
        }

        if (_this.options.resizable) {
            _this.resizable = new _resizable.Resizable({
                enabled: _this.options.resizable,
                element: _this.node()
            });
        }

        _this.shortcuts = {
            close: new _shortcut.Shortcut({
                element: _this,
                keyCode: _cuic2.default.keys.ESC,
                callback: function callback() {
                    _this.close();
                }
            })
        };

        _this.overlay.on("click", function () {
            if (_this.options.autoClose) {
                _this.close();
            }
        });

        _this.on("click", function (ev) {

            if (_cuic2.default.element(ev.target).hasClass("btn-close")) {
                ev.preventDefault();
                _this.close();
            }
        });

        _this.onClose(function () {
            _this.overlay.options.autoRemove = _this.options.autoRemove;
            _this.overlay.close();
        });

        _this.onClosed(function () {
            if (_this.options.autoRemove) {
                _this.remove();
                _this.overlay.remove();
            }
        });

        _this.onOpen(function () {

            var zIndex = Math.max(_this.options.zIndex, _cuic2.default.dialogs.getCurrentZIndex() + 1);

            _this.css({ "z-index": zIndex });
            _this.resizeContent();

            if (_this.options.modal) {
                _this.css({ "z-index": zIndex + 1 });
                _this.overlay.css({ "z-index": zIndex });
                _this.overlay.open();
            }

            if (_this.options.maximized) {
                _this.maximize();
            } else {
                _this.align(_this.options.position);
            }

            var buttons = _this.buttons.children();

            if (buttons.length > 0) {
                buttons.last().node().focus();
            }
        });

        _this.onRemoved(function () {
            _cuic2.default.dialogs.remove(_this);
        });

        _cuic2.default.dialogs.add(_this);
        return _this;
    }

    _createClass(Dialog, [{
        key: "addButton",
        value: function addButton(button) {
            var _this2 = this;

            if (!(button instanceof _button.Button)) {
                var callback = button.callback;

                button = new _button.Button(_cuic2.default.extend({
                    className: "btn btn-default " + button.className,
                    label: button.label
                }, button));

                if (typeof callback === "function") {
                    button.on("click", function (ev) {
                        callback.call(_this2, ev);
                    });
                } else if (callback === "close") {
                    button.on("click", function () {
                        _this2.close();
                    });
                }
            }

            this.buttons.addComponent(button);
            return button;
        }
    }, {
        key: "getBody",
        value: function getBody() {
            return this.content;
        }
    }, {
        key: "getContent",
        value: function getContent() {
            return this.content;
        }
    }, {
        key: "getFooter",
        value: function getFooter() {
            return this.footer;
        }
    }, {
        key: "getHeader",
        value: function getHeader() {
            return this.header;
        }
    }, {
        key: "resizeContent",
        value: function resizeContent() {

            var available = this._calculateAvailableSpace();

            this.css({
                "max-height": available.height,
                "max-width": available.width
            });

            var maxHeight = available.height;

            if (this.header instanceof _element.Element && this.header.isShown()) {
                maxHeight -= this.header.outerHeight(true);
            }

            if (this.footer instanceof _element.Element && this.footer.isShown()) {
                maxHeight -= this.footer.outerHeight(true);
            }

            maxHeight -= this.content.margin().vertical;

            this.content.css({ "max-height": maxHeight });
            return this;
        }
    }, {
        key: "setContent",
        value: function setContent(html) {
            this.content.html(html);
            return this;
        }
    }, {
        key: "setFooter",
        value: function setFooter(html) {
            this.footer.html(html);
            return this;
        }
    }, {
        key: "setHeader",
        value: function setHeader(html) {
            this.header.html(html);
            return this;
        }
    }, {
        key: "setTitle",
        value: function setTitle(html) {
            this.title.html(html);

            if (html !== null) {
                this.header.show();
            }
            return this;
        }
    }]);

    return Dialog;
}(_closable.Closable);

Dialog.prototype.options = {
    autoClose: false,
    autoRemove: true,
    autoResize: true,
    buttons: [],
    closable: true,
    closeButton: null,
    closeButtonClass: "glyphicon glyphicon-remove-sign",
    content: null,
    contentHeight: null,
    contentWidth: null,
    movable: true,
    maximized: false,
    modal: true,
    namespace: "dialog",
    opened: false,
    parent: document.body,
    position: "center",
    resizable: false,
    title: null,
    zIndex: 10
};

_cuic2.default.dialogs = new _collection.Collection();

_cuic2.default.dialogs.getCurrentZIndex = function () {
    var zIndex = 0;

    _cuic2.default.dialogs.each(function (dialog) {
        var index = parseInt(dialog.css("z-index"));

        if (index > zIndex) {
            zIndex = index;
        }
    });
    return zIndex;
};

_cuic2.default.onWindowResized(function () {
    _cuic2.default.dialogs.each(function (dialog) {
        if (dialog.isInDOM()) {
            dialog.resizeContent();
        }
    });
});

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Guide = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _popup = __webpack_require__(13);

var _events = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Guide = exports.Guide = function () {
    function Guide(options) {
        _classCallCheck(this, Guide);

        this.options = _cuic2.default.extend({}, Guide.prototype.options, options, {
            mainClass: "guide",
            className: "guide guide-popup"
        });

        this.popup = new _popup.Popup(_cuic2.default.extend({}, options, {
            mainClass: "guide",
            className: "guide guide-popup"
        }));
        this.popup.guide = this;

        this.events = new _events.Events(this);

        this.step = -1;
        this.steps = [];

        if (this.options.autoStart) {
            this.start();
        }
    }

    _createClass(Guide, [{
        key: "addStep",
        value: function addStep(options) {

            if (!options.target) {
                throw new TypeError("Guide.addStep(options) must have a 'target' option");
            }
            if (!options.title) {
                throw new TypeError("Guide.addStep(options) must have a 'title' option");
            }
            if (!options.content) {
                throw new TypeError("Guide.addStep(options) must have a 'content' option");
            }

            this.steps.push(_cuic2.default.extend({
                title: null,
                content: null,
                buttons: null
            }, options));

            return this;
        }
    }, {
        key: "getCurrentStep",
        value: function getCurrentStep() {
            return this.step >= this.steps.length ? this.steps[this.step] : null;
        }
    }, {
        key: "getPopup",
        value: function getPopup() {
            return this.popup;
        }
    }, {
        key: "getSteps",
        value: function getSteps() {
            return this.steps;
        }
    }, {
        key: "goTo",
        value: function goTo(number) {
            var _this = this;

            number = Number.parseInt(number);

            if (typeof number === "number" && !isNaN(number) && number >= 0 && number < this.steps.length) {
                this.step = Number.parseInt(number);
                var step = this.steps[this.step];

                this.popup.setTitle(step.title);
                this.popup.setContent(step.content);
                this.popup.buttons.empty();

                if (step.buttons instanceof Array) {
                    step.buttons.forEach(function (button) {
                        _this.popup.addButton(button);
                    });
                }

                var target = _cuic2.default.element(step.target);
                var anchor = target.data("anchor") || this.options.anchor;
                var anchorPoint = target.data("anchor-point") || this.options.anchorPoint;
                this.popup.anchor(anchor, anchorPoint, target);
                this.popup.open();
                this.events.trigger("stepChanged", this.step, step);
            }
            return this;
        }
    }, {
        key: "next",
        value: function next() {
            if (this.step + 1 >= this.steps.length) {
                return this.stop();
            } else {
                return this.goTo(this.step + 1);
            }
        }
    }, {
        key: "onStepChanged",
        value: function onStepChanged(callback) {
            this.events.on("stepChanged", callback);
        }
    }, {
        key: "onStarted",
        value: function onStarted(callback) {
            this.events.on("started", callback);
        }
    }, {
        key: "onStopped",
        value: function onStopped(callback) {
            this.events.on("stopped", callback);
        }
    }, {
        key: "previous",
        value: function previous() {
            return this.goTo(this.step - 1);
        }
    }, {
        key: "start",
        value: function start() {
            this.goTo(0);
            this.events.trigger("started");
            return this;
        }
    }, {
        key: "stop",
        value: function stop() {
            this.popup.close();
            this.events.trigger("stopped");
            return this;
        }
    }]);

    return Guide;
}();

Guide.prototype.options = {
    anchor: "top",
    autoClose: true,
    autoRemove: false,
    autoStart: false,
    content: null,
    duration: 5000,
    namespace: "guide",
    opened: false,
    zIndex: 9
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Hook = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _element = __webpack_require__(1);

var _component = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hook = exports.Hook = function (_Component) {
    _inherits(Hook, _Component);

    function Hook(options) {
        _classCallCheck(this, Hook);

        options = _cuic2.default.extend({}, Hook.prototype.options, options);

        var _this = _possibleConstructorReturn(this, (Hook.__proto__ || Object.getPrototypeOf(Hook)).call(this, "div", { className: options.className }, options));

        _this.addClass("hook");

        _this.css({
            position: "relative",
            top: "",
            width: ""
        });

        _this.space = new _element.Element("div", {
            className: "hook-space"
        });

        var offset = _this.offset();

        var onScroll = function onScroll() {
            var fitsInScreen = _this.outerHeight(true) <= window.screen.availHeight;

            if (fitsInScreen) {
                if (_this.options.fixed) {
                    _this.hook();
                } else {
                    var margin = _this.margin();

                    if (window.scrollY > offset.top - margin.top) {
                        _this.hook();
                    } else {
                        _this.unhook();
                    }
                }
            } else {
                _this.unhook();
            }
        };

        onScroll();

        window.onscroll = function () {
            onScroll();
        };
        window.onresize = function () {
            onScroll();
        };
        return _this;
    }

    _createClass(Hook, [{
        key: "hook",
        value: function hook() {
            if (this.css("position") !== "fixed") {
                var offset = this.offset();
                var margin = this.margin();

                if (this.options.fixed) {
                    this.options.offsetTop = offset.top;
                }

                this.space.css({
                    display: this.css("display"),
                    float: this.css("float"),
                    height: this.outerHeight(),
                    width: this.outerWidth(),
                    "margin-bottom": margin.bottom,
                    "margin-left": margin.left,
                    "margin-right": margin.right,
                    "margin-top": margin.top
                });
                this.insertBefore(this.space);
                this.space.show();

                this.css({
                    position: "fixed",
                    left: offset.left,
                    top: this.options.offsetTop,
                    height: this.space.height(),
                    width: this.space.width(),
                    zIndex: this.options.zIndex
                });
                this.addClass("hooked");

                this.onHook(this);
            }
        }
    }, {
        key: "isHooked",
        value: function isHooked() {
            return this.hasClass("hooked");
        }
    }, {
        key: "onHook",
        value: function onHook() {}
    }, {
        key: "onUnhook",
        value: function onUnhook() {}
    }, {
        key: "unhook",
        value: function unhook() {
            if (this.css("position") !== "relative") {
                this.space.hide();
                this.css({
                    position: "relative",
                    bottom: "",
                    left: "",
                    right: "",
                    top: "",
                    width: ""
                });
                this.removeClass("hooked");

                this.onUnhook(this);
            }
        }
    }]);

    return Hook;
}(_component.Component);

Hook.prototype.options = {
    fixed: true,
    hookedClass: "hooked",

    zIndex: 4
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NotificationStack = undefined;

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _group = __webpack_require__(6);

var _notification = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationStack = exports.NotificationStack = function (_Group) {
    _inherits(NotificationStack, _Group);

    function NotificationStack(options) {
        _classCallCheck(this, NotificationStack);

        options = _cuic2.default.extend({}, NotificationStack.prototype.options, options, {
            mainClass: "notification-stack"
        });

        var _this = _possibleConstructorReturn(this, (NotificationStack.__proto__ || Object.getPrototypeOf(NotificationStack)).call(this, "div", { className: options.className }, options));

        if (_this.options.position) {
            _this.align();
        }

        _this.onComponentAdded(function (component) {
            if (component instanceof _notification.Notification) {

                setTimeout(function () {
                    component.open();
                }, 10);
            }
        });

        _this.onComponentRemoved(function (component) {
            if (component instanceof _notification.Notification) {
                component.close();
            }
        });
        return _this;
    }

    return NotificationStack;
}(_group.Group);

NotificationStack.prototype.options = {
    namespace: "notification-stack",
    position: "right top",
    zIndex: 10
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Panel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _closable = __webpack_require__(3);

var _collection = __webpack_require__(2);

var _element = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Panel = exports.Panel = function (_Closable) {
    _inherits(Panel, _Closable);

    function Panel(options) {
        _classCallCheck(this, Panel);

        options = _cuic2.default.extend({}, Panel.prototype.options, options, {
            mainClass: "panel"
        });

        var _this = _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).call(this, "div", { className: options.className }, options));

        if (options.element) {
            _this.header = _this.find(".panel-header").eq(0);
            _this.title = _this.find(".panel-title").eq(0);
            _this.content = _this.find(".panel-content").eq(0);
            _this.footer = _this.find(".panel-footer").eq(0);
            _this.closeButton = _this.find(".panel-header .btn-close").eq(0);
        } else {

            _this.header = new _element.Element("header", {
                className: "panel-header"
            }).prependTo(_this);

            _this.title = new _element.Element("h5", {
                className: "panel-title",
                html: options.title
            }).appendTo(_this.header);

            _this.closeButton = new _element.Element("span", {
                className: _this.options.closeButtonClass,
                html: _this.options.closeButton,
                role: "button"
            }).addClass("btn-close").appendTo(_this.header);

            _this.content = new _element.Element("section", {
                className: "panel-content",
                html: options.content
            }).appendTo(_this);

            _this.footer = new _element.Element("footer", {
                className: "panel-footer",
                html: options.footer
            }).appendTo(_this);

            if (!options.title) {
                _this.header.hide();
            }

            if (!options.footer) {
                _this.footer.hide();
            }
        }

        if (_this.isOpened()) {
            _this.align();
            _this.resizeContent();
        }

        if (_this.hasParent()) {
            _this.parent().css({ overflow: "hidden" });
        }

        var autoClose = function autoClose(ev) {
            if (_this.isOpened() && _this.options.autoClose) {
                if (ev.target !== _this.node() && !_cuic2.default.element(ev.target).isChildOf(_this)) {
                    _this.close();
                }
            }
        };

        _this.on("click", function (ev) {

            if (_cuic2.default.element(ev.target).hasClass("btn-close")) {
                ev.preventDefault();
                _this.close();
            }

            if (_cuic2.default.element(ev.target).hasClass("btn-toggle")) {
                ev.preventDefault();
                _this.toggle();
            }
        });

        _this.onClose(function () {
            var height = _this.outerHeight(true);
            var width = _this.outerWidth(true);
            var prop = {};

            if (_this.isAligned("right")) {
                prop.right = -width;
                prop.left = "";
            } else if (_this.isAligned("left")) {
                prop.left = -width;
                prop.right = "";
            }

            if (_this.isAligned("bottom")) {
                prop.bottom = -height;
                prop.top = "";
            } else if (_this.isAligned("top")) {
                prop.top = -height;
                prop.bottom = "";
            }

            _this.css(prop);
        });

        _this.onClosed(function () {
            _cuic2.default.off("click", document, autoClose);
        });

        _this.onMaximized(function () {

            if (!_this.isOpened()) {
                var prop = {};

                if (_this.isAligned("left")) {
                    prop.left = -_this.outerWidth(true);
                    prop.right = "";
                } else if (_this.isAligned("right")) {
                    prop.right = -_this.outerWidth(true);
                    prop.left = "";
                }

                if (_this.isAligned("bottom")) {
                    prop.bottom = -_this.outerHeight(true);
                    prop.top = "";
                } else if (_this.isAligned("top")) {
                    prop.top = -_this.outerHeight(true);
                    prop.bottom = "";
                }
                _this.css(prop);
            }
        });

        _this.onMinimize(function () {

            if (!_this.isOpened()) {
                var prop = {};

                if (_this.isAligned("left")) {
                    prop.left = -_this.outerWidth(true);
                    prop.right = "";
                } else if (_this.isAligned("right")) {
                    prop.right = -_this.outerWidth(true);
                    prop.left = "";
                }

                if (_this.isAligned("bottom")) {
                    prop.bottom = -_this.outerHeight(true);
                    prop.top = "";
                } else if (_this.isAligned("top")) {
                    prop.top = -_this.outerHeight(true);
                    prop.bottom = "";
                }
                _this.css(prop);
            }
        });

        _this.onOpen(function () {
            _this.resizeContent();
            _this.align();
        });

        _this.onOpened(function () {

            _cuic2.default.on("click", document, autoClose);
        });

        _cuic2.default.panels.add(_this);
        return _this;
    }

    _createClass(Panel, [{
        key: "getBody",
        value: function getBody() {
            return this.content;
        }
    }, {
        key: "getContent",
        value: function getContent() {
            return this.content;
        }
    }, {
        key: "getFooter",
        value: function getFooter() {
            return this.footer;
        }
    }, {
        key: "getHeader",
        value: function getHeader() {
            return this.header;
        }
    }, {
        key: "resizeContent",
        value: function resizeContent() {

            var available = this._calculateAvailableSpace();

            this.css({
                "max-height": available.height,
                "max-width": available.width
            });

            var maxHeight = available.height;

            if (this.header instanceof _element.Element) {
                maxHeight -= this.header.outerHeight(true);
            }

            if (this.footer instanceof _element.Element) {
                maxHeight -= this.footer.outerHeight(true);
            }

            maxHeight -= this.content.margin().vertical;

            this.content.css({ "max-height": maxHeight });
            return this;
        }
    }, {
        key: "setContent",
        value: function setContent(html) {
            this.content.html(html);
            return this;
        }
    }, {
        key: "setFooter",
        value: function setFooter(html) {
            this.footer.html(html);
            return this;
        }
    }, {
        key: "setHeader",
        value: function setHeader(html) {
            this.header.html(html);
            return this;
        }
    }, {
        key: "setTitle",
        value: function setTitle(html) {
            this.title.html(html);
            this.header.show();
            return this;
        }
    }]);

    return Panel;
}(_closable.Closable);

Panel.prototype.options = {
    autoClose: false,
    closable: true,
    closeButton: null,
    closeButtonClass: "glyphicon glyphicon-remove-sign",
    content: null,
    footer: null,
    maximized: false,
    namespace: "panel",
    opened: false,
    parent: null,
    position: "left top",
    title: null,
    zIndex: 1
};

_cuic2.default.panels = new _collection.Collection();

_cuic2.default.onWindowResized(function () {
    _cuic2.default.panels.each(function (panel) {
        if (panel.isInDOM()) {
            panel.align();
            panel.resizeContent();
        }
    });
});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Selectable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _component = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Selectable = exports.Selectable = function (_Component) {
    _inherits(Selectable, _Component);

    function Selectable(options) {
        _classCallCheck(this, Selectable);

        options = _cuic2.default.extend({}, Selectable.prototype.options, options);

        var _this = _possibleConstructorReturn(this, (Selectable.__proto__ || Object.getPrototypeOf(Selectable)).call(this, "div", { className: options.className }, options));

        _this.addClass("selectable");

        if (_this.options.selected) {
            _this.addClass("selected");
        }

        _this.on("click", function () {
            if (_this.hasClass("selected")) {
                _this.deselect();
            } else {
                _this.select();
            }
        });
        return _this;
    }

    _createClass(Selectable, [{
        key: "deselect",
        value: function deselect(callback) {
            var _this2 = this;

            this.removeClass("selected");
            this.once("transitionend", function (ev) {
                if (!_this2.isSelected()) {
                    _this2.events.trigger("deselected", ev);

                    if (typeof callback === "function") {
                        callback.call(_this2, ev);
                    }
                }
            });
            return this;
        }
    }, {
        key: "isSelected",
        value: function isSelected() {
            return (this.hasClass("selected") || this.attr("selected")) === true;
        }
    }, {
        key: "onDeselected",
        value: function onDeselected(callback) {
            this.events.on("deselected", callback);
            return this;
        }
    }, {
        key: "onSelected",
        value: function onSelected(callback) {
            this.events.on("selected", callback);
            return this;
        }
    }, {
        key: "select",
        value: function select(callback) {
            var _this3 = this;

            this.addClass("selected");
            this.once("transitionend", function (ev) {
                if (_this3.isSelected()) {
                    _this3.events.trigger("selected", ev);

                    if (typeof callback === "function") {
                        callback.call(_this3, ev);
                    }
                }
            });
            return this;
        }
    }]);

    return Selectable;
}(_component.Component);

Selectable.prototype.options = {
    namespace: "selectable",
    selected: false
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Switcher = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _closable = __webpack_require__(3);

var _collection = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Switcher = exports.Switcher = function (_Closable) {
    _inherits(Switcher, _Closable);

    function Switcher(options) {
        _classCallCheck(this, Switcher);

        options = _cuic2.default.extend({}, Switcher.prototype.options, options, {
            mainClass: "switcher"
        });

        var _this = _possibleConstructorReturn(this, (Switcher.__proto__ || Object.getPrototypeOf(Switcher)).call(this, "div", {
            className: options.className,
            html: options.content
        }, options));

        _this.activeElement = null;
        _this.index = 0;
        _this.timer = null;

        _this.goTo(0);

        if (_this.options.autoStart) {
            _this.start();
        }

        _cuic2.default.switchers.add(_this);
        return _this;
    }

    _createClass(Switcher, [{
        key: "first",
        value: function first() {
            this.goTo(0);
        }
    }, {
        key: "getActiveElement",
        value: function getActiveElement() {
            return this.activeElement;
        }
    }, {
        key: "getElementAt",
        value: function getElementAt(index) {
            return this.children().eq(index);
        }
    }, {
        key: "getIndex",
        value: function getIndex() {
            return this.children().index(this.activeElement);
        }
    }, {
        key: "goTo",
        value: function goTo(position) {
            var children = this.children();
            var repeat = this.options.repeat;

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

                for (var i = 0; i < children.length; i += 1) {
                    var child = _cuic2.default.element(children[i]);

                    if (this.index === i) {
                        child.addClass("visible");
                        child.removeClass("hidden");
                    } else {
                        child.addClass("hidden");
                        child.removeClass("visible");
                    }
                }

                this.activeElement = children.eq(this.index);
                this.activeElement.addClass("visible");
                this.activeElement.removeClass("hidden");

                if (started) {
                    this.start();
                }
            }
        }
    }, {
        key: "isStarted",
        value: function isStarted() {
            return this.timer !== null && this.timer !== undefined;
        }
    }, {
        key: "last",
        value: function last() {
            this.goTo(this.children().length - 1);
        }
    }, {
        key: "next",
        value: function next() {
            this.goTo(this.index + 1);
        }
    }, {
        key: "previous",
        value: function previous() {
            this.goTo(this.index - 1);
        }
    }, {
        key: "start",
        value: function start() {
            var _this2 = this;

            if (!this.isStarted()) {
                this.timer = setInterval(function () {
                    _this2.next();
                }, this.options.delay);
            }
        }
    }, {
        key: "stop",
        value: function stop() {
            if (this.isStarted()) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    }]);

    return Switcher;
}(_closable.Closable);

Switcher.prototype.options = {
    autoStart: true,
    delay: 3000,
    namespace: "switcher",
    repeat: true
};

_cuic2.default.switchers = new _collection.Collection();

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tooltip = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuic = __webpack_require__(0);

var _cuic2 = _interopRequireDefault(_cuic);

var _closable = __webpack_require__(3);

var _collection = __webpack_require__(2);

var _element = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tooltip = exports.Tooltip = function (_Closable) {
    _inherits(Tooltip, _Closable);

    function Tooltip(options) {
        _classCallCheck(this, Tooltip);

        options = _cuic2.default.extend({}, Tooltip.prototype.options, options, {
            mainClass: "tooltip"
        });

        var _this = _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).call(this, "div", { className: options.className }, options));

        _this.currentTarget = null;

        _this.content = new _element.Element("div", {
            className: "tooltip-content"
        }).appendTo(_this);

        _this.tail = new _element.Element("span", {
            className: "tooltip-tail"
        }).appendTo(_this);

        _cuic2.default.element(document).on("mouseover", function (ev) {
            var targets = _cuic2.default.find(_this.options.selector);

            for (var i = 0; i < targets.length; i += 1) {
                var target = targets[i];

                if (ev.target === target.node()) {

                    var content = target.data("tooltip");

                    if (!content || !content.length) {

                        content = target.attr(_this.options.attribute);

                        target.attr(_this.options.attribute, "");

                        target.data("tooltip", content);
                    }

                    if (content && content.length) {
                        _this.content.html(content);
                    }

                    _this.currentTarget = ev.target;

                    if (!_this.options.followPointer) {
                        if (_this.parentNode() !== ev.target.parentNode) {
                            _this.appendTo(ev.target.parentNode);
                        }
                    }
                    _this.open();

                    target.once("mouseleave", function () {
                        _this.close();
                    });
                    break;
                }
            }
        });

        _cuic2.default.element(document).on("mousemove", function (ev) {
            if (_this.options.followPointer && !_this.isHidden()) {
                if (_this.parentNode() !== document.body) {
                    _this.appendTo(document.body);
                }
                var target = _cuic2.default.element(_this.currentTarget);

                var anchor = target.data("anchor") || _this.options.anchor;
                var anchorPoint = target.data("anchor-point") || _this.options.anchorPoint;
                _this.anchor(anchor, anchorPoint, [ev.pageX, ev.pageY]);
            }
        });

        var autoClose = function autoClose(ev) {
            if (_this.isOpened() && _this.options.autoClose) {
                if (ev.target !== _this.node() && !_cuic2.default.element(ev.target).isChildOf(_this)) {
                    _this.close();
                }
            }
        };

        _this.on("mouseover", function () {
            _this.open();
        });

        _this.on("mouseleave", function () {
            _this.close();
        });

        _this.onAnchored(function () {
            _this.updateTail();
        });

        _this.onClosed(function () {
            _cuic2.default.off("click", document, autoClose);

            if (_this.options.autoRemove) {
                _this.remove();
            }
        });

        _this.onOpen(function () {
            if (!_this.options.followPointer) {
                var target = _cuic2.default.element(_this.currentTarget);

                var anchor = target.data("anchor") || _this.options.anchor;
                var anchorPoint = target.data("anchor-point") || _this.options.anchorPoint;
                _this.anchor(anchor, anchorPoint, target);
            }
        });

        _this.onOpened(function () {

            _cuic2.default.on("click", document, autoClose);
        });

        _cuic2.default.tooltips.add(_this);
        return _this;
    }

    _createClass(Tooltip, [{
        key: "getContent",
        value: function getContent() {
            return this.content;
        }
    }, {
        key: "setContent",
        value: function setContent(html) {
            this.content.html(html);
            return this;
        }
    }, {
        key: "updateTail",
        value: function updateTail() {
            var prop = {
                bottom: "",
                left: "",
                right: "",
                top: ""
            };

            this.tail.removeClass("tooltip-tail-bottom tooltip-tail-left tooltip-tail-right tooltip-tail-top");

            if (this.isAnchored("bottom")) {
                this.tail.addClass("tooltip-tail-top");
            }

            if (this.isAnchored("top")) {
                this.tail.addClass("tooltip-tail-bottom");
            }

            if (this.isAnchored("left")) {
                this.tail.addClass("tooltip-tail-right");
            }

            if (this.isAnchored("right")) {
                this.tail.addClass("tooltip-tail-left");
            }

            this.tail.css(prop);

            return this;
        }
    }]);

    return Tooltip;
}(_closable.Closable);

Tooltip.prototype.options = {
    anchor: "right",
    attribute: "title",
    followPointer: true,
    namespace: "tooltip",
    opened: false,
    selector: "[title]",
    zIndex: 100
};

_cuic2.default.tooltips = new _collection.Collection();

/***/ })
/******/ ]);
});
