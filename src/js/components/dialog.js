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
        let $container;
        let $content;
        let $footer;
        let $header;
        let $title;
        let position;

        // Define attributes
        self.autoRemove = options.autoRemove === true;
        self.autoResize = options.autoResize === true;
        self.closeable = options.closeable === true;
        self.draggable = options.draggable === true;
        self.maximized = options.maximized === true;
        self.modal = options.modal === true;

        // Define vars
        $container = $(options.container);
        position = options.position;

        // Use document body as container
        if ($container.length === 0) {
            $container = $(document.body);
        }

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
                    button.onClick = function () {
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
         * Closes the dialog
         * @param callback
         * @return {Cuic.Dialog}
         */
        self.onClose = function (callback) {
            fader.close(function () {
                // if (self.autoRemove) {
                //     fader.remove();
                // }
            });
            if (typeof callback === 'function') {
                callback.call(self);
            }
            // if (self.autoRemove) {
            //     self.$element.remove();
            // }
            return self;
        };

        /**
         * Returns the content
         * @deprecated
         * @return {jQuery}
         */
        self.getBody = function () {
            return $content;
        };

        /**
         * Returns the content
         * @return {jQuery}
         */
        self.getContent = function () {
            return $content;
        };

        /**
         * Returns the footer
         * @return {jQuery}
         */
        self.getFooter = function () {
            return $footer;
        };

        /**
         * Returns the header
         * @return {jQuery}
         */
        self.getHeader = function () {
            return $header;
        };

        /**
         * Opens the dialog
         * @param callback
         * @return {Cuic.Dialog}
         */
        self.onOpen = function (callback) {
            const dialogOpened = function () {
                if (typeof callback === 'function') {
                    callback.call(self);
                }
                // Focus the last button
                if (self.$element.find(':focus').length === 0) {
                    $footer.find('button:last').focus();
                }
            };

            if (self.maximized) {
                self.maximize();
            } else {
                self.setPosition(position);
            }

            // // Find images
            // let images = self.$element.find('img');
            //
            // if (images.length > 0) {
            //     // Position the dialog when images are loaded
            //     images.off(ns('load')).on(ns('load'), function () {
            //         self.resizeContent();
            //     });
            // } else {
            //     // Position the dialog in the wrapper
            //     self.resizeContent();
            // }

            if (self.modal) {
                fader.open();
            }
            dialogOpened();

            return self;
        };

        /**
         * Resizes the content
         * @return {Cuic.Dialog}
         */
        self.resizeContent = function () {
            let display = fader.css('display');
            let maxHeight = window.innerHeight;

            console.warn('dialog.resizeContent disabled');
            return;

            // Temporary display the dialog
            // to get real height values
            fader.show();
            self.$element.show();

            // Set maximized
            if (self.maximized) {
                self.$element.css({
                    height: '100%',
                    width: '100%'
                });
            }

            // Use container for max height
            if ($container !== document.body) {
                maxHeight = $container.innerHeight();
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

            Cuic.position(self.$element, position, fader);

            // Restore the initial display state
            fader.css('display', display);
            self.$element.css('display', display);

            return self;
        };

        /**
         * Sets the content
         * @param html
         * @return {Cuic.Dialog}
         */
        self.setContent = function (html) {
            $content.html(html);
            return self;
        };

        /**
         * Sets the position of the dialog and optionally its container
         * @param pos
         * @param cont
         * @return {Cuic.Dialog}
         */
        self.setPosition = function (pos, cont) {
            position = pos;
            $container = $(cont || $container);
            Cuic.position(self.$element, position, $container);
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

        // If the dialog is not in a container, then it is fixed
        let fixed = $container.get(0).nodeName === 'BODY';

        // Set dialog position
        self.$element.css({position: fixed ? 'fixed' : 'absolute'});

        // Create the fader
        const fader = new Cuic.Fader({className: 'fader dialog-fader'});
        fader.appendTo($container);

        // Set fader position
        if (fixed) {
            fader.css({position: 'fixed'});
        }

        // If the dialog is not modal,
        // a click on the wrapper will close the dialog
        fader.onClick(function (ev) {
            self.close();
        });

        // Add header
        $header = $('<header>', {
            'class': 'dialog-header',
            css: {display: options.title != null ? 'block' : 'none'}
        }).appendTo(self.$element);

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
        }).appendTo(self.$element);

        // Add footer
        $footer = $('<footer>', {
            'class': 'dialog-footer',
            css: {display: options.buttons != null ? 'block' : 'none'}
        }).appendTo(self.$element);

        // Add buttons group
        $buttons = $('<div>', {
            'class': 'btn-group',
            role: 'group'
        }).appendTo($footer);

        // Set custom styles
        Cuic.applyCss(options.css, self.$element);

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
        $closeButton.off(ns('click')).on(ns('click'), function () {
            self.close();
        });

        // let timer;
        // $(window).off(ns('resize')).on(ns('resize'), function () {
        //     clearTimeout(timer);
        //
        //     if (self.autoResize) {
        //         timer = setTimeout(function () {
        //             self.resizeContent();
        //         }, 50);
        //     }
        // });

        // Add dialog in container
        self.appendTo($container);

        // Make the dialog draggable
        self.draggable = new Cuic.Draggable({
            area: $title,
            container: $container,
            rootOnly: false,
            target: self.$element
        });

        // Define the close shortcut
        new Cuic.Shortcut({
            keyCode: 27, //Esc
            target: self.$element,
            callback() {
                self.close();
            }
        });
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
    closeable: true,
    container: null,
    content: null,
    contentHeight: null,
    contentWidth: null,
    css: null,
    draggable: true,
    maximized: false,
    position: 'center',
    modal: true,
    target: null,
    title: null,
    zIndex: 5
};
