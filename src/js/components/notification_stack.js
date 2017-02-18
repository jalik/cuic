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

Cuic.NotificationStack = class extends Cuic.GroupComponent {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.NotificationStack.prototype.options, options);

        // Create element
        super('div', {
            className: options.className,
            html: options.content
        }, options);

        const self = this;

        // Add component classes
        self.addClass('notification-stack');

        // Set position
        if (self.options.position) {
            let isFixed = self.getParentElement() === document.body;
            self.css({position: isFixed ? 'fixed' : 'absolute'});
            self.align(self.options.position);
        }
    }

    onComponentAdded(component) {
        // Display the notification when it's added to the stack
        if (component instanceof Cuic.Notification) {
            // fixme Not using a timeout to open blocks the animation
            setTimeout(function () {
                component.open();
            }, 10);
        }
    }

    onComponentRemoved(component) {
        // Display the notification when it's added to the stack
        if (component instanceof Cuic.Notification) {
            component.close();
        }
    }
};

Cuic.NotificationStack.prototype.options = {
    className: 'notification-stack',
    namespace: 'notification-stack',
    position: 'right top',
    zIndex: 10
};
