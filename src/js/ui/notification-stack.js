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
import Cuic from '../cuic';
import Group from './group';
import Notification from './notification';

class NotificationStack extends Group {
  constructor(options) {
    // Set default options
    const opt = extend({}, NotificationStack.prototype.options, options, {
      mainClass: 'cc-notification-stack',
    });

    // Create element
    super('div', { className: opt.className }, opt);

    // Set position
    this.align(this.options.position);

    // Set max height
    this.resize();

    // Display the notification when it's added to the stack
    this.onComponentAdded((component) => {
      if (component instanceof Notification) {
        component.open();
      }
    });

    // Display the notification when it's added to the stack
    this.onComponentRemoved((component) => {
      if (component instanceof Notification) {
        component.close();
      }
    });

    Cuic.onWindowResized(() => {
      if (this.isInDOM()) {
        this.resize();
        this.align(this.options.position);
      }
    });
  }

  resize() {
    const availableSpace = this.calculateAvailableSpace(this.offsetParent());
    this.css({ 'max-height': availableSpace.height });
  }
}

NotificationStack.prototype.options = {
  animationClass: 'cc-anim-fade',
  namespace: 'notification-stack',
  position: 'right top',
  zIndex: 10,
};

export default NotificationStack;
