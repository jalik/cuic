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

Cuic.Group = class extends Cuic.Element {

    constructor(node, attributes, options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Group.prototype.options, options);

        // Create element
        super(node, Cuic.extend({
            className: options.className,
            role: 'group'
        }, attributes), options);

        const self = this;

        // Add component classes
        self.addClass('component-group');

        // Prepare components collection
        self.components = new Cuic.Collection();
    }

    /**
     * Add the component to the group
     * @param component
     * @return {Cuic.Group}
     */
    addComponent(component) {
        if (!(component instanceof Cuic.Element)) {
            throw new TypeError(`Cannot add non component to a Group.`);
        }
        // fixme check position with this.options.position
        if (this.isPosition('top')) {
            component.prependTo(this);
        } else {
            component.appendTo(this);
        }
        this.components.add(component);
        return this;
    }

    /**
     * Called when component is added
     * @param callback
     * @return {Cuic.Group}
     */
    onComponentAdded(callback) {
        this.components.onAdded(callback);
        return this;
    }

    /**
     * Called when component is removed
     * @param callback
     * @return {Cuic.Group}
     */
    onComponentRemoved(callback) {
        this.components.onRemoved(callback);
        return this;
    }

    /**
     * Removes the component from the group
     * @param component
     * @return {Cuic.Group}
     */
    removeComponent(component) {
        this.components.remove(component);
        return this;
    }
};

Cuic.Group.prototype.options = {
    className: 'group',
    namespace: 'group'
};
