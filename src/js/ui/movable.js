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

        // Add component class
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
            if (self.onMoveStart(ev) === false) return;

            // Prevent text selection
            ev.preventDefault();

            // Add moving class
            self.addClass('moving');

            const parent = self.parent();
            const startOffset = self.position();
            const startX = ev.clientX;
            const startY = ev.clientY;

            const onMouseMove = (ev) => {
                const margin = self.margin();
                const height = self.outerHeight();
                const width = self.outerWidth();
                const parentPadding = parent.padding();
                const parentHeight = parent.innerHeight();
                const parentWidth = parent.innerWidth();
                let prop = {};

                // Calculate minimal values
                let minX = 0;
                let minY = 0;

                // Calculate maximal values
                let maxX = parentWidth - parentPadding.horizontal;
                let maxY = parentHeight - parentPadding.vertical;

                if (self.css('position') === 'relative') {
                    maxX -= margin.horizontal;
                    maxY -= margin.vertical;
                }

                const diffX = ev.clientX - startX;
                const diffY = ev.clientY - startY;
                let left = startOffset.left + diffX;
                let top = startOffset.top + diffY;

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
                if (self.onMove(ev, {x: left, y: top}) === false) {
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
            };

            // Moving
            Cuic.on('mousemove', document, onMouseMove);

            // Stop moving
            Cuic.once('mouseup', document, (ev) => {
                Cuic.off('mousemove', document, onMouseMove);
                self.removeClass('moving');
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
