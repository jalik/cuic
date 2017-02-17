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

Cuic.Element = class {

    constructor(node, attributes, options) {
        const self = this;

        // Set default attributes
        attributes = Cuic.extend({}, attributes, options);

        // Set default options
        self.options = Cuic.extend({}, Cuic.Element.prototype.options, options);

        // Use existing element
        if (self.options.element) {
            self.element = Cuic.getElement(self.options.element);
        }
        // Create element
        else if (typeof node === 'string') {
            self.element = document.createElement(node);
        }
        // Use HTML element
        else if (node instanceof HTMLElement) {
            self.element = node;
        }
        // Use Cuic element
        else if (node instanceof Cuic.Element) {
            self.element = node.getElement();
        }
        // Use jQuery element
        else if (node instanceof jQuery) {
            self.element = node.get(0);
        }
        else {
            throw new TypeError(`Cannot create element.`);
        }

        // Get parent element
        if (self.options.parent) {
            self.options.parent = Cuic.getElement(self.options.parent);
        }

        // Set element attributes
        for (let attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                const value = attributes[attr];

                // Do not override existing classes
                if (attr === 'className') {
                    self.addClass(value);
                    continue;
                }

                if (value !== null && value !== undefined) {
                    if (self.element[attr] !== undefined) {
                        self.element[attr] = value;
                    }
                    else if (attr === 'html') {
                        self.element.innerHTML = value;
                    }
                    else if (attr === 'text') {
                        self.element.innerText = value;
                    }
                    else if (attr === 'zIndex') {
                        self.css({'z-index': parseInt(value)});
                    }
                }
            }
        }

        // Set element styles
        if (attributes.css) {
            self.css(attributes.css);
        }

        // Element is not in the DOM
        if (!self.element.parentNode) {
            // Put element in parent node
            if (self.options.parent instanceof HTMLElement) {
                self.appendTo(self.options.parent);

                // Position the element
                if (self.options.position) {
                    self.align(self.options.position);
                }
            }
        }
    }

    /**
     * Adds the class
     * @param className
     * @return {Cuic.Element}
     */
    addClass(className) {
        Cuic.addClass(this.getElement(), className);
        return this;
    }

    /**
     * Sets the position of the element inside its parent
     * @param position
     * @return {Cuic.Element}
     */
    align(position) {
        Cuic.align(this.getElement(), position);
        this.options.position = position;
        return this;
    }

    /**
     * Sets the position of the element toward another element
     * @param position
     * @param target
     * @return {Cuic.Element}
     */
    anchor(position, target) {
        target = target || this.options.target;
        Cuic.anchor(this.getElement(), position, target);
        this.options.anchor = position;
        this.options.target = target;
        return this;
    }

    /**
     * Appends the element
     * @param element
     * @return {Cuic.Element}
     */
    append(element) {
        this.getElement().append(Cuic.getElement(element));
        return this;
    }

    /**
     * Appends to the element
     * @param element
     * @return {Cuic.Element}
     */
    appendTo(element) {
        Cuic.getElement(element).append(this.getElement());
        return this;
    }

    /**
     * Set styles
     * @param styles
     * @return {*}
     */
    css(styles) {
        return Cuic.css(this.getElement(), styles);
    }

    /**
     * Disables the element
     * @return {Cuic.Element}
     */
    disable() {
        this.getElement().disabled = true;
        this.addClass('disabled');
        return this;
    }

    /**
     * Enables the element
     * @return {Cuic.Element}
     */
    enable() {
        this.getElement().disabled = false;
        this.removeClass('disabled');
        return this;
    }

    /**
     * Returns the first element that matches the selector
     * @param selector
     * @return {*}
     */
    find(selector) {
        return this.getElement().querySelector(selector);
    }

    /**
     * Returns all elements that match the selector
     * @param selector
     * @return {*}
     */
    findAll(selector) {
        return this.getElement().querySelectorAll(selector);
    }

    /**
     * Returns element CSS classes
     * @return {Array}
     */
    getClasses() {
        return Cuic.getClasses(this.getElement());
    }

    /**
     * Returns the HTML element
     * @return {HTMLElement}
     */
    getElement() {
        return this.element;
    }

    /**
     * Returns the parent of the element
     * @return {HTMLElement}
     */
    getParentElement() {
        return this.getElement().parentNode;
    }

    /**
     * Checks if the element has the class
     * @param className
     * @return {boolean}
     */
    hasClass(className) {
        return Cuic.hasClass(this.getElement(), className);
    }

    /**
     * Returns the element height without margins and borders
     * @return {number}
     */
    height() {
        return Cuic.height(this);
    }

    /**
     * Hides the element
     * @return {Cuic.Element}
     */
    hide() {
        this.css({display: 'none'});
        return this;
    }

    /**
     * Returns the element height including padding
     * @return {number}
     */
    innerHeight() {
        return Cuic.innerHeight(this);
    }

    /**
     * Returns the element width including padding
     * @return {number}
     */
    innerWidth() {
        return Cuic.innerWidth(this);
    }

    /**
     * Inserts an element after
     * @param element
     * @return {Cuic.Element}
     */
    insertAfter(element) {
        const parent = this.getParentElement();
        parent.insertBefore(element, this.getElement().nextSibling);
        return this;
    }

    /**
     * Inserts an element before
     * @param element
     * @return {Cuic.Element}
     */
    insertBefore(element) {
        const parent = this.getParentElement();
        parent.insertBefore(element, this.getElement());
        return this;
    }

    /**
     * Checks if the element is enabled
     * @return {boolean}
     */
    isEnabled() {
        return this.getElement().disabled !== true
            || !this.hasClass('disabled');
    }

    /**
     * Checks if the element is removed from the DOM
     * @return {boolean}
     */
    isRemoved() {
        const parent = this.getElement().parentNode;
        return parent === null || parent === undefined;
    }

    /**
     * Remove the callback attached to the event
     * @param event
     * @param callback
     * @return {Cuic.Element}
     */
    off(event, callback) {
        Cuic.off(event, this.getElement(), callback);
        return this;
    }

    /**
     * Returns the element offset
     * @return {*|{left: Number, top: Number}}
     */
    offset() {
        return Cuic.offset(this.getElement());
    }

    /**
     * Executes the callback each time the event is triggered
     * @param event
     * @param callback
     * @return {Cuic.Element}
     */
    on(event, callback) {
        Cuic.on(event, this.getElement(), callback);
        return this;
    }

    /**
     * Executes the callback once when the event is triggered
     * @param event
     * @param callback
     * @return {Cuic.Element}
     */
    once(event, callback) {
        Cuic.once(event, this.getElement(), callback);
        return this;
    }

    /**
     * Called when the element is removed from the DOM
     */
    onRemove() {
    }

    /**
     * Returns the element height including padding, borders and eventually margin
     * @param includeMargin
     * @return {number}
     */
    outerHeight(includeMargin) {
        return Cuic.outerHeight(this, includeMargin);
    }

    /**
     * Returns the element width including padding, borders and eventually margin
     * @param includeMargin
     * @return {number}
     */
    outerWidth(includeMargin) {
        return Cuic.outerWidth(this, includeMargin);
    }

    /**
     * Returns the element position
     * @return {*|{bottom: Number, left: Number, right: Number, top: Number}}
     */
    position() {
        return Cuic.position(this.getElement());
    }

    /**
     * Prepends the element
     * @param element
     * @return {Cuic.Element}
     */
    prepend(element) {
        this.getElement().prepend(Cuic.getElement(element));
        return this;
    }

    /**
     * Prepends to the element
     * @param element
     * @return {Cuic.Element}
     */
    prependTo(element) {
        Cuic.getElement(element).prepend(this.getElement());
        return this;
    }

    /**
     * Removes the element from the DOM
     * @return {Cuic.Element}
     */
    remove() {
        this.onRemove();
        this.getElement().remove();
        return this;
    }

    /**
     * Removes classes from the element
     * @param className
     * @return {Cuic.Element}
     */
    removeClass(className) {
        Cuic.removeClass(this.getElement(), className);
        return this;
    }

    /**
     * Sets the content
     * @param html
     * @deprecated
     * @return {Cuic.Element}
     */
    setContent(html) {
        this.setHtml(html);
        return this;
    };

    /**
     * Sets content HTML
     * @param html
     * @return {Cuic.Element}
     */
    setHtml(html) {
        this.getElement().innerHTML = html;
        return this;
    }

    /**
     * Sets content text
     * @param text
     * @return {Cuic.Element}
     */
    setText(text) {
        this.getElement().innerText = text;
        return this;
    }

    /**
     * Shows the element
     * @return {Cuic.Element}
     */
    show() {
        this.css({display: ''});
        return this;
    }

    /**
     * Returns the element width
     * @return {number}
     */
    width() {
        return Cuic.width(this);
    }
};

Cuic.Element.prototype.options = {
    className: null,
    css: null,
    namespace: 'cuic',
    parent: null,
    position: null
};
