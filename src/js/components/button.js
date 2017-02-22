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

Cuic.Button = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Button.prototype.options, options);

        // Create element
        super('button', {
            className: options.className,
            disabled: false,
            html: options.label,
            title: options.title,
            type: options.type
        }, options);

        // Add component classes
        this.addClass('btn');

        // Create shortcut
        if (typeof options.shortcut === 'number') {
            this.shortcut = new Cuic.Shortcut({
                keyCode: options.shortcut,
                target: this.element,
                callback() {
                    this.node().click();
                }
            });
        }
    }
};

Cuic.Button.prototype.options = {
    className: 'btn btn-default',
    disabled: false,
    shortcut: null,
    title: null,
    type: 'button'
};
