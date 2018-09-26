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

import { extend } from '@jalik/extend';
import Cuic from '../cuic';
import Collection from '../utils/collection';
import Component from './component';
import Element from './element';

class Resizable extends Component {
  constructor(options) {
    // Set default options
    const opt = extend({}, Resizable.prototype.options, options);

    // Create element
    super('div', { className: opt.className }, opt);

    // Add component classes
    this.addClass('cc-resizable');

    // Force the target to be the relative parent
    if (this.isStatic()) {
      this.css('position', 'relative');
    }

    // Add Bottom handle
    this.bottomHandle = new Element('div', {
      className: 'cc-resize-handle cc-resize-handle-s',
      css: { height: opt.handleSize },
    }).appendTo(this);

    // Add Right handler
    this.rightHandle = new Element('div', {
      className: 'cc-resize-handle cc-resize-handle-e',
      css: { width: opt.handleSize },
    }).appendTo(this);

    // Add Bottom-Right handler
    this.bottomRightHandle = new Element('div', {
      className: 'cc-resize-handle cc-resize-handle-se',
      css: {
        height: opt.handleSize,
        width: opt.handleSize,
      },
    }).appendTo(this);

    // Group handles
    this.handles = new Collection([
      this.rightHandle,
      this.bottomHandle,
      this.bottomRightHandle,
    ]);

    // Group horizontal handles
    this.horizontalHandles = new Collection([
      this.rightHandle,
      this.bottomRightHandle,
    ]);

    // Group vertical handles
    this.verticalHandles = new Collection([
      this.bottomHandle,
      this.bottomRightHandle,
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

        const onMouseMove = (mouseMoveEvent) => {
          // Execute callback
          if (this.events.trigger('resize', mouseMoveEvent) === false) return;

          const prop = {};

          // Resize horizontally
          if (this.options.horizontally) {
            for (let i = 0; i < this.horizontalHandles.length; i += 1) {
              if (this.horizontalHandles.get(i).node() === handleTarget) {
                const diffX = mouseMoveEvent.clientX - startX;
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
          if (this.options.vertically) {
            for (let i = 0; i < this.verticalHandles.length; i += 1) {
              if (this.verticalHandles.get(i).node() === handleTarget) {
                const diffY = mouseMoveEvent.clientY - startY;
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
            } else if (prop.width) {
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
        Cuic.once('mouseup', document, (mouseUpEvent) => {
          Cuic.off('mousemove', document, onMouseMove);
          this.removeClass('resizing');
          this.events.trigger('resizeEnd', mouseUpEvent);
        });
      });
    });
  }

  /**
   * Called when resizing
   * @param callback
   * @return {Resizable}
   */
  onResize(callback) {
    this.events.on('resize', callback);
    return this;
  }

  /**
   * Called when resize end
   * @param callback
   * @return {Resizable}
   */
  onResizeEnd(callback) {
    this.events.on('resizeEnd', callback);
    return this;
  }

  /**
   * Called when resize start
   * @param callback
   * @return {Resizable}
   */
  onResizeStart(callback) {
    this.events.on('resizeStart', callback);
    return this;
  }
}

Resizable.prototype.options = {
  handleSize: 10,
  horizontally: true,
  keepRatio: false,
  maxHeight: null,
  maxWidth: null,
  minHeight: 1,
  minWidth: 1,
  namespace: 'resizable',
  vertically: true,
};

export default Resizable;
