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

Cuic.Switcher = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Switcher.prototype.options, options);

        // Create element
        super('div', {
            className: options.className,
            html: options.content
        }, options);

        const self = this;

        // Add component classes
        self.addClass('switcher');

        // Public attributes
        self.activeElement = null;
        self.index = 0;
        self.timer = null;

        // Display first element
        self.goTo(0);

        // Auto start timer
        if (self.options.autoStart) {
            self.start();
        }
    }

    /**
     * Displays the first element
     */
    first() {
        this.goTo(0);
    }

    /**
     * Returns the active element
     * @return {HTMLElement}
     */
    getActiveElement() {
        return this.activeElement;
    }

    /**
     * Returns the element at the specified index
     * @param index
     * @return {HTMLElement}
     */
    getElementAt(index) {
        return this.children()[index];
    }

    /**
     * Returns the index of the visible element
     * @return {number}
     */
    getIndex() {
        return this.children().indexOf(this.activeElement);
    }

    /**
     * Displays the element at the specified index
     * @param position
     */
    goTo(position) {
        const children = this.children();
        const repeat = this.options.repeat;

        // Go to first element if end of list
        if (position >= children.length) {
            this.index = repeat ? 0 : children.length - 1;
        }
        else if (position < 0) {
            this.index = repeat ? children.length - 1 : 0;
        }
        else {
            this.index = position;
        }

        if (this.index !== this.getIndex()) {
            const started = this.isStarted();
            this.stop();

            // Get the visible element
            this.activeElement = children[this.index];

            // Hide visible elements
            for (let i = 0; i < children.length; i += 1) {
                let child = Cuic.element(children[i]);

                if (this.index === i) {
                    child.addClass('visible');
                    child.removeClass('hidden');
                } else {
                    child.addClass('hidden');
                    child.removeClass('visible');
                }
            }

            // Show the active element
            if (started) {
                this.start();
            }
        }
    }

    /**
     * Checks if the switcher is started
     * @return {boolean}
     */
    isStarted() {
        return this.timer !== null && this.timer !== undefined;
    }

    /**
     * Displays the last element
     */
    last() {
        this.goTo(this.children().length - 1);
    }

    /**
     * Displays the next element
     */
    next() {
        this.goTo(this.index + 1);
    }

    /**
     * Displays the previous element
     */
    previous() {
        this.goTo(this.index - 1);
    }

    /**
     * Starts the started
     */
    start() {
        if (!this.isStarted()) {
            this.timer = setInterval(() => {
                this.next();
            }, this.options.delay);
        }
    }

    /**
     * Stops the started
     */
    stop() {
        if (this.isStarted()) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
};

Cuic.Switcher.prototype.options = {
    autoStart: true,
    delay: 3000,
    namespace: 'switcher',
    repeat: true
};
