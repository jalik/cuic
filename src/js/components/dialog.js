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

Cuic.dialogs.onAdded = function (value) {
    dialogZIndex += 1;
};

Cuic.dialogs.onRemoved = function (value) {
    dialogZIndex -= 1;
};

/**
 * Basic dialog
 */
Cuic.Dialog = class extends Cuic.Component {

    constructor(options) {
        const ns = Cuic.namespace('dialog');

        // Set default options
        options = $.extend({}, Cuic.Dialog.prototype.options, options);

        // Create element
        super('div', {
            className: options.className,
            role: 'dialog'
        }, options);

        const self = this;

        let buttons = [];
        let $buttons;
        let $closeButton;
        let $content;
        let $footer;
        let $header;
        let $title;

        /**
         * Adds a button to the dialog
         * @return {Cuic.Button}
         * @param button
         */
        self.addButton = function (button) {
            if (!(button instanceof Cuic.Button)) {
                const callback = button.callback;

                button = new Cuic.Button({
                    className: 'btn btn-default',
                    label: button.label
                });

                // Set button callback
                if (typeof callback === 'function') {
                    button.onClick = function (ev) {
                        callback.call(self, ev);
                    };
                } else if (callback === 'close') {
                    button.onClick = () => {
                        self.close();
                    };
                }
            }

            // Add button in footer
            $buttons.append(button.getElement());
            buttons.push(button);

            // Hide footer if empty
            if (buttons.length > 1) {
                $footer.show();
            }
            // Maximize the only one button
            else if (buttons.length === 1) {
                $footer.show();
            }
            // Hide footer if empty
            else {
                $footer.hide();
            }
            return button;
        };

        /**
         * Returns the content
         * @deprecated
         * @return {jQuery}
         */
        self.getBody = () => {
            return $content;
        };

        /**
         * Returns the content
         * @return {jQuery}
         */
        self.getContent = () => {
            return $content;
        };

        /**
         * Returns the footer
         * @return {jQuery}
         */
        self.getFooter = () => {
            return $footer;
        };

        /**
         * Returns the header
         * @return {jQuery}
         */
        self.getHeader = () => {
            return $header;
        };

        /**
         * Called when the dialog is closing
         */
        self.onClose = () => {
            fader.close(() => {
                if (self.options.autoRemove) {
                    fader.remove();
                }
            });
        };

        /**
         * Called when the dialog is closed
         */
        self.onClosed = () => {
            if (self.options.autoRemove) {
                self.remove();
            }
        };

        /**
         * Called when the dialog is opening
         */
        self.onOpen = () => {
            // Calculate z-index
            let zIndex = options.zIndex + dialogZIndex;
            self.css({'z-index': zIndex});

            // Open fader
            if (self.options.modal) {
                self.css({'z-index': zIndex + 1});
                fader.css({'z-index': zIndex});
                fader.open();
            }
            // Maximize or position the dialog
            if (self.options.maximized) {
                self.maximize();
            } else {
                self.setPosition(self.options.position);
            }
            // Focus the last button
            if (self.$element.find(':focus').length === 0) {
                $footer.find('button:last').focus();
            }
        };

        /**
         * Called when the dialog is opened
         */
        self.onOpened = () => {
            // // Find images
            // let images = self.$element.find('img');
            //
            // if (images.length > 0) {
            //     // Position the dialog when images are loaded
            //     images.off(ns('load')).on(ns('load'), () => {
            //         self.resizeContent();
            //     });
            // } else {
            //     // Position the dialog in the wrapper
            //     self.resizeContent();
            // }
        };

        /**
         * Resizes the content
         * @return {Cuic.Dialog}
         */
        self.resizeContent = () => {
            let display = fader.css('display');
            let maxHeight = window.innerHeight;

            console.warn('dialog.resizeContent disabled');
            return;

            // Temporary display the dialog
            // to get real height values
            fader.show();
            self.$element.show();

            // Set maximized
            if (self.options.maximized) {
                self.css({
                    height: '100%',
                    width: '100%'
                });
            }

            // Use parent for max height
            if (self.getParentElement() !== document.body) {
                maxHeight = self.getParentElement().innerHeight();
            }

            // Set dialog max height
            maxHeight -= self.$element.outerHeight(true) - self.$element.height();
            self.$element.css('max-height', maxHeight);

            // Set content max height
            let contentMaxHeight = maxHeight;
            contentMaxHeight -= $content.outerHeight(true) - $content.height();

            if ($header) {
                contentMaxHeight -= $header.outerHeight(true);
            }

            if ($footer) {
                contentMaxHeight -= $footer.outerHeight(true);
            }

            $content.css({
                maxHeight: contentMaxHeight,
                overflow: 'auto'
            });

            self.position(position);

            // Restore the initial display state
            fader.css('display', display);
            self.$element.css('display', display);

            return self;
        };

        /**
         * Sets the title
         * @param html
         * @return {Cuic.Dialog}
         */
        self.setTitle = function (html) {
            $title.html(html);
            return self;
        };

        // Set dialog position
        let fixed = self.getParentElement() === document.body;
        self.$element.css({position: fixed ? 'fixed' : 'absolute'});

        // Create the fader
        const fader = new Cuic.Fader({
            className: 'fader dialog-fader'
        }).appendTo(options.parent);

        // Set fader position
        if (fixed) {
            fader.css({position: 'fixed'});
        }

        // If the dialog is not modal,
        // a click on the wrapper will close the dialog
        fader.onClick = function (ev) {
            self.close();
        };

        // Add header
        $header = $('<header>', {
            'class': 'dialog-header',
            css: {display: options.title != null ? 'block' : 'none'}
        }).appendTo(self.getElement());

        // Add title
        $title = $('<h3>', {
            html: options.title,
            'class': 'dialog-title'
        }).appendTo($header);

        // Add close button
        $closeButton = $('<span>', {
            'class': 'dialog-close-btn glyphicon glyphicon-remove-sign'
        }).prependTo($header);

        // Add content
        $content = $('<section>', {
            'html': options.content,
            'class': 'dialog-content',
            style: 'overflow: auto'
        }).appendTo(self.getElement());

        // Add footer
        $footer = $('<footer>', {
            'class': 'dialog-footer',
            css: {display: options.buttons != null ? 'block' : 'none'}
        }).appendTo(self.getElement());

        // Add buttons group
        $buttons = $('<div>', {
            'class': 'btn-group',
            role: 'group'
        }).appendTo($footer);

        // Set content height
        if (parseFloat(options.contentHeight) > 0) {
            $content.css('height', options.contentHeight);
        }

        // Set content width
        if (parseFloat(options.contentWidth) > 0) {
            $content.css('width', options.contentWidth);
        }

        // Add buttons
        if (options.buttons instanceof Array) {
            for (let i = 0; i < options.buttons.length; i += 1) {
                self.addButton(options.buttons[i]);
            }
        }

        // Close dialog when close button is clicked
        $closeButton.on(ns('click'), () => {
            self.close();
        });

        // let timer;
        // $(window).off(ns('resize')).on(ns('resize'), () => {
        //     clearTimeout(timer);
        //
        //     if (self.options.autoResize) {
        //         timer = setTimeout(() => {
        //             self.resizeContent();
        //         }, 50);
        //     }
        // });

        // Add dialog to collection
        Cuic.dialogs.add(self);

        // Make the dialog draggable
        if (self.options.draggable) {
            self.draggable = new Cuic.Draggable({
                area: $title,
                container: self.getParentElement(),
                rootOnly: false,
                target: self.getElement()
            });
        }

        // Define the close shortcut
        new Cuic.Shortcut({
            keyCode: 27, //Esc
            target: self.getElement(),
            callback() {
                self.close();
            }
        });
    }

    onRemove() {
        Cuic.dialogs.remove(this);
    }
};

/**
 * Default options
 * @type {*}
 */
Cuic.Dialog.prototype.options = {
    autoRemove: true,
    autoResize: true,
    buttons: [],
    className: 'dialog',
    content: null,
    contentHeight: null,
    contentWidth: null,
    draggable: true,
    maximized: false,
    parent: document.body,
    position: 'center',
    modal: true,
    target: null,
    title: null,
    zIndex: 5
};
