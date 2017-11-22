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

import Cuic from "../cuic";
import {Closable} from "./closable";
import {Collection} from "../utils/collection";
import {Element} from "./element";

export class Tooltip extends Closable {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Tooltip.prototype.options, options, {
            mainClass: "tooltip"
        });

        // Create element
        super("div", {className: options.className}, options);

        // Public attributes
        this.currentTarget = null;

        // Add content
        this.content = new Element("div", {
            className: "tooltip-content"
        }).appendTo(this);

        // Add tail
        this.tail = new Element("span", {
            className: "tooltip-tail"
        }).appendTo(this);

        Cuic.element(document).on("mouseover", (ev) => {
            const targets = Cuic.find(this.options.selector);

            for (let i = 0; i < targets.length; i += 1) {
                const target = targets[i];

                if (ev.target === target.node()) {
                    // Get stored tooltip content
                    let content = target.data("tooltip");

                    if (!content || !content.length) {
                        // Get tooltip content from attribute
                        content = target.attr(this.options.attribute);
                        // Avoid conflict with native tooltip
                        target.attr(this.options.attribute, "");
                        // Store tooltip content
                        target.data("tooltip", content);
                    }

                    // Update tooltip content
                    if (content && content.length) {
                        this.content.html(content);
                    }

                    this.currentTarget = ev.target;

                    // Position tooltip
                    if (!this.options.followPointer) {
                        if (this.parentNode() !== ev.target.parentNode) {
                            this.appendTo(ev.target.parentNode);
                        }
                    }
                    this.open();

                    // Close tooltip when mouse leaves area
                    target.once("mouseleave", () => {
                        this.close();
                    });
                    break;
                }
            }
        });

        // Move tooltip when mouse moves and tooltip is opened
        Cuic.element(document).on("mousemove", (ev) => {
            if (this.options.followPointer && !this.isHidden()) {
                if (this.parentNode() !== document.body) {
                    this.appendTo(document.body);
                }
                const target = Cuic.element(this.currentTarget);
                // Get anchor from data attribute
                const anchor = target.data("anchor") || this.options.anchor;
                const anchorPoint = target.data("anchor-point") || this.options.anchorPoint;
                this.anchor(anchor, anchorPoint, [ev.pageX, ev.pageY]);
            }
        });

        const autoClose = (ev) => {
            if (this.isOpened() && this.options.autoClose) {
                if (ev.target !== this.node() && !Cuic.element(ev.target).isChildOf(this)) {
                    this.close();
                }
            }
        };

        // Keep tooltip open when mouse is over
        this.on("mouseover", () => {
            this.open();
        });

        // Close tooltip open when mouse leave it
        this.on("mouseleave", () => {
            this.close();
        });

        // Reposition tail when tooltip position change
        this.onAnchored(() => {
            this.updateTail();
        });

        this.onClosed(() => {
            Cuic.off("click", document, autoClose);

            if (this.options.autoRemove) {
                this.remove();
            }
        });

        this.onOpen(() => {
            if (!this.options.followPointer) {
                const target = Cuic.element(this.currentTarget);
                // Get anchor from data attribute
                const anchor = target.data("anchor") || this.options.anchor;
                const anchorPoint = target.data("anchor-point") || this.options.anchorPoint;
                this.anchor(anchor, anchorPoint, target);
            }
        });

        this.onOpened(() => {
            // Close the popup when the user clicks outside of it
            Cuic.on("click", document, autoClose);
        });

        // Add element to collection
        Cuic.tooltips.add(this);
    }

    /**
     * Returns the content
     * @return {Element}
     */
    getContent() {
        return this.content;
    }

    /**
     * Sets tooltip content
     * @param html
     * @return {Tooltip}
     */
    setContent(html) {
        this.content.html(html);
        return this;
    }

    /**
     * Position the tail
     * @return {Tooltip}
     */
    updateTail() {
        let prop = {
            bottom: "",
            left: "",
            right: "",
            top: "",
        };

        // todo copy tooltip background color
        // prop["border-color"] = this.css("background-color");

        // Remove previous classes
        this.tail.removeClass("tooltip-tail-bottom tooltip-tail-left tooltip-tail-right tooltip-tail-top");

        // Top tail
        if (this.isAnchored("bottom")) {
            this.tail.addClass("tooltip-tail-top");
        }
        // Bottom tail
        if (this.isAnchored("top")) {
            this.tail.addClass("tooltip-tail-bottom");
        }
        // Right tail
        if (this.isAnchored("left")) {
            this.tail.addClass("tooltip-tail-right");
        }
        // Left tail
        if (this.isAnchored("right")) {
            this.tail.addClass("tooltip-tail-left");
        }

        // Apply CSS
        this.tail.css(prop);

        return this;
    }
}

Tooltip.prototype.options = {
    anchor: "right",
    attribute: "title",
    followPointer: true,
    namespace: "tooltip",
    opened: false,
    selector: "[title]",
    zIndex: 100
};

Cuic.tooltips = new Collection();
