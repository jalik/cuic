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

import extend from '@jalik/extend';
import Cuic from '../cuic';
import Collection from '../utils/collection';
import Closable from './closable';
import Element from './element';

export const Tooltips = new Collection();

class Tooltip extends Closable {
  constructor(options) {
    // Set default options
    const opt = extend({}, Tooltip.prototype.options, options, {
      mainClass: 'cc-tooltip',
    });

    // Create element
    super('div', { className: opt.className }, opt);

    // Public attributes
    this.currentTarget = null;

    // Add content
    this.content = new Element('div', {
      className: 'cc-tooltip-content',
    }).appendTo(this);

    // Add tail
    this.tail = new Element('span', {
      className: 'cc-tooltip-tail',
    }).appendTo(this);

    Cuic.element(document).on('mouseover', (ev) => {
      const targets = Cuic.find(this.options.selector);

      for (let i = 0; i < targets.length; i += 1) {
        const target = targets[i];

        // Mouse is over a target
        if (ev.target === target.node()) {
          // Get stored tooltip content
          let content = target.data('tooltip');

          if (!content || !content.length) {
            // Get tooltip content from attribute
            content = target.attr(this.options.attribute);
            // Avoid conflict with native tooltip
            target.attr(this.options.attribute, '');
            // Store tooltip content
            target.data('tooltip', content);
          }

          // Update tooltip content
          if (content && content.length) {
            this.content.html(content);
          }

          this.currentTarget = ev.target;

          // Position tooltip
          if (!this.options.followPointer) {
            if (this.parentNode() !== ev.target.parentNode) {
              this.appendTo(ev.target.parentNode);
            }
          }

          // Display tooltip
          this.open();

          target.once('mouseleave', () => {
            // Close tooltip when mouse leaves area
            this.closeAfterDelay(100);
          });

          // Stop looping now because
          // we found the current target.
          break;
        } else if (ev.target === this.node() && this.options.followPointer) {
          this.reAnchor([ev.pageX, ev.pageY]);
        }
      }
    });

    // Move tooltip when mouse moves and tooltip is opened
    Cuic.element(document).on('mousemove', (ev) => {
      if (this.options.followPointer /* && !this.isHidden() && !this.isClosed() */) {
        this.reAnchor([ev.pageX, ev.pageY]);
      }
    });

    // Reposition tail when tooltip position change
    this.onAnchored(() => {
      this.updateTail();
    });

    this.onOpen(() => {
      if (!this.options.followPointer) {
        this.reAnchor();
      }
    });

    // Remove element from list
    this.onRemoved(() => {
      Tooltips.remove(this);
    });

    // Add element to collection
    Tooltips.add(this);
  }

  /**
   * Returns the content
   * @return {Element}
   */
  getContent() {
    return this.content;
  }

  /**
   * Re-Anchor element using the current options.
   * @param target
   */
  reAnchor(target) {
    const currentTarget = Cuic.element(this.currentTarget);
    // Get anchor from data attribute
    const anchor = currentTarget.data('anchor') || this.options.anchor;
    const anchorPoint = currentTarget.data('anchor-point') || this.options.anchorPoint;
    this.anchor(anchor, anchorPoint, (target || currentTarget));
  }

  /**
   * Sets tooltip content
   * @param html
   * @return {Tooltip}
   */
  setContent(html) {
    this.content.html(html);
    return this;
  }

  /**
   * Position the tail
   * @return {Tooltip}
   */
  updateTail() {
    const prop = {
      bottom: '',
      left: '',
      right: '',
      top: '',
    };

    // todo copy tooltip background color
    // prop["border-color"] = this.css("background-color");

    // Remove previous classes
    this.tail.removeClass('cc-tooltip-tail-bottom cc-tooltip-tail-left cc-tooltip-tail-right cc-tooltip-tail-top');

    // Top tail
    if (this.isAnchored('bottom')) {
      this.tail.addClass('cc-tooltip-tail-top');
    }
    // Bottom tail
    if (this.isAnchored('top')) {
      this.tail.addClass('cc-tooltip-tail-bottom');
    }
    // Right tail
    if (this.isAnchored('left')) {
      this.tail.addClass('cc-tooltip-tail-right');
    }
    // Left tail
    if (this.isAnchored('right')) {
      this.tail.addClass('cc-tooltip-tail-left');
    }

    // Apply CSS
    this.tail.css(prop);

    return this;
  }
}

Tooltip.prototype.options = {
  anchor: 'right',
  animationClass: 'cc-anim-zoom',
  attribute: 'title',
  autoClose: false,
  autoCloseDelay: 0,
  autoRemove: false,
  closable: true,
  closed: true,
  closeOnBlur: false,
  closeOnFocus: false,
  closeOnMouseLeave: false,
  followPointer: true,
  namespace: 'tooltip',
  selector: '[title]',
  zIndex: 100,
};

export default Tooltip;
