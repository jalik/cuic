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

/**
 * Generic component
 */
Cuic.Component = class {

    constructor(node, attributes, options) {
        const self = this;

        // Set default options
        options = $.extend({}, Cuic.Component.prototype.options, options);

        // Create element
        self.element = document.createElement(node);
        self.$element = $(self.element);
        // self.$element = $(`<${node}>`, attributes);

        // Set element attributes
        for (let attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                const value = attributes[attr];

                if (value !== null && value !== undefined) {
                    if (self.element[attr] !== undefined) {
                        self.element[attr] = value;
                    } else if (attr === 'html') {
                        self.element.innerHTML = value;
                    } else if (attr === 'text') {
                        self.element.innerText = value;
                    }
                }
            }
        }

        // Handle click events
        self.$element.on('click', (ev) => {
            if (typeof self.onClick === 'function') {
                self.onClick.call(self, ev);
            }
        });
    }

    disable() {
        this.element.disabled = true;
        this.$element.addClass('disabled');
    }

    enable() {
        this.element.disabled = false;
        this.$element.removeClass('disabled');
    }

    getElement() {
        return this.$element;
    }

    isEnabled() {
        return this.element.disabled !== true
            || !this.$element.hasClass('disabled');
    }

    onClick() {
    }
};

/**
 * Generic component default options
 */
Cuic.Component.prototype.options = {};
