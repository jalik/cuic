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

Cuic.Panel = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Panel.prototype.options, options);

        // Create element
        super('div', {
            className: options.className
        }, options);

        const self = this;

        let $content;
        let $footer;
        let $header;
        let $title;

        // Define attributes
        self.closeButton = options.closeButton;

        /**
         * Returns the content
         * @deprecated
         * @return {jQuery}
         */
        self.getBody = () => {
            return $content;
        };

        /**
         * Returns the content
         * @return {jQuery}
         */
        self.getContent = () => {
            return $content;
        };

        /**
         * Returns the footer
         * @return {jQuery}
         */
        self.getFooter = () => {
            return $footer;
        };

        /**
         * Returns the header
         * @return {jQuery}
         */
        self.getHeader = () => {
            return $header;
        };

        /**
         * Called when the panel is closing
         */
        self.onClose = () => {
            const elm = self.getElement();
            const height = Cuic.outerHeight(elm, true);
            const width = Cuic.outerWidth(elm, true);
            let prop = {};

            // Horizontal position
            if (Cuic.isPosition('left', elm)) {
                prop.left = -width + 'px';
                prop.right = '';
            }
            else if (Cuic.isPosition('right', elm)) {
                prop.right = -width + 'px';
                prop.left = '';
            }
            else {
                // todo center
            }

            // Vertical position
            if (Cuic.isPosition('bottom', elm)) {
                prop.bottom = -height + 'px';
                prop.top = '';
            }
            else if (Cuic.isPosition('top', elm)) {
                prop.top = -height + 'px';
                prop.bottom = '';
            }
            else {
                // todo center
            }

            // Hide panel
            self.css(prop);
        };

        /**
         * Called when the panel is minimized
         */
        self.onMinimize = () => {
            const elm = self.getElement();
            const parent = elm.parentNode;
            const clone = elm.cloneNode(true);
            Cuic.css(clone, {height: 'auto', width: 'auto'});

            // Calculate minimized size
            let prop = Cuic.calculatePosition(clone, self.options.position, parent);
            prop.height = Cuic.height(clone);
            prop.width = Cuic.width(clone);
            clone.remove();

            if (!self.isOpened()) {
                // Horizontal position
                if (Cuic.isPosition('left', elm)) {
                    prop.left = -Cuic.outerWidth(elm, true);
                    prop.right = '';
                }
                else if (Cuic.isPosition('right', elm)) {
                    prop.right = -Cuic.outerWidth(elm, true);
                    prop.left = '';
                }
                // Vertical position
                if (Cuic.isPosition('bottom', elm)) {
                    prop.bottom = -Cuic.outerHeight(elm, true);
                    prop.top = '';
                }
                else if (Cuic.isPosition('top', elm)) {
                    prop.top = -Cuic.outerHeight(elm, true);
                    prop.bottom = '';
                }
            }

            self.resizeContent();

            // Minimize panel
            self.css(prop);
        };

        /**
         * Called when the panel is opening
         */
        self.onOpen = () => {
            // Resize content
            self.resizeContent();
            // Recalculate position
            self.setPosition(self.options.position);
        };

        //     // todo position panel when closed
        // const pos = Cuic.offset(self);

        // // Panel is hidden
        // if (pos.bottom < 0 || pos.left < 0 || pos.right < 0 || pos.top < 0) {
        //     const elm = self.getElement();
        //     let prop = Cuic.calculatePosition(elm, position);
        //
        //     // Horizontal position
        //     if (position.indexOf('left') !== -1) {
        //         prop.left = -$(elm).outerWidth(true) + 'px';
        //         prop.right = '';
        //     } else if (position.indexOf('right') !== -1) {
        //         prop.right = -$(elm).outerWidth(true) + 'px';
        //         prop.left = '';
        //     }
        //     // Vertical position
        //     if (position.indexOf('bottom') !== -1) {
        //         prop.bottom = -$(elm).outerHeight(true) + 'px';
        //         prop.top = '';
        //     } else if (position.indexOf('top') !== -1) {
        //         prop.top = -$(elm).outerHeight(true) + 'px';
        //         prop.bottom = '';
        //     }
        //
        //     self.css(prop);
        //     self.options.position = position;
        // }

        /**
         * Resizes the content
         * @return {Cuic.Panel}
         */
        self.resizeContent = () => {
            const elm = self.getElement();
            const parent = self.getParentElement();
            const display = elm.style.display;
            let maxHeight = window.innerHeight;

            // Use parent for max height
            if (parent && parent !== document.body) {
                maxHeight = Cuic.height(parent);
            }

            // Set panel max height
            const border = Cuic.border(elm);
            const margin = Cuic.margin(elm);
            maxHeight -= margin.vertical;
            maxHeight -= border.vertical;
            self.css({'max-height': maxHeight + 'px'});

            // Set content max height
            let contentMaxHeight = maxHeight;

            if ($header) {
                contentMaxHeight -= Cuic.outerHeight($header, true);
            }
            if ($footer) {
                contentMaxHeight -= Cuic.outerHeight($footer, true);
            }

            Cuic.css($content, {
                'max-height': contentMaxHeight + 'px',
                overflow: 'auto'
            });

            // Restore initial display state
            self.css({display: display});

            return self;
        };

        /**
         * Sets the title
         * @param html
         * @return {Cuic.Panel}
         */
        self.setTitle = function (html) {
            $title.html(html);
            return self;
        };

        if (options.target) {
            // Find panel parts
            $header = $(self.getElement()).find('.panel-header');
            $title = $(self.getElement()).find('.panel-title');
            $content = $(self.getElement()).find('.panel-content');
            $footer = $(self.getElement()).find('.panel-footer');
        }
        else {
            // Add the header
            $header = $('<header>', {
                'class': 'panel-header'
            }).appendTo(self.getElement());

            // Add the title
            $title = $('<h5>', {
                'class': 'panel-title',
                html: options.title
            }).appendTo($header);

            // Add the body
            $content = $('<section>', {
                'class': 'panel-content',
                html: options.content
            }).appendTo(self.getElement());

            // Add the footer
            $footer = $('<footer>', {
                'class': 'panel-footer',
                html: options.footer
            }).appendTo(self.getElement());

            // Hide the header if not used
            if (!options.title) {
                $header.hide();
            }

            // Hide the footer if not used
            if (!options.footer) {
                $footer.hide();
            }
        }

        // Set panel position
        let fixed = self.getParentElement() === document.body;
        self.css({position: fixed ? 'fixed' : 'absolute'});

        self.setPosition(self.options.position);
        self.resizeContent();

        // To hide the panel in the container,
        // the container must have a hidden overflow
        Cuic.css(self.getParentElement(), {overflow: 'hidden'});

        // Set the panel visibility
        // Since the visible option is used to check if the panel is visible
        // we force the panel to show or hide by setting visible to the inverse value.
        if (options.visible) {
            self.open();
        } else {
            self.close();
        }

        // Maximize the panel
        if (options.maximized) {
            self.maximize();
        }

        // Add the close button
        if (self.options.closeable) {
            $('<span>', {
                class: 'close-panel',
                html: self.closeButton
            }).prependTo($header);
        }

        // Close button
        Cuic.on('click', self.getElement(), (ev) => {
            if (Cuic.hasClass(ev.target, 'close-panel')) {
                ev.preventDefault();
                self.close();
            }
        });

        // Toggle button
        Cuic.on('click', self.getElement(), (ev) => {
            if (Cuic.hasClass(ev.target, 'toggle-panel')) {
                ev.preventDefault();
                self.toggle();
            }
        });

        // Close the panel when the user clicks outside of it
        Cuic.on('click', document.body, (ev) => {
            const elm = self.getElement();

            if (ev.target !== elm && Cuic.isParent(elm, ev.target)) {
                if (self.options.autoClose) {
                    self.close();
                }
            }
        });
    }
};

Cuic.Panel.prototype.options = {
    autoClose: false,
    className: 'panel',
    closeable: true,
    closeButton: '×',
    parent: null,
    content: null,
    css: null,
    footer: null,
    maximized: false,
    position: 'left top',
    title: null,
    visible: false,
    zIndex: 1
};
