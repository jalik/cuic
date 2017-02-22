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
        // Set default attributes
        attributes = Cuic.extend({}, attributes);

        // Set default options
        this.options = Cuic.extend({}, Cuic.Element.prototype.options, options);

        // Use existing node
        if (this.options.element) {
            this.element = Cuic.node(this.options.element);
        }
        // Create node
        else if (typeof node === 'string') {
            this.element = document.createElement(node);
        }
        // Use HTML node
        else if (node instanceof HTMLElement || node instanceof HTMLDocument || node === window) {
            this.element = node;
        }
        // Use node from Cuic.Element
        else if (node instanceof Cuic.Element) {
            this.element = node.node();
        }
        // Use the first node of a Cuic.Elements object
        else if (node instanceof Cuic.Elements) {
            this.element = node.get(0);
        }
        // Use the first node of a jQuery object
        else if (node instanceof jQuery) {
            this.element = node.get(0);
        }
        else {
            console.log(node);
            throw new TypeError(`Cannot create element using given node.`);
        }

        // Set element attributes
        for (let attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                const value = attributes[attr];

                // Do not override classes
                if (attr === 'className') {
                    this.addClass(value);
                    continue;
                }
                // Apply CSS styles
                if (attr === 'css') {
                    this.css(value);
                    continue;
                }

                if (value !== null && value !== undefined) {
                    if (this.element[attr] !== undefined) {
                        this.element[attr] = value;
                    }
                    else if (attr === 'html') {
                        this.html(value);
                    }
                    else if (attr === 'text') {
                        this.text(value);
                    }
                }
            }
        }

        // Define Z-Index
        if (typeof this.options.zIndex === 'number') {
            this.css({'z-index': parseInt(this.options.zIndex)});
        }

        // Set element styles
        if (this.options.css) {
            this.css(this.options.css);
        }

        // Add debug class
        if (this.options.debug) {
            this.addClass('debug');
        }

        // Add default events
        this.events = new Cuic.Events(this);

        // Called when element is aligned
        this.events.on('aligned', () => {
            this.addPositionClass(this.options.position, this.options.namespace);
        });

        // Called when element is anchored
        this.events.on('anchored', () => {
            this.addPositionClass(this.options.anchor, this.options.namespace);
        });

        // Get parent element
        if (this.options.parent) {
            let parent = null;

            // Find element in DOM
            if (typeof this.options.parent === 'string') {
                const el = Cuic.find(this.options.parent);

                if (el.length) {
                    parent = el[0];
                }
            } else {
                parent = Cuic.node(this.options.parent);
            }

            // Append element to parent node
            if (parent) {
                this.appendTo(parent);
            }
        }

        // Position the element
        if (this.options.position && this.element.parentNode) {
            this.align(this.options.position);
        }
    }

    /**
     * Adds the class
     * @param className
     * @return {Cuic.Element}
     */
    addClass(className) {
        let classes = this.getClasses();
        const target = (className || '').split(' ');

        for (let i = 0; i < target.length; i += 1) {
            // Check if class is already assigned
            if (classes.indexOf(target[i]) === -1) {
                classes.push(target[i]);
            }
        }
        this.node().className = classes.join(' ');
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
        this.css(Cuic.calculateAlign(this, position));
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
        target = Cuic.element(target || this.options.target);
        this.css(Cuic.calculateAnchor(this, position, target));
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
        this.node().append(Cuic.node(element));
        return this;
    }

    /**
     * Appends to the element
     * @param element
     * @return {Cuic.Element}
     */
    appendTo(element) {
        Cuic.node(element).append(this.node());
        return this;
    }

    /**
     * Sets or returns the element attribute
     * @param name
     * @param value
     * @return {Cuic.Element|*}
     */
    attr(name, value) {
        const node = this.node();

        if (value !== undefined) {
            if (name in node) {
                node[name] = value;
            }
            return this;
        } else {
            return node[name];
        }
    }

    /**
     * Auto align element in its parent
     * @return {Cuic.Element}
     */
    autoAlign() {
        const available = Cuic.calculateAvailablePosition(this, this.parent());
        const alignments = ['bottom', 'left', 'right', 'top'];
        let prop = this.position();

        // Only keep properties that are styled
        for (let i = 0; i < alignments.length; i += 1) {
            if (!this.css(alignments[i])) {
                prop[alignments[i]] = '';
            }
        }

        // Limit horizontal align
        if (typeof prop.left === 'number') {
            if (prop.left < available.minX) {
                prop.left = available.minX;
            }
            else if (prop.left > available.maxX) {
                prop.left = available.maxX;
            }
        }
        if (typeof prop.right === 'number') {
            if (prop.right < available.minX) {
                prop.right = available.minX;
            }
            else if (prop.right > available.maxX) {
                prop.right = available.maxX;
            }
        }

        // Limit vertical align
        if (typeof prop.top === 'number') {
            if (prop.top < available.minY) {
                prop.top = available.minY;
            }
            else if (prop.top > available.maxY) {
                prop.top = available.maxY;
            }
        }
        if (typeof prop.bottom === 'number') {
            if (prop.bottom < available.minY) {
                prop.bottom = available.minY;
            }
            else if (prop.bottom > available.maxY) {
                prop.bottom = available.maxY;
            }
        }

        // Apply alignment
        this.css(prop);

        return this;
    }

    /**
     * Auto fits element in its parent
     * @return {Cuic.Element}
     */
    autoFit() {
        this.autoAlign();
        this.autoResize();
        return this;
    }

    /**
     * Auto resize element in its parent
     * @return {Cuic.Element}
     */
    autoResize() {
        const available = Cuic.calculateAvailableSpace(this, this.parent());

        let prop = {
            height: this.outerHeight(),
            width: this.outerWidth()
        };

        // Limit to max width
        if (prop.width && prop.width > available.width) {
            prop.width = available.width;
        }
        // Limit to max height
        if (prop.height && prop.height > available.height) {
            prop.height = available.height;
        }
        // Apply size
        this.css(prop);

        return this;
    }

    /**
     * Returns element border widths
     * @return {*|{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
     */
    border() {
        const bottom = parseFloat(Cuic.getComputedStyle(this, 'border-bottom-width'));
        const left = parseFloat(Cuic.getComputedStyle(this, 'border-left-width'));
        const right = parseFloat(Cuic.getComputedStyle(this, 'border-right-width'));
        const top = parseFloat(Cuic.getComputedStyle(this, 'border-top-width'));
        return {
            bottom: bottom,
            horizontal: left + right,
            left: left,
            right: right,
            top: top,
            vertical: bottom + top
        };
    }

    /**
     * Returns element child nodes
     * @param selector
     * @return {Cuic.Elements}
     */
    children(selector) {
        let children = [];
        let nodes = this.node().children || this.node().childNodes;

        for (let i = 0; i < nodes.length; i += 1) {
            if (nodes[i] instanceof HTMLElement) {
                if (!selector || nodes[i].matches(selector)) {
                    children.push(nodes[i]);
                }
            }
        }
        return new Cuic.Elements(children, this.node(), selector);
    }

    /**
     * Returns a clone of the element
     * @return {*|Cuic.Element}
     */
    clone() {
        return Cuic.element(this.node().cloneNode(true));
    }

    /**
     * Returns the closest parent element matching the selector
     * @param selector
     * @return {Cuic.Element|null}
     */
    closest(selector) {
        const node = this.node().closest(selector);
        return node ? Cuic.element(node) : null;
    }

    /**
     * Set styles
     * @param styles
     * @return {Cuic.Element|*}
     */
    css(styles) {
        const node = this.node();

        // Writing styles
        if (styles) {
            if (typeof styles === 'object') {
                let mergedStyles = '';

                // Add pixel unit where needed
                Cuic.autoPixel(styles);

                // Get current styles
                for (let i = 0; i < node.style.length; i += 1) {
                    const property = node.style[i];

                    // Ignore properties that are overwritten
                    if (!(property in styles)) {
                        let value = node.style[property];
                        if (typeof value === 'string' && value === '') {
                            value = '""';
                        }
                        mergedStyles += `${property}: ${value};`;
                    }
                }
                // Add new styles
                for (let style in styles) {
                    if (styles.hasOwnProperty(style)) {
                        let value = styles[style];

                        // Check if style is supported
                        if (!(style in node.style)) {
                            console.warn(`Style "${style}" is not supported by element.`, node);
                        }
                        if (typeof value === 'string' && value === '') {
                            value = '""';
                        }
                        mergedStyles += `${style}: ${value};`;
                    }
                }
                node.style = mergedStyles;
                return this;
            }
            else if (typeof styles === 'string') {
                // Set styles
                if (styles.indexOf(':') !== -1) {
                    node.style = styles;
                    return this;
                } else {
                    // Return computed version for some properties
                    // that would return nothing.
                    switch (styles) {
                        case 'position':
                            return Cuic.getComputedStyle(node, styles);
                    }
                    // Return specific style
                    return node.style[styles];
                }
            }
        }
        // Return all styles
        return node.style;
    }

    /**
     * Sets or returns the element data
     * @param key
     * @param value
     * @return {Cuic.Element|*}
     */
    data(key, value) {
        const dataSet = this.node().dataset;

        if (value !== undefined) {
            dataSet[Cuic.toCamelCase(key)] = value;
            return this;
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
        this.node().disabled = true;
        this.addClass('disabled');
        this.events.trigger('disabled');
        return this;
    }

    /**
     * Removes element content
     * @return {Cuic.Element}
     */
    empty() {
        this.node().innerHTML = '';
        return this;
    }

    /**
     * Enables the element
     * @return {Cuic.Element}
     */
    enable() {
        this.node().disabled = false;
        this.removeClass('disabled');
        this.events.trigger('enabled');
        return this;
    }

    /**
     * Enters full screen
     * @return {Cuic.Element}
     */
    enterFullScreen() {
        const node = this.node();

        if (node.requestFullscreen) {
            node.requestFullscreen();
        } else if (node.webkitRequestFullscreen) {
            node.webkitRequestFullscreen();
        } else if (node.mozRequestFullScreen) {
            node.mozRequestFullScreen();
        } else if (node.msRequestFullscreen) {
            node.msRequestFullscreen();
        }
        return this;
    }

    /**
     * Returns the first element that matches the selector
     * @param selector
     * @return {Cuic.Elements}
     */
    find(selector) {
        const context = this.node();
        const elements = context.querySelectorAll(selector);
        return new Cuic.Elements(elements, context, selector);
    }

    /**
     * Returns element CSS classes
     * @return {Array}
     */
    getClasses() {
        return this.node().className.split(' ');
    }

    /**
     * Checks if the element has the class
     * @param className
     * @return {boolean}
     */
    hasClass(className) {
        const classes = this.getClasses();
        const classNames = (className || '').split(' ');
        let result = classNames.length > 0;

        for (let i = 0; i < classNames.length; i += 1) {
            if (classes.indexOf(classNames[i]) === -1) {
                result = false;
                break;
            }
        }
        return result;
    }

    /**
     * Checks if the element has a parent
     * @return {boolean}
     */
    hasParent() {
        return !!this.parentNode();
    }

    /**
     * Returns the element height without margins and borders
     * @return {number}
     */
    height() {
        return this.node().clientHeight - this.padding().vertical;
    }

    /**
     * Hides the element
     * @return {Cuic.Element}
     */
    hide() {
        // this.css({display: 'none'});
        this.addClass('hidden');
        this.events.trigger('hidden');
        return this;
    }

    /**
     * Gets or sets HTML content
     * @param html
     * @return {Cuic.Element|string}
     */
    html(html) {
        if (html !== undefined) {
            // Get HTML from object
            if (html && typeof html === 'object') {
                // Replace content keeping attached events on nodes
                if (html instanceof Cuic.Element) {
                    this.empty();
                    this.append(html.node());
                }
                else if (html instanceof jQuery) {
                    this.empty();
                    this.append(html.get(0));
                }
            }
            else if (typeof html === 'string' || html === null) {
                this.node().innerHTML = html;
            }
            return this;
        } else {
            return this.node().innerHTML;
        }
    }

    /**
     * Returns the element height including padding
     * @return {number}
     */
    innerHeight() {
        // todo subtract vertical scrollbar width
        return this.node().clientHeight;
    }

    /**
     * Returns the element width including padding
     * @return {number}
     */
    innerWidth() {
        // todo subtract horizontal scrollbar width
        return this.node().clientWidth;
    }

    /**
     * Inserts an element after
     * @param element
     * @return {Cuic.Element}
     */
    insertAfter(element) {
        element = Cuic.node(element);
        const parent = this.node().parentNode;
        parent.insertBefore(element, this.node().nextSibling);
        return this;
    }

    /**
     * Inserts an element before
     * @param element
     * @return {Cuic.Element}
     */
    insertBefore(element) {
        element = Cuic.node(element);
        const parent = this.node().parentNode;
        parent.insertBefore(element, this.node());
        return this;
    }

    /**
     * Checks if the element is parent of the current element
     * @param parent
     * @return {boolean}
     */
    isChildOf(parent) {
        parent = Cuic.node(parent);
        let node = this.node();

        do {
            node = node.parentNode;

            if (node === parent) {
                return true;
            }
        } while (node);

        return false;
    }

    /**
     * Checks if the element is disabled
     * @return {boolean}
     */
    isDisabled() {
        return this.node().disabled
            || this.hasClass('disabled');
    }

    /**
     * Checks if the element is enabled
     * @return {boolean}
     */
    isEnabled() {
        return this.node().disabled !== true
            || !this.hasClass('disabled');
    }

    /**
     * Checks if the element is hidden
     * @return {boolean}
     */
    isHidden() {
        return this.hasClass('hidden')
            || this.css('display') === 'none';
    }

    /**
     * Checks if the element is aligned at the position
     * @param position
     * @return {boolean}
     */
    isAligned(position) {
        let result = false;

        if (this.options.position) {
            const pos = (position || '').split(' ');
            result = true;

            for (let i = 0; i < pos.length; i += 1) {
                if (this.options.position.indexOf(pos[i]) === -1) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    /**
     * Checks if the element is at the position
     * @param position
     * @return {boolean}
     */
    isPosition(position) {
        const pos = this.position();

        if (position.indexOf('center') !== -1) {
            return pos.top == pos.bottom || pos.left == pos.right;
        }
        if (position.indexOf('bottom') !== -1) {
            return pos.bottom < pos.top;
        }
        if (position.indexOf('top') !== -1) {
            return pos.top < pos.bottom;
        }
        if (position.indexOf('left') !== -1) {
            return pos.left < pos.right;
        }
        if (position.indexOf('right') !== -1) {
            return pos.right < pos.left;
        }
        return false;
    }

    /**
     * Checks if the element is removed from the DOM
     * @return {boolean}
     */
    isRemoved() {
        const parent = this.node().parentNode;
        return parent === null || parent === undefined;
    }

    /**
     * Checks if the element is shown
     * @return {boolean}
     */
    isShown() {
        return !this.hasClass('hidden')
            && this.css('display') !== 'none';
    }

    /**
     * Returns the element margins
     * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
     */
    margin() {
        const bottom = parseFloat(Cuic.getComputedStyle(this, 'margin-bottom'));
        const left = parseFloat(Cuic.getComputedStyle(this, 'margin-left'));
        const right = parseFloat(Cuic.getComputedStyle(this, 'margin-right'));
        const top = parseFloat(Cuic.getComputedStyle(this, 'margin-top'));
        return {
            bottom: bottom,
            horizontal: left + right,
            left: left,
            right: right,
            top: top,
            vertical: bottom + top
        };
    }

    /**
     * Returns the HTML element
     * @return {HTMLDocument|HTMLElement}
     */
    node() {
        return this.element;
    }

    /**
     * Remove the callback attached to the event
     * @param event
     * @param callback
     * @return {Cuic.Element}
     */
    off(event, callback) {
        Cuic.off(event, this.node(), callback);
        return this;
    }

    /**
     * Returns the element offset
     * @return {{left: *, top: *}}
     */
    offset() {
        const node = this.node();
        return {
            left: node.offsetLeft,
            top: node.offsetTop
        };
    }

    /**
     * Returns the first positioned parent element
     * @return {Cuic.Element|null}
     */
    offsetParent() {
        const parent = this.offsetParentNode();
        return parent ? Cuic.element(parent) : null;
    }

    /**
     * Returns the first positioned parent node
     * @return {HTMLDocument|HTMLElement|null}
     */
    offsetParentNode() {
        return this.node().offsetParent;
    }

    /**
     * Executes the callback each time the event is triggered
     * @param event
     * @param callback
     * @return {Cuic.Element}
     */
    on(event, callback) {
        Cuic.on(event, this.node(), callback);
        return this;
    }

    /**
     * Executes the callback once when the event is triggered
     * @param event
     * @param callback
     * @return {Cuic.Element}
     */
    once(event, callback) {
        Cuic.once(event, this.node(), callback);
        return this;
    }

    /**
     * Called when element is aligned
     * @param callback
     * @return {Cuic.Element}
     */
    onAligned(callback) {
        this.events.on('aligned', callback);
        return this;
    }

    /**
     * Called when element is positioned towards another element
     * @param callback
     * @return {Cuic.Element}
     */
    onAnchored(callback) {
        this.events.on('anchored', callback);
        return this;
    }

    /**
     * Called when element is removed from the DOM
     * @param callback
     * @return {Cuic.Element}
     */
    onRemoved(callback) {
        this.events.on('removed', callback);
        return this;
    }

    /**
     * Returns the element height including padding, borders and eventually margin
     * @param includeMargin
     * @return {number}
     */
    outerHeight(includeMargin) {
        return this.node().offsetHeight + (includeMargin ? this.margin().vertical : 0);
    }

    /**
     * Returns the element width including padding, borders and eventually margin
     * @param includeMargin
     * @return {number}
     */
    outerWidth(includeMargin) {
        return this.node().offsetWidth + (includeMargin ? this.margin().horizontal : 0);
    }

    /**
     * Returns element padding
     * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
     */
    padding() {
        const bottom = parseFloat(Cuic.getComputedStyle(this, 'padding-bottom'));
        const left = parseFloat(Cuic.getComputedStyle(this, 'padding-left'));
        const right = parseFloat(Cuic.getComputedStyle(this, 'padding-right'));
        const top = parseFloat(Cuic.getComputedStyle(this, 'padding-top'));
        return {
            bottom: bottom,
            horizontal: left + right,
            left: left,
            right: right,
            top: top,
            vertical: bottom + top
        };
    }

    /**
     * Returns the parent element
     * @return {Cuic.Element|null}
     */
    parent() {
        const parent = this.parentNode();
        return parent ? Cuic.element(parent) : null;
    }

    /**
     * Returns the parent of the element
     * @return {HTMLDocument|HTMLElement|null}
     */
    parentNode() {
        return this.node().parentNode;
    }

    /**
     * Returns the element position
     * @return {{bottom: Number, left: Number, right: Number, top: Number}}
     */
    position() {
        const bottom = parseFloat(Cuic.getComputedStyle(this, 'bottom'));
        const left = parseFloat(Cuic.getComputedStyle(this, 'left'));
        const right = parseFloat(Cuic.getComputedStyle(this, 'right'));
        const top = parseFloat(Cuic.getComputedStyle(this, 'top'));
        return {
            bottom: bottom,
            left: left,
            right: right,
            top: top
        };
    }

    /**
     * Prepends the element
     * @param element
     * @return {Cuic.Element}
     */
    prepend(element) {
        this.node().prepend(Cuic.node(element));
        return this;
    }

    /**
     * Prepends to the element
     * @param element
     * @return {Cuic.Element}
     */
    prependTo(element) {
        Cuic.node(element).prepend(this.node());
        return this;
    }

    /**
     * Removes the element from the DOM
     * @return {Cuic.Element}
     */
    remove() {
        this.node().remove();
        this.events.trigger('removed');
        return this;
    }

    /**
     * Removes classes from the element
     * @param className
     * @return {Cuic.Element}
     */
    removeClass(className) {
        let classes = this.getClasses();
        const classNames = (className || '').split(' ');

        for (let i = 0; i < classNames.length; i += 1) {
            let index = classes.indexOf(classNames[i]);

            if (index !== -1) {
                classes.splice(index, 1);
            }
        }
        this.node().className = classes.join(' ');
        return this;
    }

    /**
     * Shows the element
     * @return {Cuic.Element}
     */
    show() {
        // this.css({display: ''});
        this.removeClass('hidden');
        this.events.trigger('shown');
        return this;
    }

    /**
     * Gets or sets element content as text
     * @param text
     * @return {Cuic.Element|string}
     */
    text(text) {
        if (text !== undefined) {
            this.node().innerText = text;
            return this;
        } else {
            return this.node().innerText;
        }
    }

    /**
     * Returns or sets element value
     * @param value
     * @return {Cuic.Element|*}
     */
    val(value) {
        if (value !== undefined) {
            this.node().value = value;
            return this;
        } else {
            return this.node().value;
        }
    }

    /**
     * Returns the element width
     * @return {number}
     */
    width() {
        return this.node().clientWidth - this.padding().horizontal;
    }
};

Cuic.Element.prototype.options = {
    className: null,
    namespace: null,
    parent: null
};
