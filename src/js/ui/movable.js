/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Karl STEIN
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Cuic from '../cuic';
import Collection from '../utils/collection';
import Component from './component';

class Movable extends Component {
  constructor(options) {
    // Set default options
    const opt = Cuic.extend({}, Movable.prototype.options, options);

    // Create element
    super('div', { className: opt.className }, opt);

    // Add component class
    this.addClass('cc-movable');

    // Force the target to be the relative parent
    if (this.isStatic()) {
      this.css({ position: 'relative' });
    }

    // Group handles
    this.handles = new Collection();

    // Set the moving area
    this.addMoveHandle(opt.handle || this.node());
  }

  /**
   * Sets the moving area
   * @param handleTarget
   * @return {Movable}
   */
  addMoveHandle(handleTarget) {
    const handle = Cuic.element(handleTarget);

    this.handles.add(handle);

    // Add the handle class
    handle.addClass('cc-movable-handle');

    // Start moving
    handle.on('mousedown', (ev) => {
      // Ignore moving if the target is not the root
      if (this.options.rootOnly && ev.target !== ev.currentTarget) return;

      // Execute callback
      if (this.events.trigger('moveStart', ev) === false) return;

      // Prevent text selection
      ev.preventDefault();

      // Add moving class
      this.addClass('moving');

      // Removes alignment classes
      // this.removeClass("aligned-left aligned-right aligned-top aligned-bottom");

      const startPosition = this.position();
      const startX = ev.clientX;
      const startY = ev.clientY;

      const onMouseMove = (mouseMoveEvent) => {
        // Execute callback
        if (this.events.trigger('move', mouseMoveEvent) === false) return;

        let prop = { bottom: 'auto' };

        // Move horizontally
        if (this.options.horizontally) {
          const diffX = mouseMoveEvent.clientX - startX;
          prop.left = startPosition.left + diffX;
          prop.right = 'auto';
        }

        // Move vertically
        if (this.options.vertically) {
          const diffY = mouseMoveEvent.clientY - startY;
          prop.top = startPosition.top + diffY;
          prop.bottom = 'auto';
        }

        // Limit position to parent available position
        if (this.options.constraintToParent) {
          const available = this.calculateAvailablePosition();
          prop = Cuic.constraintPosition(prop, available);
          this.alignInParent(); // todo useful ?
        }

        // Move element
        this.css(prop);
      };

      // Moving
      Cuic.on('mousemove', document, onMouseMove);

      // Stop moving
      Cuic.once('mouseup', document, (mouseUpEvent) => {
        Cuic.off('mousemove', document, onMouseMove);
        this.removeClass('moving');
        this.events.trigger('moveEnd', mouseUpEvent);
      });
    });
    return this;
  }

  /**
   * Called when moving
   * @param callback
   * @return {Movable}
   */
  onMove(callback) {
    this.events.on('move', callback);
    return this;
  }

  /**
   * Called when move end
   * @param callback
   * @return {Movable}
   */
  onMoveEnd(callback) {
    this.events.on('moveEnd', callback);
    return this;
  }

  /**
   * Called when move start
   * @param callback
   * @return {Movable}
   */
  onMoveStart(callback) {
    this.events.on('moveStart', callback);
    return this;
  }
}

Movable.prototype.options = {
  constraintToParent: true,
  handle: null,
  handleClassName: 'cc-movable-handle',
  horizontally: true,
  namespace: 'movable',
  rootOnly: true,
  vertically: true,
};

export default Movable;
