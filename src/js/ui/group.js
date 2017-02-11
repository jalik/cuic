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

Cuic.GroupComponent = class extends Cuic.Component {

    constructor(node, attributes, options) {
        // Set default options
        options = $.extend({}, Cuic.GroupComponent.prototype.options, options);

        // Create element
        super(node, $.extend({
            className: options.className,
            role: 'group'
        }, attributes), options);

        // Prepare components collection
        this.components = new Cuic.Collection();

        this.components.onAdded = (component) => {
            this.onComponentAdded(component);
        };
        this.components.onRemoved = (component) => {
            this.onComponentRemoved(component);
        };
    }

    /**
     * Add the component to the group
     * @param component
     * @return {Cuic.Component}
     */
    add(component) {
        if (!(component instanceof Cuic.Component)) {
            throw new TypeError(`Cannot add non component to a GroupComponent.`);
        }
        if (Cuic.isPosition('top', this.getElement())) {
            component.prependTo(this);
        } else {
            component.appendTo(this);
        }
        this.components.add(component);
        return component;
    }

    /**
     * Called when component is added
     * @param component
     */
    onComponentAdded(component) {
    }

    /**
     * Called when component is removed
     * @param component
     */
    onComponentRemoved(component) {
    }

    /**
     * Removes the component from the group
     * @param component
     * @return {Cuic.Component}
     */
    remove(component) {
        throw new Error(`GroupComponent.remove() is not defined.`);
        this.components.remove(component);
        return component;
    }
};

Cuic.GroupComponent.prototype.options = {
    className: 'group'
};
