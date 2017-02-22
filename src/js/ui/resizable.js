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

Cuic.Resizable = class extends Cuic.Element {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Resizable.prototype.options, options);

        // Create element
        super('div', {className: options.className}, options);

        // Add component classes
        this.addClass('resizable');

        // Force the target to be the relative parent
        if (this.css('position') === 'static') {
            this.css('position', 'relative');
        }

        // Add Bottom handle
        this.bottomHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-s',
            css: {height: options.handleSize}
        }).appendTo(this);

        // Add Right handler
        this.rightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-e',
            css: {width: options.handleSize}
        }).appendTo(this);

        // Add Bottom-Right handler
        this.bottomRightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-se',
            css: {
                height: options.handleSize,
                width: options.handleSize
            }
        }).appendTo(this);

        // Group handles
        this.handles = new Cuic.Collection([
            this.rightHandle,
            this.bottomHandle,
            this.bottomRightHandle
        ]);

        // Group horizontal handles
        this.horizontalHandles = new Cuic.Collection([
            this.rightHandle,
            this.bottomRightHandle
        ]);

        // Group vertical handles
        this.verticalHandles = new Cuic.Collection([
            this.bottomHandle,
            this.bottomRightHandle
        ]);

        this.handles.each((handle) => {
            // Start resizing
            handle.on('mousedown', (ev) => {
                // Execute callback
                if (this.events.trigger('resizeStart', ev) === false) return;

                // Prevent text selection
                ev.preventDefault();

                // Add resizing class
                this.addClass('resizing');

                const startX = ev.clientX;
                const startY = ev.clientY;
                const initialHeight = this.outerHeight();
                const initialWidth = this.outerWidth();
                const handleTarget = ev.currentTarget;

                // Calculate initial ratio
                const ratio = initialHeight / initialWidth;

                const onMouseMove = (ev) => {
                    // Execute callback
                    if (this.events.trigger('resize', ev) === false) return;

                    let prop = {};

                    // Resize horizontally
                    if (this.options.horizontal) {
                        for (let i = 0; i < this.horizontalHandles.length; i += 1) {
                            if (this.horizontalHandles.get(i).node() === handleTarget) {
                                const diffX = ev.clientX - startX;
                                const width = initialWidth + diffX;

                                // Width is between min and max
                                if ((!Number(this.options.maxWidth) || width <= this.options.maxWidth)
                                    && (!Number(this.options.minWidth) || width >= this.options.minWidth)) {
                                    prop.width = width;
                                }
                                break;
                            }
                        }
                    }

                    // Resize vertically
                    if (this.options.vertical) {
                        for (let i = 0; i < this.verticalHandles.length; i += 1) {
                            if (this.verticalHandles.get(i).node() === handleTarget) {
                                const diffY = ev.clientY - startY;
                                const height = initialHeight + diffY;

                                // Height is between min and max
                                if ((!Number(this.options.maxHeight) || height <= this.options.maxHeight)
                                    && (!Number(this.options.minHeight) || height >= this.options.minHeight)) {
                                    prop.height = height;
                                }
                                break;
                            }
                        }
                    }

                    // fixme element can be resized more than parent size if keep ratio is active

                    // Keep ratio
                    if (this.options.keepRatio) {
                        if (prop.height) {
                            prop.width = prop.height / ratio;
                        }
                        else if (prop.width) {
                            prop.height = prop.width * ratio;
                        }
                    }

                    // Apply new size
                    this.css(prop);
                    this.autoResize();
                };

                // Resizing
                Cuic.on('mousemove', document, onMouseMove);

                // Stop resizing
                Cuic.once('mouseup', document, (ev) => {
                    Cuic.off('mousemove', document, onMouseMove);
                    this.removeClass('resizing');
                    this.events.trigger('resizeEnd', ev);
                });
            });
        });
    }

    /**
     * Called when resizing
     * @param callback
     * @return {Cuic.Resizable}
     */
    onResize(callback) {
        this.events.on('resize', callback);
        return this;
    }

    /**
     * Called when resize end
     * @param callback
     * @return {Cuic.Resizable}
     */
    onResizeEnd(callback) {
        this.events.on('resizeEnd', callback);
        return this;
    }

    /**
     * Called when resize start
     * @param callback
     * @return {Cuic.Resizable}
     */
    onResizeStart(callback) {
        this.events.on('resizeStart', callback);
        return this;
    }
};

Cuic.Resizable.prototype.options = {
    handleSize: 10,
    horizontal: true,
    keepRatio: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 1,
    minWidth: 1,
    namespace: 'resizable',
    vertical: true
};
