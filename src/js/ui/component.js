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
Cuic.Component = class extends Cuic.Element {

    constructor(node, attributes, options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Component.prototype.options, options);

        super(node, attributes, options);

        const self = this;

        // Add component classes
        if (options.className) {
            self.addClass('component');
        }
    }

    /**
     * Closes the component
     * @param callback
     * @return {Cuic.Component}
     */
    close(callback) {
        this.onClose();
        this.removeClass('opened');
        this.addClass('closed');
        this.once('transitionend', (ev) => {
            this.onClosed(ev);

            if (typeof callback === 'function') {
                callback.call(this, ev);
            }
        });
        return this;
    }

    /**
     * Checks if the component is opened
     * @return {boolean}
     */
    isOpened() {
        return this.hasClass('opened');
    }

    /**
     * Maximizes the component in its container
     * @param callback
     */
    maximize(callback) {
        this.onMaximize();
        this.removeClass('minimized');
        this.addClass('maximized');
        Cuic.maximize(this.getElement());
        this.once('transitionend', (ev) => {
            this.onMaximized(ev);

            if (typeof callback === 'function') {
                callback.call(this, ev);
            }
        });
    }

    /**
     * Minimizes the component in its container
     * @param callback
     */
    minimize(callback) {
        this.onMinimize();
        this.removeClass('maximized');
        this.addClass('minimized');
        Cuic.minimize(this.getElement(), this.options.position);
        this.once('transitionend', (ev) => {
            this.onMinimized(ev);

            if (typeof callback === 'function') {
                callback.call(this, ev);
            }
        });
    }

    /**
     * Called when the component is closing
     */
    onClose() {
    }

    /**
     * Called when the component is closed
     */
    onClosed() {
    }

    /**
     * Called when the component is maximizing
     */
    onMaximize() {
    }

    /**
     * Called when the component is maximized
     */
    onMaximized() {
    }

    /**
     * Called when the component is minimizing
     */
    onMinimize() {
    }

    /**
     * Called when the component is minimized
     */
    onMinimized() {
    }

    /**
     * Called when the component is opened
     */
    onOpen() {
    }

    /**
     * Called when the component is opened
     */
    onOpened() {
    }

    /**
     * Opens the component
     * @param callback
     * @return {Cuic.Component}
     */
    open(callback) {
        this.onOpen();
        this.removeClass('closed');
        this.addClass('opened');
        this.once('transitionend', (ev) => {
            this.onOpened(ev);

            if (typeof callback === 'function') {
                callback.call(this, ev);
            }
        });
        return this;
    }

    /**
     * Toggles the component
     * @param callback
     * @return {Cuic.Component}
     */
    toggle(callback) {
        if (this.isOpened()) {
            this.close(callback);
        } else {
            this.open(callback);
        }
        return this;
    }
};

Cuic.Component.prototype.options = {
    className: null,
    css: null,
    parent: null,
    position: null
};
