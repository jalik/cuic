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
        else if (Cuic.isNode(node) || node instanceof Window) {
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
            console.info(node);
            throw new TypeError(`Cannot create element using given node.`);
        }

        // Set element attributes
        for (let attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                const value = attributes[attr];

                if (value !== null && value !== undefined) {
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

                    // Set attribute
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

        // Add main class
        if (this.options.mainClass) {
            this.addClass(this.options.mainClass);
        }

        // Add default events
        this.events = new Cuic.Events(this);

        // Append element to parent node
        if (this.options.parent) {
            this.appendTo(this.options.parent);
            Cuic.element(this.options.parent).append(this);
        }

        // Position the element
        if (this.options.position && this.hasParent()) {
            this.align(this.options.position);
        }
    }

    /**
     * Calculates the alignment of the element inside its parent
     * @param position
     * @param parent
     * @return {{bottom: string, left: string, right: string, top: string}}
     * @private
     */
    _calculateAlign(position, parent) {
        position = position || '';

        if (parent) {
            parent = Cuic.element(parent);

            // Use body as parent
            if (parent.node().nodeName === 'HTML') {
                parent = Cuic.element(document.body);
            }
        }
        else {
            // Use parent node if no parent defined
            parent = this.offsetParent();
        }

        let elHeight = this.outerHeight(true);
        let elWidth = this.outerWidth(true);
        let parentHeight = parent.height();
        let parentWidth = parent.width();
        let relativeLeft = parent.node().scrollLeft; // todo use internal method scrollLeft
        let relativeTop = parent.node().scrollTop; // todo use internal method scrollTop
        let relativeBottom = -relativeTop;
        let relativeRight = -relativeLeft;
        let prop = {
            bottom: '',
            left: '',
            right: '',
            top: ''
        };

        // If the target is fixed, we use the window as parent
        switch (this.css('position')) {
            case 'fixed':
                parent = Cuic.element(window);
                parentHeight = parent.innerHeight();
                parentWidth = parent.innerWidth();
                relativeLeft = 0;
                relativeTop = 0;
                relativeBottom = 0;
                relativeRight = 0;
                break;
        }

        const centerX = relativeLeft + Math.max(0, parent.innerWidth() / 2 - elWidth / 2);
        const centerY = relativeTop + Math.max(0, parent.innerHeight() / 2 - elHeight / 2);

        // Vertical position
        if (position.indexOf('top') !== -1) {
            prop.top = 0;
        }
        else if (position.indexOf('bottom') !== -1) {
            prop.bottom = 0;
        }
        else {
            prop.top = centerY;
        }

        // Horizontal position
        if (position.indexOf('left') !== -1) {
            prop.left = 0;
        }
        else if (position.indexOf('right') !== -1) {
            prop.right = 0;
        }
        else {
            prop.left = centerX;
        }

        // Calculate available position
        const available = this._calculateAvailablePosition(parent);

        // Constraint position
        if (prop.left < available.minX) {
            prop.left = available.minX;
        }
        else if (prop.left > available.maxX) {
            prop.left = available.maxX;
        }
        return prop;
    }

    /**
     * Calculates the position of the element around its parent
     * @param position
     * @param target
     * @param attach todo attach to
     * @return {{bottom: string, left: string, right: string, top: string}}
     * @private
     */
    _calculateAnchor(position, target, attach) {
        position = position || '';

        let targetHeight;
        let targetWidth;
        let targetOffset;

        // Target is a coordinate (x, y)
        if (target instanceof Array && target.length === 2) {
            targetHeight = 1;
            targetWidth = 1;
            targetOffset = {
                left: target[0],
                top: target[1]
            };
        }
        // Target is an element
        else {
            target = Cuic.element(target);
            targetHeight = target.outerHeight();
            targetWidth = target.outerWidth();
            targetOffset = target.offset();
        }

        let elWidth = this.outerWidth(true);
        let elHeight = this.outerHeight(true);
        let elCenterX = (elWidth / 2);
        let elCenterY = (elHeight / 2);
        let targetCenterX = (targetWidth / 2);
        let targetCenterY = (targetHeight / 2);

        // fixme elHeight can be less if animated (resized), which leads to wrong elCenterY
        // fixme the problem is with element with scale(0) or display:none

        let prop = {
            bottom: '',
            left: '',
            right: '',
            top: ''
        };

        // Vertical positioning
        if (position.indexOf('bottom') !== -1) {
            prop.top = targetOffset.top + targetHeight;
        }
        else if (position.indexOf('top') !== -1) {
            prop.top = targetOffset.top - elHeight;
        }
        else {
            prop.top = targetOffset.top + targetCenterY - elCenterY;
        }

        // Horizontal positioning
        if (position.indexOf('left') !== -1) {
            prop.left = targetOffset.left - elWidth;
        }
        else if (position.indexOf('right') !== -1) {
            prop.left = targetOffset.left + targetWidth;
        }
        else {
            prop.left = targetOffset.left + targetCenterX - elCenterX;
        }

        // Use window for positioning
        if (this.css('position') === 'fixed') {
            prop.left -= window.scrollX;
            prop.top -= window.scrollY;
        }

        // Calculate available position
        // const limit = this._calculateAvailablePosition(target.offsetParent());
        // prop = this.constraintPosition(prop, limit);

        return prop;
    }

    /**
     * Returns the available position inside a container
     * @param parent
     * @return {{minX: number, minY: number, maxX: number, maxY: number}}
     * @private
     */
    _calculateAvailablePosition(parent) {
        parent = parent ? Cuic.element(parent) : this.offsetParent();

        let prop = {
            minX: 0,
            minY: 0,
            maxX: Math.max(0, parent.width() - this.outerWidth(true)),
            maxY: Math.max(0, parent.height() - this.outerHeight(true))
        };

        // Adjust limits depending of element position
        switch (this.css('position')) {
            case 'absolute':
            case 'fixed':
                const prPadding = parent.padding();
                // const elMargin = this.margin();
                prop.maxX += prPadding.horizontal;
                prop.maxY += prPadding.vertical;
                // prop.maxX -= elMargin.horizontal;
                // prop.maxY -= elMargin.vertical;
                // fixme max is wrong sometimes
                break;
        }
        return prop;
    }

    /**
     * Returns the available space inside a container
     * @param parent
     * @return {{height, width}}
     * @private
     */
    _calculateAvailableSpace(parent) {
        parent = parent ? Cuic.element(parent) : this.offsetParent();
        const elMargin = this.margin();

        let prop = {
            height: parent.height(),
            width: parent.width()
        };

        // Adjust limits depending of element position
        switch (this.css('position')) {
            case 'absolute':
            case 'fixed':
                const prPadding = parent.padding();
                prop.height += prPadding.vertical;
                prop.width += prPadding.horizontal;
                prop.height -= elMargin.vertical;
                prop.width -= elMargin.horizontal;
                break;
            case 'relative':
                prop.height -= elMargin.vertical;
                prop.width -= elMargin.horizontal;
                break;
        }
        return prop;
    }

    /**
     * Calculates maximized properties
     * @return {{bottom: string, height: number, left: string, right: string, top: string, width: number}}
     * @private
     */
    _calculateMaximize() {
        const parent = this.offsetParent();
        const parentPadding = parent.padding();
        const elMargin = this.margin();
        let prop = {
            bottom: '',
            height: parent.innerHeight() - parentPadding.vertical,
            left: '',
            right: '',
            top: '',
            width: parent.innerWidth() - parentPadding.horizontal
        };

        // Adjust dimensions
        switch (this.css('position')) {
            case 'absolute':
            case 'fixed':
                prop.height += parentPadding.vertical;
                prop.height -= elMargin.vertical;
                prop.width += parentPadding.horizontal;
                prop.width -= elMargin.horizontal;
                break;

            case 'relative':
                prop.height -= elMargin.vertical;
                prop.width -= elMargin.horizontal;
                break;
        }

        // todo maximize from current this.options.position (if right:0, stay right:0)

        // Horizontal position
        if (this.isAligned('right')) {
            prop.right = 0;
        } else {
            prop.left = 0;
        }
        // Vertical position
        if (this.isAligned('bottom')) {
            prop.bottom = 0;
        } else {
            prop.top = 0;
        }
        return prop;
    }

    /**
     * Calculates minimized properties
     * @param position
     * @return {{height, width}}
     * @private
     */
    _calculateMinimize(position) {
        position = position || '';

        // Create a clone with minimal size
        const clone = this.clone();
        clone.css({height: 'auto', width: 'auto'});
        clone.appendTo(this.parent());

        // Calculate minimized size
        let prop = clone._calculateAlign(position);
        prop.height = clone.outerHeight();
        prop.width = clone.outerWidth();
        clone.remove();

        return prop;
    }

    /**
     * Displays element for calculation (positioning, parenting...)
     * @return {Cuic.Element}
     * @private
     */
    _display() {
        if (!this.hasClass('computing')) {
            this._previousDisplay = this.css('display');

            if (this._previousDisplay === 'none') {
                this.addClass('computing');
                this.css({display: ''});

                if (this.hasClass('hidden')) {
                    this.removeClass('hidden');
                    this._previousClass = 'hidden';
                }
            }
        }
        return this;
    }

    /**
     * Restores element previous display state
     * @return {Cuic.Element}
     * @private
     */
    _restoreDisplay() {
        if (this.hasClass('computing')) {
            if (this._previousClass) {
                this.addClass(this._previousClass);
            }
            this.removeClass('computing');
            this.css({display: this._previousDisplay});
            this._previousDisplay = null;
            this._previousClass = null;
        }
        return this;
    }

    /**
     * Adds the class
     * @param className
     * @return {Cuic.Element}
     */
    addClass(className) {
        this.debug('addClass', className);
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
        this.debug('addPositionClass', position, prefix);
        const pfx = (str) => {
            return prefix ? prefix + '-' + str : str;
        };

        // Remove previous classes
        this.removeClass([
            pfx('bottom'),
            pfx('center'),
            pfx('left'),
            pfx('right'),
            pfx('top')
        ].join(' '));

        // Vertical position
        if (position.indexOf('bottom') !== -1) {
            this.addClass(pfx('bottom'));
        }
        else if (position.indexOf('top') !== -1) {
            this.addClass(pfx('top'));
        }
        else {
            this.addClass(pfx('center'));
        }

        // Horizontal position
        if (position.indexOf('left') !== -1) {
            this.addClass(pfx('left'));
        }
        else if (position.indexOf('right') !== -1) {
            this.addClass(pfx('right'));
        }
        else {
            this.addClass(pfx('center'));
        }
        return this;
    }

    /**
     * Sets the position of the element inside its parent
     * @param position
     * @return {Cuic.Element}
     */
    align(position) {
        if (this.isInDOM()) {
            const pos = this.css('position');

            if (['absolute', 'fixed'].indexOf(pos) !== -1) {
                this.debug('align', position);
                this.css(this._calculateAlign(position));
                this.addPositionClass(position, 'aligned');
                this.options.position = position;
                this.events.trigger('aligned', position);
            }
        }
        return this;
    }

    /**
     * Aligns element in its parent
     * @return {Cuic.Element}
     */
    alignInParent() {
        if (this.isInDOM()) {
            this.debug('alignInParent');
            const alignments = ['bottom', 'left', 'right', 'top'];
            let prop = this.position();

            // Only keep properties that are styled
            for (let i = 0; i < alignments.length; i += 1) {
                if (!this.css(alignments[i])) {
                    prop[alignments[i]] = '';
                }
            }

            // Limit position to parent available position
            const available = this._calculateAvailablePosition();
            prop = Cuic.constraintPosition(prop, available);

            // Apply alignment
            this.css(prop);
        }
        return this;
    }

    /**
     * Aligns element in screen
     * @return {Cuic.Element}
     */
    alignInScreen() {
        if (this.isInDOM()) {
            this.debug('alignInScreen');
            const alignments = ['bottom', 'left', 'right', 'top'];
            let prop = this.position();

            // Only keep properties that are styled
            for (let i = 0; i < alignments.length; i += 1) {
                if (!this.css(alignments[i])) {
                    prop[alignments[i]] = '';
                }
            }

            // Limit position to screen
            const screen = {
                minX: 0, maxX: Cuic.element(window).width(),
                minY: 0, maxY: Cuic.element(window).height()
            };
            const rect = this.positionOnScreen();
            const elWidth = this.outerWidth(true);
            const elHeight = this.outerHeight(true);

            // todo
            // console.log('screen', screen);
            // console.log('rect', rect);
            // console.log('prop', prop);
            // console.log('size', {width: elWidth, height: elHeight});

            for (let i = 0; i < alignments.length; i += 1) {
                const location = alignments[i];
                const screenPos = rect[location];

                if (typeof prop[location] === 'number') {
                    // negative
                    if (screenPos < 0) {
                        prop[location] += Math.abs(screenPos);
                    }
                    // positive
                    else if (['bottom', 'top'].indexOf(location) !== -1) {
                        if (screenPos + elHeight > screen.maxY) {
                            // console.log(location + ': ' + (screenPos + elHeight) + " > " + available.maxY);
                            // const extraSpace = Math.abs(available.maxY - Math.abs(prop[location]) - elHeight);
                            const extraSpace = Math.abs(screen.maxY - Math.abs(rect[location]) - elHeight);
                            prop[location] -= extraSpace;
                            // console.log(available.maxY + '-' + extraSpace + ' = ', prop[location]);
                        }
                    }
                    else if (['left', 'right'].indexOf(location) !== -1) {
                        if (screenPos + elWidth > screen.maxX) {
                            // console.log(location + ': ' + (screenPos + elWidth) + " > " + available.maxX);
                            const extraSpace = Math.abs(screen.maxX - Math.abs(rect[location]) - elWidth);
                            prop[location] -= extraSpace;
                            // console.log(available.maxX + '-' + extraSpace + ' = ', prop[location]);
                        }
                    }
                }
            }
            // console.log('prop', prop);

            // Apply alignment
            this.css(prop);
        }
        return this;
    }

    /**
     * Sets the position of the element toward another element
     * @param position
     * @param target
     * @param attach
     * @return {Cuic.Element}
     */
    anchor(position, target, attach) {
        if (this.isInDOM()) {
            this.debug('anchor', position, target);
            target = Cuic.element(target || this.options.target);
            this.css(this._calculateAnchor(position, target, attach));
            this.addPositionClass(position, 'anchored');
            this.options.anchor = position;
            this.options.target = target;
            this.events.trigger('anchored', position);
        }
        return this;
    }

    /**
     * Appends the element
     * @param element
     * @return {Cuic.Element}
     */
    append(element) {
        this.debug('append', element);
        this.node().append(Cuic.node(element));
        return this;
    }

    /**
     * Appends to the element
     * @param element
     * @return {Cuic.Element}
     */
    appendTo(element) {
        this.debug('appendTo', element);
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
     * Auto fits element in its parent
     * @return {Cuic.Element}
     */
    autoFit() {
        this.alignInParent();
        this.autoResize();
        return this;
    }

    /**
     * Auto resize element in its parent
     * @return {Cuic.Element}
     */
    autoResize() {
        if (this.isInDOM()) {
            this.debug('autoResize');
            const available = this._calculateAvailableSpace();

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
        }
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
            if (Cuic.isNode(nodes[i])) {
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
        this.debug('clone');
        return Cuic.element(this.node().cloneNode(true));
    }

    /**
     * Returns the closest parent element matching the selector
     * @param selector
     * @return {Cuic.Element|null}
     */
    closest(selector) {
        this._display();
        const node = this.node().closest(selector);
        this._restoreDisplay();
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
                this.debug('css', styles);

                // Add pixel unit where needed
                Cuic.autoPixel(styles);

                // Add new styles
                for (let style in styles) {
                    if (styles.hasOwnProperty(style)) {
                        let value = styles[style];

                        // Check if style is supported
                        if (!(style in node.style)) {
                            console.warn(`Style "${style}" is not supported by element.`, node);
                        }
                        node.style[style] = value;
                    }
                }
                return this;
            }
            else if (typeof styles === 'string') {
                // Set styles
                if (styles.indexOf(':') !== -1) {
                    this.debug('css', styles);
                    node.style = styles;
                    return this;
                } else {
                    // Return computed version for some properties
                    // that would return nothing.
                    switch (styles) {
                        case 'display':
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
        this.debug('data', key, value);
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
     * Displays debug message if debug mode is active
     */
    debug() {
        if (Cuic.options.debug || this.options.debug) {
            const args = Array.prototype.slice.call(arguments);
            (console.debug || console.log).apply(this, args);
        }
    }

    /**
     * Disables the element
     * @return {Cuic.Element}
     */
    disable() {
        this.debug('disable');
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
        this.debug('empty');
        this.text('');
        return this;
    }

    /**
     * Enables the element
     * @return {Cuic.Element}
     */
    enable() {
        this.debug('enable');
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
        const node = this.node();
        let height;

        if (node instanceof Window) {
            height = node.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
        } else {
            height = node.clientHeight - this.padding().vertical;
        }
        return height;
    }

    /**
     * Hides the element
     * @return {Cuic.Element}
     */
    hide() {
        this.debug('hide');
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
                if (Cuic.isNode(html)) {
                    this.empty();
                    this.append(html);
                }
                // Replace content keeping attached events on nodes
                else if (html instanceof Cuic.Element) {
                    this.empty();
                    this.append(html.node());
                }
                else if (html instanceof jQuery) {
                    this.empty();
                    this.append(html.get(0));
                }
            }
            else {
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
        const node = this.node();
        let height;

        if (node instanceof Window) {
            height = node.screen.height;
        } else {
            // todo subtract vertical scrollbar width
            height = node.clientHeight;
        }
        return height;
    }

    /**
     * Returns the element width including padding
     * @return {number}
     */
    innerWidth() {
        const node = this.node();
        let width;

        if (node instanceof Window) {
            width = node.screen.width;
        } else {
            // todo subtract horizontal scrollbar width
            width = node.clientWidth;
        }
        return width;
    }

    /**
     * Inserts an element after
     * @param element
     * @return {Cuic.Element}
     */
    insertAfter(element) {
        this.debug('insertAfter', element);
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
        this.debug('insertBefore', element);
        element = Cuic.node(element);
        const parent = this.node().parentNode;
        parent.insertBefore(element, this.node());
        return this;
    }

    /**
     * Checks if the element has an absolute position
     * @return {boolean}
     */
    isAbsolute() {
        return this.css('position') === 'absolute';
    }

    /**
     * Checks the element alignment
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
     * Checks the element anchor
     * @param position
     * @return {boolean}
     */
    isAnchored(position) {
        let result = false;

        if (this.options.anchor) {
            const pos = (position || '').split(' ');
            result = true;

            for (let i = 0; i < pos.length; i += 1) {
                if (this.options.anchor.indexOf(pos[i]) === -1) {
                    result = false;
                    break;
                }
            }
        }
        return result;
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
     * Checks if the element has a fixed position
     * @return {boolean}
     */
    isFixed() {
        return this.css('position') === 'fixed';
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
     * Checks if the element is in the DOM
     * @return {boolean}
     */
    isInDOM() {
        return document.body.contains(this.node()) || !!this.offsetParent();
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
     * Checks if the element has a relative position
     * @return {boolean}
     */
    isRelative() {
        return this.css('position') === 'relative';
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
     * Checks if the element has a static position
     * @return {boolean}
     */
    isStatic() {
        return this.css('position') === 'static';
    }

    /**
     * Returns the element margins
     * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
     */
    margin() {
        let bottom = 0;
        let left = 0;
        let right = 0;
        let top = 0;

        if (!(this.node() instanceof Window)) {
            bottom = parseFloat(Cuic.getComputedStyle(this, 'margin-bottom'));
            left = parseFloat(Cuic.getComputedStyle(this, 'margin-left'));
            right = parseFloat(Cuic.getComputedStyle(this, 'margin-right'));
            top = parseFloat(Cuic.getComputedStyle(this, 'margin-top'));
        }
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
        this._display();
        const offset = {left: node.offsetLeft, top: node.offsetTop};
        this._restoreDisplay();
        return offset;
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
        this._display();
        const parent = this.node().offsetParent;
        this._restoreDisplay();
        return parent;
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
    outerHeight(includeMargin = false) {
        const node = this.node();
        let height;

        if (node instanceof Window) {
            height = node.screen.height;
        } else {
            height = node.offsetHeight + (includeMargin ? this.margin().vertical : 0);
        }
        return height;
    }

    /**
     * Returns the element width including padding, borders and eventually margin
     * @param includeMargin
     * @return {number}
     */
    outerWidth(includeMargin = false) {
        const node = this.node();
        let width;

        if (node instanceof Window) {
            width = node.screen.width;
        } else {
            width = node.offsetWidth + (includeMargin ? this.margin().horizontal : 0);
        }
        return width;
    }

    /**
     * Returns element padding
     * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
     */
    padding() {
        let bottom = 0;
        let left = 0;
        let right = 0;
        let top = 0;

        if (!(this.node() instanceof Window)) {
            bottom = parseFloat(Cuic.getComputedStyle(this, 'padding-bottom'));
            left = parseFloat(Cuic.getComputedStyle(this, 'padding-left'));
            right = parseFloat(Cuic.getComputedStyle(this, 'padding-right'));
            top = parseFloat(Cuic.getComputedStyle(this, 'padding-top'));
        }
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
        this._display();
        const bottom = parseFloat(Cuic.getComputedStyle(this, 'bottom'));
        const left = parseFloat(Cuic.getComputedStyle(this, 'left'));
        const right = parseFloat(Cuic.getComputedStyle(this, 'right'));
        const top = parseFloat(Cuic.getComputedStyle(this, 'top'));
        this._restoreDisplay();
        return {
            bottom: bottom,
            left: left,
            right: right,
            top: top
        };
    }

    /**
     * Returns position of element in the screen
     * @return {*}
     */
    positionOnScreen() {
        return Cuic.extend({}, this.node().getBoundingClientRect());
    }

    /**
     * Prepends the element
     * @param element
     * @return {Cuic.Element}
     */
    prepend(element) {
        this.debug('prepend', element);
        this.node().prepend(Cuic.node(element));
        return this;
    }

    /**
     * Prepends to the element
     * @param element
     * @return {Cuic.Element}
     */
    prependTo(element) {
        this.debug('prependTo', element);
        Cuic.node(element).prepend(this.node());
        return this;
    }

    /**
     * Removes the element from the DOM
     * @return {Cuic.Element}
     */
    remove() {
        this.debug('remove');
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
        this.debug('removeClass', className);
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
        this.debug('show');
        this.css({display: ''});
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
        this.debug('text', text);

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
        this.debug('val', value);

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
        const node = this.node();
        let width;

        if (node instanceof Window) {
            width = node.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;
        } else {
            width = node.clientWidth - this.padding().horizontal;
        }
        return width;
    }
};

Cuic.Element.prototype.options = {
    className: null,
    css: null,
    debug: false,
    namespace: null,
    parent: null
};
