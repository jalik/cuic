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

Cuic.Resizable = class extends Cuic.Component {

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
            css: {height: options.handlerSize}
        }).appendTo(self);

        // Add Right handler
        self.rightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-e',
            css: {width: options.handlerSize}
        }).appendTo(self);

        // Add Bottom-Right handler
        self.bottomRightHandle = new Cuic.Element('div', {
            className: 'resize-handle resize-handle-se',
            css: {
                height: options.handlerSize,
                width: options.handlerSize
            }
        }).appendTo(self);

        // Group handles
        self.handles = [
            self.rightHandle,
            self.bottomHandle,
            self.bottomRightHandle
        ];

        // Group horizontal handles
        self.horizontalHandles = [
            self.rightHandle,
            self.bottomRightHandle
        ];

        // Group vertical handles
        self.verticalHandles = [
            self.bottomHandle,
            self.bottomRightHandle
        ];

        /**
         * This method is called the element is resizing
         * @param ev
         */
        const startResize = (ev) => {
            // Execute callback
            if (self.onResizeStart && self.onResizeStart.call(self, ev) === false) {
                return;
            }

            // Prevent text selection
            ev.preventDefault();

            // Change element style
            self.addClass('resizing');

            const parent = self.parent();
            const parentOffset = parent.offset();
            let elmHeight = self.outerHeight();
            let elmWidth = self.outerWidth();
            let elmPadding = self.padding();

            // Calculate initial ratio
            let ratio = elmHeight / elmWidth;

            // Stop resizing
            Cuic.once('mouseup', document, (ev) => {
                clearInterval(timer);
                self.removeClass('resizing');
                self.onResizeStop.call(self, ev);
            });

            let timer = setInterval(() => {
                let prop = {};

                // Execute callback
                if (self.onResize && self.onResize.call(self) === false) {
                    return;
                }

                // Resize horizontally
                if (self.options.horizontal) {
                    for (let i = 0; i < self.horizontalHandles.length; i += 1) {
                        if (self.horizontalHandles[i].getElement() === ev.target) {
                            const diffX = Cuic.mouseX - ev.clientX;
                            const offset = self.offset();
                            const parentWidth = parent.innerWidth();
                            const maxWidth = parentWidth - (offset.left - parentOffset.left + elmPadding.horizontal);
                            let width = elmWidth + diffX;

                            // Limit to max width
                            if (width > maxWidth) {
                                width = maxWidth;
                            }
                            // Width is between min and max
                            if ((!Number(this.options.maxWidth) || width <= this.options.maxWidth)
                                && (!Number(this.options.minWidth) || width >= this.options.minWidth)) {
                                width = Math.round(width / self.options.stepX) * self.options.stepX;
                                prop.width = width;
                            }
                            break;
                        }
                    }
                }

                // Resize vertically
                if (self.options.vertical) {
                    for (let i = 0; i < self.verticalHandles.length; i += 1) {
                        if (self.verticalHandles[i].getElement() === ev.target) {
                            const diffY = Cuic.mouseY - ev.clientY;
                            const offset = self.offset();
                            const parentHeight = parent.innerHeight();
                            const maxHeight = parentHeight - (offset.top - parentOffset.top + elmPadding.vertical);
                            let height = elmHeight + diffY;

                            // Limit to max height
                            if (height > maxHeight) {
                                height = maxHeight;
                            }
                            // Height is between min and max
                            if ((!Number(this.options.maxHeight) || height <= this.options.maxHeight)
                                && (!Number(this.options.minHeight) || height >= this.options.minHeight)) {
                                height = Math.round(height / self.options.stepY) * self.options.stepY;
                                prop.height = height;
                            }
                            break;
                        }
                    }
                }

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

            }, Math.round(1000 / self.options.fps));
        };

        // Resize element on resize with handles
        self.bottomHandle.on('mousedown', startResize);
        self.rightHandle.on('mousedown', startResize);
        self.bottomRightHandle.on('mousedown', startResize);
    }

    onResize() {
    }

    onResizeStart() {
    }

    onResizeStop() {
    }
};

Cuic.Resizable.prototype.options = {
    className: 'resizable',
    fps: 30,
    handlerSize: 10,
    horizontal: true,
    keepRatio: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 1,
    minWidth: 1,
    namespace: 'resizable',
    stepX: 1,
    stepY: 1,
    vertical: true
};
