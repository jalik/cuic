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

        if (options.element) {
            self.header = Cuic.element(self.find('.panel-header'));
            self.title = Cuic.element(self.find('.panel-title'));
            self.content = Cuic.element(self.find('.panel-content'));
            self.footer = Cuic.element(self.find('.panel-footer'));
            self.closeButton = Cuic.element(self.find('.panel-header .btn-close'));
        }
        else {
            // Add the header
            self.header = new Cuic.Element('header', {
                className: 'panel-header'
            }).prependTo(self);

            // Add the title
            self.title = new Cuic.Element('h5', {
                className: 'panel-title',
                html: options.title
            }).appendTo(self.header);

            // Add close button
            self.closeButton = new Cuic.Element('span', {
                className: 'btn-close glyphicon glyphicon-remove-sign',
                html: self.options.closeButton,
                role: 'button'
            }).appendTo(self.header);

            // Add the body
            self.content = new Cuic.Element('section', {
                className: 'panel-content',
                html: options.content
            }).appendTo(self);

            // Add the footer
            self.footer = new Cuic.Element('footer', {
                className: 'panel-footer',
                html: options.footer
            }).appendTo(self);

            // Hide the header if not used
            if (!options.title) {
                self.header.hide();
            }

            // Hide the footer if not used
            if (!options.footer) {
                self.footer.hide();
            }
        }

        // Set panel position
        let fixed = self.getParentElement() === document.body;
        self.css({position: fixed ? 'fixed' : 'absolute'});

        self.align(self.options.position);
        self.resizeContent();

        // To hide the panel in the container,
        // the container must have a hidden overflow
        Cuic.css(self.getParentElement(), {overflow: 'hidden'});

        // Set the panel visibility
        // Since the visible option is used to check if the panel is visible
        // we force the panel to show or hide by setting visible to the inverse value.
        if (self.options.visible) {
            self.open();
        } else {
            self.close();
        }

        // Maximize the panel
        if (self.options.maximized) {
            self.maximize();
        }

        if (self.closeButton) {
            if (self.options.closeable) {
                self.closeButton.show();
            } else {
                self.closeButton.hide();
            }
        }

        self.on('click', (ev) => {
            // Close button
            if (Cuic.hasClass(ev.target, 'btn-close')) {
                ev.preventDefault();
                self.close();
            }
            // Toggle button
            if (Cuic.hasClass(ev.target, 'btn-toggle')) {
                ev.preventDefault();
                self.toggle();
            }
        });

        // Close the panel when the user clicks outside of it
        Cuic.on('click', document, (ev) => {
            const elm = self.getElement();

            if (ev.target !== elm && !Cuic.isParent(elm, ev.target)) {
                if (self.options.autoClose) {
                    // self.close(); // todo find how to avoid closing when opening from exterior (eg: button)
                }
            }
        });
    }

    /**
     * Returns the content
     * @deprecated
     * @return {Cuic.Element}
     */
    getBody() {
        return this.content;
    }

    /**
     * Returns the content
     * @return {Cuic.Element}
     */
    getContent() {
        return this.content;
    }

    /**
     * Returns the footer
     * @return {Cuic.Element}
     */
    getFooter() {
        return this.footer;
    }

    /**
     * Returns the header
     * @return {Cuic.Element}
     */
    getHeader() {
        return this.header;
    }

    /**
     * Called when the panel is closing
     */
    onClose() {
        const height = this.outerHeight(true);
        const width = this.outerWidth(true);
        let prop = {};

        // Horizontal position
        if (Cuic.isPosition('left', this)) {
            prop.left = -width + 'px';
            prop.right = '';
        }
        else if (Cuic.isPosition('right', this)) {
            prop.right = -width + 'px';
            prop.left = '';
        }
        else {
            // todo center
        }

        // Vertical position
        if (Cuic.isPosition('bottom', this)) {
            prop.bottom = -height + 'px';
            prop.top = '';
        }
        else if (Cuic.isPosition('top', this)) {
            prop.top = -height + 'px';
            prop.bottom = '';
        }
        else {
            // todo center
        }

        // Hide panel
        this.css(prop);
    }

    /**
     * Called when the panel is minimized
     */
    onMinimize() {
        const elm = this.getElement();
        const parent = elm.parentNode;
        const clone = elm.cloneNode(true);
        Cuic.css(clone, {height: 'auto', width: 'auto'});

        // Calculate minimized size
        let prop = Cuic.calculateAlign(clone, this.options.position, parent);
        prop.height = Cuic.height(clone);
        prop.width = Cuic.width(clone);
        clone.remove();

        if (!this.isOpened()) {
            // Horizontal position
            if (Cuic.isPosition('left', this)) {
                prop.left = -this.outerWidth(true);
                prop.right = '';
            }
            else if (Cuic.isPosition('right', this)) {
                prop.right = -this.outerWidth(true);
                prop.left = '';
            }
            // Vertical position
            if (Cuic.isPosition('bottom', this)) {
                prop.bottom = -this.outerHeight(true);
                prop.top = '';
            }
            else if (Cuic.isPosition('top', this)) {
                prop.top = -this.outerHeight(true);
                prop.bottom = '';
            }
        }

        this.resizeContent();

        // Minimize panel
        this.css(prop);
    }

    /**
     * Called when the panel is opening
     */
    onOpen() {
        // Resize content
        this.resizeContent();
        // Recalculate position
        this.align(this.options.position);
    }

    //     // todo position panel when closed
    // const pos = Cuic.offset(self);

    // // Panel is hidden
    // if (pos.bottom < 0 || pos.left < 0 || pos.right < 0 || pos.top < 0) {
    //     const elm = self.getElement();
    //     let prop = Cuic.calculateAlign(elm, position);
    //
    //     // Horizontal position
    //     if (position.indexOf('left') !== -1) {
    //         prop.left = -self.outerWidth(true) + 'px';
    //         prop.right = '';
    //     } else if (position.indexOf('right') !== -1) {
    //         prop.right = -self.outerWidth(true) + 'px';
    //         prop.left = '';
    //     }
    //     // Vertical position
    //     if (position.indexOf('bottom') !== -1) {
    //         prop.bottom = -self.outerHeight(true) + 'px';
    //         prop.top = '';
    //     } else if (position.indexOf('top') !== -1) {
    //         prop.top = -self.outerHeight(true) + 'px';
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
    resizeContent() {
        const parent = this.getParentElement();
        const display = this.css('display');
        let maxHeight = window.innerHeight;

        // Use parent for max height
        if (parent && parent !== document.body) {
            maxHeight = Cuic.height(parent);
        }

        // Set panel max height
        const border = Cuic.border(this);
        const margin = Cuic.margin(this);
        maxHeight -= margin.vertical;
        maxHeight -= border.vertical;
        this.css({'max-height': maxHeight + 'px'});

        // Calculate content max height
        let contentMaxHeight = maxHeight;

        if (this.header instanceof Cuic.Element) {
            contentMaxHeight -= this.header.outerHeight(true);
        }
        if (this.footer instanceof Cuic.Element) {
            contentMaxHeight -= this.footer.outerHeight(true);
        }

        // Set content max height
        this.content.css({
            'max-height': contentMaxHeight + 'px',
            overflow: 'auto'
        });

        // Restore initial display state
        this.css({display: display});

        return this;
    }

    /**
     * Sets the title
     * @param html
     * @return {Cuic.Panel}
     */
    setTitle(html) {
        this.title.html(html);
        this.header.show();
        return this;
    }
};

Cuic.Panel.prototype.options = {
    autoClose: false,
    className: 'panel',
    closeable: true,
    closeButton: '',
    parent: null,
    content: null,
    css: null,
    footer: null,
    maximized: false,
    namespace: 'panel',
    position: 'left top',
    title: null,
    visible: false,
    zIndex: 1
};
