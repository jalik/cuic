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
import {Closable} from "./closable";
import {Collection} from "../utils/collection";
import {Element} from "./element";
import {Shortcut} from "../utils/shortcut";
import {Group} from "./group";
import {Button} from "./button";

export class Popup extends Closable {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Popup.prototype.options, options, {
            mainClass: "popup"
        });

        // Create element
        super("div", {className: options.className}, options);

        // Add tail
        this.tail = new Element("span", {
            className: "popup-tail"
        }).appendTo(this);

        // Add header
        this.header = new Element("header", {
            className: "popup-header",
            css: {display: !!this.options.title ? "block" : "none"}
        }).appendTo(this);

        // Add title
        this.title = new Element("h5", {
            className: "popup-title",
            html: this.options.title
        }).appendTo(this.header);

        // Add content
        this.content = new Element("div", {
            className: "popup-content",
            html: options.content
        }).appendTo(this);

        // Add footer
        this.footer = new Element("footer", {
            className: "popup-footer",
            css: {display: !!this.options.buttons ? "block" : "none"}
        }).appendTo(this);

        // Add buttons group
        this.buttons = new Group("div", {
            className: "btn-group guide-buttons"
        }).appendTo(this.footer);

        // Show footer if not empty
        this.buttons.onComponentAdded(() => {
            if (this.buttons.components.length > 0) {
                this.footer.show();
            }
        });

        // Hide footer if empty
        this.buttons.onComponentRemoved(() => {
            if (this.buttons.components.length < 1) {
                this.footer.hide();
            }
        });

        // Add buttons
        if (this.options.buttons instanceof Array) {
            for (let i = 0; i < this.options.buttons.length; i += 1) {
                this.addButton(this.options.buttons[i]);
            }
        }

        // Hide footer if no buttons
        if (!(this.options.buttons instanceof Array) || this.options.buttons.length < 1) {
            this.footer.hide();
        }

        /**
         * Popup shortcuts
         * @type {{close: *}}
         */
        this.shortcuts = {
            close: new Shortcut({
                element: this,
                keyCode: Cuic.keys.ESC,
                callback: () => {
                    this.close();
                }
            })
        };

        const autoClose = (ev) => {
            if (this.isOpened() && this.options.autoClose) {
                if (ev.target !== this.node() && !Cuic.element(ev.target).isChildOf(this)) {
                    this.close();
                }
            }
        };

        this.on("click", (ev) => {
            // Close button
            if (Cuic.element(ev.target).hasClass("btn-close")) {
                ev.preventDefault();
                this.close();
            }
        });

        // Reposition tail when popup position change
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
            const target = Cuic.element(this.options.target);
            // Get anchor from data attribute
            const anchor = target.data("anchor") || this.options.anchor;
            const anchorPoint = target.data("anchor-point") || this.options.anchorPoint;
            this.anchor(anchor, anchorPoint, target);
        });

        this.onOpened(() => {
            // Close the popup when the user clicks outside of it
            Cuic.on("click", document, autoClose);
        });

        // Add element to collection
        Cuic.popups.add(this);
    }

    /**
     * Adds a button to the footer
     * @param button
     * @return {Button}
     */
    addButton(button) {
        if (!(button instanceof Button)) {
            const callback = button.callback;

            // Create button
            button = new Button(Cuic.extend({
                className: "btn btn-default " + button.className,
                label: button.label
            }, button));

            // Set button callback
            if (typeof callback === "function") {
                button.on("click", (ev) => {
                    callback.call(this, ev);
                });
            }
        }

        // Add button in footer
        this.buttons.addComponent(button);
        return button;
    }

    /**
     * Returns the content
     * @return {Element}
     */
    getContent() {
        return this.content;
    }

    /**
     * Returns the footer
     * @return {Element}
     */
    getFooter() {
        return this.footer;
    }

    /**
     * Returns the header
     * @return {Element}
     */
    getHeader() {
        return this.header;
    }

    /**
     * Sets the content
     * @param html
     * @return {Popup}
     */
    setContent(html) {
        this.content.html(html);
        return this;
    }

    /**
     * Sets the footer
     * @param html
     * @return {Popup}
     */
    setFooter(html) {
        this.footer.html(html);
        return this;
    }

    /**
     * Sets the header
     * @param html
     * @return {Popup}
     */
    setHeader(html) {
        this.header.html(html);
        return this;
    }

    /**
     * Sets dialog title
     * @param html
     * @return {Popup}
     */
    setTitle(html) {
        this.title.html(html);

        if (html !== null) {
            this.header.show();
        }
        return this;
    }

    /**
     * Position the tail
     * @return {Popup}
     */
    updateTail() {
        let prop = {
            bottom: "",
            left: "",
            right: "",
            top: "",
        };

        // todo copy popup background color
        // prop["border-color"] = this.css("background-color");

        // Remove previous classes
        this.tail.removeClass("popup-tail-bottom popup-tail-left popup-tail-right popup-tail-top");

        // Top tail
        if (this.isAnchored("bottom")) {
            this.tail.addClass("popup-tail-top");
        }
        // Bottom tail
        if (this.isAnchored("top")) {
            this.tail.addClass("popup-tail-bottom");
        }
        // Right tail
        if (this.isAnchored("left")) {
            this.tail.addClass("popup-tail-right");
        }
        // Left tail
        if (this.isAnchored("right")) {
            this.tail.addClass("popup-tail-left");
        }

        // Apply CSS
        this.tail.css(prop);

        return this;
    }
}

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

Cuic.popups = new Collection();

Cuic.onWindowResized(() => {
    Cuic.popups.each((popup) => {
        if (popup.isInDOM() && popup.isShown()) {
            // popup._disableTransitions();
            const options = popup.options;
            popup.anchor(options.anchor, options.anchorPoint, options.target);
            // popup._enableTransitions();
        }
    });
});
