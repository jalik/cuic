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

import Cuic from "../cuic";
import {Elements} from "./elements";
import {Events} from "../utils/events";

export class Element {

    constructor(node, attributes, options) {
        // Set default attributes
        attributes = Cuic.extend({}, attributes);

        // Set default options
        this.options = Cuic.extend({}, Element.prototype.options, options);

        // Use existing node
        if (this.options.element) {
            this.element = Cuic.node(this.options.element);
        }
        // Create node
        else if (typeof node === "string") {
            this.element = document.createElement(node);
        }
        // Use HTML node
        else if (Cuic.isNode(node) || node instanceof Window) {
            this.element = node;
        }
        // Use node from Element
        else if (node instanceof Element) {
            this.element = node.node();
        }
        // Use the first node of an Elements object
        else if (node instanceof Elements) {
            this.element = node.get(0);
        }
        // Use the first node of a jQuery object
        else if (Cuic.isJQuery(node)) {
            this.element = node.get(0);
        }
        else {
            console.info(node);
            throw new TypeError(`Cannot create element using given node.`);
        }

        // Set element attributes
        for (let attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                const value = attributes[attr];

                if (value !== null && typeof value !== "undefined") {
                    // Do not override classes
                    if (attr === "className") {
                        this.addClass(value);
                        continue;
                    }

                    // Apply CSS styles
                    if (attr === "css") {
                        this.css(value);
                        continue;
                    }

                    // Apply CSS styles
                    if (attr === "data") {
                        this.data(value);
                        continue;
                    }

                    // Set attribute
                    if (typeof this.element[attr] !== "undefined") {
                        this.element[attr] = value;
                    }
                    else if (attr === "html") {
                        this.html(value);
                    }
                    else if (attr === "text") {
                        this.text(value);
                    }
                }
            }
        }

        // Define Z-Index
        if (typeof this.options.zIndex === "number") {
            this.css({"z-index": parseInt(this.options.zIndex)});
        }

        // Set element styles
        if (this.options.css) {
            this.css(this.options.css);
        }

        // Add debug class
        if (this.options.debug) {
            this.addClass("debugging");
        }

        // Add main class
        if (this.options.mainClass) {
            this.addClass(this.options.mainClass);
        }

        // Add default events
        this.events = new Events(this);

        // Append element to parent node
        if (this.options.parent) {
            this.appendTo(this.options.parent);
            Cuic.element(this.options.parent).append(this);
        }

        // Position the element
        if (this.options.position && this.hasParent()) {
            // this.align(this.options.position);//todo maybe remove this line that causes bad animations
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
     * @param options
     * @return {{bottom: string, left: string, right: string, top: string}}
     */
    _calculateAlign(position, options) {
        if (!position || !position.length) {
            throw new TypeError(`Cannot calculate alignment if no position defined`);
        }

        // Default options
        options = Cuic.extend({
            inScreen: false,
            parent: null
        }, options);

        let parent = options.parent;
        const windowElement = Cuic.element(window);

        if (parent) {
            parent = Cuic.element(parent);

            // Use body as parent
            if (parent.node().nodeName === "HTML") {
                parent = Cuic.body();
            }
        }
        else {
            // Use parent node if no parent defined
            parent = this.offsetParent() || Cuic.body();
        }

        let elHeight = this.outerHeight(true);
        let elWidth = this.outerWidth(true);
        let parentHeight = parent.height();
        let parentWidth = parent.width();
        let scrollLeft = parent.scrollLeft();
        let scrollTop = parent.scrollTop();
        let scrollBottom = -scrollTop;
        let scrollRight = -scrollLeft;
        let prop = {
            bottom: "",
            left: "",
            right: "",
            top: ""
        };

        // If the target is fixed, we use the window as parent
        switch (this.css("position")) {
            case "fixed":
                parent = windowElement;
                parentHeight = parent.innerHeight();
                parentWidth = parent.innerWidth();
                scrollLeft = 0;
                scrollTop = 0;
                scrollBottom = 0;
                scrollRight = 0;
                break;
        }

        let centerX = scrollLeft + Math.max(0, parent.innerWidth() / 2 - elWidth / 2);
        let centerY = scrollTop + Math.max(0, parent.innerHeight() / 2 - elHeight / 2);

        // Align element in screen if parent is body
        if (options.inScreen && parent.node() instanceof HTMLBodyElement) {
            centerX = scrollLeft + Math.max(0, windowElement.width() / 2 - elWidth / 2);
            centerY = scrollTop + Math.max(0, windowElement.height() / 2 - elHeight / 2);
        }

        // Vertical position
        if (position.indexOf("top") !== -1) {
            prop.top = 0;
        }
        else if (position.indexOf("bottom") !== -1) {
            prop.bottom = 0;
        }
        else {
            prop.top = centerY;
        }

        // Horizontal position
        if (position.indexOf("left") !== -1) {
            prop.left = 0;
        }
        else if (position.indexOf("right") !== -1) {
            prop.right = 0;
        }
        else {
            prop.left = centerX;
        }

        // Calculate available position
        const available = this._calculateAvailablePosition(parent);

        // Constraint position
        if (prop.left < available.minX) {
            prop.left = available.minX;
        }
        else if (prop.left > available.maxX) {
            prop.left = available.maxX;
        }
        return prop;
    }

    /**
     * Calculates the position of the element around its parent
     * @param anchor
     * @param anchorPoint
     * @param target
     * @return {{bottom, left, right, top}}
     */
    _calculateAnchor(anchor, anchorPoint, target) {
        if (!anchor || !anchor.length) {
            throw new TypeError(`Cannot calculate anchor with no position defined`);
        }

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
            target = Cuic.element(target);
            targetHeight = target.outerHeight();
            targetWidth = target.outerWidth();
            targetOffset = target.offset();
        }

        let elWidth = this.outerWidth(true);
        let elHeight = this.outerHeight(true);
        let elCenterX = (elWidth / 2);
        let elCenterY = (elHeight / 2);
        let targetCenterX = (targetWidth / 2);
        let targetCenterY = (targetHeight / 2);
        let prop = {
            bottom: "",
            left: "",
            right: "",
            top: ""
        };

        // TODO REMOVE
        this.debug("elSize:", {width: elWidth, height: elHeight});
        this.debug("targetOffset:", targetOffset);
        // this.debug("width:", elWidth, ", height:", elHeight);

        if (anchorPoint) {
            // Vertical positioning
            if (anchor.indexOf("top") !== -1) {
                prop.top = targetOffset.top - elCenterY;
            }
            else if (anchor.indexOf("bottom") !== -1) {
                prop.top = targetOffset.top - elCenterY + targetHeight;
            }
            else {
                prop.top = targetOffset.top - elCenterY + targetCenterY;
            }
            // Horizontal positioning
            if (anchor.indexOf("left") !== -1) {
                prop.left = targetOffset.left - elCenterX;
            }
            else if (anchor.indexOf("right") !== -1) {
                prop.left = targetOffset.left - elCenterX + targetWidth;
            }
            else {
                prop.left = targetOffset.left - elCenterX + targetCenterX;
            }

            // Vertical anchor point
            if (anchorPoint.indexOf("top") !== -1) {
                prop.top += elCenterY;
            }
            else if (anchorPoint.indexOf("bottom") !== -1) {
                prop.top -= elCenterY;
            }
            // Horizontal anchor point
            if (anchorPoint.indexOf("left") !== -1) {
                prop.left += elCenterX;
            }
            else if (anchorPoint.indexOf("right") !== -1) {
                prop.left -= elCenterX;
            }
        } else {
            // console.log("elHtml", this.html());
            // console.log("elHeight", elHeight);
            // console.log("elWidth", elWidth);
            // console.log("targetHeight", targetHeight);
            // console.log("targetWidth", targetWidth);

            // new Element("div", {html: JSON.stringify(targetOffset)}).css({
            //     background: "rgba(200,0,0,0.3)",
            //     position: "absolute",
            //     left: 0,
            //     top: 0,
            //     height: targetOffset.top,
            //     width: targetOffset.left
            // }).appendTo(target.offsetParent());

            // Vertical positioning
            if (anchor.indexOf("bottom") !== -1) {
                prop.top = targetOffset.top + targetHeight;
            }
            else if (anchor.indexOf("top") !== -1) {
                prop.top = targetOffset.top - elHeight;
            }
            else {
                prop.top = targetOffset.top + targetCenterY - elCenterY;
            }
            // Horizontal positioning
            if (anchor.indexOf("left") !== -1) {
                prop.left = targetOffset.left - elWidth;
            }
            else if (anchor.indexOf("right") !== -1) {
                prop.left = targetOffset.left + targetWidth;
            }
            else {
                prop.left = targetOffset.left + targetCenterX - elCenterX;
            }
        }

        // Use window for positioning
        if (this.isFixed()) {
            prop.left -= window.scrollX;
            prop.top -= window.scrollY;
        }
        // this.debug("css =", prop);
        return prop;
    }

