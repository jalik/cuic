/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Karl STEIN
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
import { asElement, onWindowResized } from '../cuic';
import Collection from '../utils/collection';
import Closable from './closable';
import Element from './element';

export const Panels = new Collection();

class Panel extends Closable {
  constructor(options) {
    // Set default options
    const opt = extend({}, Panel.prototype.options, options, {
      mainClass: 'cc-panel',
    });

    // Create element
    super('div', { className: opt.className }, opt);

    if (opt.element) {
      this.header = this.find('.cc-panel-header').first();
      this.title = this.find('.cc-panel-title').first();
      this.content = this.find('.cc-panel-content').first();
      this.footer = this.find('.cc-panel-footer').first();
      this.closeButton = this.find('.cc-panel-header .btn-close').first();
    } else {
      // Add the header
      this.header = new Element('header', {
        className: 'cc-panel-header',
      }).prependTo(this);

      // Add the title
      this.title = new Element('h5', {
        className: 'cc-panel-title',
        html: opt.title,
      }).appendTo(this.header);

      // Add close button
      this.closeButton = new Element('span', {
        className: this.options.closeButtonClass,
        html: this.options.closeButton,
        role: 'button',
      }).addClass('btn-close').appendTo(this.header);

      // Add the body
      this.content = new Element('section', {
        className: 'cc-panel-content',
        html: opt.content,
      }).appendTo(this);

      // Add the footer
      this.footer = new Element('footer', {
        className: 'cc-panel-footer',
        html: opt.footer,
      }).appendTo(this);

      // Hide the header if not used
      if (!opt.title) {
        this.header.hide();
      }

      // Hide the footer if not used
      if (!opt.footer) {
        this.footer.hide();
      }
    }

    // Set default alignment
    if (this.options.position) {
      this.align(this.options.position);
    }

    // Resize content
    this.resizeContent();

    // To hide the panel in the container,
    // the container must have a hidden overflow
    if (this.hasParent()) {
      this.parent().css({ overflow: 'hidden' });
    }

    // todo avoid closing panel if button is from another component
    // Handle click events on the component
    this.on('click', (ev) => {
      // Close button
      if (asElement(ev.target).hasClass('btn-close')) {
        ev.preventDefault();
        this.close();
      }
      // Toggle button
      if (asElement(ev.target).hasClass('btn-toggle')) {
        ev.preventDefault();
        this.toggle();
      }
    });

    // this.onClose(() => {
    //   const height = this.outerHeight(true);
    //   const width = this.outerWidth(true);
    //   const prop = {
    //     bottom: '',
    //     left: '',
    //     right: '',
    //     top: '',
    //   };
    //
    //   // Horizontal position
    //   if (this.isAligned('right')) {
    //     prop.right = -width;
    //     prop.left = '';
    //   } else if (this.isAligned('left')) {
    //     prop.left = -width;
    //     prop.right = '';
    //   }
    //
    //   // Vertical position
    //   if (this.isAligned('bottom')) {
    //     prop.bottom = -height;
    //     prop.top = '';
    //   } else if (this.isAligned('top')) {
    //     prop.top = -height;
    //     prop.bottom = '';
    //   }
    //
    //   // Animate panel
    //   this.css(prop);
    // });

    // this.onMaximized(() => {
    //   // Realign if panel is closed
    //   if (this.isClosed()) {
    //     const prop = {};
    //
    //     // Horizontal position
    //     if (this.isAligned('left')) {
    //       prop.left = -this.outerWidth(true);
    //       prop.right = '';
    //     } else if (this.isAligned('right')) {
    //       prop.right = -this.outerWidth(true);
    //       prop.left = '';
    //     }
    //     // Vertical position
    //     if (this.isAligned('bottom')) {
    //       prop.bottom = -this.outerHeight(true);
    //       prop.top = '';
    //     } else if (this.isAligned('top')) {
    //       prop.top = -this.outerHeight(true);
    //       prop.bottom = '';
    //     }
    //     this.css(prop);
    //   }
    // });

    // this.onMinimize(() => {
    //   // Realign if panel is closed
    //   if (this.isClosed()) {
    //     const prop = {};
    //
    //     // Horizontal position
    //     if (this.isAligned('left')) {
    //       prop.left = -this.outerWidth(true);
    //       prop.right = '';
    //     } else if (this.isAligned('right')) {
    //       prop.right = -this.outerWidth(true);
    //       prop.left = '';
    //     }
    //     // Vertical position
    //     if (this.isAligned('bottom')) {
    //       prop.bottom = -this.outerHeight(true);
    //       prop.top = '';
    //     } else if (this.isAligned('top')) {
    //       prop.top = -this.outerHeight(true);
    //       prop.bottom = '';
    //     }
    //     this.css(prop);
    //   }
    // });

    this.onOpen(() => {
      this.align(this.options.position);
      this.resizeContent();
    });

    onWindowResized(() => {
      if (this.isInDOM()) {
        // panel._disableTransitions();
        this.resizeContent();
        this.align(this.options.position);
        // panel._enableTransitions();
      }
    });

    // Remove element from list
    this.onRemoved(() => {
      Panels.remove(this);
    });

    // Add element to collection
    Panels.add(this);
  }

  /**
   * Returns the content
   * @deprecated
   * @return {Element}
   */
  getBody() {
    return this.content;
  }

  /**
   * Returns the content
   * @return {Element}
   */
  getContent() {
    return this.content;
  }

  /**
   * Returns the footer
   * @return {Element}
   */
  getFooter() {
    return this.footer;
  }

  /**
   * Returns the header
   * @return {Element}
   */
  getHeader() {
    return this.header;
  }

  /**
   * Resizes the content
   * @return {Panel}
   */
  resizeContent() {
    // Calculate available space
    const available = this.calculateAvailableSpace();

    // Set panel max dimensions
    this.css({
      'max-height': available.height,
      'max-width': available.width,
    });

    // Calculate content max height
    let maxHeight = available.height;

    // Subtract header height
    if (this.header instanceof Element) {
      maxHeight -= this.header.outerHeight(true);
    }
    // Subtract footer height
    if (this.footer instanceof Element) {
      maxHeight -= this.footer.outerHeight(true);
    }
    // Subtract content margin
    maxHeight -= this.content.margin().vertical;

    // Set content max height
    this.content.css({ 'max-height': maxHeight });
    return this;
  }

  /**
   * Sets the content
   * @param html
   * @return {Panel}
   */
  setContent(html) {
    this.content.html(html);
    return this;
  }

  /**
   * Sets the footer
   * @param html
   * @return {Panel}
   */
  setFooter(html) {
    this.footer.html(html);
    return this;
  }

  /**
   * Sets the header
   * @param html
   * @return {Panel}
   */
  setHeader(html) {
    this.header.html(html);
    return this;
  }

  /**
   * Sets panel title
   * @param html
   * @return {Panel}
   */
  setTitle(html) {
    this.title.html(html);
    this.header.show();
    return this;
  }
}

Panel.prototype.options = {
  animationClass: 'cc-anim-fade cc-anim-slide',
  closable: true,
  closeButton: null,
  closeButtonClass: 'glyphicon glyphicon-remove-sign',
  closed: true,
  content: null,
  footer: null,
  maximized: false,
  namespace: 'panel',
  parent: null,
  position: 'left top',
  title: null,
  zIndex: 1,
};

export default Panel;
