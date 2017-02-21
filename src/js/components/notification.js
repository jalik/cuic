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
        super('div', {className: options.className}, options);

        const self = this;

        // Add component classes
        self.addClass('notification');

        // Public attributes
        self.closeTimer = null;

        // Add content
        self.content = new Cuic.Element('div', {
            className: 'notification-content',
            html: options.content
        }).appendTo(self);

        // Add close button
        self.closeButton = new Cuic.Element('span', {
            className: 'btn-close glyphicon glyphicon-remove-sign',
            html: self.options.closeButton,
            role: 'button'
        }).appendTo(self);

        // Avoid closing notification when mouse is over
        self.on('mouseenter', (ev) => {
            clearTimeout(self.closeTimer);
        });

        // Close notification when mouse is out
        self.on('mouseleave', (ev) => {
            if (ev.currentTarget === self.getElement()) {
                self.autoClose();
            }
        });

        self.on('click', (ev) => {
            // Close button
            if (Cuic.hasClass(ev.target, 'btn-close')) {
                ev.preventDefault();
                self.close();
            }
        });

        // Add dialog to collection
        Cuic.notifications.add(self);

        // Called when the notification is closed
        self.onClosed(() => {
            if (self.options.autoRemove) {
                self.remove();
            }
        });

        // Called when the notification is opening
        self.onOpen(() => {
            if (self.options.position) {
                let isFixed = self.getParentElement() === document.body;
                self.css({position: isFixed ? 'fixed' : 'absolute'});
                self.align(self.options.position);
            }
        });

        // Called when the notification is opened
        self.onOpened(() => {
            self.autoClose();
        });

        // Remove dialog from list
        self.onRemoved(() => {
            Cuic.notifications.remove(self);
        });
    }

    /**
     * Auto closes the notification
     */
    autoClose() {
        clearTimeout(this.closeTimer);
        this.closeTimer = setTimeout(() => {
            if (this.options.autoClose) {
                this.close();
            }
        }, this.options.duration);
    }

    /**
     * Sets notification content
     * @param html
     * @return {Cuic.Notification}
     */
    setContent(html) {
        this.content.html(html);
        return this;
    }
};

Cuic.Notification.prototype.options = {
    autoClose: true,
    autoRemove: true,
    className: 'notification',
    closable: true,
    closeButton: '',
    content: null,
    duration: 2000,
    namespace: 'notification',
    parent: document.body,
    position: 'center',
    zIndex: 10
};
