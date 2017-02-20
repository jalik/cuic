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

Cuic.Collection = class {

    constructor(values) {
        this.values = values instanceof Array ? values : [];
        this.length = this.values.length;
    }

    /**
     * Adds the value to the collection
     * @param value
     */
    add(value) {
        this.values.push(value);
        this.length += 1;
        this.onAdded(value);
    }

    /**
     * Executes a callback on each values
     * @param callback
     */
    each(callback) {
        for (let i = 0; i < this.values.length; i += 1) {
            callback.call(this, this.values[i]);
        }
    }

    /**
     * Returns the specified value
     * @param index
     * @return {Array.<T>}
     */
    get(index) {
        return this.values[index];
    }

    /**
     * Returns the index of the value
     * @param value
     * @return {number}
     */
    indexOf(value) {
        return this.values.indexOf(value);
    }

    /**
     * Called when a value is added
     * @param value
     */
    onAdded(value) {
    }

    /**
     * Called when a value is removed
     * @param value
     */
    onRemoved(value) {
    }

    /**
     * Removes the value from the collection
     * @param value
     */
    remove(value) {
        const index = this.values.indexOf(value);

        if (index !== -1) {
            this.values.splice(index, 1);
            this.length -= 1;
            this.onRemoved(value);
        }
    }

    /**
     * Returns the collection size
     */
    size() {
        return this.values.length;
    }
};
