/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Karl STEIN
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

import {Element} from "./ui/element";

const Cuic = {

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
     * Global options
     */
    options: {
        debug: false
    },

    /**
     * Adds an event listener
     * @param element
     * @param event
     * @param listener
     * @return {*}
     */
    addEventListener(element, event, listener) {
        if (typeof element.addEventListener === "function") {
            return element.addEventListener(event, listener);
        }
        else if (typeof element.attachEvent === "function") {
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
        if (typeof fn === "function") {
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
            "bottom",
            "left",
            "padding",
            "right",
            "top",
            // dimension
            "max-height",
            "max-width",
            "height",
            "width",
            // margin
            "margin",
            "margin-bottom",
            "margin-left",
            "margin-right",
            "margin-top",
            // padding
            "padding",
            "padding-bottom",
            "padding-left",
            "padding-right",
            "padding-top"
        ];

        // Add pixel unit to numbers
        for (let style in styles) {
            if (styles.hasOwnProperty(style)) {
                if (typeof styles[style] === "number" && properties.indexOf(style) !== -1) {
                    styles[style] = styles[style] + "px";
                }
            }
        }
        return styles;
    },

    /**
     * Returns the document body
     * @return {*}
     */
    body() {
        return this.element(document.body);
    },

    /**
     * Returns the scrollbar width
     * @return {number}
     */
    calculateScrollbarWidth() {
        const inner = document.createElement("div");
        inner.style.width = "100%";
        inner.style.height = "200px";

        const outer = document.createElement("div");
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);
        document.body.appendChild(outer);

        const w1 = inner.offsetWidth;
        outer.style.overflow = "scroll";
        let w2 = inner.offsetWidth;

        if (w1 === w2) {
            w2 = outer.clientWidth;
        }
        document.body.removeChild(outer);

        return (w1 - w2);
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
     * Constraints position to limits
     * @param prop
     * @param limit
     * @return {*}
     */
    constraintPosition(prop, limit) {
        // Limit horizontal align
        if (typeof prop.left === "number") {
            if (prop.left < limit.minX) {
                prop.left = limit.minX;
            }
            else if (prop.left > limit.maxX) {
                prop.left = limit.maxX;
            }
        }
        if (typeof prop.right === "number") {
            if (prop.right < limit.minX) {
                prop.right = limit.minX;
            }
            else if (prop.right > limit.maxX) {
                prop.right = limit.maxX;
            }
        }

        // Limit vertical align
        if (typeof prop.top === "number") {
            if (prop.top < limit.minY) {
                prop.top = limit.minY;
            }
            else if (prop.top > limit.maxY) {
                prop.top = limit.maxY;
            }
        }
        if (typeof prop.bottom === "number") {
            if (prop.bottom < limit.minY) {
                prop.bottom = limit.minY;
            }
            else if (prop.bottom > limit.maxY) {
                prop.bottom = limit.maxY;
            }
        }
        return prop;
    },

    /**
     * Displays a message in the console
     */
    debug() {
        if (this.options.debug && typeof console !== "undefined") {
            const args = Array.prototype.slice.call(arguments);
            (console.debug || console.log).apply(this, args);
        }
    },

    /**
     * Returns a Cuic element if possible
     * @param element
     * @return {*|Element}
     */
    element(element) {
        if (element instanceof Element) {
            return element;
        }
        if (this.isNode(element)) {
            return new Element(element);
        }
        if (element instanceof Window) {
            return new Element(element);
        }
        if (this.isJQuery(element)) {
            return new Element(element.get(0));
        }
        if (typeof element === "string") {
            return this.find(element).first();
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

        if (typeof a === "boolean") {
            recursive = a;
            a = args.shift();
        }

        for (let i = 0; i < args.length; i += 1) {
            const b = args[i];

            if (typeof b === "object" && b !== null
                && typeof a === "object" && a !== null) {
                for (let key in b) {
                    if (b.hasOwnProperty(key)) {
                        if (recursive && typeof b[key] === "object" && b[key] !== null) {
                            a[key] = this.extend(a[key], b[key]);
                        } else {
                            a[key] = b[key];
                        }
                    }
                }
            } else if (b !== null && typeof b !== "undefined") {
                a = b;
            }
        }
        return a;
    },

    /**
     * Returns all elements matching the selector
     * @param selector
     * @param context
     * @return {Elements}
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
        const element = document.createElement("div");

        // Check with animation
        if (element.WebkitAnimation == "") return "-webkit-";
        if (element.MozAnimation == "") return "-moz-";
        if (element.OAnimation == "") return "-o-";

        // Check with transition
        if (element.WebkitTransition == "") return "-webkit-";
        if (element.MozTransition == "") return "-moz-";
        if (element.OTransition == "") return "-o-";

        return "";
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
        return !this.isIE() && !!window.StyleMedia;
    },

    /**
     * Checks if the element is an instance of Element
     * @param obj
     * @return {*}
     */
    isElement(obj) {
        return (
            typeof HTMLElement === "object" ? obj instanceof HTMLElement : //DOM2
                obj !== null
                && typeof obj === "object"
                && obj.nodeType === 1
                && typeof obj.nodeName === "string"
        );
    },

    /**
     * Checks if the browser is Firefox 1.0+
     * @return {boolean}
     */
    isFirefox() {
        return typeof window.InstallTrigger !== "undefined";
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
     * Checks if element is an instance of an object
     * @param fn
     * @param obj
     * @return {boolean}
     */
    isInstanceOf(fn, obj) {
        return typeof fn !== "undefined"
            && fn !== null
            && obj instanceof fn;
    },

    /**
     * Checks if element is a JQuery object
     * @param obj
     * @return {boolean}
     */
    isJQuery(obj) {
        return typeof obj === "object" && obj && obj["jquery"];
    },

    /**
     * Checks if the element is an instance of Node
     * @param obj
     * @return {*}
     */
    isNode(obj) {
        return (
            typeof Node === "object" ? obj instanceof Node : obj
                && typeof obj === "object"
                && typeof obj.nodeType === "number"
                && typeof obj.nodeName === "string"
        );
    },

    /**
     * Checks if the browser is Opera 8.0+
     * @return {boolean}
     */
    isOpera() {
        return (!!window.opr && !!opr.addons)
            || !!window.opera
            || navigator.userAgent.indexOf(" OPR/") >= 0;
    },

    /**
     * Checks if the browser is Safari 3.0+
     * @return {boolean}
     */
    isSafari() {
        return /constructor/i.test(window.HTMLElement)
            || ((p) => {
                return p.toString() === "[object SafariRemoteNotification]";
            })(!window["safari"]
                || safari.pushNotification);
    },

    /**
     * Creates a namespace helper
     * @param ns
     * @return {Function}
     */
    namespace(ns) {
        return (event, id) => {
            id = Cuic.slug(id);
            return `${event}.cuic.${ns}` + (id ? `.${id}` : "");
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
        if (element instanceof Element) {
            return element.node();
        }
        if (this.isJQuery(element)) {
            return element.get(0);
        }
        if (typeof element === "string") {
            return this.find(element).get(0);
        }
        console.error(`cannot get HTMLElement from element.`, element);
    },

    /**
     * Removes an event listener
     * @param event
     * @param element
     * @param callback
     * @return {*}
     */
    off(event, element, callback) {
        if (element instanceof Element) {
            element = element.node();
        }
        else if (this.isJQuery(element)) {
            element = element.get(0);
        }
        else if (!this.isNode(element) && !(element instanceof Window)) {
            console.info(event, element);
            throw new TypeError(`Cannot add event listener on unsupported element.`);
        }

        // Get browser event name
        const browserEvent = this.whichEvent(event, element);

        // Check if event is supported
        if (!browserEvent) {
            console.warn(`Event "${event}" is not supported by this browser.`);
        }

        // Event is a animation
        if (event.indexOf("animation") !== -1) {
            const duration = this.prefixStyle("animation-duration");

            // Execute callback now
            if (!browserEvent && !("animation" in element.style) || getComputedStyle(element)[duration] === "0s") {
                this.apply(callback, element);
            }
        }
        // Event is a transition
        else if (event.indexOf("transition") !== -1) {
            const duration = this.prefixStyle("transition-duration");

            // Execute callback now
            if (!browserEvent && !("transition" in element.style) || getComputedStyle(element)[duration] === "0s") {
                this.apply(callback, element);
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
        if (element instanceof Element) {
            element = element.node();
        }
        else if (this.isJQuery(element)) {
            element = element.get(0);
        }
        else if (!this.isNode(element) && !(element instanceof Window)) {
            console.info(event, element);
            throw new TypeError(`Cannot add event listener on unsupported element.`);
        }

        // Get browser event name
        const browserEvent = this.whichEvent(event, element);

        // Check if event is supported
        if (!browserEvent) {
            console.warn(`Event "${event}" is not supported by this browser.`);
        }

        // Event is a animation
        if (event.indexOf("animation") !== -1) {
            const duration = this.prefixStyle("animation-duration");

            // Execute callback now
            if (!browserEvent && !("animation" in element.style) || getComputedStyle(element)[duration] === "0s") {
                this.apply(callback, element);
            }
        }
        // Event is a transition
        else if (event.indexOf("transition") !== -1) {
            const duration = this.prefixStyle("transition-duration");

            // Execute callback now
            if (!browserEvent && !("transition" in element.style) || getComputedStyle(element)[duration] === "0s") {
                this.apply(callback, element);
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
        if (element instanceof Element) {
            element = element.node();
        }
        else if (this.isJQuery(element)) {
            element = element.get(0);
        }
        else if (!this.isNode(element) && !(element instanceof Window)) {
            console.info(event, element);
            throw new TypeError(`Cannot add event listener on unsupported element.`);
        }

        // Get browser event name
        const browserEvent = this.whichEvent(event, element);

        // Check if event is supported
        if (!browserEvent) {
            console.warn(`Event "${event}" is not supported by this browser.`);
        }

        // Event is a animation
        if (event.indexOf("animation") !== -1) {
            const duration = this.prefixStyle("animation-duration");

            // Execute callback now
            if (!browserEvent && !("animation" in element.style) || getComputedStyle(element)[duration] === "0s") {
                this.apply(callback, element);
            }
        }
        // Event is a transition
        else if (event.indexOf("transition") !== -1) {
            const duration = this.prefixStyle("transition-duration");

            // Execute callback now
            if (!browserEvent && !("transition" in element.style) || getComputedStyle(element)[duration] === "0s") {
                this.apply(callback, element);
            }
        }
        const listener = (ev) => {
            this.removeEventListener(element, browserEvent, listener);
            this.apply(callback, element, Array.prototype.slice.call(ev));
        };
        return this.addEventListener(element, browserEvent, listener);
    },

    /**
     * Executes a callback when the window is resized
     * @param callback
     * @param delay
     */
    onWindowResized(callback, delay = 50) {
        let timer;

        if (this.isInstanceOf(Window, window)) {
            this.on("resize", window, function (ev) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    callback.call(this, ev);
                }, delay);
            });
        }
    },

    /**
     * Returns the value as boolean
     * @param val
     * @return {null|boolean}
     */
    parseBoolean(val) {
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
        return typeof prefix === "string" && prefix.length ? prefix + style : style;
    },

    /**
     * Executes the callback when the DOM is ready
     * @param callback
     */
    ready(callback) {
        document.addEventListener("DOMContentLoaded", callback);
    },

    /**
     * Removes an event listener
     * @param element
     * @param event
     * @param listener
     * @return {*}
     */
    removeEventListener(element, event, listener) {
        if (typeof element.removeEventListener === "function") {
            return element.removeEventListener(event, listener);
        }
        else if (typeof element.detachEvent === "function") {
            return element.detachEvent(event, listener);
        }
    },

    /**
     * Returns screen height
     * @return {number}
     */
    screenHeight() {
        return window.screen.height;
    },


    /**
     * Returns screen width
     * @return {number}
     */
    screenWidth() {
        return window.screen.width;
    },

    /**
     * Sets of returns the window horizontal scroll
     * @param x
     * @param y
     */
    scrollTo(x, y) {
        window.scrollTo(x, y);
    },

    /**
     * Sets of returns the window horizontal scroll
     * @param x
     * @return {number}
     */
    scrollX(x) {
        if (typeof x === "undefined") {
            return window.scrollX;
        } else {
            window.scrollTo(x, window.scrollY);
        }
    },

    /**
     * Sets of returns the window vertical scroll
     * @param y
     * @return {number}
     */
    scrollY(y) {
        if (typeof y === "undefined") {
            return window.scrollY;
        } else {
            window.scrollTo(window.scrollX, y);
        }
    },

    /**
     * Removes all special characters
     * @param text
     * @return {string}
     */
    slug(text) {
        if (typeof text === "string") {
            text = text.replace(/ +/g, "-");
            text = text.replace(/[^a-zA-Z0-9_-]+/g, "");
        }
        return text;
    },

    /**
     * Removes HTML tags leaving only text
     * @param html
     * @return {*}
     */
    stripTags(html) {
        if (typeof html === "string" && html.length) {
            // Replaces <br> with new line
            html = html.replace(/<br[^>]>/gi, "\r\n");
            // Removes tags
            html = html.replace(/<[^>]+>/g, "");
            // Removes extra spaces
            html = html.trim();
        }
        return html;
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
            .replace(/[-_]+/g, " ")
            // Removes any non alphanumeric characters
            .replace(/[^\w\s]/g, "")
            // Uppercases the first character in each group immediately following a space
            // (delimited by spaces)
            .replace(/ (.)/g, ($1) => {
                return $1.toUpperCase();
            })
            // Removes spaces
            .replace(/ /g, "");
    },

    /**
     * Returns the value depending of the type of the value,
     * for example, if it is a function, it will returns the result of the function.
     * @param value
     * @param context
     * @return {*}
     */
    valueOf(value, context) {
        if (typeof value === "function") {
            value = value.call(context);
        }
        return value;
    },

    /**
     * Returns the event supported by the current environment
     * @param event
     * @param element
     * @return {*}
     */
    whichEvent(event, element) {
        let ev;
        let resolver = {};

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

        // Check in resolver
        for (ev in resolver) {
            if (typeof element.style[ev] !== "undefined") {
                return resolver[ev];
            }
        }

        // Check in element
        if (typeof element[event] !== "undefined") {
            return event;
        }
        if (typeof element[`on${event}`] !== "undefined") {
            return event;
        }

        // Check in document
        if (typeof document[event] !== "undefined") {
            return event;
        }
        if (typeof document[`on${event}`] !== "undefined") {
            return event;
        }

        // Check in window
        if (typeof window[event] !== "undefined") {
            return event;
        }
        if (typeof window[`on${event}`] !== "undefined") {
            return event;
        }
    }
};

export default Cuic;

// Expose lib as global
if (typeof window !== "undefined") {
    window.Cuic = Cuic;
}

Cuic.ready(() => {
    // Save mouse position on move
    Cuic.element(document).on("mousemove", (ev) => {
        Cuic.mouseX = ev.clientX;
        Cuic.mouseY = ev.clientY;
    });
});
