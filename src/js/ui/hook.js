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
import Component from './component';
import Element from './element';

class Hook extends Component {
  constructor(options) {
    // Set default options
    const opt = extend({}, Hook.prototype.options, options);

    // Create element
    super('div', { className: opt.className }, opt);

    // Add component classes
    this.addClass('cc-hook');

    // This is a fix to avoid offsetTop > 0
    this.css({
      position: 'relative',
      top: '',
      width: '',
    });

    // Create the spacer item that will replace
    // the bar when it is scrolled
    this.space = new Element('div', {
      className: 'cc-hook-space',
    });

    // Get the element"s offset
    const offset = this.offset();

    const onScroll = () => {
      const fitsInScreen = this.outerHeight(true) <= window.screen.availHeight;

      if (fitsInScreen) {
        if (this.options.fixed) {
          this.hook();
        } else {
          const margin = this.margin();

          if (window.scrollY > offset.top - margin.top) {
            this.hook();
          } else {
            this.unhook();
          }
        }
      } else {
        this.unhook();
      }
    };

    // If the window is scrolled when reloading the page,
    // the bar must be shown
    onScroll();

    window.onscroll = () => {
      onScroll();
    };
    window.onresize = () => {
      onScroll();
    };
  }

  /**
   * Hooks the element
   */
  hook() {
    if (this.css('position') !== 'fixed') {
      const offset = this.offset();
      const margin = this.margin();

      if (this.options.fixed) {
        this.options.offsetTop = offset.top;
      }

      // Replace element with invisible space
      this.space.css({
        display: this.css('display'),
        float: this.css('float'),
        height: this.outerHeight(),
        width: this.outerWidth(),
        'margin-bottom': margin.bottom,
        'margin-left': margin.left,
        'margin-right': margin.right,
        'margin-top': margin.top,
      });
      this.insertBefore(this.space);
      this.space.show();

      // Make element scroll
      this.css({
        position: 'fixed',
        left: offset.left,
        top: this.options.offsetTop,
        height: this.space.height(),
        width: this.space.width(),
        zIndex: this.options.zIndex,
      });
      this.addClass('hooked');

      // Execute the hooked listener
      this.events.trigger('hook');
    }
    // else if (this.space) {
    //     const offset = this.space.offset();
    //     this.css({
    //         left: offset.left,
    //         width: this.space.width()
    //     });
    // }
  }

  /**
   * Checks if the element is hooked
   * @return {*|boolean}
   */
  isHooked() {
    return this.hasClass('hooked');
  }

  /**
   * Called when the element is hooked
   * @param callback
   * @return {Hook}
   */
  onHook(callback) {
    this.events.on('hook', callback);
    return this;
  }

  /**
   * Called when the element is unhooked
   * @param callback
   * @return {Hook}
   */
  onUnhook(callback) {
    this.events.on('unhook', callback);
    return this;
  }

  /**
   * Unhooks the element
   */
  unhook() {
    if (this.css('position') !== 'relative') {
      this.space.hide();
      this.css({
        position: 'relative',
        bottom: '',
        left: '',
        right: '',
        top: '',
        width: '',
      });
      this.removeClass('hooked');

      // Execute the unhooked listener
      this.events.trigger('unhook');
    }
  }
}

Hook.prototype.options = {
  fixed: true,
  hookedClass: 'hooked',
  // offsetBottom: 0,
  // offsetLeft: 0,
  // offsetRight: 0,
  // offsetTop: 0,
  zIndex: 4,
};

export default Hook;
