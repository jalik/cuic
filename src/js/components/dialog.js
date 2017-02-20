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

let dialogZIndex = 0;

/**
 * Collection of dialogs
 */
Cuic.dialogs = new Cuic.Collection();

Cuic.dialogs.onAdded = function () {
    dialogZIndex += 1;
};

Cuic.dialogs.onRemoved = function () {
    dialogZIndex -= 1;
};

/**
 * Basic dialog
 */
Cuic.Dialog = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Dialog.prototype.options, options);

        // Create element
        super('div', {
            className: options.className,
            role: 'dialog'
        }, options);

        const self = this;

        // Add component classes
        self.addClass('dialog');

        let buttons;//todo use a GroupComponent

        // Public attributes
        self.buttons = new Cuic.Collection();

        /**
         * Adds a button to the dialog
         * todo make public method
         * @return {Cuic.Button}
         * @param button
         */
        self.addButton = (button) => {
            if (!(button instanceof Cuic.Button)) {
                const callback = button.callback;

                button = new Cuic.Button({
                    className: 'btn btn-default',
                    label: button.label
                });

                // Set button callback
                if (typeof callback === 'function') {
                    button.on('click', (ev) => {
                        callback.call(self, ev);
                    });
                } else if (callback === 'close') {
                    button.on('click', () => {
                        self.close();
                    });
                }
            }

            // Add button in footer
            buttons.append(button.getElement());
            self.buttons.add(button);

            // Show footer if not empty
            if (self.buttons.length > 0) {
                self.footer.show();
            }
            // Hide footer if empty
            else {
                self.footer.hide();
            }
            return button;
        };

        // Set dialog position
        let fixed = self.getParentElement() === document.body;
        self.css({position: fixed ? 'fixed' : 'absolute'});

        // Create the fader
        self.fader = new Cuic.Fader({
            className: 'fader dialog-fader',
            autoClose: false,
            autoRemove: false
        }).appendTo(options.parent);

        // Add header
        self.header = new Cuic.Element('header', {
            className: 'dialog-header',
            css: {display: options.title != null ? 'block' : 'none'}
        }).appendTo(self);

        // Add title
        self.title = new Cuic.Element('h3', {
            className: 'dialog-title',
            html: options.title
        }).appendTo(self.header);

        // Add content
        self.content = new Cuic.Element('section', {
            className: 'dialog-content',
            html: options.content
        }).appendTo(self);

        // Add footer
        self.footer = new Cuic.Element('footer', {
            className: 'dialog-footer',
            css: {display: options.buttons != null ? 'block' : 'none'}
        }).appendTo(self);

        // Add buttons group
        buttons = new Cuic.Element('div', {
            className: 'btn-group',
            role: 'group'
        }).appendTo(self.footer);

        // Add close button
        self.closeButton = new Cuic.Element('span', {
            className: 'btn-close glyphicon glyphicon-remove-sign',
            html: self.options.closeButton,
            role: 'button'
        }).appendTo(self.header);

        if (self.options.closable) {
            self.closeButton.show();
        } else {
            self.closeButton.hide();
        }

        // Add buttons
        if (options.buttons instanceof Array) {
            for (let i = 0; i < options.buttons.length; i += 1) {
                self.addButton(options.buttons[i]);
            }
        }

        // Set content height
        if (parseFloat(options.contentHeight) > 0) {
            content.css({height: options.contentHeight});
        }

        // Set content width
        if (parseFloat(options.contentWidth) > 0) {
            content.css({width: options.contentWidth});
        }

        // Close dialog when fader is clicked
        self.fader.on('click', () => {
            if (self.options.autoClose) {
                self.close();
            }
        });

        self.on('click', (ev) => {
            // Close button
            if (Cuic.hasClass(ev.target, 'btn-close')) {
                ev.preventDefault();
                self.close();
            }
        });

        // todo Close dialog when the user clicks outside of it
        // Cuic.on('click', document, (ev) => {
        //     const elm = self.getElement();
        //
        //     if (ev.target !== elm && !Cuic.isParent(elm, ev.target)) {
        //         if (self.options.autoClose) {
        //             self.close();
        //         }
        //     }
        // });

        /**
         * Movable interface
         * @type {Cuic.Movable}
         */
        self.movable = new Cuic.Movable({
            enabled: self.options.movable,
            element: self.getElement(),
            handle: self.title,
            rootOnly: false
        });

        /**
         * Dialog shortcuts
         * @type {{close: *}}
         */
        self.shortcuts = {
            close: new Cuic.Shortcut({
                element: self,
                keyCode: Cuic.keys.ESC,
                callback() {
                    self.close();
                }
            })
        };

        // Add dialog to collection
        Cuic.dialogs.add(self);

        // Called when dialog is closing
        self.onClose(() => {
            self.fader.options.autoRemove = self.options.autoRemove;
            self.fader.close();
        });

        // Called when dialog is closed
        self.onClosed(() => {
            if (self.options.autoRemove) {
                self.remove();
            }
        });

        // Called when dialog is opening
        self.onOpen(() => {
            // Calculate z-index
            let zIndex = self.options.zIndex + dialogZIndex;
            self.css({'z-index': zIndex});

            self.resizeContent();

            // Open fader
            if (self.options.modal) {
                self.css({'z-index': zIndex + 1});
                self.fader.css({'z-index': zIndex});
                self.fader.open();
            }
            // Maximize or position the dialog
            if (self.options.maximized) {
                self.maximize();
            } else {
                self.align(self.options.position);
            }
            // Focus the last button
            if (self.buttons.length > 0) {
                const button = self.buttons.get(self.buttons.length - 1);
                button.getElement().focus();
            }
        });

        // Called when dialog is opened
        self.onOpened((ev) => {
            // // todo Find images
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
        self.onRemoved(() => {
            Cuic.dialogs.remove(self);
        });
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
        const parent = this.getParentElement();
        const display = this.css('display');
        let maxHeight = window.innerHeight;

        // Use parent for max height
        if (parent && parent !== document.body) {
            maxHeight = Cuic.height(parent);
        }

        // Set panel max height
        const border = this.border();
        const margin = this.margin();
        maxHeight -= margin.vertical;
        maxHeight -= border.vertical;
        this.css({'max-height': maxHeight});

        // Calculate content max height
        let contentMaxHeight = maxHeight;

        if (this.header instanceof Cuic.Element) {
            contentMaxHeight -= this.header.outerHeight(true);
        }
        if (this.footer instanceof Cuic.Element) {
            contentMaxHeight -= this.footer.outerHeight(true);
        }

        // Set content max height
        this.content.css({
            'max-height': contentMaxHeight,
            overflow: 'auto'
        });

        // Restore initial display state
        this.css({display: display});

        return this;
    }

    /**
     * Sets the title
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
    className: 'dialog',
    closable: true,
    closeButton: null,
    content: null,
    contentHeight: null,
    contentWidth: null,
    movable: true,
    maximized: false,
    modal: true,
    namespace: 'dialog',
    parent: document.body,
    position: 'center',
    title: null,
    zIndex: 5
};