    /**
     * Returns the available position inside a container
     * @param parent
     * @return {{minX: number, minY: number, maxX: number, maxY: number}}
     */
    _calculateAvailablePosition(parent) {
        parent = parent ? Cuic.element(parent) : this.offsetParent() || Cuic.body();

        const prop = {
            minX: 0,
            minY: 0,
            maxX: Math.max(0, parent.width() - this.outerWidth(true)),
            maxY: Math.max(0, parent.height() - this.outerHeight(true))
        };

        const body = Cuic.body();

        // Adjust limits depending of element position
        switch (this.css("position")) {

            case "absolute":
                const prPadding = parent.padding();
                // const elMargin = this.margin();
                prop.maxX += prPadding.horizontal;
                prop.maxY += prPadding.vertical;
                // prop.maxX -= elMargin.horizontal;
                // prop.maxY -= elMargin.vertical;
                // fixme max is wrong sometimes

                if (parent.node() instanceof HTMLBodyElement) {
                    prop.maxX = body.scrollWidth();
                    prop.maxY = body.scrollHeight();
                }
                break;

            case "fixed":
                prop.maxX = body.scrollWidth();
                prop.maxY = body.scrollHeight();
                break;
        }
        return prop;
    }

    /**
     * Returns the available space inside a container
     * @param parent
     * @return {{height, width}}
     */
    _calculateAvailableSpace(parent) {
        parent = parent ? Cuic.element(parent) : this.offsetParent() || Cuic.body();
        const elMargin = this.margin();
        const prop = {
            height: parent.height(),
            width: parent.width()
        };

        // Adjust limits depending of element position
        switch (this.css("position")) {
            case "absolute":
            case "fixed":
                const prPadding = parent.padding();
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

    /**
     * Calculates maximized properties
     * @return {{bottom: string, height: number, left: string, right: string, top: string, width: number}}
     */
    _calculateMaximize() {
        const parent = this.offsetParent() || Cuic.body();
        const windowElement = Cuic.element(window);
        const parentPadding = parent.padding();
        const elMargin = this.margin();
        const prop = {
            bottom: "",
            left: "",
            right: "",
            top: "",
            height: parent.innerHeight() - parentPadding.vertical,
            width: parent.innerWidth() - parentPadding.horizontal
        };

        // Maximize to screen size
        if (parent.node() instanceof HTMLBodyElement) {
            prop.height = windowElement.innerHeight();
            prop.width = windowElement.innerWidth();
        }

        // Adjust dimensions
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

        // Horizontal position
        if (this.isAligned("right")) {
            prop.right = 0;
        } else {
            prop.left = 0;

            // Position with horizontal scroll
            if (parent.node() instanceof HTMLBodyElement) {
                prop.left = windowElement.scrollLeft();
            }
        }

        // Vertical position
        if (this.isAligned("bottom")) {
            prop.bottom = 0;
        } else {
            prop.top = 0;

            // Position with vertical scroll
            if (parent.node() instanceof HTMLBodyElement) {
                prop.top = windowElement.scrollTop();
            }
        }

        return prop;
    }

    /**
     * Calculates minimized properties
     * @param position
     * @return {{height, width}}
     */
    _calculateMinimize(position) {
        position = position || "";

        // Create a clone with minimal size
        const clone = this.clone();
        clone.css({height: "auto", width: "auto"});
        clone.show().appendTo(this.parent());

        // Calculate minimized size
        let prop = clone._calculateAlign(position);
        prop.height = clone.outerHeight();
        prop.width = clone.outerWidth();
        clone.remove();

        return prop;
    }

    /**
     * Disables transitions
     * @return {Element}
     */
    _disableTransitions() {
        this.addClass("no-transition");
        return this;
    }

    /**
     * Displays element for calculation (positioning, parenting...)
     * @return {Element}
     */
    _display() {
        if (!this.hasClass("computing")) {
            this._previousDisplay = this.css("display");

            if (this._previousDisplay === "none") {
                this.addClass("computing");
                this.css({display: ""});

                if (this.hasClass("hidden")) {
                    this.removeClass("hidden");
                    this._previousClass = "hidden";
                }
            }
        }
        return this;
    }

    /**
     * Enables transitions
     * @return {Element}
     */
    _enableTransitions() {
        this.removeClass("no-transition");
        return this;
    }

    /**
     * Restores element previous display state
     * @return {Element}
     */
    _restoreDisplay() {
        if (this.hasClass("computing")) {
            this.removeClass("computing");

            if (this._previousClass) {
                this.addClass(this._previousClass);
                this.css({display: this._previousDisplay});
                this._previousDisplay = null;
                this._previousClass = null;
            }
        }
        return this;
    }

    /**
     * Adds the class
     * @param className
     * @return {Element}
     */
    addClass(className) {
        this.debug("addClass", className);
        let classes = this.getClasses();
        const target = (className || "").split(" ");

        for (let i = 0; i < target.length; i += 1) {
            // Check if class is already assigned
            if (classes.indexOf(target[i]) === -1) {
                classes.push(target[i]);
            }
        }
        this.node().className = classes.join(" ");
        return this;
    }

    /**
     * Adds position class
     * @param position
     * @param prefix
     * @return {Element}
     */
    addPositionClass(position, prefix) {
        this.debug("addPositionClass", position, prefix);
        const pfx = (str) => {
            return prefix ? prefix + "-" + str : str;
        };

        // Remove previous classes
        this.removeClass([
            pfx("bottom"),
            pfx("center"),
            pfx("left"),
            pfx("right"),
            pfx("top")
        ].join(" "));

        // Vertical position
        if (position.indexOf("bottom") !== -1) {
            this.addClass(pfx("bottom"));
        }
        else if (position.indexOf("top") !== -1) {
            this.addClass(pfx("top"));
        }
        else {
            this.addClass(pfx("center"));
        }

        // Horizontal position
        if (position.indexOf("left") !== -1) {
            this.addClass(pfx("left"));
        }
        else if (position.indexOf("right") !== -1) {
            this.addClass(pfx("right"));
        }
        else {
            this.addClass(pfx("center"));
        }
        return this;
    }

    /**
     * Sets the position of the element inside its parent
     * @param position
     * @param options
     * @return {Element}
     */
    align(position, options) {
        if (this.isInDOM() && position && position !== "") {
            const pos = this.css("position");

            if (["absolute", "fixed"].indexOf(pos) !== -1) {
                this.debug("align", position);
                this.css(this._calculateAlign(position, options));
                this.addPositionClass(position, "aligned");
                this.options.position = position;
                this.events.trigger("aligned", position);
            }
        }
        return this;
    }

    /**
     * Aligns element in its parent
     * @return {Element}
     */
    alignInParent() {
        if (this.isInDOM()) {
            this.debug("alignInParent");
            const alignments = ["bottom", "left", "right", "top"];
            let prop = this.position();

            // Only keep properties that are styled
            for (let i = 0; i < alignments.length; i += 1) {
                if (!this.css(alignments[i])) {
                    prop[alignments[i]] = "";
                }
            }

            // Limit position to parent available position
            const available = this._calculateAvailablePosition();
            prop = Cuic.constraintPosition(prop, available);

            // Apply alignment
            this.css(prop);
        }
        return this;
    }

    /**
     * Aligns element in screen
     * @return {Element}
     */
    alignInScreen() {
        if (this.isInDOM()) {
            this.debug("alignInScreen");
            const alignments = ["bottom", "left", "right", "top"];
            let prop = this.position();

            // Only keep properties that are styled
            for (let i = 0; i < alignments.length; i += 1) {
                if (!this.css(alignments[i])) {
                    prop[alignments[i]] = "";
                }
            }

            // Limit position to screen
            const screen = {
                minX: 0, maxX: Cuic.element(window).width(),
                minY: 0, maxY: Cuic.element(window).height()
            };
            const rect = this.positionOnScreen();
            const elWidth = this.outerWidth(true);
            const elHeight = this.outerHeight(true);

            // todo
            // this.debug("screen", screen);
            // this.debug("rect", rect);
            // this.debug("prop", prop);
            // this.debug("size", {width: elWidth, height: elHeight});

            // TODO aligner dans la zone visible d l'écran
            // const targetPosition = target.calculatePositionOnScreen();
            // this.debug("targetPosition:", targetPosition);
            // const targetPositionScroll = target.calculatePositionOnScreen();
            // this.debug("targetPositionScroll:", targetPositionScroll);
            // new Element("div").css({
            //     position: "absolute",
            //     top: targetPositionScroll.top,
            //     left: targetPositionScroll.left,
            //     background: "rgba(255,0,0,0.2)",
            //     height: targetHeight,
            //     width: targetWidth,
            //     zIndex: 1000
            // }).appendTo(document.body);

            // let diffX = Math.abs(Math.min(0, window.screen.width - (targetPosition.left - Math.abs(prop.left - targetOffset.left) + elWidth)));
            //
            // // Fit element to right
            // if (diffX > 0) {
            //     prop.left -= diffX;
            //     // todo limit width
            // }
            // // Fit element to left
            // else {
            //     diffX = Math.abs(Math.min(0, targetPosition.left - (targetOffset.left - prop.left)));
            //
            //     if (diffX > 0) {
            //         prop.left += diffX;
            //         // todo limit width
            //     }
            // }
            //
            // let diffY = Math.abs(Math.min(0, window.screen.height - (targetPosition.top - Math.abs(prop.top - targetOffset.top) + elHeight)));
            //
            // // Fit element to bottom
            // if (diffY > 0) {
            //     prop.top -= diffY;
            //     // todo limit height
            // }
            // // Fit element to top
            // else {
            //     diffY = Math.abs(Math.min(0, targetPosition.top - (targetOffset.top - prop.top)));
            //
            //     if (diffY > 0) {
            //         prop.top += diffY;
            //         // todo limit height
            //     }
            // }

            for (let i = 0; i < alignments.length; i += 1) {
                const location = alignments[i];
                const screenPos = rect[location];

                if (typeof prop[location] === "number") {
                    // negative
                    if (screenPos < 0) {
                        prop[location] += Math.abs(screenPos);
                    }
                    // positive
                    else if (["bottom", "top"].indexOf(location) !== -1) {
                        if (screenPos + elHeight > screen.maxY) {
                            // this.debug(location + ": " + (screenPos + elHeight) + " > " + available.maxY);
                            // const extraSpace = Math.abs(available.maxY - Math.abs(prop[location]) - elHeight);
                            const extraSpace = Math.abs(screen.maxY - Math.abs(rect[location]) - elHeight);
                            prop[location] -= extraSpace;
                            // this.debug(available.maxY + "-" + extraSpace + " = ", prop[location]);
                        }
                    }
                    else if (["left", "right"].indexOf(location) !== -1) {
                        if (screenPos + elWidth > screen.maxX) {
                            // this.debug(location + ": " + (screenPos + elWidth) + " > " + available.maxX);
                            const extraSpace = Math.abs(screen.maxX - Math.abs(rect[location]) - elWidth);
                            prop[location] -= extraSpace;
                            // this.debug(available.maxX + "-" + extraSpace + " = ", prop[location]);
                        }
                    }
                }
            }
            // this.debug("prop", prop);

            // Apply alignment
            this.css(prop);
        }
        return this;
    }

    /**
     * Sets the position of the element toward another element
     * @param anchor
     * @param anchorPoint
     * @param target
     * @return {Element}
     */
    anchor(anchor, anchorPoint, target) {
        if (anchor && anchor !== "") {
            const isPixelCoordinate = target instanceof Array;

            // Anchor can be an array of pixel coordinates
            if (!isPixelCoordinate) {
                target = Cuic.element(target);
            }
            this.debug("anchor", anchor, target);

            const targetParent = isPixelCoordinate ? document.body : target.offsetParent();
            const disableTransition = this.isInDOM() && !this.isDirectChildOf(targetParent);
            disableTransition && this._disableTransitions();
            this.appendTo(targetParent);
            const props = this._calculateAnchor(anchor, anchorPoint, target);
            this.css(props);
            this.addPositionClass(anchor, "anchored");
            disableTransition && this._enableTransitions();

            this.options.anchor = anchor;
            this.options.anchorPoint = anchorPoint;
            this.options.target = target;
            this.events.trigger("anchored", anchor);
        }
        return this;
    }

    /**
     * Appends the element
     * @param element
     * @return {Element}
     */
    append(element) {
        const node = this.node();
        this.debug("append", element);

        if (element instanceof Elements) {
            element.each((el) => {
                node.appendChild(el.node());
            });
        }
        else if (Cuic.isJQuery(element)) {
            element.each(function () {
                node.appendChild(this);
            });
        }
        else {
            node.appendChild(Cuic.node(element));
        }
        return this;
    }

    /**
     * Appends to the element
     * @param element
     * @return {Element}
     */
    appendTo(element) {
        this.debug("appendTo", element);
        Cuic.node(element).appendChild(this.node());
        return this;
    }

    /**
     * Sets or returns the element attribute
     * @param name
     * @param value
     * @return {Element|*}
     */
    attr(name, value) {
        const node = this.node();

        if (typeof value !== "undefined") {
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
     * @return {Element}
     */
    autoFit() {
        this.alignInParent();
        this.autoResize();
        return this;
    }

    /**
     * Auto resize element in its parent
     * @return {Element}
     */
    autoResize() {
        if (this.isInDOM()) {
            this.debug("autoResize");
            const available = this._calculateAvailableSpace();

            let prop = {
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
        }
        return this;
    }

    /**
     * Returns element border widths
     * @return {*|{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
     */
    border() {
        const bottom = parseFloat(Cuic.getComputedStyle(this, "border-bottom-width"));
        const left = parseFloat(Cuic.getComputedStyle(this, "border-left-width"));
        const right = parseFloat(Cuic.getComputedStyle(this, "border-right-width"));
        const top = parseFloat(Cuic.getComputedStyle(this, "border-top-width"));
        return {
            bottom: bottom,
            horizontal: left + right,
            left: left,
            right: right,
            top: top,
            vertical: bottom + top
        };
    }

    calculatePosition() {
        const pos = this.offset();

        if (this.isInDOM()) {
            let parent;
            let ref = this;

            do {
                parent = ref.offsetParent();

                if (parent) {
                    // this.debug("-- parent:", offsetParent.node());
                    const parentPos = parent.offset();
                    // this.debug("        ->", parentPos);
                    pos.top += parentPos.top;
                    pos.left += parentPos.left;
                    ref = parent;
                }
            } while (parent);
        }
        return pos;
    }

    calculatePositionOnScreen() {
        const pos = this.offset();

        if (this.isInDOM()) {
            let parent;
            let ref = this;

            do {
                parent = ref.offsetParent();

                if (parent) {
                    // this.debug("-- parent:", offsetParent.node());
                    const parentPos = parent.offset();
                    // this.debug("        ->", parentPos);
                    pos.top += parentPos.top;
                    pos.left += parentPos.left;
                    ref = parent;
                }
            } while (parent);

            ref = this;
            do {
                parent = ref.parent();

                if (parent) {
                    // Subtract scrolling
                    const scrollTop = parent.scrollTop();
                    const scrollLeft = parent.scrollLeft();

                    if (typeof scrollTop === "number" && !isNaN(scrollTop)) {
                        pos.top -= scrollTop;
                    }
                    if (typeof scrollLeft === "number" && !isNaN(scrollLeft)) {
                        pos.left -= scrollLeft;
                    }
                    ref = parent;
                }
            } while (parent);
        }
        return pos;
    }

    /**
     * Returns element child nodes
     * @param selector
     * @return {Elements}
     */
    children(selector) {
        let children = [];
        let nodes = this.node().children || this.node().childNodes;

        for (let i = 0; i < nodes.length; i += 1) {
            if (Cuic.isNode(nodes[i])) {
                if (!selector || nodes[i].matches(selector)) {
                    children.push(nodes[i]);
                }
            }
        }
        return new Elements(children, this.node(), selector);
    }

    /**
     * Triggers a click event on the element
     * @return {Element}
     */
    click() {
        this.node().click();
        return this;
    }

    /**
     * Returns a clone of the element
     * @return {*|Element}
     */
    clone() {
        this.debug("clone");
        return Cuic.element(this.node().cloneNode(true));
    }

    /**
     * Returns the closest parent element matching the selector
     * @param selector
     * @return {Element|null}
     */
    closest(selector) {
        this._display();
        const node = this.node().closest(selector);
        this._restoreDisplay();
        return node ? Cuic.element(node) : null;
    }

    /**
     * Set styles
     * @param styles
     * @return {Element|*}
     */
    css(styles) {
        const node = this.node();

        // Writing styles
        if (styles) {
            if (typeof styles === "object") {
                this.debug("css", styles);

                // Add pixel unit where needed
                Cuic.autoPixel(styles);

                // Add new styles
                for (let style in styles) {
                    if (styles.hasOwnProperty(style)) {
                        let value = styles[style];

                        // Check if style is supported
                        if (!(style in node.style)) {
                            console.warn(`Style "${style}" is not supported by element.`, node);
                        }
                        node.style[style] = value;
                    }
                }
                return this;
            }
            else if (typeof styles === "string") {
                // Set styles
                if (styles.indexOf(":") !== -1) {
                    this.debug("css", styles);
                    node.style = styles;
                    return this;
                } else {
                    // Return computed version for some properties
                    // that would return nothing.
                    switch (styles) {
                        case "display":
                        case "position":
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
     * @return {Element|*}
     */
    data(key, value) {
        this.debug("data", key, value);
        const dataSet = this.node().dataset;

        if (typeof value !== "undefined") {
            dataSet[Cuic.toCamelCase(key)] = value;
            return this;
        }
        else if (key) {
            if (typeof key === "string") {
                return dataSet[Cuic.toCamelCase(key)];
            }
            if (typeof key === "object" && key) {
                for (let name in key) {
                    if (key.hasOwnProperty(name)) {
                        dataSet[Cuic.toCamelCase(name)] = key[name];
                    }
                }
                return this;
            }
        }
        else {
            return dataSet;
        }
    }

    /**
     * Displays debug message if debug mode is active
     */
    debug() {
        if (this.options.debug || Cuic.options.debug) {
            const args = Array.prototype.slice.call(arguments);
            (console.debug || console.log).apply(this, args);
        }
    }

    /**
     * Disables the element
     * @return {Element}
     */
    disable() {
        this.debug("disable");
        this.node().disabled = true;
        this.addClass("disabled");
        this.events.trigger("disabled");
        return this;
    }

    /**
     * Removes element content
     * @return {Element}
     */
    empty() {
        this.debug("empty");
        this.html("");
        return this;
    }

    /**
     * Enables the element
     * @return {Element}
     */
    enable() {
        this.debug("enable");
        this.node().disabled = false;
        this.removeClass("disabled");
        this.events.trigger("enabled");
        return this;
    }

    /**
     * Enters full screen
     * @return {Element}
     */
    enterFullScreen() {
        const node = this.node();

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
     * @return {Elements}
     */
    find(selector) {
        const context = this.node();
        const elements = context.querySelectorAll(selector);
        return new Elements(elements, context, selector);
    }

    /**
     * Triggers a focus event on the element
     * @return {Element}
     */
    focus() {
        this.node().focus();
        return this;
    }

    /**
     * Returns element CSS classes
     * @return {Array}
     */
    getClasses() {
        return this.node().className.split(" ");
    }

    /**
     * Checks if the element has the class
     * @param className
     * @return {boolean}
     */
    hasClass(className) {
        const classes = this.getClasses();
        const classNames = (className || "").split(" ");
        let result = classNames.length > 0;

        for (let i = 0; i < classNames.length; i += 1) {
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
    hasParent() {
        return !!this.parentNode();
    }

    /**
     * Returns the element height without margins and borders
     * @return {number}
     */
    height() {
        const node = this.node();
        let height;

        if (node instanceof Window) {
            height = node.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
        } else {
            this._display();
            height = node.clientHeight;
            this._restoreDisplay();
            height -= this.padding().vertical;
        }
        return height;
    }

    /**
     * Hides the element
     * @return {Element}
     */
    hide() {
        this.debug("hide");
        this.addClass("hidden");
        this.events.trigger("hidden");
        return this;
    }

    /**
     * Gets or sets HTML content
     * @param html
     * @return {Element|string}
     */
    html(html) {
        if (typeof html !== "undefined") {
            // Get HTML from object
            if (html && typeof html === "object") {
                if (Cuic.isNode(html)) {
                    this.empty();
                    this.append(html);
                }
                // Replace content keeping attached events on nodes
                else if (html instanceof Element) {
                    this.empty();
                    this.append(html.node());
                }
                else if (Cuic.isJQuery(html)) {
                    this.empty();
                    this.append(html.get(0));
                }
            }
            else {
                this.node().innerHTML = html;
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
    innerHeight() {
        const node = this.node();
        let height;

        if (node instanceof Window) {
            height = this.height();
        } else {
            // todo subtract vertical scrollbar width
            this._display();
            height = node.clientHeight;
            this._restoreDisplay();
        }
        return height;
    }

    /**
     * Returns the element width including padding
     * @return {number}
     */
    innerWidth() {
        const node = this.node();
        let width;

        if (node instanceof Window) {
            width = this.width();
        } else {
            // todo subtract horizontal scrollbar width
            this._display();
            width = node.clientWidth;
            this._restoreDisplay();
        }
        return width;
    }

    /**
     * Inserts the element after node
     * @param element
     * @return {Element}
     */
    insertAfter(element) {
        this.debug("insertAfter", element);
        const node = Cuic.node(element);
        const parentNode = this.parentNode();
        parentNode.insertBefore(node, this.node().nextSibling);
        return this;
    }

    /**
     * Inserts the element before node
     * @param element
     * @return {Element}
     */
    insertBefore(element) {
        this.debug("insertBefore", element);
        const node = Cuic.node(element);
        const parentNode = this.parentNode();
        parentNode.insertBefore(node, this.node());
        return this;
    }

    /**
     * Checks if the element has an absolute position
     * @return {boolean}
     */
    isAbsolute() {
        return this.css("position") === "absolute";
    }

    /**
     * Checks the element alignment
     * @param position
     * @return {boolean}
     */
    isAligned(position) {
        let result = false;

        if (this.options.position) {
            const pos = (position || "").split(" ");
            result = true;

            for (let i = 0; i < pos.length; i += 1) {
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
    isAnchored(position) {
        let result = false;

        if (this.options.anchor) {
            const pos = (position || "").split(" ");
            result = true;

            for (let i = 0; i < pos.length; i += 1) {
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
    isChildOf(parent) {
        parent = Cuic.node(parent);
        let node = this.node();

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
    isDisabled() {
        return this.node().disabled
            || this.hasClass("disabled");
    }

    /**
     * Checks if the element is parent of the current element
     * @param element
     * @return {boolean}
     */
    isDirectChildOf(element) {
        return this.parentNode() === Cuic.node(element);
    }

    /**
     * Checks if the element is enabled
     * @return {boolean}
     */
    isEnabled() {
        return this.node().disabled !== true
            || !this.hasClass("disabled");
    }

    /**
     * Checks if the element has a fixed position
     * @return {boolean}
     */
    isFixed() {
        return this.css("position") === "fixed";
    }

    /**
     * Checks if the element is hidden
     * @return {boolean}
     */
    isHidden() {
        return this.hasClass("hidden")
            || this.css("display") === "none";
    }

    /**
     * Checks if the element is in the DOM
     * @return {boolean}
     */
    isInDOM() {
        return document.body.contains(this.node()) || !!this.node().offsetParent;//todo check if method is valid
    }

    /**
     * Checks if the component is maximized
     * @return {boolean}
     */
    isMaximized() {
        return this.hasClass("maximized")
            || this.hasClass("maximized-x maximized-y")
            || (this.css("width") === "100%" && this.css("height") === "100%");
    }

    /**
     * Checks if the component width is maximized
     * @return {boolean}
     */
    isMaximizedX() {
        return this.hasClass("maximized-x")
            || this.css("width") === "100%";
    }

    /**
     * Checks if the component height is maximized
     * @return {boolean}
     */
    isMaximizedY() {
        return this.hasClass("maximized-y")
            || this.css("height") === "100%";
    }

    /**
     * Checks if the component is minimized
     * @return {boolean}
     */
    isMinimized() {
        return this.hasClass("minimized");
    }

    /**
     * Checks if the element is at the position
     * @param position
     * @return {boolean}
     */
    isPosition(position) {
        const pos = this.position();

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

    /**
     * Checks if the element has a relative position
     * @return {boolean}
     */
    isRelative() {
        return this.css("position") === "relative";
    }

    /**
     * Checks if the element is removed from the DOM
     * @return {boolean}
     */
    isRemoved() {
        const parent = this.node().parentNode;
        return parent === null || typeof parent === "undefined";
    }

    /**
     * Checks if the element is shown
     * @return {boolean}
     */
    isShown() {
        return !this.hasClass("hidden")
            && this.css("display") !== "none";
    }

    /**
     * Checks if the element has a static position
     * @return {boolean}
     */
    isStatic() {
        return this.css("position") === "static";
    }

    /**
     * Returns the element margins
     * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
     */
    margin() {
        let bottom = 0;
        let left = 0;
        let right = 0;
        let top = 0;

        if (!(this.node() instanceof Window)) {
            bottom = parseFloat(Cuic.getComputedStyle(this, "margin-bottom"));
            left = parseFloat(Cuic.getComputedStyle(this, "margin-left"));
            right = parseFloat(Cuic.getComputedStyle(this, "margin-right"));
            top = parseFloat(Cuic.getComputedStyle(this, "margin-top"));
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
     * @return {Element}
     */
    maximize(callback) {
        this.debug("maximize");
        this.events.trigger("maximize");
        this.removeClass("minimized");
        this.addClass("maximized");
        this.css(this._calculateMaximize());
        this.once("transitionend", (ev) => {
            if (this.isMaximized()) {
                this.debug("maximized");
                this.events.trigger("maximized", ev);

                if (typeof callback === "function") {
                    callback.call(this, ev);
                }
            }
        });
        return this;
    }

    /**
     * Maximizes element width
     * @param callback
     * @return {Element}
     */
    maximizeX(callback) {
        this.debug("maximizeX");
        this.events.trigger("maximizeX");
        this.removeClass("minimized");
        this.addClass("maximized-x");
        const prop = this._calculateMaximize();
        this.css({width: prop.width, left: prop.left, right: prop.right});
        this.once("transitionend", (ev) => {
            if (this.isMaximizedX()) {
                this.debug("maximizedX");
                this.events.trigger("maximizedX", ev);

                if (typeof callback === "function") {
                    callback.call(this, ev);
                }
            }
        });
        return this;
    }

    /**
     * Maximizes element height
     * @param callback
     * @return {Element}
     */
    maximizeY(callback) {
        this.debug("maximizeY");
        this.events.trigger("maximizeY");
        this.removeClass("minimized");
        this.addClass("maximized-y");
        const prop = this._calculateMaximize();
        this.css({height: prop.height, top: prop.top, bottom: prop.bottom});
        this.once("transitionend", (ev) => {
            if (this.isMaximizedY()) {
                this.debug("maximizedY");
                this.events.trigger("maximizedY", ev);

                if (typeof callback === "function") {
                    callback.call(this, ev);
                }
            }
        });
        return this;
    }

    /**
     * Minimizes the component in its container
     * @param callback
     * @return {Element}
     */
    minimize(callback) {
        this.debug("minimize");
        this.events.trigger("minimize");
        this.removeClass("maximized maximized-x maximized-y");
        this.addClass("minimized");
        this.css(this._calculateMinimize(this.options.position));
        this.once("transitionend", (ev) => {
            if (this.isMinimized()) {
                this.debug("minimized");
                this.events.trigger("minimized", ev);

                if (typeof callback === "function") {
                    callback.call(this, ev);
                }
            }
        });
        return this;
    }

    /**
     * Returns the HTML element
     * @return {HTMLDocument|HTMLElement}
     */
    node() {
        return this.element;
    }

    /**
     * Remove the callback attached to the event
     * @param event
     * @param callback
     * @return {Element}
     */
    off(event, callback) {
        Cuic.off(event, this.node(), callback);
        return this;
    }

    /**
     * Returns the element offset
     * @return {{left: *, top: *}}
     */
    offset() {
        const node = this.node();
        this._display();
        const offset = {left: node.offsetLeft, top: node.offsetTop};
        this._restoreDisplay();
        return offset;
    }

    /**
     * Returns the first positioned parent element
     * @return {Element|null}
     */
    offsetParent() {
        const parent = this.offsetParentNode();
        return parent ? Cuic.element(parent) : null;
    }

    /**
     * Returns the first positioned parent node
     * @return {HTMLDocument|HTMLElement|null}
     */
    offsetParentNode() {
        this._display();
        const parent = this.node().offsetParent;
        this._restoreDisplay();
        return parent;
    }

    /**
     * Executes the callback each time the event is triggered
     * @param event
     * @param callback
     * @return {Element}
     */
    on(event, callback) {
        Cuic.on(event, this.node(), callback);
        return this;
    }

    /**
     * Executes the callback once when the event is triggered
     * @param event
     * @param callback
     * @return {Element}
     */
    once(event, callback) {
        Cuic.once(event, this.node(), callback);
        return this;
    }

    /**
     * Called when element is aligned
     * @param callback
     * @return {Element}
     */
    onAligned(callback) {
        this.events.on("aligned", callback);
        return this;
    }

    /**
     * Called when element is positioned towards another element
     * @param callback
     * @return {Element}
     */
    onAnchored(callback) {
        this.events.on("anchored", callback);
        return this;
    }

    /**
     * Called when the component is maximizing
     * @param callback
     */
    onMaximize(callback) {
        this.events.on("maximize", callback);
    }

    /**
     * Called when the component is maximized
     * @param callback
     */
    onMaximized(callback) {
        this.events.on("maximized", callback);
    }

    /**
     * Called when the component is minimizing
     * @param callback
     */
    onMinimize(callback) {
        this.events.on("minimize", callback);
    }

    /**
     * Called when the component is minimized
     * @param callback
     */
    onMinimized(callback) {
        this.events.on("minimized", callback);
    }

    /**
     * Called when element is removed from the DOM
     * @param callback
     * @return {Element}
     */
    onRemoved(callback) {
        this.events.on("removed", callback);
        return this;
    }

    /**
     * Returns the element height including padding, borders and eventually margin
     * @param includeMargin
     * @return {number}
     */
    outerHeight(includeMargin = false) {
        const node = this.node();
        let height;

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

    /**
     * Returns the element width including padding, borders and eventually margin
     * @param includeMargin
     * @return {number}
     */
    outerWidth(includeMargin = false) {
        const node = this.node();
        let width;

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

    /**
     * Returns element padding
     * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
     */
    padding() {
        let bottom = 0;
        let left = 0;
        let right = 0;
        let top = 0;

        if (!(this.node() instanceof Window)) {
            bottom = parseFloat(Cuic.getComputedStyle(this, "padding-bottom"));
            left = parseFloat(Cuic.getComputedStyle(this, "padding-left"));
            right = parseFloat(Cuic.getComputedStyle(this, "padding-right"));
            top = parseFloat(Cuic.getComputedStyle(this, "padding-top"));
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
     * @return {Element|null}
     */
    parent() {
        const parent = this.parentNode();
        return parent ? Cuic.element(parent) : null;
    }

    /**
     * Returns the parent of the element
     * @return {HTMLDocument|HTMLElement|null}
     */
    parentNode() {
        return this.node().parentNode;
    }

    /**
     * Returns the element position
     * @return {{bottom: Number, left: Number, right: Number, top: Number}}
     */
    position() {
        this._display();
        const bottom = parseFloat(Cuic.getComputedStyle(this, "bottom"));
        const left = parseFloat(Cuic.getComputedStyle(this, "left"));
        const right = parseFloat(Cuic.getComputedStyle(this, "right"));
        const top = parseFloat(Cuic.getComputedStyle(this, "top"));
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
    positionOnScreen() {
        return Cuic.extend({}, this.node().getBoundingClientRect());
    }

    /**
     * Prepends the element
     * @param element
     * @return {Element}
     */
    prepend(element) {
        const self = this;
        // const node = this.node();
        // const parent = this.parent();
        this.debug("prepend", element);

        if (element instanceof Elements) {
            element.each((el) => {
                el.preprendTo(self);
                // node.prepend(el.node());
            });
        }
        else if (Cuic.isJQuery(element)) {
            element.each(function () {
                Cuic.element(this).preprendTo(self);
                // node.prepend(this);
            });
        }
        else {
            Cuic.element(element).preprendTo(self);
            // node.prepend(Cuic.node(element));
        }
        return this;
    }

    /**
     * Prepends to the element
     * @param element
     * @return {Element}
     */
    prependTo(element) {
        this.debug("prependTo", element);
        const el = Cuic.element(element);

        if (el.children().length) {
            el.children().first().insertBefore(this.node());
        } else {
            el.append(this);
        }
        // Cuic.node(element).prepend(this.node());
        return this;
    }

    /**
     * Removes the element from the DOM
     * @return {Element}
     */
    remove() {
        this.debug("remove");
        this.node().remove();
        this.events.trigger("removed");
        return this;
    }

    /**
     * Removes classes from the element
     * @param className
     * @return {Element}
     */
    removeClass(className) {
        this.debug("removeClass", className);
        let classes = this.getClasses();
        const classNames = (className || "").split(" ");

        for (let i = 0; i < classNames.length; i += 1) {
            let index = classes.indexOf(classNames[i]);

            if (index !== -1) {
                classes.splice(index, 1);
            }
        }
        this.node().className = classes.join(" ");
        return this;
    }

    /**
     * Returns element scroll height
     * @return {number|*}
     */
    scrollHeight() {
        const node = this.node();
        let scroll = node.scrollHeight;

        // Use document scroll height instead
        if (node instanceof Window) {
            scroll = document.body.scrollHeight;
        }
        return scroll;
    }

    /**
     * Returns element scroll left
     * @return {number|*}
     */
    scrollLeft() {
        const node = this.node();
        let scroll = node.scrollLeft;

        // Use window scrolling instead
        if (node instanceof HTMLBodyElement || node instanceof Window) {
            scroll = Cuic.scrollX();
        }
        return scroll;
    }

    /**
     * Returns element scroll top
     * @return {number|*}
     */
    scrollTop() {
        const node = this.node();
        let scroll = node.scrollTop;

        // Use window scrolling instead
        if (node instanceof HTMLBodyElement || node instanceof Window) {
            scroll = Cuic.scrollY();
        }
        return scroll;
    }

    /**
     * Returns element scroll width
     * @return {number|*}
     */
    scrollWidth() {
        const node = this.node();
        let scroll = node.scrollWidth;

        // Use document scroll width instead
        if (node instanceof Window) {
            scroll = document.body.scrollWidth;
        } else if (node instanceof Window) {
            scroll = 0;
        }
        return scroll;
    }

    /**
     * Shows the element
     * @return {Element}
     */
    show() {
        this.debug("show");
        this.css({display: ""});
        this.removeClass("hidden");
        this.events.trigger("shown");
        return this;
    }

    /**
     * Gets or sets element content as text
     * @param text
     * @return {Element|string}
     */
    text(text) {
        const node = this.node();
        this.debug("text", text);

        if (typeof text !== "undefined") {
            if (typeof node.innerText !== "undefined") {
                node.innerText = text;
            } else {
                node.textContent = text;
            }
            return this;
        }
        else if (node.hasOwnProperty("textContent")) {
            return node.textContent;
        }
        else {
            return Cuic.stripTags(node.innerHTML);
        }
    }

    /**
     * Returns or sets element value
     * @param value
     * @return {Element|*}
     */
    val(value) {
        this.debug("val", value);

        if (typeof value !== "undefined") {
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
    width() {
        const node = this.node();
        let width;

        if (node instanceof Window) {
            width = node.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;
        } else {
            this._display();
            width = node.clientWidth;
            this._restoreDisplay();
            width -= this.padding().horizontal;
        }
        return width;
    }
}

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
