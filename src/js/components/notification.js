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
 * Collection of notifications
 */
Cuic.notifications = new Cuic.Collection();

/**
 * Notification component
 */
Cuic.Notification = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Notification.prototype.options, options);

        // Create element
        super('div', {
            className: options.className,
            html: options.content
        }, options);

        const self = this;

        let closeTimer;

        /**
         * Auto closes the notification
         */
        self.autoClose = () => {
            clearTimeout(closeTimer);
            closeTimer = setTimeout(() => {
                if (self.options.autoClose) {
                    self.close();
                }
            }, self.options.duration);
        };

        /**
         * Called when the notification is closed
         */
        self.onClosed = () => {
            if (self.options.autoRemove) {
                self.remove();
            }
        };

        /**
         * Called when the notification is opening
         */
        self.onOpen = () => {
            // Place the component if a position is set
            if (self.options.position) {
                let isFixed = self.getParentElement() === document.body;
                self.css({position: isFixed ? 'fixed' : 'absolute'});
                self.setPosition(self.options.position);
            }
        };

        /**
         * Called when the notification is opened
         */
        self.onOpened = () => {
            self.autoClose();
        };

        // Set element styles
        self.css({zIndex: options.zIndex});

        // Avoid closing notification when mouse is over
        self.on('mouseenter', (ev) => {
            clearTimeout(closeTimer);
        });

        // Close notification when mouse is out
        self.on('mouseleave', (ev) => {
            if (ev.currentTarget === self.getElement()) {
                self.autoClose();
            }
        });

        // Add the close button
        // if (self.options.closeable) {
        //     element.find('.close-notification').remove();
        //     $('<span>', {
        //         class: 'close-notification',
        //         html: self.closeButton
        //     }).appendTo(element);
        // }
        // If the content of the notification has changed,
        // we need to check if there is a close button
        // $element.find('.close-notification').off(ns('click')).one(ns('click'), self.close);

        // Add dialog to collection
        Cuic.notifications.add(self);
    }

    onRemove() {
        Cuic.notifications.remove(this);
    }
};

/**
 * Default options
 * @type {*}
 */
Cuic.Notification.prototype.options = {
    autoClose: true,
    autoRemove: true,
    className: 'notification',
    closeable: true,
    closeButton: '×',
    content: null,
    css: null,
    duration: 2000,
    parent: document.body,
    position: 'center',
    zIndex: 10
};
