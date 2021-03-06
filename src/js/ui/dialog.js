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
import {
  asElement,
  onWindowResized,
} from '../cuic';
import Keys from '../keys';
import Collection from '../utils/collection';
import Shortcut from '../utils/shortcut';
import Button from './button';
import Closable from './closable';
import Element from './element';
import Group from './group';
import Movable from './movable';
import Overlay from './overlay';
import Resizable from './resizable';

export const Dialogs = new Collection();

/**
 * Returns the z-index of the highest dialog
 * @return {number}
 */
Dialogs.getCurrentZIndex = () => {
  let zIndex = 0;

  Dialogs.each((dialog) => {
    const index = Number.parseInt(dialog.css('z-index'), 10);

    if (index > zIndex) {
      zIndex = index;
    }
  });
  return zIndex;
};

/**
 * A dialog component.
 */
class Dialog extends Closable {
  constructor(options) {
    // Set default options
    const opt = extend({}, Dialog.prototype.options, options, {
      mainClass: 'cc-dialog',
    });

    super('div', {
      className: opt.className,
      role: 'dialog',
    }, opt);

    // Add header
    this.header = new Element('header', {
      className: 'cc-dialog-header',
      css: { display: typeof this.options.title !== 'undefined' ? 'block' : 'none' },
    }).appendTo(this);

    // Add title
    this.title = new Element('h3', {
      className: 'cc-dialog-title',
      html: this.options.title,
    }).appendTo(this.header);

    // Add content
    this.content = new Element('section', {
      className: 'cc-dialog-content',
      html: this.options.content,
    }).appendTo(this);

    // Add footer
    const isButtonsDefined = this.options.buttons instanceof Array
      && this.options.buttons.length > 0;

    this.footer = new Element('footer', {
      className: 'cc-dialog-footer',
      css: { display: isButtonsDefined ? 'block' : 'none' },
    }).appendTo(this);

    // Add buttons group
    this.buttons = new Group('div', {
      className: 'btn-group',
    }).appendTo(this.footer);

    // Add close button
    this.closeButton = new Element('span', {
      className: this.options.closeButtonClass,
      html: this.options.closeButton,
      role: 'button',
    }).addClass('btn-close').appendTo(this.header);

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

    // Set content height
    if (parseFloat(this.options.contentHeight) > 0) {
      this.content.css({ height: this.options.contentHeight });
    }

    // Set content width
    if (parseFloat(this.options.contentWidth) > 0) {
      this.content.css({ width: this.options.contentWidth });
    }

    /**
     * Movable interface
     * @type {Movable}
     */
    if (this.options.movable) {
      this.movable = new Movable({
        constraintToParent: true,
        enabled: this.options.movable,
        element: this.node(),
        handle: this.header,
        rootOnly: false,
      });
      // Ignore moving if button is clicked
      this.movable.onMoveStart((ev) => !asElement(ev.target).hasClass('btn-close'));
    }

    /**
     * Resizable interface
     * @type {Resizable}
     */
    if (this.options.resizable) {
      this.resizable = new Resizable({
        enabled: this.options.resizable,
        element: this.node(),
      });
    }

    /**
     * Dialog shortcuts
     * @type {{close: *}}
     */
    this.shortcuts = {
      close: new Shortcut({
        element: this,
        keyCode: Keys.ESC,
        callback: () => {
          this.close();
        },
      }),
    };

    this.on('click', (ev) => {
      // Close button
      if (asElement(ev.target).hasClass('btn-close')) {
        ev.preventDefault();
        this.close();
      }
    });

    this.onClose(() => {
      if (this.overlay) {
        // Close overlay when dialog is closing
        this.overlay.options.autoRemove = this.options.autoRemove;
        this.overlay.close();
      }
    });

    this.onOpen(() => {
      // Calculate z-index
      const zIndex = Math.max(this.options.zIndex, Dialogs.getCurrentZIndex() + 1);

      // Set dialog z-index and resize content
      this.css({ 'z-index': zIndex });
      this.resizeContent();

      if (this.options.modal) {
        // Create the overlay within the same parent
        this.overlay = new Overlay({
          autoClose: false,
          autoRemove: this.options.autoRemove,
          className: 'cc-overlay cc-dialog-overlay',
          closed: true,
        }).appendTo(this.options.parent);

        // Open overlay
        this.css({ 'z-index': zIndex + 1 });
        this.overlay.css({ 'z-index': zIndex });
        this.overlay.open();
      }

      // Align the dialog
      if (!this.options.maximized) {
        this.align(this.options.position, {
          inScreen: true,
        });
      }

      // Focus the last button
      const buttons = this.buttons.children();

      if (buttons.length > 0) {
        // Focus the last button
        buttons.last().node().focus();

        for (let i = 0; i < buttons.length; i += 1) {
          if (buttons.eq(i).attr('autofocus')) {
            // Focus the last button with "autofocus" attribute
            buttons.eq(i).node().focus();
          }
        }
      }

      onWindowResized(() => {
        if (this.isInDOM()) {
          this.resizeContent();
        }
      });
    });

    this.onOpened(() => {
      const autoFocusElement = this.find('[autofocus]').first();

      // Places focus on first element with auto focus attribute
      if (autoFocusElement) {
        autoFocusElement.focus();
      }
    });

    // Remove dialog from list
    this.onRemoved(() => {
      Dialogs.remove(this);
    });

    // Add element to collection
    Dialogs.add(this);
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
        className: `btn btn-default btn-secondary ${(props.className || '')}`,
        label: props.label,
      }, props));

      // Set button callback
      if (typeof callback === 'function') {
        button.on('click', (ev) => {
          callback.call(this, ev);
        });
      } else if (callback === 'close') {
        button.on('click', () => {
          this.close();
        });
      }
    }

    // Add button in footer
    this.buttons.addComponent(button);

    return button;
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
   * @return {Dialog}
   */
  resizeContent() {
    // Calculate available space
    const available = this.calculateAvailableSpace();

    // Set dialog max dimensions
    this.css({
      'max-height': available.height,
      'max-width': available.width,
    });

    // Calculate content max height
    let maxHeight = available.height;

    // Subtract header height
    if (this.header instanceof Element && this.header.isShown()) {
      maxHeight -= this.header.outerHeight(true);
    }
    // Subtract footer height
    if (this.footer instanceof Element && this.footer.isShown()) {
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
   * @return {Dialog}
   */
  setContent(html) {
    this.content.html(html);
    return this;
  }

  /**
   * Sets the footer
   * @param html
   * @return {Dialog}
   */
  setFooter(html) {
    this.footer.html(html);
    return this;
  }

  /**
   * Sets the header
   * @param html
   * @return {Dialog}
   */
  setHeader(html) {
    this.header.html(html);
    return this;
  }

  /**
   * Sets dialog title
   * @param html
   * @return {Dialog}
   */
  setTitle(html) {
    this.title.html(html);

    if (html !== null) {
      this.header.show();
    }
    return this;
  }
}

Dialog.prototype.options = {
  animationClass: 'cc-anim-fade cc-anim-resize',
  autoClose: false,
  autoCloseDelay: 0,
  autoRemove: true,
  autoResize: true,
  buttons: [],
  closable: true,
  closeButton: null,
  closeButtonClass: 'glyphicon glyphicon-remove-sign',
  closed: true,
  closeOnBlur: false,
  closeOnFocus: false,
  closeOnMouseLeave: false,
  content: null,
  contentHeight: null,
  contentWidth: null,
  movable: true,
  maximized: false,
  modal: true,
  namespace: 'dialog',
  parent: document.body,
  position: 'center',
  resizable: false,
  title: null,
  zIndex: 10,
};

export default Dialog;
