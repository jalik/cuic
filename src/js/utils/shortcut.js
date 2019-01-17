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

class Shortcut {
  constructor(options) {
    // Set default options
    this.options = extend({}, Shortcut.prototype.options, options);

    // Get the element
    this.options.element = Cuic.node(this.options.element);

    // Check options
    if (typeof this.options.callback !== 'function') {
      throw new TypeError('Shortcut.options.callback is not a function.');
    }

    // Init options
    if (this.options.active) {
      this.activate();
    }
  }

  /**
   * Activates the shortcut
   */
  activate() {
    const { options } = this;
    const element = this.node();
    Cuic.on('keydown', element, (ev) => {
      if ((options.keyCode === ev.keyCode || options.key === ev.key || options.key === ev.code)
        && options.altKey === ev.altKey
        && options.ctrlKey === ev.ctrlKey
        && options.shiftKey === ev.shiftKey) {
        ev.preventDefault();
        ev.stopPropagation();
        options.callback.call(this, element, ev);
        return false;
      }
      return true;
    });
  }

  /**
   * Deactivates the shortcut
   */
  deactivate() {
    Cuic.off('keydown', this.node(), this.options.callback);
  }

  /**
   * Returns the element
   * @return {HTMLElement}
   */
  node() {
    return Cuic.node(this.options.element);
  }
}

Shortcut.prototype.options = {
  active: true,
  altKey: false,
  callback: null,
  ctrlKey: false,
  element: document.body,
  key: null,
  keyCode: null,
  shiftKey: false,
};

Cuic.keys = {
  BACKSPACE: 8,
  DEL: 46,
  DOWN: 40,
  ENTER: 13,
  ESC: 27,
  INSERT: 45,
  LEFT: 37,
  MINUS: 109,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  PLUS: 107,
  RIGHT: 39,
  TAB: 9,
  UP: 38,
};

export default Shortcut;
