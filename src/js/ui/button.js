/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Karl STEIN
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
import Shortcut from '../utils/shortcut';
import Component from './component';

/**
 * A button component.
 */
class Button extends Component {
  constructor(options) {
    // Set default options
    const opt = extend({}, Button.prototype.options, options, {
      mainClass: 'cc-button',
    });

    // Create element
    super('button', {
      autofocus: opt.autofocus,
      className: opt.className,
      disabled: opt.disabled,
      html: opt.label,
      title: opt.title,
      type: opt.type,
    }, opt);

    // Create shortcut
    if (typeof opt.shortcut === 'number') {
      this.shortcut = new Shortcut({
        keyCode: opt.shortcut,
        target: this.element,
        callback: () => {
          this.click();
        },
      });
    }
  }
}

Button.prototype.options = {
  autofocus: false,
  className: 'btn btn-default btn-secondary',
  disabled: false,
  label: null,
  shortcut: null,
  title: null,
  type: 'button',
};

export default Button;
