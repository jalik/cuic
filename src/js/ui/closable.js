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
import Component from './component';

class Closable extends Component {
  constructor(node, attributes, options) {
    // Set default options
    const opt = extend({}, Closable.prototype.options, options);

    super(node, attributes, opt);

    // Add closable class
    if (this.options.closable) {
      this.addClass('cc-closable');
    }

    // Open or hide the component
    if (typeof this.options.opened !== 'undefined') {
      if (this.options.opened) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  /**
   * Closes the component
   * @param callback
   * @return {Closable}
   */
  close(callback) {
    this.debug('close');
    this.events.trigger('close');
    this.removeClass('opened');
    this.addClass('closed');
    this.once('transitionend', (ev) => {
      if (!this.isOpened()) {
        this.debug('closed');
        this.events.trigger('closed', ev);
        this.hide();

        if (typeof callback === 'function') {
          callback.call(this, ev);
        }
      }
    });
    return this;
  }

  /**
   * Checks if the component is opened
   * @return {boolean}
   */
  isOpened() {
    return this.hasClass('opened');
  }

  /**
   * Called when the component is closing
   * @param callback
   */
  onClose(callback) {
    this.events.on('close', callback);
  }

  /**
   * Called when the component is closed
   * @param callback
   */
  onClosed(callback) {
    this.events.on('closed', callback);
  }

  /**
   * Called when the component is opened
   * @param callback
   */
  onOpen(callback) {
    this.events.on('open', callback);
  }

  /**
   * Called when the component is opened
   * @param callback
   */
  onOpened(callback) {
    this.events.on('opened', callback);
  }

  /**
   * Opens the component
   * @param callback
   * @return {Closable}
   */
  open(callback) {
    this.show();
    this.debug('open');
    this.events.trigger('open');
    this.removeClass('closed');
    this.addClass('opened');
    this.once('transitionend', (ev) => {
      if (this.isOpened()) {
        this.debug('opened');
        this.events.trigger('opened', ev);

        if (typeof callback === 'function') {
          callback.call(this, ev);
        }
      }
    });
    return this;
  }

  /**
   * Toggles the component
   * @param callback
   * @return {Closable}
   */
  toggle(callback) {
    if (this.isOpened()) {
      this.close(callback);
    } else {
      this.open(callback);
    }
    return this;
  }
}

Closable.prototype.options = {
  closable: false,
  opened: true,
};

export default Closable;
