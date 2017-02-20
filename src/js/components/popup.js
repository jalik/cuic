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

Cuic.Popup = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Popup.prototype.options, options);

        // Create element
        super('div', {className: options.className}, options);

        const self = this;

        // Add component classes
        self.addClass('popup');

        // Add content
        self.content = new Cuic.Element('div', {
            className: 'popup-content',
            html: options.content
        }).appendTo(self);

        // Add close button
        self.closeButton = new Cuic.Element('span', {
            className: 'btn-close glyphicon glyphicon-remove-sign',
            html: self.options.closeButton,
            role: 'button'
        }).appendTo(self);

        if (self.options.closeable) {
            self.closeButton.show();
        } else {
            self.closeButton.hide();
        }

        self.on('click', (ev) => {
            // Close button
            if (Cuic.hasClass(ev.target, 'btn-close')) {
                ev.preventDefault();
                self.close();
            }
        });

        // Close the popup when the user clicks outside of it
        Cuic.on('click', document, (ev) => {
            const elm = self.getElement();

            if (ev.target !== elm && !Cuic.isParent(elm, ev.target)) {
                if (self.options.autoClose && self.isOpened()) {
                    self.close();
                }
            }
        });

        /**
         * Popup shortcuts
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

        // Called when the popup is closed
        self.onClosed(() => {
            if (self.options.autoRemove) {
                self.remove();
            }
        });

        // Called when the popup is opening
        self.onOpen(() => {
            const targetParent = Cuic.getElement(self.options.target).parentNode;
            self.appendTo(targetParent);
            self.anchor(self.options.anchor, self.options.target);
        });
    }

    /**
     * Returns the content
     * @return {Cuic.Element}
     */
    getContent() {
        return this.content;
    }

    /**
     * Sets the popup content
     * @param html
     * @return {Cuic.Popup}
     */
    setContent(html) {
        this.content.setHtml(html);
        return this;
    }
};

Cuic.Popup.prototype.options = {
    anchor: 'top',
    autoClose: true,
    autoRemove: false,
    className: 'popup',
    closeable: true,
    closeButton: '',
    content: null,
    namespace: 'popup',
    target: null,
    zIndex: 9
};
