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

(function ($) {
    'use strict';

    let ns = Cuic.namespace('dialog');

    /**
     * Creates a dialog
     * @param options
     * @constructor
     */
    Cuic.Dialog = function (options) {
        const self = this;

        // Default options
        options = $.extend(Cuic.Dialog.prototype.options, options);

        let buttons = [];
        let $buttons;
        let $container;
        let $content;
        let $element;
        let $footer;
        let $header;
        let $title;
        let $wrapper;
        let isClosing = false;
        let isOpened = false;
        let isOpening = false;
        let position;

        // Define attributes
        self.autoRemove = options.autoRemove === true;
        self.autoResize = options.autoResize === true;
        self.closeable = options.closeable === true;
        self.closeButton = options.closeButton;
        self.draggable = options.draggable === true;
        self.fullscreen = options.fullscreen === true;
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
         * @param label
         * @param callback
         * @return {Cuic.Button}
         */
        self.addButton = function (label, callback) {
            const button = new Cuic.Button({
                className: 'btn btn-default',
                label: label
            });

            // Add button in footer
            $buttons.append(button.getElement());
            buttons.push(button);

            // Set button callback
            if (typeof callback === 'function') {
                button.onClick = function (ev) {
                    callback.call(self, ev);
                };
            } else if (callback === 'close') {
                button.onClick = function () {
                    self.close();
                };
            } else {
                console.warn(`Cuic.Dialog.addButton: callback not defined`);
            }

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
        self.close = function (callback) {
            if (isOpening || (isOpened && !isClosing)) {
                isClosing = true;
                isOpening = false;

                $wrapper.stop(true, false).fadeOut(200, function () {
                    if (self.autoRemove) {
                        $wrapper.remove();
                    }
                });

                $element.stop(true, false).fadeOut(200, function () {
                    if (typeof callback === 'function') {
                        callback.call(self);
                    }
                    if (self.autoRemove) {
                        $element.remove();
                    }
                    isClosing = false;
                    isOpened = false;
                });
            }
            return self;
        };

        /**
         * Returns the body
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
         * Returns the element
         * @return {jQuery}
         */
        self.getElement = function () {
            return $element;
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
         * Checks if the dialog is opened
         * @return {boolean}
         */
        self.isOpened = function () {
            return isOpened;
        };

        /**
         * Opens the dialog
         * @param callback
         * @return {Cuic.Dialog}
         */
        self.open = function (callback) {
            if (isClosing || (!isOpened && !isOpening)) {
                isClosing = false;
                isOpening = true;

                // Set fullscreen
                if (self.fullscreen) {
                    $element.css({
                        height: '100%',
                        width: '100%'
                    });
                }

                // Find images
                let images = $element.find('img');

                if (images.length > 0) {
                    // Position the dialog when images are loaded
                    images.off(ns('load')).on(ns('load'), function () {
                        self.resizeContent();
                    });
                } else {
                    // Position the dialog in the wrapper
                    self.resizeContent();
                }

                // If the content of the dialog has changed,
                // we need to check if there is a close button
                $element.find('.dialog-close').off(ns('click')).one(ns('click'), function () {
                    self.close();
                });

                // Position the notification
                $element.css({position: $container.get(0).nodeName === 'BODY' ? 'fixed' : 'absolute'});

                // Set the position
                self.setPosition(position);

                // Stop animation
                $element.stop(true, false);

                // Add the close button
                if (self.closeable) {
                    $header.find('.close-dialog').remove();
                    $('<span>', {
                        class: 'close-dialog',
                        html: self.closeButton
                    }).prependTo($header);
                }

                // If the content of the dialog has changed,
                // we need to check if there is a close button
                $element.find('.close-dialog').off(ns('click')).one(ns('click'), self.close);

                if (self.modal) {
                    $wrapper.css({
                        height: '100%',
                        width: '100%'
                    });
                    $wrapper.fadeIn(200, function () {
                        $element.fadeIn(200, function () {
                            if (typeof callback === 'function') {
                                callback.call(self);
                            }
                            isOpening = false;
                            isOpened = true;
                        });
                        // Focus the last button
                        if ($element.find(':focus').length === 0) {
                            $footer.find('button:last').focus();
                        }
                    });
                } else {
                    $element.fadeIn(200, function () {
                        if (typeof callback === 'function') {
                            callback.call(self);
                        }
                        isOpening = false;
                        isOpened = true;

                        // Focus the last button
                        if ($element.find(':focus').length === 0) {
                            $footer.find('button:last').focus();
                        }
                    });
                }
            }
            return self;
        };

        /**
         * Resizes the content
         * @return {Cuic.Dialog}
         */
        self.resizeContent = function () {
            let display = $wrapper.css('display');
            let maxHeight = window.innerHeight;

            // Temporary display the dialog
            // to get real height values
            $wrapper.show();
            $element.show();

            // Set fullscreen
            if (self.fullscreen) {
                $element.css({
                    height: '100%',
                    width: '100%'
                });
            }

            // Use container for max height
            if ($container !== document.body) {
                maxHeight = $container.innerHeight();
            }

            // Set dialog max height
            maxHeight -= $element.outerHeight(true) - $element.height();
            $element.css('max-height', maxHeight);

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

            Cuic.position($element, position, $wrapper);

            // Restore the initial display state
            $wrapper.css('display', display);
            $element.css('display', display);

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
            Cuic.position($element, position, $container);
            return self;
        };

        /**
         * Sets the title
         * @param html
         * @return {Cuic.Dialog}
         */
        self.setTitle = function (html) {
            if ($title) {
                $title.html(html);
            }
            return self;
        };

        /**
         * Toggles the dialog visibility
         * @param callback
         * @return {Cuic.Dialog}
         */
        self.toggle = function (callback) {
            if (isClosing || (!isOpened && !isOpening)) {
                self.open(callback);
            } else {
                self.close(callback);
            }
            return self;
        };

        // If the dialog is not in a container, then it is fixed
        let fixed = $container.get(0).nodeName === 'BODY';

        // Create the wrapper
        $wrapper = $('<div>', {
            'class': 'dialog-wrapper',
            css: {
                display: 'none',
                height: '100%',
                left: 0,
                position: fixed ? 'fixed' : 'absolute',
                top: 0,
                width: '100%',
                zIndex: self.zIndex
            }
        }).appendTo($container);

        // Create the dialog
        $element = $('<div>', {
            'class': options.className,
            css: {
                display: 'none',
                zIndex: self.zIndex
            }
        }).appendTo($wrapper);

        // Add the header
        $header = $('<header>', {
            'class': 'dialog-header',
            css: {
                display: options.title != null ? 'block' : 'none'
            }
        }).appendTo($element);

        // Add the title
        $title = $('<h3>', {
            html: options.title,
            'class': 'dialog-title'
        }).appendTo($header);

        // Add the content
        $content = $('<section>', {
            'html': options.content,
            'class': 'dialog-content',
            style: 'overflow: auto'
        }).appendTo($element);

        // Add the footer
        $footer = $('<footer>', {
            'class': 'dialog-footer',
            css: {
                display: options.buttons != null ? 'block' : 'none'
            }
        }).appendTo($element);

        $buttons = $('<div>', {
            'class': 'btn-group',
            role: 'group'
        }).appendTo($footer);

        // Set custom styles
        Cuic.applyCss(options.css, $element);

        // Override styles
        $element.css({position: fixed ? 'fixed' : 'absolute'});

        // Set content height
        if (parseFloat(options.contentHeight) > 0) {
            $content.css('height', options.contentHeight);
        }
        // Set content width
        if (parseFloat(options.contentWidth) > 0) {
            $content.css('width', options.contentWidth);
        }

        // Add the buttons
        if (options.buttons instanceof Array) {
            for (let i = 0; i < options.buttons.length; i += 1) {
                let btn = options.buttons[i];
                self.addButton(btn.label, btn.callback);
            }
        }

        // If the dialog is not modal,
        // a click on the wrapper will close the dialog
        $wrapper.off(ns('click')).on(ns('click'), function (ev) {
            if (!self.modal && ev.target == $wrapper.get(0)) {
                self.close();
            }
        });

        // Make the dialog draggable
        self.draggable = new Cuic.Draggable({
            area: $title,
            container: $container,
            rootOnly: false,
            target: $element
        });

        let timer;
        $(window).off(ns('resize')).on(ns('resize'), function () {
            clearTimeout(timer);

            if (self.autoResize) {
                timer = setTimeout(function () {
                    self.resizeContent();
                }, 50);
            }
        });

        // Define the close shortcut
        new Cuic.Shortcut({
            keyCode: 27, //Esc
            target: $element,
            callback: self.close
        });
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
        closeButton: '×',
        container: null,
        content: null,
        contentHeight: null,
        contentWidth: null,
        css: null,
        draggable: true,
        fullscreen: false,
        position: 'center',
        modal: true,
        target: null,
        title: null,
        zIndex: 5
    };

})(jQuery);
