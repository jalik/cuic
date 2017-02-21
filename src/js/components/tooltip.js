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

Cuic.tooltips = new Cuic.Collection();

Cuic.Tooltip = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Tooltip.prototype.options, options);

        // Create element
        super('div', {className: options.className}, options);

        const self = this;

        // Add component classes
        self.addClass('tooltip');

        // Add content
        self.content = new Cuic.Element('div', {
            className: 'tooltip-content'
        }).appendTo(self);

        // Add tooltip tail
        self.tail = new Cuic.Element('span', {
            className: 'tooltip-tail'
        }).appendTo(self);

        // Find tooltip targets
        const targets = Cuic.find(self.options.selector);

        targets.each((target) => {
            // Open tooltip when mouse enter area
            target.on('mouseenter', (ev) => {
                // Get stored tooltip content
                let content = target.data('tooltip');

                if (!content || !content.length) {
                    // Get tooltip content from attribute
                    content = target.attr(self.options.attribute);
                    // Avoid tooltip conflict
                    target.attr(self.options.attribute, '');
                    // Store tooltip content
                    target.data('tooltip', content);
                }

                // Update tooltip content
                if (content && content.length) {
                    self.content.html(content);
                }

                // Position tooltip
                self.update(ev);
                self.open();
            });

            // Move tooltip when mouse moves over area
            target.on('mousemove', (ev) => {
                self.update(ev);
            });

            // Close tooltip when mouse leaves area
            target.on('mouseleave', (ev) => {
                self.close();
            });
        });

        // Move tooltip if mouse is over
        self.on('mousemove', (ev) => {
            self.update(ev);
        });

        // Close the panel when the user clicks outside of it
        Cuic.on('click', document, (ev) => {
            const el = self.node();

            if (ev.target !== el && !Cuic.isParent(el, ev.target)) {
                self.close();
            }
        });

        // Add the tooltip to the list
        Cuic.tooltips.add(self);

        // Called when the tooltip is closed
        self.onClosed(() => {
            if (self.options.autoRemove) {
                self.remove();
            }
        });

        // Reposition tail when tooltip position change
        self.onAnchored(() => {
            self.updateTail();
        });
    }

    /**
     * Sets tooltip content
     * @param html
     * @return {Cuic.Tooltip}
     */
    setContent(html) {
        this.content.html(html);
        return this;
    }

    /**
     * Updates tooltip location
     * @param ev
     * @return {Cuic.Tooltip}
     */
    update(ev) {
        // Position tooltip
        if (this.options.followPointer) {
            if (this.parentNode() !== document.body) {
                this.appendTo(document.body);
            }
            this.anchor(this.options.anchor, [ev.pageX, ev.pageY]);
        }
        else {
            if (this.parentNode() !== ev.currentTarget.parentNode) {
                this.appendTo(ev.currentTarget.parentNode);
            }
            this.anchor(this.options.anchor, ev.currentTarget);
            this.updateTail();
        }
        return this;
    }

    /**
     * Position the tooltip tail
     * @return {Cuic.Tooltip}
     */
    updateTail() {
        let prop = {
            'margin-bottom': 0,
            'margin-left': 0,
            'margin-right': 0,
            'margin-top': 0,
            bottom: '',
            left: '',
            right: '',
            top: '',
        };

        // todo copy tooltip background color
        // prop['border-color'] = this.css('background-color');

        // Remove previous classes
        this.tail.removeClass('tooltip-tail-bottom tooltip-tail-left tooltip-tail-right tooltip-tail-top');

        // Top tail
        if (this.options.anchor.indexOf('bottom') !== -1) {
            this.tail.addClass('tooltip-tail-top');
            prop.top = -this.tail.outerHeight();
            prop['margin-left'] = -this.tail.outerWidth() / 2;
        }
        // Bottom tail
        if (this.options.anchor.indexOf('top') !== -1) {
            this.tail.addClass('tooltip-tail-bottom');
            prop.bottom = -this.tail.outerHeight();
            prop['margin-left'] = -this.tail.outerWidth() / 2;
        }
        // Right tail
        if (this.options.anchor.indexOf('left') !== -1) {
            this.tail.addClass('tooltip-tail-right');
            prop.right = -this.tail.outerWidth();
            prop['margin-top'] = -this.tail.outerHeight() / 2;
        }
        // Left tail
        if (this.options.anchor.indexOf('right') !== -1) {
            this.tail.addClass('tooltip-tail-left');
            prop.left = -this.tail.outerWidth();
            prop['margin-top'] = -this.tail.outerHeight() / 2;
        }

        // Apply CSS
        this.tail.css(prop);

        return this;
    }
};

Cuic.Tooltip.prototype.options = {
    anchor: 'right',
    attribute: 'title',
    className: 'tooltip',
    followPointer: true,
    namespace: 'tooltip',
    selector: '[title]',
    zIndex: 10
};
