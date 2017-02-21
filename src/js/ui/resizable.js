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

        const self = this;

        // Add component classes
        self.addClass('resizable');

        // Force the target to be the relative parent
        if (self.css('position') === 'static') {
            self.css('position', 'relative');
        }

        // Add Bottom handle
        self.bottomHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-s',
            css: {height: options.handleSize}
        }).appendTo(self);

        // Add Right handler
        self.rightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-e',
            css: {width: options.handleSize}
        }).appendTo(self);

        // Add Bottom-Right handler
        self.bottomRightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-se',
            css: {
                height: options.handleSize,
                width: options.handleSize
            }
        }).appendTo(self);

        // Group handles
        self.handles = new Cuic.Collection([
            self.rightHandle,
            self.bottomHandle,
            self.bottomRightHandle
        ]);

        // Group horizontal handles
        self.horizontalHandles = new Cuic.Collection([
            self.rightHandle,
            self.bottomRightHandle
        ]);

        // Group vertical handles
        self.verticalHandles = new Cuic.Collection([
            self.bottomHandle,
            self.bottomRightHandle
        ]);

        self.handles.each((handle) => {
            // Start resizing
            handle.on('mousedown', (ev) => {
                // Execute callback
                if (self.events.trigger('resizeStart', ev) === false) return;

                // Prevent text selection
                ev.preventDefault();

                // Add resizing class
                self.addClass('resizing');

                const parent = self.parent();
                const startX = ev.clientX;
                const startY = ev.clientY;
                const initialHeight = self.outerHeight();
                const initialWidth = self.outerWidth();
                const handleTarget = ev.currentTarget;

                // Calculate initial ratio
                const ratio = initialHeight / initialWidth;

                const onMouseMove = (ev) => {
                    // Execute callback
                    if (self.events.trigger('resize', ev) === false) return;

                    let prop = {};

                    // Resize horizontally
                    if (self.options.horizontal) {
                        for (let i = 0; i < self.horizontalHandles.length; i += 1) {
                            if (self.horizontalHandles.get(i).node() === handleTarget) {
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
                    if (self.options.vertical) {
                        for (let i = 0; i < self.verticalHandles.length; i += 1) {
                            if (self.verticalHandles.get(i).node() === handleTarget) {
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

                    // Get available space
                    const availableSpace = Cuic.calculateAvailableSpace(self, parent);

                    // Limit to max width
                    if (prop.width && prop.width > availableSpace.width) {
                        prop.width = availableSpace.width;
                    }
                    // Limit to max height
                    if (prop.height && prop.height > availableSpace.height) {
                        prop.height = availableSpace.height;
                    }

                    // fixme element can be resized more than parent size if keep ratio is active

                    // Keep ratio
                    if (self.options.keepRatio) {
                        if (prop.height) {
                            prop.width = prop.height / ratio;
                        }
                        else if (prop.width) {
                            prop.height = prop.width * ratio;
                        }
                    }

                    // Apply new size
                    self.css(prop);
                };

                // Resizing
                Cuic.on('mousemove', document, onMouseMove);

                // Stop resizing
                Cuic.once('mouseup', document, (ev) => {
                    Cuic.off('mousemove', document, onMouseMove);
                    self.removeClass('resizing');
                    self.events.trigger('resizeEnd', ev);
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
    className: 'resizable',
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
