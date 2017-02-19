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

Cuic.Movable = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Movable.prototype.options, options);

        // Create element
        super('div', {className: options.className}, options);

        const self = this;

        // Add component classes
        self.addClass('movable');

        // Force the target to be the relative parent
        if (self.css('position') === 'static') {
            self.css({position: 'relative'});
        }

        // Set the dragging area
        this.setDragHandle(options.handle || self.getElement());
    }

    /**
     * Called when dragging
     */
    onMove() {
    }

    /**
     * Called when drag start
     */
    onMoveStart() {
    }

    /**
     * Called when drag stop
     */
    onMoveStop() {
    }

    /**
     * Sets the dragging area
     * @param handle
     * @return {Cuic.Component}
     */
    setDragHandle(handle) {
        const self = this;

        // Add the movable classes
        Cuic.addClass(handle, 'movable-handle');

        // Start dragging
        Cuic.on('mousedown', handle, (ev) => {
            // Ignore dragging if the target is not the root
            if (self.options.rootOnly && ev.target !== ev.currentTarget) return;

            // Execute callback
            if (self.onMoveStart(ev) === false) {
                return;
            }

            // Prevent text selection
            ev.preventDefault();

            // Change element style
            self.addClass('dragging');

            const parent = self.getParentElement();

            let margin = Cuic.margin(self);
            let height = Cuic.outerHeight(self);
            let width = Cuic.outerWidth(self);
            let startOffset = Cuic.position(self);
            let startX = Cuic.mouseX;
            let startY = Cuic.mouseY;

            let timer = setInterval(() => {
                const parentPadding = Cuic.padding(parent);
                const parentHeight = Cuic.innerHeight(parent);
                const parentWidth = Cuic.innerWidth(parent);
                const spaceLeft = Math.max(parentPadding.left);
                const spaceTop = Math.max(parentPadding.top);
                let prop = {};

                // Calculate minimal values
                let minX = spaceLeft;
                let minY = spaceTop;

                // Calculate maximal values
                let maxX = parentWidth - parentPadding.horizontal - margin.right;
                let maxY = parentHeight - parentPadding.vertical - margin.bottom;

                const stepX = self.options.stepX;
                const stepY = self.options.stepY;
                const diffX = Cuic.mouseX - startX;
                const diffY = Cuic.mouseY - startY;
                let left = startOffset.left + Math.round(diffX / stepX) * stepX;
                let top = startOffset.top + Math.round(diffY / stepY) * stepY;

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
                if (self.onMove({x: left, y: top}) === false) {
                    return;
                }

                // Move horizontally
                if (self.options.horizontal) {
                    prop.left = left;
                    prop.right = '';
                }
                // Move vertically
                if (self.options.vertical) {
                    prop.top = top;
                    prop.bottom = '';
                }
                // Move element
                self.css(prop);

            }, Math.round(1000 / self.options.fps));

            // Stop dragging
            Cuic.once('mouseup', document.body, (ev) => {
                clearInterval(timer);
                self.removeClass('dragging');
                self.onMoveStop(ev);
            });
        });
        return self;
    }
};

Cuic.Movable.prototype.options = {
    className: 'movable',
    fps: 60,
    handle: null,
    handleClassName: 'movable-handle',
    horizontal: true,
    rootOnly: true,
    stepX: 1,
    stepY: 1,
    vertical: true
};
