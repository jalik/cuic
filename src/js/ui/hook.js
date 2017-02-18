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

Cuic.Hook = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Hook.prototype.options, options);

        // Create element
        super('div', {className: options.className}, options);

        const self = this;

        // This is a fix to avoid offsetTop > 0
        self.css({
            position: 'relative',
            top: '',
            width: ''
        });

        // Create the spacer item that will replace
        // the bar when it is scrolled
        self.space = new Cuic.Element('div', {
            className: 'hook-space'
        });

        // Get the element's offset
        let offset = self.offset();

        const onScroll = () => {
            let fitsInScreen = self.outerHeight(true) <= window.screen.availHeight;

            if (fitsInScreen) {
                if (self.options.fixed) {
                    self.hook();
                }
                else {
                    let margin = Cuic.margin(self);

                    if (window.scrollY > offset.top - margin.top) {
                        self.hook();
                    } else {
                        self.unhook();
                    }
                }
            } else {
                self.unhook();
            }
        };

        // If the window is scrolled when reloading the page,
        // the bar must be shown
        onScroll();

        window.onscroll = () => {
            onScroll();
        };
        window.onresize = () => {
            onScroll();
        };
    }

    /**
     * Hooks the element
     */
    hook() {
        const self = this;
        console.log('hook')

        if (self.css('position') !== 'fixed') {
            const offset = self.offset();
            const margin = Cuic.margin(self);

            if (self.options.fixed) {
                self.options.offsetTop = offset.top;
            }

            // Replace element with invisible space
            self.space.css({
                display: self.css('display'),
                float: self.css('float'),
                height: self.outerHeight() + 'px',
                width: self.outerWidth() + 'px',
                'margin-bottom': margin.bottom + 'px',
                'margin-left': margin.left + 'px',
                'margin-right': margin.right + 'px',
                'margin-top': margin.top + 'px'
            });
            self.insertBefore(self.space);
            self.space.show();

            // Make element scroll
            self.css({
                position: 'fixed',
                left: offset.left + 'px',
                top: self.options.offsetTop + 'px',
                height: self.space.height() + 'px',
                width: self.space.width() + 'px',
                zIndex: self.options.zIndex
            });
            self.addClass('hooked');

            // Execute the hooked listener
            self.onHook(self);
        }
        // else if (self.space) {
        //     const offset = self.space.offset();
        //     self.css({
        //         left: offset.left,
        //         width: self.space.width()
        //     });
        // }
    }

    /**
     * Checks if the element is hooked
     * @return {*|boolean}
     */
    isHooked() {
        return this.hasClass('hooked');
    }

    onHook() {
    }

    onUnhook() {
    }

    /**
     * Unhooks the element
     */
    unhook() {
        const self = this;
        console.log('unhook')

        if (self.css('position') !== 'relative') {
            self.space.hide();
            self.css({
                position: 'relative',
                bottom: '',
                left: '',
                right: '',
                top: '',
                width: ''
            });
            self.removeClass('hooked');

            // Execute the unhooked listener
            self.onUnhook(self);
        }
    }
};

Cuic.Hook.prototype.options = {
    fixed: true,
    hookedClass: 'hooked',
    // offsetBottom: 0,
    // offsetLeft: 0,
    // offsetRight: 0,
    // offsetTop: 0,
    zIndex: 4
};
