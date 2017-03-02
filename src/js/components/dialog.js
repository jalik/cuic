/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

Cuic.Dialog = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Dialog.prototype.options, options, {
            mainClass: 'dialog'
        });

        // Create element
        super('div', {
            className: options.className,
            role: 'dialog'
        }, options);

        // Set dialog position
        if (this.parentNode() === document.body) {
            this.css({position: 'absolute'});
        }

        // Create the fader
        this.fader = new Cuic.Fader({
            className: 'fader dialog-fader',
            autoClose: false,
            autoRemove: false,
            opened: false
        }).appendTo(this.options.parent);

        // Add header
        this.header = new Cuic.Element('header', {
            className: 'dialog-header',
            css: {display: this.options.title != null ? 'block' : 'none'}
        }).appendTo(this);

        // Add title
        this.title = new Cuic.Element('h3', {
            className: 'dialog-title',
            html: this.options.title
        }).appendTo(this.header);

        // Add content
        this.content = new Cuic.Element('section', {
            className: 'dialog-content',
            html: this.options.content
        }).appendTo(this);

        // Add footer
        this.footer = new Cuic.Element('footer', {
            className: 'dialog-footer',
            css: {display: this.options.buttons != null ? 'block' : 'none'}
        }).appendTo(this);

        // Add buttons group
        this.buttons = new Cuic.Group('div', {
            className: 'btn-group'
        }).appendTo(this.footer);

        // Add close button
        this.closeButton = new Cuic.Element('span', {
            className: this.options.closeButtonClass,
            html: this.options.closeButton,
            role: 'button'
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

        // Set content height
        if (parseFloat(options.contentHeight) > 0) {
            this.content.css({height: options.contentHeight});
        }

        // Set content width
        if (parseFloat(options.contentWidth) > 0) {
            this.content.css({width: options.contentWidth});
        }

        /**
         * Movable interface
         * @type {Cuic.Movable}
         */
        if (this.options.movable) {
            this.movable = new Cuic.Movable({
                constraintToParent: true,
                enabled: this.options.movable,
                element: this.node(),
                handle: this.title,
                rootOnly: false
            });
        }

        /**
         * Resizable interface
         * @type {Cuic.Resizable}
         */
        if (this.options.resizable) {
            this.resizable = new Cuic.Resizable({
                enabled: this.options.resizable,
                element: this.node()
            });
        }

        /**
         * Dialog shortcuts
         * @type {{close: *}}
         */
        this.shortcuts = {
            close: new Cuic.Shortcut({
                element: this,
                keyCode: Cuic.keys.ESC,
                callback: () => {
                    this.close();
                }
            })
        };

        // Close dialog when fader is clicked
        this.fader.on('click', () => {
            if (this.options.autoClose) {
                this.close();
            }
        });

        this.on('click', (ev) => {
            // Close button
            if (Cuic.element(ev.target).hasClass('btn-close')) {
                ev.preventDefault();
                this.close();
            }
        });

        // Called when dialog is closing
        this.onClose(() => {
            this.fader.options.autoRemove = this.options.autoRemove;
            this.fader.close();
        });

        // Called when dialog is closed
        this.onClosed(() => {
            if (this.options.autoRemove) {
                this.remove();
                this.fader.remove();
            }
        });

        // Called when dialog is opening
        this.onOpen(() => {
            // Calculate z-index
            let zIndex = Math.max(this.options.zIndex, Cuic.dialogs.getCurrentZIndex() + 1);

            // Find current top dialog z-index
            this.css({'z-index': zIndex});
            this.resizeContent();

            // Open fader
            if (this.options.modal) {
                this.css({'z-index': zIndex + 1});
                this.fader.css({'z-index': zIndex});
                this.fader.open();
            }

            // Maximize or position the dialog
            if (this.options.maximized) {
                this.maximize();
            } else {
                this.align();
            }

            // Focus the last button
            const buttons = this.buttons.children();

            if (buttons.length > 0) {
                buttons.last().node().focus();
            }
        });

        // Called when dialog is opened
        this.onOpened((ev) => {
            // // todo wait images to be loaded to resize content
            // let images = this.find('img');
            //
            // if (images.length > 0) {
            //     // Position the dialog when images are loaded
            //     images.off(ns('load')).on(ns('load'), () => {
            //         this.resizeContent();
            //     });
            // } else {
            //     // Position the dialog in the wrapper
            //     this.resizeContent();
            // }
        });

        // Remove dialog from list
        this.onRemoved(() => {
            Cuic.dialogs.remove(this);
        });

        // Add element to collection
        Cuic.dialogs.add(this);
    }

    /**
     * Adds a button to the dialog
     * @param button
     * @return {Cuic.Button}
     */
    addButton(button) {
        if (!(button instanceof Cuic.Button)) {
            const callback = button.callback;

            // Create button
            button = new Cuic.Button({
                className: 'btn btn-default',
                label: button.label
            });

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
     * @return {Cuic.Element}
     */
    getBody() {
        return this.content;
    }

    /**
     * Returns the content
     * @return {Cuic.Element}
     */
    getContent() {
        return this.content;
    }

    /**
     * Returns the footer
     * @return {Cuic.Element}
     */
    getFooter() {
        return this.footer;
    }

    /**
     * Returns the header
     * @return {Cuic.Element}
     */
    getHeader() {
        return this.header;
    }

    /**
     * Resizes the content
     * @return {Cuic.Dialog}
     */
    resizeContent() {
        // Calculate available space
        const available = this._calculateAvailableSpace();

        // Set dialog max dimensions
        this.css({
            'max-height': available.height,
            'max-width': available.width
        });

        // Calculate content max height
        let maxHeight = available.height;

        // Subtract header height
        if (this.header instanceof Cuic.Element) {
            maxHeight -= this.header.outerHeight(true);
        }
        // Subtract footer height
        if (this.footer instanceof Cuic.Element) {
            maxHeight -= this.footer.outerHeight(true);
        }
        // Subtract content margin
        maxHeight -= this.content.margin().vertical;

        // Set content max height
        this.content.css({'max-height': maxHeight});
        return this;
    }

    /**
     * Sets dialog content
     * @param html
     * @return {Cuic.Dialog}
     */
    setContent(html) {
        this.content.html(html);
        return this;
    }

    /**
     * Sets dialog footer
     * @param html
     * @return {Cuic.Dialog}
     */
    setFooter(html) {
        this.footer.html(html);
        return this;
    }

    /**
     * Sets dialog title
     * @param html
     * @return {Cuic.Dialog}
     */
    setTitle(html) {
        this.title.html(html);
        return this;
    }
};

Cuic.Dialog.prototype.options = {
    autoClose: false,
    autoRemove: true,
    autoResize: true,
    buttons: [],
    closable: true,
    closeButton: null,
    closeButtonClass: 'glyphicon glyphicon-remove-sign',
    content: null,
    contentHeight: null,
    contentWidth: null,
    movable: true,
    maximized: false,
    modal: true,
    namespace: 'dialog',
    opened: false,
    parent: document.body,
    position: 'center',
    resizable: false,
    title: null,
    zIndex: 10
};

Cuic.dialogs = new Cuic.Collection();

/**
 * Returns the z-index of the highest dialog
 * @return {number}
 */
Cuic.dialogs.getCurrentZIndex = function () {
    let zIndex = 0;

    Cuic.dialogs.each((dialog) => {
        const index = parseInt(dialog.css('z-index'));

        if (index > zIndex) {
            zIndex = index;
        }
    });
    return zIndex;
};

Cuic.onWindowResized(() => {
    Cuic.dialogs.each((dialog) => {
        if (dialog.isInDOM()) {
            dialog.resizeContent();
        }
    });
});
