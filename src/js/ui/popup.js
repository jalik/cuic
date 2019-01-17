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
import Shortcut from '../utils/shortcut';
import Button from './button';
import Closable from './closable';
import Element from './element';
import Group from './group';

export const Popups = new Collection();

class Popup extends Closable {
  constructor(options) {
    // Set default options
    const opt = extend({}, Popup.prototype.options, options, {
      mainClass: 'cc-popup',
    });

    // Create element
    super('div', { className: opt.className }, opt);

    // Add tail
    this.tail = new Element('span', {
      className: 'cc-popup-tail',
    }).appendTo(this);

    // Add header
    this.header = new Element('header', {
      className: 'cc-popup-header',
      css: { display: this.options.title ? 'block' : 'none' },
    }).appendTo(this);

    // Add title
    this.title = new Element('h5', {
      className: 'cc-popup-title',
      html: this.options.title,
    }).appendTo(this.header);

    // Add content
    this.content = new Element('div', {
      className: 'cc-popup-content',
      html: opt.content,
    }).appendTo(this);

    // Add footer
    const isButtonsDefined = this.options.buttons instanceof Array
      && this.options.buttons.length > 0;

    this.footer = new Element('footer', {
      className: 'cc-popup-footer',
      css: { display: isButtonsDefined ? 'block' : 'none' },
    }).appendTo(this);

    // Add buttons group
    this.buttons = new Group('div', {
      className: 'btn-group cc-guide-buttons',
    }).appendTo(this.footer);

    // Show footer if not empty
    this.buttons.onComponentAdded(() => {
      if (this.buttons.components.length > 0) {
        this.footer.show();
      }
    });

    // Hide footer if empty
    this.buttons.onComponentRemoved(() => {
      if (this.buttons.components.length < 1) {
        this.footer.hide();
      }
    });

    // Add buttons
    if (this.options.buttons instanceof Array) {
      for (let i = 0; i < this.options.buttons.length; i += 1) {
        this.addButton(this.options.buttons[i]);
      }
    }

    // Hide footer if no buttons
    if (!(this.options.buttons instanceof Array) || this.options.buttons.length < 1) {
      this.footer.hide();
    }

    /**
     * Popup shortcuts
     * @type {{close: *}}
     */
    this.shortcuts = {
      close: new Shortcut({
        element: this,
        keyCode: Cuic.keys.ESC,
        callback: () => {
          this.close();
        },
      }),
    };

    this.on('click', (ev) => {
      // Close button
      if (Cuic.element(ev.target).hasClass('btn-close')) {
        ev.preventDefault();
        this.close();
      }
    });

    // Reposition tail when popup position change
    this.onAnchored(() => {
      this.updateTail();
    });

    this.onOpen(() => {
      const target = Cuic.element(this.options.target);
      // Get anchor from data attribute
      const anchor = target.data('anchor') || this.options.anchor;
      const anchorPoint = target.data('anchor-point') || this.options.anchorPoint;
      this.anchor(anchor, anchorPoint, target);
    });

    Cuic.onWindowResized(() => {
      if (this.isInDOM() && this.isShown()) {
        // popup._disableTransitions();
        this.anchor(opt.anchor, opt.anchorPoint, opt.target);
        // popup._enableTransitions();
      }
    });

    // Remove element from list
    this.onRemoved(() => {
      Popups.remove(this);
    });

    // Add element to collection
    Popups.add(this);
  }

  /**
   * Adds a button to the footer
   * @param props
   * @return {Button}
   */
  addButton(props) {
    let button = props;

    if (!(props instanceof Button)) {
      const { callback } = props;

      // Create button
      button = new Button(extend({
        className: `btn btn-default btn-secondary ${props.className}`,
        label: props.label,
      }, props));

      // Set button callback
      if (typeof callback === 'function') {
        button.on('click', (ev) => {
          callback.call(this, ev);
        });
      }
    }

    // Add button in footer
    this.buttons.addComponent(button);

    return button;
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
   * Sets the content
   * @param html
   * @return {Popup}
   */
  setContent(html) {
    this.content.html(html);
    return this;
  }

  /**
   * Sets the footer
   * @param html
   * @return {Popup}
   */
  setFooter(html) {
    this.footer.html(html);
    return this;
  }

  /**
   * Sets the header
   * @param html
   * @return {Popup}
   */
  setHeader(html) {
    this.header.html(html);
    return this;
  }

  /**
   * Sets dialog title
   * @param html
   * @return {Popup}
   */
  setTitle(html) {
    this.title.html(html);

    if (html !== null) {
      this.header.show();
    }
    return this;
  }

  /**
   * Position the tail
   * @return {Popup}
   */
  updateTail() {
    const prop = {
      bottom: '',
      left: '',
      right: '',
      top: '',
    };

    // todo copy popup background color
    // prop["border-color"] = this.css("background-color");

    // Remove previous classes
    this.tail.removeClass('cc-popup-tail-bottom cc-popup-tail-left cc-popup-tail-right cc-popup-tail-top');

    // Top tail
    if (this.isAnchored('bottom')) {
      this.tail.addClass('cc-popup-tail-top');
    }
    // Bottom tail
    if (this.isAnchored('top')) {
      this.tail.addClass('cc-popup-tail-bottom');
    }
    // Right tail
    if (this.isAnchored('left')) {
      this.tail.addClass('cc-popup-tail-right');
    }
    // Left tail
    if (this.isAnchored('right')) {
      this.tail.addClass('cc-popup-tail-left');
    }

    // Apply CSS
    this.tail.css(prop);

    return this;
  }
}

Popup.prototype.options = {
  anchor: 'top',
  animationClass: 'cc-anim-zoom',
  autoClose: false,
  autoCloseDelay: 0,
  autoRemove: false,
  buttons: [],
  closable: true,
  closed: true,
  closeOnBlur: true,
  closeOnFocus: false,
  closeOnMouseLeave: false,
  content: null,
  namespace: 'popup',
  target: null,
  title: null,
  zIndex: 9,
};

export default Popup;
