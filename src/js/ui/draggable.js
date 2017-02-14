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

Cuic.Draggable = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = $.extend({}, Cuic.Draggable.prototype.options, options);

        // Create element
        super('div', {
            className: options.className
        }, options);

        const self = this;

        /**
         * Set the dragging area
         * @param handle
         * @return {*}
         */
        self.setHandle = (handle) => {
            // Add the draggable classes
            Cuic.addClass(handle, self.options.className);

            // Change cursor icon over dragging area
            Cuic.css(handle, {cursor: 'move'});

            // Start dragging
            Cuic.on('mousedown', handle, (ev) => {
                // Ignore dragging if the target is not the root
                if (self.options.rootOnly && ev.target !== ev.currentTarget) return;

                // Execute callback
                if (self.onDragStart(ev) === false) {
                    return;
                }

                // Prevent text selection
                ev.preventDefault();

                // Change element style
                self.addClass('dragging');

                const parent = self.getParentElement();
                let isInBody = parent === document.body;

                let margin = Cuic.margin(self);
                let height = Cuic.outerHeight(self);
                let width = Cuic.outerWidth(self);
                let startOffset = Cuic.position(self);
                let startX = Cuic.mouseX;
                let startY = Cuic.mouseY;
                let scrollX = window.scrollX;
                let scrollY = window.scrollY;
                let timer = setInterval(() => {
                    let prop = {};
                    const parentPadding = Cuic.padding(parent);
                    const parentOffset = Cuic.position(parent) || {left: 0, top: 0};
                    const parentHeight = Cuic.innerHeight(parent);
                    const parentWidth = Cuic.innerWidth(parent);

                    const spaceBottom = Math.max(parentPadding.bottom);
                    const spaceLeft = Math.max(parentPadding.left);
                    const spaceRight = Math.max(parentPadding.right);
                    const spaceTop = Math.max(parentPadding.top);

                    // Calculate minimal values
                    let minX = (isInBody ? scrollX : 0) + spaceLeft;
                    let minY = (isInBody ? scrollY : 0) + spaceTop;
                    minX = 0;
                    minY = 0;

                    // Calculate maximal values
                    let maxX = parentWidth - parentPadding.horizontal;
                    let maxY = parentHeight - parentPadding.vertical;

                    const stepX = self.options.stepX;
                    const stepY = self.options.stepY;
                    const mouseLeft = Cuic.mouseX - startX;
                    const mouseTop = Cuic.mouseY - startY;
                    let left = startOffset.left + Math.round(mouseLeft / stepX) * stepX;
                    let top = startOffset.top + Math.round(mouseTop / stepY) * stepY;

                    // Check horizontal location
                    if (left < minX) {
                        left = minX;
                    }
                    else if (left + width > maxX) {
                        left = maxX - width;
                    }

                    // Check vertical location
                    if (top < minY) {
                        top = minY;
                    }
                    else if (top + height > maxY) {
                        top = maxY - height;
                    }

                    // Execute callback
                    if (self.onDrag(left, top) === false) {
                        return;
                    }

                    // Move horizontally
                    if (self.options.horizontal) {
                        prop.left = left + 'px';
                        prop.right = '';
                    }
                    // Move vertically
                    if (self.options.vertical) {
                        prop.top = top + 'px';
                        prop.bottom = '';
                    }
                    // Move element
                    self.css(prop);

                }, Math.round(1000 / self.options.fps));

                // Stop dragging
                Cuic.once('mouseup', document.body, (ev) => {
                    clearInterval(timer);
                    self.removeClass('dragging');
                    self.onDragStop();
                });
            });
            return self;
        };

        // Force the target to be the relative parent
        if (self.css('position') === 'static') {
            self.css({position: 'relative'});
        }

        // Set the dragging area
        self.setHandle(options.area || self.getElement());

        // $(document).ready(function () {
        //     $(document.head).append($('<style>', {
        //         text: '.' + self.options.className + ' > * { cursor: auto }'
        //     }));
        // });
    }

    /**
     * Called when dragging
     */
    onDrag() {
    }

    /**
     * Called when drag start
     */
    onDragStart() {
    }

    /**
     * Called when drag stop
     */
    onDragStop() {
    }

};

/**
 * Draggable default options
 */
Cuic.Draggable.prototype.options = {
    className: 'draggable',
    fps: 60,
    handle: null,
    horizontal: true,
    rootOnly: true,
    stepX: 1,
    stepY: 1,
    vertical: true
};
