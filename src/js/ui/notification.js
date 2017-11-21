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
import {Collection} from "../utils/collection";
import {Component} from "../ui/component";
import {Element} from "../ui/element";

export class Notification extends Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Notification.prototype.options, options, {
            mainClass: "notification"
        });

        // Create element
        super("div", {className: options.className}, options);

        // Public attributes
        this.closeTimer = null;

        // Add content
        this.content = new Element("div", {
            className: "notification-content",
            html: options.content
        }).appendTo(this);

        // Add close button
        this.closeButton = new Element("span", {
            className: this.options.closeButtonClass,
            html: this.options.closeButton,
            role: "button"
        }).addClass("btn-close").appendTo(this);

        // Avoid closing notification when mouse is over
        this.on("mouseenter", (ev) => {
            clearTimeout(this.closeTimer);
        });

        // Close notification when mouse is out
        this.on("mouseleave", (ev) => {
            if (ev.currentTarget === this.node()) {
                this.autoClose();
            }
        });

        this.on("click", (ev) => {
            // Close button
            if (Cuic.element(ev.target).hasClass("btn-close")) {
                ev.preventDefault();
                this.close();
            }
        });

        this.onClosed(() => {
            if (this.options.autoRemove) {
                this.remove();
            }
        });

        this.onOpen(() => {
            if (this.options.position) {
                this.align();
            }
        });

        this.onOpened(() => {
            this.autoClose();
        });

        // Remove dialog from list
        this.onRemoved(() => {
            Cuic.notifications.remove(this);
        });

        // Add element to collection
        Cuic.notifications.add(this);
    }

    /**
     * Auto closes the notification
     */
    autoClose() {
        clearTimeout(this.closeTimer);
        this.closeTimer = setTimeout(() => {
            if (this.options.autoClose) {
                this.close();
            }
        }, this.options.duration);
    }

    /**
     * Sets notification content
     * @param html
     * @return {Notification}
     */
    setContent(html) {
        this.content.html(html);
        return this;
    }
}

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

Cuic.notifications = new Collection();

Cuic.onWindowResized(() => {
    Cuic.notifications.each((n) => {
        if (n.isInDOM()) {
            n.align();
        }
    });
});
