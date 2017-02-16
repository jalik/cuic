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
        const ns = Cuic.namespace('ui');
        const self = this;

        // Set default attributes
        attributes = Cuic.extend({}, attributes, options);

        // Set default options
        self.options = Cuic.extend({}, Cuic.Element.prototype.options, options);

        // Use existing element
        if (self.options.target) {
            self.element = Cuic.getElement(self.options.target);
        }
        // Create element
        else if (typeof node === 'string') {
            self.element = document.createElement(node);
        }
        else {
            throw new TypeError(`Cannot create component without node or target.`);
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
                }
            }
        }

        // Set element styles
        if (attributes.css) {
            self.css(self.options.css);
        }

        // Element is not in the DOM
        if (!self.element.parentNode) {
            // Put component in parent node
            if (self.options.parent instanceof HTMLElement) {
                self.appendTo(self.options.parent);

                // Place the component
                if (self.options.position) {
                    self.setPosition(self.options.position);
                }
            }
        }
    }

    /**
     * Adds the class
     * @param className
     * @return {Array}
     */
    addClass(className) {
        return Cuic.addClass(this.getElement(), className);
    }

    /**
     * Appends the element to the component
     * @param element
     * @return {Cuic.Component}
     */
    append(element) {
        if (element instanceof Cuic.Component) {
            element = element.getElement();
        }
        this.getElement().append(element);
        return this;
    }

    /**
     * Appends the component to the element
     * @param element
     * @return {Cuic.Component}
     */
    appendTo(element) {
        if (element instanceof Cuic.Component) {
            element = element.getElement();
        }
        element.append(this.getElement());
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
     * Disables the component
     */
    disable() {
        this.getElement().disabled = true;
        this.addClass('disabled');
    }

    /**
     * Enables the component
     */
    enable() {
        this.getElement().disabled = false;
        this.removeClass('disabled');
    }

    /**
     * Returns component CSS classes
     * @return {Array}
     */
    getClasses() {
        return Cuic.getClasses(this.getElement());
    }

    /**
     * Returns the component element
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
     * Checks if the component has the class
     * @param className
     * @return {boolean}
     */
    hasClass(className) {
        return Cuic.hasClass(this.getElement(), className);
    }

    /**
     * Returns the component height without margins and borders
     * @param element
     * @return {number}
     */
    height(element) {
        return Cuic.height(element);
    }

    /**
     * Hides the element
     */
    hide() {
        this.css({display: 'none'});
    }

    /**
     * Returns the component height including padding
     * @param element
     * @return {number}
     */
    innerHeight(element) {
        return Cuic.innerHeight(element);
    }

    /**
     * Returns the component width including padding
     * @param element
     * @return {number}
     */
    innerWidth(element) {
        return Cuic.innerWidth(element);
    }

    /**
     * Checks if the component is enabled
     * @return {boolean}
     */
    isEnabled() {
        return this.getElement().disabled !== true
            || !this.hasClass('disabled');
    }

    /**
     * Remove the callback attached to the event
     * @param event
     * @param callback
     */
    off(event, callback) {
        Cuic.off(event, this.getElement(), callback);
    }

    /**
     * Executes the callback each time the event is triggered
     * @param event
     * @param callback
     */
    on(event, callback) {
        Cuic.on(event, this.getElement(), callback);
    }

    /**
     * Executes the callback once when the event is triggered
     * @param event
     * @param callback
     */
    once(event, callback) {
        Cuic.once(event, this.getElement(), callback);
    }

    /**
     * Called when the component is removed from the DOM
     */
    onRemove() {
    }

    /**
     * Returns the component height including padding, borders and eventually margin
     * @param element
     * @param includeMargin
     * @return {number}
     */
    outerHeight(element, includeMargin) {
        return Cuic.outerHeight(element, includeMargin);
    }

    /**
     * Returns the component width including padding, borders and eventually margin
     * @param element
     * @param includeMargin
     * @return {number}
     */
    outerWidth(element, includeMargin) {
        return Cuic.outerWidth(element, includeMargin);
    }

    /**
     * Prepends the element to the component
     * @param element
     * @return {Cuic.Component}
     */
    prepend(element) {
        if (element instanceof Cuic.Component) {
            element = element.getElement();
        }
        this.getElement().prepend(element);
        return this;
    }

    /**
     * Prepends the component to the element
     * @param element
     * @return {Cuic.Component}
     */
    prependTo(element) {
        if (element instanceof Cuic.Component) {
            element = element.getElement();
        }
        element.prepend(this.getElement());
        return this;
    }

    /**
     * Removes the element from the DOM
     */
    remove() {
        this.onRemove();
        this.getElement().remove();
    }

    /**
     * Removes the class from the component
     * @param className
     * @return {*}
     */
    removeClass(className) {
        return Cuic.removeClass(this.getElement(), className);
    }

    /**
     * Sets the content
     * @param html
     * @deprecated
     */
    setContent(html) {
        this.setHtml(html);
    };

    /**
     * Sets content HTML
     * @param html
     */
    setHtml(html) {
        this.getElement().innerHTML = html;
    }

    /**
     * Sets the position of the dialog and optionally its container
     * @param position
     */
    setPosition(position) {
        Cuic.position(this.getElement(), position);
        this.options.position = position;
    }

    /**
     * Sets content text
     * @param text
     */
    setText(text) {
        this.getElement().innerText = text;
    }

    /**
     * Shows the element
     */
    show() {
        this.css({display: ''});
    }

    /**
     * Returns the component width
     * @param element
     * @return {number}
     */
    width(element) {
        return Cuic.width(element);
    }
};

Cuic.Element.prototype.options = {
    className: null,
    css: null,
    parent: null,
    position: null
};