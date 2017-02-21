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

Cuic.Elements = class {

    constructor(elements, context, selector) {
        this.length = 0;
        this.context = context;
        this.selector = selector;

        for (let i = 0; i < elements.length; i += 1) {
            if (elements.hasOwnProperty(i)) {
                let el = elements[i];

                // Get element from node
                if (el instanceof HTMLDocument || el instanceof HTMLElement) {
                    el = Cuic.element(el);
                }

                // Add element to set
                this[this.length] = el;

                // Increment set length
                this.length += 1;
            }
        }
    }

    /**
     * Aligns all elements
     * @param position
     * @return {Cuic.Elements}
     */
    align(position) {
        return this.each((el) => {
            el.align(position);
        });
    }

    /**
     * Anchors all elements
     * @param position
     * @param target
     * @return {Cuic.Elements}
     */
    anchor(position, target) {
        return this.each((el) => {
            el.anchor(position, target);
        });
    }

    /**
     * Removes all elements
     * @param styles
     * @return {Cuic.Elements}
     */
    css(styles) {
        return this.each((el) => {
            el.css(styles);
        });
    }

    /**
     * Executes a callback on each elements
     * @param callback
     * @return {Cuic.Elements}
     */
    each(callback) {
        for (let i = 0; i < this.length; i += 1) {
            callback.call(this, this[i]);
        }
        return this;
    }

    /**
     * Removes elements content
     * @return {Cuic.Elements}
     */
    empty() {
        return this.each((el) => {
            el.empty();
        });
    }

    /**
     * Returns the element at the specified index
     * @param index
     * @return {Cuic.Element}
     */
    eq(index) {
        return this[index];
    }

    /**
     * Returns elements from the list matching the selector
     * @param selector
     * @return {Cuic.Elements}
     */
    filter(selector) {
        const elements = [];

        if (typeof selector === 'string') {
            this.each((el) => {
                if (el.node().matches(selector)) {
                    elements.push(el);
                }
            });
        }
        return new Cuic.Elements(elements, this.context, selector);
    }

    /**
     * Returns elements matching the selector
     * @param selector
     * @return {Cuic.Elements}
     */
    find(selector) {
        const elements = [];

        if (typeof selector === 'string') {
            this.each((el) => {
                el.find(selector).each((el2) => {
                    elements.push(el2);
                });
            });
        }
        return new Cuic.Elements(elements, this.context, selector);
    }

    /**
     * Returns the first element in the list
     * @return {Cuic.Element|null}
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
     * @return {Cuic.Elements}
     */
    hide() {
        return this.each((el) => {
            el.hide();
        });
    }

    /**
     * Sets elements content
     * @param html
     * @return {Cuic.Elements}
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
     * @return {Cuic.Element|null}
     */
    last() {
        return this.length ? this[this.length - 1] : null;
    }

    /**
     * Returns elements from the list not matching the selector
     * @param selector
     * @return {Cuic.Elements}
     */
    not(selector) {
        const elements = [];

        if (typeof selector === 'string') {
            this.each((el) => {
                if (!el.node().matches(selector)) {
                    elements.push(el);
                }
            });
        }
        return new Cuic.Elements(elements, this.context);
    }

    /**
     * Removes all elements
     * @return {Cuic.Elements}
     */
    remove() {
        return this.each((el) => {
            el.remove();
        });
    }

    /**
     * Shows all elements
     * @return {Cuic.Elements}
     */
    show() {
        return this.each((el) => {
            el.show();
        });
    }

    /**
     * Sets elements value
     * @param value
     * @return {Cuic.Elements}
     */
    val(value) {
        return this.each((el) => {
            el.val(value);
        });
    }
};
