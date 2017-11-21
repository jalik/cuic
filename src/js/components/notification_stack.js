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

import Cuic from "../cuic";
import {Group} from "../ui/group";
import {Notification} from "./notification";

export class NotificationStack extends Group {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, NotificationStack.prototype.options, options, {
            mainClass: "notification-stack"
        });

        // Create element
        super("div", {className: options.className}, options);

        // Set position
        if (this.options.position) {
            this.align();
        }

        // Display the notification when it's added to the stack
        this.onComponentAdded((component) => {
            if (component instanceof Notification) {
                // fixme Not using a timeout to open blocks the animation
                setTimeout(function () {
                    component.open();
                }, 10);
            }
        });

        // Display the notification when it's added to the stack
        this.onComponentRemoved((component) => {
            if (component instanceof Notification) {
                component.close();
            }
        });
    }
}

NotificationStack.prototype.options = {
    namespace: "notification-stack",
    position: "right top",
    zIndex: 10
};
