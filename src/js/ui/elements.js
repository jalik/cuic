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

export class Elements {

    constructor(elements, context, selector) {
        let i;

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
     * @return {Elements}
     */
    addClass(className) {
        return this.each((el) => {
            el.addClass(className);
        });
    }

    /**
     * Aligns all elements
     * @param position
     * @return {Elements}
     */
    align(position) {
        return this.each((el) => {
            el.align(position);
        });
    }

    /**
     * Anchors all elements
     * @param position
     * @param anchorPoint
     * @param target
     * @return {Elements}
     */
    anchor(position, anchorPoint, target) {
        return this.each((el) => {
            el.anchor(position, anchorPoint, target);
        });
    }

    /**
     * Appends one or more elements
     * @param element
     * @return {Elements}
     */
    append(element) {
        return this.each((el) => {
            el.append(element);
        });
    }

    /**
     * Defines attribute for all elements
     * @param name
     * @param value
     * @return {Elements}
     */
    attr(name, value) {
        return this.each((el) => {
            el.attr(name, value);
        });
    }

    /**
     * Triggers a click event on elements
     * @return {Elements}
     */
    click() {
        return this.each((el) => {
            el.click();
        });
    }

    /**
     * Removes all elements
     * @param styles
     * @return {Elements}
     */
    css(styles) {
        return this.each((el) => {
            el.css(styles);
        });
    }

    /**
     * Executes a callback on each elements
     * @param callback
     * @return {Elements}
     */
    each(callback) {
        for (let i = 0; i < this.length; i += 1) {
            callback.call(this[i], this[i], i);
        }
        return this;
    }

    /**
     * Removes elements content
     * @return {Elements}
     */
    empty() {
        return this.each((el) => {
            el.empty();
        });
    }

    /**
     * Returns the element at the specified index
     * @param index
     * @return {Element}
     */
    eq(index) {
        return this[index];
    }

    /**
     * Returns elements from the list matching the selector
     * @param selector
     * @return {Elements}
     */
    filter(selector) {
        const elements = [];

        if (typeof selector === "string") {
            this.each((el) => {
                if (el.node().matches(selector)) {
                    elements.push(el);
                }
            });
        }
        return new Elements(elements, this.context, selector);
    }

    /**
     * Returns elements matching the selector
     * @param selector
     * @return {Elements}
     */
    find(selector) {
        const elements = [];

        if (typeof selector === "string") {
            this.each((el) => {
                el.find(selector).each((el2) => {
                    elements.push(el2);
                });
            });
        }
        return new Elements(elements, this.context, selector);
    }

    /**
     * Returns the first element in the list
     * @return {Element|null}
     */
    first() {
        return this.length ? this[0] : null;
    }

    /**
     * Returns the HTML element at the specified index
     * @param index
     * @return {HTMLDocument|HTMLElement|null}
     */
    get(index) {
        return this[index].node();
    }

    /**
     * Hides all elements
     * @return {Elements}
     */
    hide() {
        return this.each((el) => {
            el.hide();
        });
    }

    /**
     * Sets elements content as HTML
     * @param html
     * @return {Elements}
     */
    html(html) {
        return this.each((el) => {
            el.html(html);
        });
    }

    /**
     * Returns the index of the element
     * @param element
     * @return {number}
     */
    index(element) {
        for (let i = 0; i < this.length; i += 1) {
            if (this.eq(i) === element || this.get(i) === element) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Returns the last element in the list
     * @return {Element|null}
     */
    last() {
        return this.length ? this[this.length - 1] : null;
    }

    /**
     * Returns elements from the list not matching the selector
     * @param selector
     * @return {Elements}
     */
    not(selector) {
        const elements = [];

        if (typeof selector === "string") {
            this.each((el) => {
                if (!el.node().matches(selector)) {
                    elements.push(el);
                }
            });
        }
        return new Elements(elements, this.context);
    }

    /**
     * Removes an event listener from elements
     * @param event
     * @param callback
     * @return {Elements}
     */
    off(event, callback) {
        return this.each((el) => {
            el.off(event, callback);
        });
    }

    /**
     * Adds a unique event listener to elements
     * @param event
     * @param callback
     * @return {Elements}
     */
    once(event, callback) {
        return this.each((el) => {
            el.once(event, callback);
        });
    }

    /**
     * Adds an event listener to elements
     * @param event
     * @param callback
     * @return {Elements}
     */
    on(event, callback) {
        return this.each((el) => {
            el.on(event, callback);
        });
    }

    /**
     * Prepends one or more elements
     * @param element
     * @return {Elements}
     */
    prepend(element) {
        return this.each((el) => {
            el.prepend(element);
        });
    }

    /**
     * Removes all elements
     * @return {Elements}
     */
    remove() {
        return this.each((el) => {
            el.remove();
        });
    }

    /**
     * Removes class from all elements
     * @param className
     * @return {Elements}
     */
    removeClass(className) {
        return this.each((el) => {
            el.removeClass(className);
        });
    }

    /**
     * Shows all elements
     * @return {Elements}
     */
    show() {
        return this.each((el) => {
            el.show();
        });
    }

    /**
     * Sets elements content as raw text
     * @param text
     * @return {Elements}
     */
    text(text) {
        return this.each((el) => {
            el.text(text);
        });
    }

    /**
     * Toggles class from all elements
     * @param className
     * @return {Elements}
     */
    toggleClass(className) {
        return this.each((el) => {
            el.toggleClass(className);
        });
    }

    /**
     * Sets elements value
     * @param value
     * @return {Elements}
     */
    val(value) {
        if (value !== undefined) {
            return this.each((el) => {
                el.val(value);
            });
        }
        else if (this.length) {
            return this.eq(0).val();
        }
    }
}
