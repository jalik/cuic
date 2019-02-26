/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Karl STEIN
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import extend from '@jalik/extend';
import Collection from '../utils/collection';
import Closable from './closable';
import Element from './element';

class Group extends Closable {
  constructor(node, attributes, options) {
    // Set default options
    const opt = extend({}, Group.prototype.options, options);

    // Create element
    super(node, extend({
      className: opt.className,
      role: 'group',
    }, attributes), opt);

    // Add component classes
    this.addClass('cc-group');

    // Prepare components collection
    this.components = new Collection();
  }

  /**
   * Add the component to the group
   * @param component
   * @return {Group}
   */
  addComponent(component) {
    if (!(component instanceof Element)) {
      throw new TypeError('Cannot add object to the group.');
    }
    this.events.trigger('addComponent', component);

    if (this.isAligned('top')) {
      component.prependTo(this);
    } else {
      component.appendTo(this);
    }
    this.components.add(component);
    return this;
  }

  /**
   * Called before adding a component
   * @param callback
   * @return {Group}
   */
  onAddComponent(callback) {
    this.events.on('addComponent', callback);
    return this;
  }

  /**
   * Called when a component is added
   * @param callback
   * @return {Group}
   */
  onComponentAdded(callback) {
    this.components.onAdded(callback);
    return this;
  }

  /**
   * Called when a component is removed
   * @param callback
   * @return {Group}
   */
  onComponentRemoved(callback) {
    this.components.onRemoved(callback);
    return this;
  }

  /**
   * Called before removing a component
   * @param callback
   * @return {Group}
   */
  onRemoveComponent(callback) {
    this.events.on('removeComponent', callback);
    return this;
  }

  /**
   * Removes the component from the group
   * @param component
   * @return {Group}
   */
  removeComponent(component) {
    this.events.trigger('removeComponent', component);
    this.components.remove(component);
    return this;
  }
}

Group.prototype.options = {
  namespace: 'group',
};

export default Group;
