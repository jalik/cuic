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

export const Notifications = new Collection();

class Notification extends Closable {
  constructor(options) {
    // Set default options
    const opt = extend({}, Notification.prototype.options, options, {
      mainClass: 'cc-notification',
    });

    // Create element
    super('div', { className: opt.className }, opt);

    // Add content
    this.content = new Element('div', {
      className: 'cc-notification-content',
      html: opt.content,
    }).appendTo(this);

    // Add close button
    this.closeButton = new Element('span', {
      className: this.options.closeButtonClass,
      html: this.options.closeButton,
      role: 'button',
    }).addClass('btn-close').appendTo(this);

    // Avoid closing the notification when mouse is over
    this.on('mouseenter', () => {
      this.open();
    });

    this.on('click', (ev) => {
      // Close button
      if (Cuic.element(ev.target).hasClass('btn-close')) {
        ev.preventDefault();
        this.close();
      }
    });

    this.onOpen(() => {
      this.align(this.options.position);
    });

    Cuic.onWindowResized(() => {
      if (this.isInDOM()) {
        // n._disableTransitions();
        this.align(this.options.position);
        // n._enableTransitions();
      }
    });

    // Remove element from list
    this.onRemoved(() => {
      Notifications.remove(this);
    });

    // Add element to collection
    Notifications.add(this);
  }

  /**
   * Returns the content
   * @return {Element}
   */
  getContent() {
    return this.content;
  }

  /**
   * Sets notification content
   * @param html
   * @return {Notification}
   */
  setContent(html) {
    this.content.html(html);
    return this;
  }
}

Notification.prototype.options = {
  animationClass: 'cc-anim-fade cc-anim-zoom',
  autoClose: true,
  autoCloseDelay: 2000,
  autoRemove: true,
  closable: true,
  closed: true,
  closeButton: '',
  closeButtonClass: 'glyphicon glyphicon-remove-sign',
  closeOnBlur: false,
  closeOnFocus: false,
  closeOnMouseLeave: true,
  content: null,
  namespace: 'notification',
  parent: document.body,
  position: 'center',
  zIndex: 100,
};

export default Notification;
