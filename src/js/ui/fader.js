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
import {Component} from "../ui/component";

export class Fader extends Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Fader.prototype.options, options, {
            mainClass: "fader"
        });

        // Create element
        super("div", {className: options.className}, options);

        // Auto close when fader is clicked
        this.on("click", () => {
            if (this.options.autoClose) {
                this.close();
            }
        });

        // Called when fader is closed
        this.onClosed(() => {
            if (this.options.autoRemove) {
                this.remove();
            }
        });
    }
}

Fader.prototype.options = {
    autoClose: false,
    autoRemove: false,
    namespace: "fader",
    opened: false,
    zIndex: 1
};
