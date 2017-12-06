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

export class Events {

    constructor(context) {
        this.callbacks = {};
        this.context = context;
    }

    /**
     * Removes all event listeners
     */
    clear() {
        this.callbacks = [];
    }

    /**
     * Removes the event listener
     * @param event
     * @param callback
     */
    off(event, callback) {
        if (this.callbacks[event] instanceof Array) {
            const cb = this.callbacks[event];

            for (let i = 0; i < cb.length; i += 1) {
                if (cb[i] === callback) {
                    cb.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * Executes the callback each time the event is triggered
     * @param event
     * @param callback
     */
    on(event, callback) {
        if (!(this.callbacks[event] instanceof Array)) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    /**
     * Executes the callback once when the event is triggered
     * @param event
     * @param callback
     */
    once(event, callback) {
        if (!(this.callbacks[event] instanceof Array)) {
            this.callbacks[event] = [];
        }
        const cb = () => {
            let args = Array.prototype.slice.call(arguments);
            const context = args.shift();
            callback.apply(context, args);
            this.off(event, cb);
        };
        this.callbacks[event].push(cb);
    }

    /**
     * Executes all event listeners
     * @param event
     */
    trigger(event) {
        if (this.callbacks[event] instanceof Array) {
            let result;
            const cb = this.callbacks[event];
            const args = Array.prototype.slice.call(arguments, 1);

            for (let i = 0; i < cb.length; i += 1) {
                result = cb[i].apply(this.context, args);
            }
            return result;
        }
    }
}
