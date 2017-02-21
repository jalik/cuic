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

Cuic.Movable = class extends Cuic.Element {

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

        // Group handles
        self.handles = new Cuic.Collection();

        // Set the moving area
        self.addMoveHandle(options.handle || self.getElement());
    }

    /**
     * Sets the moving area
     * @param handle
     * @return {Cuic.Component}
     */
    addMoveHandle(handle) {
        const self = this;

        self.handles.add(handle);

        // Add the handle class
        Cuic.addClass(handle, 'movable-handle');

        // Start moving
        Cuic.on('mousedown', handle, (ev) => {
            // Ignore moving if the target is not the root
            if (self.options.rootOnly && ev.target !== ev.currentTarget) return;

            // Execute callback
            if (self.events.trigger('moveStart', ev) === false) return;

            // Prevent text selection
            ev.preventDefault();

            // Add moving class
            self.addClass('moving');

            const parent = self.parent();
            const startPosition = self.position();
            const startX = ev.clientX;
            const startY = ev.clientY;

            const onMouseMove = (ev) => {
                // Execute callback
                if (self.events.trigger('move', ev) === false)  return;

                const height = self.outerHeight(true);
                const width = self.outerWidth(true);
                let prop = {};

                // Calculate minimal values
                const minX = 0;
                const minY = 0;

                // Calculate maximal values
                let maxX = parent.width();
                let maxY = parent.height();

                // Adjust limits
                switch (self.css('position')) {
                    case 'absolute':
                        const padding = parent.padding();
                        maxX += padding.horizontal;
                        maxY += padding.vertical;
                        break;
                }

                const diffX = ev.clientX - startX;
                const diffY = ev.clientY - startY;
                let left = startPosition.left + diffX;
                let top = startPosition.top + diffY;

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
                self.events.trigger('moveEnd', ev);
            });
        });
        return self;
    }

    /**
     * Called when moving
     * @param callback
     * @return {Cuic.Movable}
     */
    onMove(callback) {
        this.events.on('move', callback);
        return this;
    }

    /**
     * Called when move end
     * @param callback
     * @return {Cuic.Movable}
     */
    onMoveEnd(callback) {
        this.events.on('moveEnd', callback);
        return this;
    }

    /**
     * Called when move start
     * @param callback
     * @return {Cuic.Movable}
     */
    onMoveStart(callback) {
        this.events.on('moveStart', callback);
        return this;
    }
};

Cuic.Movable.prototype.options = {
    className: 'movable',
    handle: null,
    handleClassName: 'movable-handle',
    horizontal: true,
    namespace: 'movable',
    rootOnly: true,
    vertical: true
};
