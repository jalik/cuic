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
import {Element} from "./element";

export class Selectable extends Element {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Selectable.prototype.options, options);

        // Create element
        super("div", {className: options.className}, options);

        // Add component class
        this.addClass("selectable");

        // Add selected class
        if (this.options.selected) {
            this.addClass("selected");
        }

        // Add or remove selected class
        this.on("click", () => {
            if (this.hasClass("selected")) {
                this.deselect();
            } else {
                this.select();
            }
        });
    }

    /**
     * Deselect element
     * @param callback
     * @return {Selectable}
     */
    deselect(callback) {
        this.removeClass("selected");
        this.once("transitionend", (ev) => {
            if (!this.isSelected()) {
                this.events.trigger("deselected", ev);

                if (typeof callback === "function") {
                    callback.call(this, ev);
                }
            }
        });
        return this;
    }

    /**
     * Checks if the element is selected
     * @return {boolean}
     */
    isSelected() {
        return (this.hasClass("selected") || this.attr("selected")) === true;
    }

    /**
     * Called when element is deselected
     * @param callback
     * @return {Selectable}
     */
    onDeselected(callback) {
        this.events.on("deselected", callback);
        return this;
    }

    /**
     * Called when element is selected
     * @param callback
     * @return {Selectable}
     */
    onSelected(callback) {
        this.events.on("selected", callback);
        return this;
    }

    /**
     * Select element
     * @param callback
     * @return {Selectable}
     */
    select(callback) {
        this.addClass("selected");
        this.once("transitionend", (ev) => {
            if (this.isSelected()) {
                this.events.trigger("selected", ev);

                if (typeof callback === "function") {
                    callback.call(this, ev);
                }
            }
        });
        return this;
    }
}

Selectable.prototype.options = {
    namespace: "selectable"
};
