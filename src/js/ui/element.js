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
        attributes = Cuic.extend({}, attributes);

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

                // Do not override classes
                if (attr === 'className') {
                    self.addClass(value);
                    continue;
                }
                // Apply CSS styles
                if (attr === 'css') {
                    self.css(value);
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

        // Define Z-Index
        if (typeof self.options.zIndex === 'number') {
            self.css({'z-index': parseInt(self.options.zIndex)});
        }

        // Set element styles
        if (self.options.css) {
            self.css(self.options.css);
        }

        // Add debug class
        if (self.options.debug) {
            self.addClass('debug');
        }

        // Add default events
        self.events = new Cuic.Events(this);

        // Called when element is aligned
        self.events.on('aligned', () => {
            this.addPositionClass(this.options.position, self.options.namespace);
        });

        // Called when element is anchored
        self.events.on('anchored', () => {
            this.addPositionClass(this.options.anchor, self.options.namespace);
        });

        // Append element to parent node
        if (self.options.parent instanceof HTMLElement) {
            self.appendTo(self.options.parent);
        }

        // Position the element
        if (self.options.position && self.element.parentNode) {
            self.align(self.options.position);
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
     * Adds position class
     * @param position
     * @param prefix
     * @return {Cuic.Element}
     */
    addPositionClass(position, prefix) {
        const pfx = (str) => {
            return prefix ? prefix + '-' + str : str;
        };

        // Remove previous classes
        this.removeClass([
            pfx('bottom'),
            pfx('left'),
            pfx('right'),
            pfx('top')
        ].join(' '));

        // Add dialog position class
        if (position.indexOf('bottom') !== -1) {
            this.addClass(pfx('bottom'));
        }
        else if (position.indexOf('top') !== -1) {
            this.addClass(pfx('top'));
        }
        if (position.indexOf('left') !== -1) {
            this.addClass(pfx('left'));
        }
        else if (position.indexOf('right') !== -1) {
            this.addClass(pfx('right'));
        }
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
        this.events.trigger('aligned', position);
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
        this.events.trigger('anchored', position);
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
     * Sets or returns the element attribute
     * @param name
     * @param value
     * @return {*}
     */
    attr(name, value) {
        if (value !== undefined) {
            if (name in this.getElement()) {
                this.getElement()[name] = value;
            }
        } else {
            return this.getElement()[name];
        }
    }

    /**
     * Returns element border widths
     * @return {*|{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
     */
    border() {
        return Cuic.border(this);
    }

    /**
     * Returns element child nodes
     * @return {Array}
     */
    children() {
        let children = [];
        let nodes = this.getElement().children || this.getElement().childNodes;

        for (let i = 0; i < nodes.length; i += 1) {
            if (nodes[i] instanceof HTMLElement) {
                children.push(nodes[i]);
            }
        }
        return children;
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
     * Sets or returns the element data
     * @param key
     * @param value
     * @return {*}
     */
    data(key, value) {
        const dataSet = this.getElement().dataset;

        if (value !== undefined) {
            dataSet[Cuic.toCamelCase(key)] = value;
        }
        else if (key) {
            return dataSet[key];
        }
        else {
            return dataSet;
        }
    }

    /**
     * Disables the element
     * @return {Cuic.Element}
     */
    disable() {
        this.getElement().disabled = true;
        this.addClass('disabled');
        this.events.trigger('disabled');
        return this;
    }

    /**
     * Enables the element
     * @return {Cuic.Element}
     */
    enable() {
        this.getElement().disabled = false;
        this.removeClass('disabled');
        this.events.trigger('enabled');
        return this;
    }

    /**
     * Returns the first element that matches the selector
     * @param selector
     * @return {*}
     */
    find(selector) {
        return Cuic.element(this.getElement().querySelector(selector));
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
        this.events.trigger('hidden');
        return this;
    }

    /**
     * Sets HTML content
     * @param html
     * @return {Cuic.Element|string}
     */
    html(html) {
        if (html) {
            this.getElement().innerHTML = html;
            return this;
        } else {
            return this.getElement().innerHTML;
        }
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
        element = Cuic.getElement(element);
        const parent = this.getElement().parentNode;
        parent.insertBefore(element, this.getElement().nextSibling);
        return this;
    }

    /**
     * Inserts an element before
     * @param element
     * @return {Cuic.Element}
     */
    insertBefore(element) {
        element = Cuic.getElement(element);
        const parent = this.getElement().parentNode;
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
     * Returns element margin
     * @return {*|{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
     */
    margin() {
        return Cuic.margin(this);
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
     * Adds a listener on "removed" event
     * @param callback
     */
    onRemoved(callback) {
        this.events.on('removed', callback);
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
     * Returns element padding
     * @return {*|{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
     */
    padding() {
        return Cuic.padding(this);
    }

    /**
     * Returns the parent element
     * @return {*|Cuic.Element}
     */
    parent() {
        let parent = this.getElement().parentNode;
        return parent ? Cuic.element(parent) : parent;
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
        this.getElement().remove();
        this.events.trigger('removed');
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
        this.events.trigger('showed'); // todo choose event name
        return this;
    }

    /**
     * Returns or sets element value
     * @param value
     * @return {Cuic.Element|*}
     */
    val(value) {
        if (value !== undefined) {
            this.getElement().value = value;
            return this;
        } else {
            return this.getElement().value;
        }
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
    namespace: 'cuic',
    parent: null
};
