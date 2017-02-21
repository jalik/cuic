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

Cuic.Set = class {

    constructor(elements, context, selector) {
        this.length = 0;
        this.context = context;
        this.selector = selector;

        for (let i = 0; i < elements.length; i += 1) {
            if (elements.hasOwnProperty(i)) {
                let elm = elements[i];

                // Convert element
                if (elm instanceof HTMLElement) {
                    elm = Cuic.element(elm);
                }

                // Add element to set
                this[this.length] = elm;

                // Increment set length
                this.length += 1;
            }
        }
    }

    /**
     * Executes a callback on each elements
     * @param callback
     */
    each(callback) {
        for (let i = 0; i < this.length; i += 1) {
            callback.call(this, this[i]);
        }
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
     * @return {Cuic.Set}
     */
    filter(selector) {
        const elements = [];

        if (typeof selector === 'string') {
            this.each((elm) => {
                if (elm.node().matches(selector)) {
                    elements.push(elm);
                }
            });
        }
        return new Cuic.Set(elements, this.context, selector);
    }

    /**
     * Returns the first element in the list
     * @return {Cuic.Element|null}
     */
    first() {
        return this.length ? this[0] : null;
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
     * @return {Cuic.Set}
     */
    not(selector) {
        const elements = [];

        if (typeof selector === 'string') {
            this.each((elm) => {
                if (!elm.node().matches(selector)) {
                    elements.push(elm);
                }
            });
        }
        return new Cuic.Set(elements, this.context);
    }
};
