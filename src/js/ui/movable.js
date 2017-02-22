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

        // Add component class
        this.addClass('movable');

        // Force the target to be the relative parent
        if (this.css('position') === 'static') {
            this.css({position: 'relative'});
        }

        // Group handles
        this.handles = new Cuic.Collection();

        // Set the moving area
        this.addMoveHandle(options.handle || this.node());
    }

    /**
     * Sets the moving area
     * @param handle
     * @return {Cuic.Component}
     */
    addMoveHandle(handle) {
        handle = Cuic.element(handle);

        this.handles.add(handle);

        // Add the handle class
        handle.addClass('movable-handle');

        // Start moving
        Cuic.on('mousedown', handle, (ev) => {
            // Ignore moving if the target is not the root
            if (this.options.rootOnly && ev.target !== ev.currentTarget) return;

            // Execute callback
            if (this.events.trigger('moveStart', ev) === false) return;

            // Prevent text selection
            ev.preventDefault();

            // Add moving class
            this.addClass('moving');

            const startPosition = this.position();
            const startX = ev.clientX;
            const startY = ev.clientY;

            const onMouseMove = (ev) => {
                // Execute callback
                if (this.events.trigger('move', ev) === false)  return;

                let prop = {};

                // Move horizontally
                if (this.options.horizontal) {
                    const diffX = ev.clientX - startX;
                    prop.left = startPosition.left + diffX;
                    prop.right = '';
                }

                // Move vertically
                if (this.options.vertical) {
                    const diffY = ev.clientY - startY;
                    prop.top = startPosition.top + diffY;
                    prop.bottom = '';
                }

                // Move element
                this.css(prop);
                this.autoAlign();
            };

            // Moving
            Cuic.on('mousemove', document, onMouseMove);

            // Stop moving
            Cuic.once('mouseup', document, (ev) => {
                Cuic.off('mousemove', document, onMouseMove);
                this.removeClass('moving');
                this.events.trigger('moveEnd', ev);
            });
        });
        return this;
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
