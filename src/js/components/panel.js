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
        options = $.extend({}, Cuic.Panel.prototype.options, options);

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
         * Called when the panel is minimized
         */
        self.onMinimize = () => {
            const elm = self.getElement();

            // Clone panel
            let $clone = $(elm.cloneNode(true));
            $clone.css({height: 'auto', width: 'auto'});

            // Calculate minimized size
            let prop = Cuic.calculatePosition($clone, self.options.position);
            prop.height = $clone.outerHeight();
            prop.width = $clone.outerWidth();
            $clone.remove();

            if (!self.isOpened()) {
                // Horizontal position
                if (Cuic.isPosition('left', elm)) {
                    prop.left = -$(elm).outerWidth(true);
                    prop.right = '';
                } else if (Cuic.isPosition('right', elm)) {
                    prop.right = -$(elm).outerWidth(true);
                    prop.left = '';
                }
                // Vertical position
                if (Cuic.isPosition('bottom', elm)) {
                    prop.bottom = -$(elm).outerHeight(true);
                    prop.top = '';
                } else if (Cuic.isPosition('top', elm)) {
                    prop.top = -$(elm).outerHeight(true);
                    prop.bottom = '';
                }
            }

            // Minimize panel
            self.css(prop);
        };

        /**
         * Called when the panel is closing
         */
        self.onClose = () => {
            let prop = {};
            const elm = self.getElement();
            const $elm = $(elm);

            // Horizontal position
            if (Cuic.isPosition('left', elm)) {
                prop.left = -$elm.outerWidth(true) + 'px';
                prop.right = '';
            } else if (Cuic.isPosition('right', elm)) {
                prop.right = -$elm.outerWidth(true) + 'px';
                prop.left = '';
            }

            // Vertical position
            if (Cuic.isPosition('bottom', elm)) {
                prop.bottom = -$elm.outerHeight(true) + 'px';
                prop.top = '';
            } else if (Cuic.isPosition('top', elm)) {
                prop.top = -$elm.outerHeight(true) + 'px';
                prop.bottom = '';
            }

            // Hide panel
            self.css(prop);
        };

        /**
         * Called when the panel is maximizing
         */
        self.onMaximize = () => {
            console.log('maximize');
        };

        /**
         * Called when the panel is maximized
         */
        self.onMaximized = () => {
            console.log('maximized');
        };

        /**
         * Called when the panel is maximized
         */
        self.onMinimized = () => {
            console.log('minimized');
        };

        /**
         * Called when the panel is opening
         */
        self.onOpen = () => {
            // Resize content
            self.resizeContent();

            // todo position panel when it's closed
            // let prop = Cuic.calculatePosition(elm, position);
            //
            // // Horizontal position
            // if (position.indexOf('left') !== -1) {
            //     prop.left = -$(elm).outerWidth(true) + 'px';
            //     prop.right = '';
            // } else if (position.indexOf('right') !== -1) {
            //     prop.right = -$(elm).outerWidth(true) + 'px';
            //     prop.left = '';
            // }
            // // Vertical position
            // if (position.indexOf('bottom') !== -1) {
            //     prop.bottom = -$(elm).outerHeight(true) + 'px';
            //     prop.top = '';
            // } else if (position.indexOf('top') !== -1) {
            //     prop.top = -$(elm).outerHeight(true) + 'px';
            //     prop.bottom = '';
            // }
            //
            // console.log('position:', prop);
            //
            // self.css(prop);
            // self.options.position = position;

            // Recalculate position
            self.setPosition(self.options.position);
        };

        /**
         * Resizes the content
         * @return {Cuic.Panel}
         */
        self.resizeContent = () => {
            const elm = self.getElement();
            const parent = self.getParentElement();
            const display = elm.style.display;
            let panelMaxHeight = window.innerHeight;

            // Use container for max height
            if (parent && parent !== document.body) {
                panelMaxHeight = $(parent).height();
            }

            // Set panel max height
            panelMaxHeight -= $(elm).outerHeight(true) - $(elm).height();
            self.css({'max-height': panelMaxHeight});

            // Set content max height
            let contentMaxHeight = panelMaxHeight;

            if ($header) {
                contentMaxHeight -= $header.outerHeight(true);
            }
            if ($footer) {
                contentMaxHeight -= $footer.outerHeight(true);
            }

            $content.css({
                maxHeight: contentMaxHeight,
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

        // // Find the close button
        // self.getElement().find('.close-panel').off(ns('click')).on(ns('click'), self.close);
        //
        // // Find the toggle button
        // self.getElement().find('.toggle-panel').off(ns('click')).on(ns('click'), self.toggle);

        // Close the panel when the user clicks outside of it
        // $(document).off(ns('mousedown')).on(ns('mousedown'), function (ev) {
        //     let target = $(ev.target);
        //
        //     if (target !== self.getElement() && target.closest(self.getElement()).length === 0) {
        //         if (self.options.autoClose && self.isOpened()) {
        //             self.close();
        //         }
        //     }
        // });
    }
};

/**
 *
 }Default options
 * @type {*}
 */
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
