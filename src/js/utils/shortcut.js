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

Cuic.Shortcut = class {

    constructor(options) {
        const self = this;

        // Set default options
        options = Cuic.extend({}, Cuic.Shortcut.prototype.options, options);
        self.options = options;

        // Get the element
        self.options.element = Cuic.getElement(options.element);

        // Check options
        if (typeof self.options.callback !== 'function') {
            throw new TypeError(`Shortcut.options.callback is not a function.`);
        }

        // Init options
        if (self.options.active) {
            self.activate();
        }
    }

    /**
     * Activates the shortcut
     */
    activate() {
        const self = this;
        const options = this.options;
        const element = this.getElement();
        Cuic.on(`keydown`, element, (ev) => {
            if ((options.keyCode === ev.keyCode || options.key === ev.key || options.key === ev.code)
                && options.altKey === ev.altKey
                && options.ctrlKey === ev.ctrlKey
                && options.shiftKey === ev.shiftKey) {
                ev.preventDefault();
                ev.stopPropagation();
                options.callback.call(self, element, ev);
                return false;
            }
        });
    }

    /**
     * Deactivates the shortcut
     */
    deactivate() {
        Cuic.off(`keydown`, this.getElement(), this.options.callback);
    }

    /**
     * Returns the element
     * @return {HTMLElement}
     */
    getElement() {
        return Cuic.getElement(this.options.element);
    }
};

Cuic.Shortcut.prototype.options = {
    active: true,
    altKey: false,
    callback: null,
    ctrlKey: false,
    element: document.body,
    key: null,
    keyCode: null,
    shiftKey: false
};

Cuic.keys = {
    BACKSPACE: 8,
    DEL: 46,
    DOWN: 40,
    ENTER: 13,
    ESC: 27,
    INSERT: 45,
    LEFT: 37,
    MINUS: 109,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    PLUS: 107,
    RIGHT: 39,
    TAB: 9,
    UP: 38
};
