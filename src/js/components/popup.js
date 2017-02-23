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
        options = Cuic.extend({}, Cuic.Popup.prototype.options, options, {
            mainClass: 'popup'
        });

        // Create element
        super('div', {className: options.className}, options);

        // Add content
        this.content = new Cuic.Element('div', {
            className: 'popup-content',
            html: options.content
        }).appendTo(this);

        // Add tail
        this.tail = new Cuic.Element('span', {
            className: 'popup-tail'
        }).appendTo(this);

        // Add close button
        this.closeButton = new Cuic.Element('span', {
            className: this.options.closeButtonClass,
            html: this.options.closeButton,
            role: 'button'
        }).addClass('btn-close').appendTo(this);

        /**
         * Popup shortcuts
         * @type {{close: *}}
         */
        this.shortcuts = {
            close: new Cuic.Shortcut({
                element: this,
                keyCode: Cuic.keys.ESC,
                callback: () => {
                    this.close();
                }
            })
        };

        const autoClose = (ev) => {
            if (this.isOpened() && this.options.autoClose) {
                if (ev.target !== this.node() && !Cuic.element(ev.target).isChildOf(this)) {
                    this.close();
                }
            }
        };

        this.on('click', (ev) => {
            // Close button
            if (Cuic.element(ev.target).hasClass('btn-close')) {
                ev.preventDefault();
                this.close();
            }
        });

        // Reposition tail when popup position change
        this.onAnchored(() => {
            this.updateTail();
        });

        this.onClosed(() => {
            Cuic.off('click', document, autoClose);

            if (this.options.autoRemove) {
                this.remove();
            }
        });

        this.onOpen(() => {
            const targetParent = Cuic.node(this.options.target).parentNode;
            this.appendTo(targetParent);
            this.anchor(this.options.anchor, this.options.target);
        });

        this.onOpened(() => {
            // Close the popup when the user clicks outside of it
            Cuic.on('click', document, autoClose);
        });
    }

    /**
     * Sets popup content
     * @param html
     * @return {Cuic.Popup}
     */
    setContent(html) {
        this.content.html(html);
        return this;
    }

    /**
     * Updates location
     * @param ev
     * @return {Cuic.Popup}
     */
    update(ev) {
        if (this.options.followPointer && ev) {
            if (this.parentNode() !== document.body) {
                this.appendTo(document.body);
            }
            this.anchor(this.options.anchor, [ev.pageX, ev.pageY]);
        }
        else if (this.currentTarget) {
            if (this.parentNode() !== this.currentTarget.parentNode) {
                this.appendTo(this.currentTarget.parentNode);
            }
            this.anchor(this.options.anchor, this.currentTarget);
        }
        return this;
    }

    /**
     * Position the tail
     * @return {Cuic.Popup}
     */
    updateTail() {
        let prop = {
            bottom: '',
            left: '',
            right: '',
            top: '',
        };

        // todo copy popup background color
        // prop['border-color'] = this.css('background-color');

        // Remove previous classes
        this.tail.removeClass('popup-tail-bottom popup-tail-left popup-tail-right popup-tail-top');

        // Top tail
        if (this.isAnchored('bottom')) {
            this.tail.addClass('popup-tail-top');
        }
        // Bottom tail
        if (this.isAnchored('top')) {
            this.tail.addClass('popup-tail-bottom');
        }
        // Right tail
        if (this.isAnchored('left')) {
            this.tail.addClass('popup-tail-right');
        }
        // Left tail
        if (this.isAnchored('right')) {
            this.tail.addClass('popup-tail-left');
        }

        // Apply CSS
        this.tail.css(prop);

        return this;
    }
};

Cuic.Popup.prototype.options = {
    anchor: 'top',
    autoClose: true,
    autoRemove: false,
    closable: true,
    closeButton: null,
    closeButtonClass: 'glyphicon glyphicon-remove-sign',
    content: null,
    namespace: 'popup',
    opened: false,
    target: null,
    zIndex: 9
};
