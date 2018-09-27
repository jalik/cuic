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
import Component from './component';

class Closable extends Component {
  constructor(node, attributes, options) {
    // Set default options
    const opt = extend({}, Closable.prototype.options, options);

    super(node, attributes, opt);

    // Define context (this) used when calling methods
    this.closeOnBlurCallback = this.closeOnBlurCallback.bind(this);

    // Public attributes
    this.closeTimer = null;

    // Add closable class todo what is the purpose of this option ?
    if (this.options.closable) {
      this.addClass('cc-closable');
    }

    // Close when component is clicked
    this.on('click', () => {
      if (this.options.closeOnFocus) {
        this.close();
      }
    });

    // Close notification when mouse is out
    this.on('mouseleave', (ev) => {
      if (this.options.closeOnMouseLeave) {
        if (ev.currentTarget === this.node()) {
          this.autoClose();
        }
      }
    });

    // Set element position
    // if (this.parentNode() === document.body) {
    //   this.css({ position: 'absolute' });
    // }

    // Open or hide the component
    if (this.options.closed === true) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Auto closes the component
   * @param delay custom delay in milliseconds
   */
  autoClose(delay) {
    if (!this.hasClass('closed')) {
      this.cancelCloseTimer();

      if (this.isAutoClosable()) {
        this.closeTimer = setTimeout(() => {
          // Check again if the component is auto closable,
          // this could have changed during the delay.
          if (this.isAutoClosable()) {
            this.close();
          }
        }, (typeof delay === 'number' ? delay : this.options.autoCloseDelay));
      }
    }
  }

  /**
   * Cancels the close timer
   */
  cancelCloseTimer() {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
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
      if (this.isClosed()) {
        this.debug('closed');
        this.events.trigger('closed', ev);
        this.hide();

        // Ignore future click events for autoclose
        // since the component will be closed.
        Cuic.off('click', document, this.closeOnBlurCallback);

        // Remove component from the DOM
        if (this.options.autoRemove) {
          this.remove();
        }

        if (typeof callback === 'function') {
          callback.call(this, ev);
        }
      }
    });
    return this;
  }

  // Define the close on blur callback
  closeOnBlurCallback(ev) {
    if (this.options.closeOnBlur && !this.isClosed()) {
      if (ev.target !== this.node() && !Cuic.element(ev.target).isChildOf(this)) {
        this.close();
      }
    }
  }

  /**
   * Checks if the component closes automatically
   * @return {boolean}
   */
  isAutoClosable() {
    return this.options.autoClose === true;
  }

  /**
   * Checks if the component is closable
   * @return {boolean}
   */
  isClosable() {
    return this.options.closable === true;
  }

  /**
   * Checks if the component is closed
   * @return {boolean}
   */
  isClosed() {
    return this.hasClass('closed');
  }

  /**
   * Checks if the component is opened
   * @deprecated use method isClosed() instead
   * @return {boolean}
   */
  isOpened() {
    // eslint-disable-next-line no-console
    console.warn('Closable.isOpened() is deprecated, use Closable.isClosed() instead');
    return this.hasClass('opened') || !this.hasClass('closed');
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
   * Called when the component is opening
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
    this.cancelCloseTimer();
    this.show();
    this.debug('open');
    this.events.trigger('open');
    this.removeClass('closed');
    this.addClass('opened');

    this.once('transitionend', (ev) => {
      if (!this.isClosed()) {
        this.debug('opened');
        this.events.trigger('opened', ev);

        // Close the component when the user clicks outside of it
        Cuic.on('click', document, this.closeOnBlurCallback);

        // Starts the auto close timer if auto close is enabled.
        this.autoClose();

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
    if (!this.isClosed()) {
      this.close(callback);
    } else {
      this.open(callback);
    }
    return this;
  }
}

Closable.prototype.options = {
  autoClose: false,
  autoCloseDelay: 0,
  autoRemove: false,
  closable: true,
  closed: false,
  closeOnBlur: false,
  closeOnFocus: false,
  closeOnMouseLeave: false,
};

export default Closable;
