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

Cuic.Component = class extends Cuic.Element {

    constructor(node, attributes, options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Component.prototype.options, options);

        super(node, attributes, options);

        // Add component classes
        this.addClass('component');

        // Add closable class
        if (this.options.closable) {
            this.addClass('closable');
        }

        // Set the panel visibility
        // Since the visible option is used to check if the panel is visible
        // we force the panel to show or hide by setting visible to the inverse value.
        if (typeof this.options.opened === 'boolean') {
            if (this.options.opened) {
                this.open();
            } else {
                this.hide();// Hide to avoid animations
                this.close();
            }
        }

        // Maximize the panel
        if (this.options.maximized && this.hasParent()) {
            this.maximize();
        }
    }

    /**
     * Closes the component
     * @param callback
     * @return {Cuic.Component}
     */
    close(callback) {
        this.debug('close');
        this.events.trigger('close');
        this.removeClass('opened');
        this.addClass('closed');
        this.once('transitionend', (ev) => {
            if (!this.isOpened()) {
                this.debug('closed');
                this.events.trigger('closed', ev);
                this.hide();

                if (typeof callback === 'function') {
                    callback.call(this, ev);
                }
            }
        });
        return this;
    }

    /**
     * Checks if the component is maximized
     * @return {boolean}
     */
    isMaximized() {
        return this.hasClass('maximized');
    }

    /**
     * Checks if the component is minimized
     * @return {boolean}
     */
    isMinimized() {
        return this.hasClass('minimized');
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
     * @return {Cuic.Element}
     */
    maximize(callback) {
        this.debug('maximize');
        this.events.trigger('maximize');
        this.removeClass('minimized');
        this.addClass('maximized');
        this.css(Cuic.calculateMaximize(this));
        this.once('transitionend', (ev) => {
            if (this.isMaximized()) {
                this.debug('maximized');
                this.events.trigger('maximized', ev);

                if (typeof callback === 'function') {
                    callback.call(this, ev);
                }
            }
        });
        return this;
    }

    /**
     * Minimizes the component in its container
     * @param callback
     * @return {Cuic.Element}
     */
    minimize(callback) {
        this.debug('minimize');
        this.events.trigger('minimize');
        this.removeClass('maximized');
        this.addClass('minimized');
        this.css(Cuic.calculateMinimize(this, this.options.position));
        this.once('transitionend', (ev) => {
            if (this.isMinimized()) {
                this.debug('minimized');
                this.events.trigger('minimized', ev);

                if (typeof callback === 'function') {
                    callback.call(this, ev);
                }
            }
        });
        return this;
    }

    /**
     * Called when the component is closing
     * @param callback
     */
    onClose(callback) {
        this.events.on('close', callback);
    }

    /**
     * Called when the component is closed
     * @param callback
     */
    onClosed(callback) {
        this.events.on('closed', callback);
    }

    /**
     * Called when the component is maximizing
     * @param callback
     */
    onMaximize(callback) {
        this.events.on('maximize', callback);
    }

    /**
     * Called when the component is maximized
     * @param callback
     */
    onMaximized(callback) {
        this.events.on('maximized', callback);
    }

    /**
     * Called when the component is minimizing
     * @param callback
     */
    onMinimize(callback) {
        this.events.on('minimize', callback);
    }

    /**
     * Called when the component is minimized
     * @param callback
     */
    onMinimized(callback) {
        this.events.on('minimized', callback);
    }

    /**
     * Called when the component is opened
     * @param callback
     */
    onOpen(callback) {
        this.events.on('open', callback);
    }

    /**
     * Called when the component is opened
     * @param callback
     */
    onOpened(callback) {
        this.events.on('opened', callback);
    }

    /**
     * Opens the component
     * @param callback
     * @return {Cuic.Component}
     */
    open(callback) {
        this.debug('open');
        this.show();
        this.events.trigger('open');
        this.removeClass('closed');
        this.addClass('opened');
        this.once('transitionend', (ev) => {
            if (this.isOpened()) {
                this.debug('opened');
                this.events.trigger('opened', ev);

                if (typeof callback === 'function') {
                    callback.call(this, ev);
                }
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

Cuic.Component.prototype.options = {};
