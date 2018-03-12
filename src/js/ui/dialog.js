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
import Button from "./button";
import Closable from "./closable";
import Collection from "../utils/collection";
import Element from "./element";
import Overlay from "./overlay";
import Group from "./group";
import Movable from "./movable";
import Resizable from "./resizable";
import Shortcut from "../utils/shortcut";

export class Dialog extends Closable {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Dialog.prototype.options, options, {
            mainClass: "cc-dialog"
        });

        // Create element
        super("div", {
            className: options.className,
            role: "dialog"
        }, options);

        // Set dialog position
        if (this.parentNode() === document.body) {
            this.css({position: "absolute"});
        }

        // Create the overlay
        this.overlay = new Overlay({
            className: "cc-overlay cc-dialog-overlay",
            autoClose: false,
            autoRemove: false,
            opened: false
        }).appendTo(this.options.parent);

        // Add header
        this.header = new Element("header", {
            className: "cc-dialog-header",
            css: {display: !!this.options.title ? "block" : "none"}
        }).appendTo(this);

        // Add title
        this.title = new Element("h3", {
            className: "cc-dialog-title",
            html: this.options.title
        }).appendTo(this.header);

        // Add content
        this.content = new Element("section", {
            className: "cc-dialog-content",
            html: this.options.content
        }).appendTo(this);

        // Add footer
        this.footer = new Element("footer", {
            className: "cc-dialog-footer",
            css: {display: !!this.options.buttons ? "block" : "none"}
        }).appendTo(this);

        // Add buttons group
        this.buttons = new Group("div", {
            className: "btn-group"
        }).appendTo(this.footer);

        // Add close button
        this.closeButton = new Element("span", {
            className: this.options.closeButtonClass,
            html: this.options.closeButton,
            role: "button"
        }).addClass("btn-close").appendTo(this.header);

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

        // Set content height
        if (parseFloat(options.contentHeight) > 0) {
            this.content.css({height: options.contentHeight});
        }

        // Set content width
        if (parseFloat(options.contentWidth) > 0) {
            this.content.css({width: options.contentWidth});
        }

        /**
         * Movable interface
         * @type {Movable}
         */
        if (this.options.movable) {
            this.movable = new Movable({
                constraintToParent: true,
                enabled: this.options.movable,
                element: this.node(),
                handle: this.header,
                rootOnly: false
            });
            this.movable.onMoveStart((ev) => {
                // Avoid moving if button is clicked
                if (Cuic.element(ev.target).hasClass("btn-close")) {
                    return false;
                }
            });
        }

        /**
         * Resizable interface
         * @type {Resizable}
         */
        if (this.options.resizable) {
            this.resizable = new Resizable({
                enabled: this.options.resizable,
                element: this.node()
            });
        }

        /**
         * Dialog shortcuts
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

        // Close dialog when overlay is clicked
        this.overlay.on("click", () => {
            if (this.options.autoClose) {
                this.close();
            }
        });

        this.on("click", (ev) => {
            // Close button
            if (Cuic.element(ev.target).hasClass("btn-close")) {
                ev.preventDefault();
                this.close();
            }
        });

        // Called when dialog is closing
        this.onClose(() => {
            this.overlay.options.autoRemove = this.options.autoRemove;

            if (this.overlay.isOpened()) {
                this.overlay.close();
            }
        });

        // Called when dialog is closed
        this.onClosed(() => {
            if (this.options.autoRemove) {
                this.remove();
                this.overlay.remove();
            }
        });

        // Called when dialog is opening
        this.onOpen(() => {
            // Calculate z-index
            const zIndex = Math.max(this.options.zIndex, Dialogs.getCurrentZIndex() + 1);

            // Set dialog z-index and resize content
            this.css({"z-index": zIndex});
            this.resizeContent();

            // Open overlay
            if (this.options.modal) {
                this.css({"z-index": zIndex + 1});
                this.overlay.css({"z-index": zIndex});
                this.overlay.open();
            }

            // Maximize or align the dialog
            if (this.options.maximized) {
                this.maximize();
            } else {
                this.align(this.options.position, {
                    inScreen: true
                });
            }

            // Focus the last button
            const buttons = this.buttons.children();

            if (buttons.length > 0) {
                // Focus the last button
                buttons.last().node().focus();

                for (let i = 0; i < buttons.length; i += 1) {
                    if (buttons.eq(i).attr("autofocus")) {
                        // Focus the last button with "autofocus" attribute
                        buttons.eq(i).node().focus();
                    }
                }
            }
        });

        // Called when dialog is opened
        // this.onOpened((ev) => {
        // // todo wait images to be loaded to resize content
        // let images = this.find("img");
        //
        // if (images.length > 0) {
        //     // Position the dialog when images are loaded
        //     images.off(ns("load")).on(ns("load"), () => {
        //         this.resizeContent();
        //     });
        // } else {
        //     // Position the dialog in the wrapper
        //     this.resizeContent();
        // }
        // });

        // Remove dialog from list
        this.onRemoved(() => {
            Dialogs.remove(this);
        });

        // Add element to collection
        Dialogs.add(this);
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
                className: "btn btn-default btn-secondary " + (button.className || ""),
                label: button.label
            }, button));

            // Set button callback
            if (typeof callback === "function") {
                button.on("click", (ev) => {
                    callback.call(this, ev);
                });
            } else if (callback === "close") {
                button.on("click", () => {
                    this.close();
                });
            }
        }

        // Add button in footer
        this.buttons.addComponent(button);
        return button;
    }

    /**
     * Returns the content
     * @deprecated
     * @return {Element}
     */
    getBody() {
        return this.content;
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
     * Resizes the content
     * @return {Dialog}
     */
    resizeContent() {
        // Calculate available space
        const available = this._calculateAvailableSpace();

        // Set dialog max dimensions
        this.css({
            "max-height": available.height,
            "max-width": available.width
        });

        // Calculate content max height
        let maxHeight = available.height;

        // Subtract header height
        if (this.header instanceof Element && this.header.isShown()) {
            maxHeight -= this.header.outerHeight(true);
        }
        // Subtract footer height
        if (this.footer instanceof Element && this.footer.isShown()) {
            maxHeight -= this.footer.outerHeight(true);
        }
        // Subtract content margin
        maxHeight -= this.content.margin().vertical;

        // Set content max height
        this.content.css({"max-height": maxHeight});
        return this;
    }

    /**
     * Sets the content
     * @param html
     * @return {Dialog}
     */
    setContent(html) {
        this.content.html(html);
        return this;
    }

    /**
     * Sets the footer
     * @param html
     * @return {Dialog}
     */
    setFooter(html) {
        this.footer.html(html);
        return this;
    }

    /**
     * Sets the header
     * @param html
     * @return {Dialog}
     */
    setHeader(html) {
        this.header.html(html);
        return this;
    }

    /**
     * Sets dialog title
     * @param html
     * @return {Dialog}
     */
    setTitle(html) {
        this.title.html(html);

        if (html !== null) {
            this.header.show();
        }
        return this;
    }
}

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

export const Dialogs = new Collection();

/**
 * Returns the z-index of the highest dialog
 * @return {number}
 */
Dialogs.getCurrentZIndex = function () {
    let zIndex = 0;

    Dialogs.each((dialog) => {
        const index = parseInt(dialog.css("z-index"));

        if (index > zIndex) {
            zIndex = index;
        }
    });
    return zIndex;
};

Cuic.onWindowResized(() => {
    Dialogs.each((dialog) => {
        if (dialog.isInDOM()) {
            dialog.resizeContent();
        }
    });
});

export default Dialog;
