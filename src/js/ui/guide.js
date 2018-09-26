/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Karl STEIN
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

import { extend } from '@jalik/extend';
import Cuic from '../cuic';
import Events from '../utils/events';
import Popup from './popup';

class Guide {
  constructor(options) {
    // Set default options
    this.options = extend({}, Guide.prototype.options, options, {});

    // Add debug method
    this.debug = Cuic.debug;

    // Create guide popup
    this.popup = new Popup(extend({}, options, {
      autoClose: false,
      autoRemove: false,
      mainClass: 'cc-guide',
      className: 'cc-guide cc-guide-popup',
    }));
    this.popup.guide = this;

    // Add events handler
    this.events = new Events(this);

    this.step = -1;
    this.steps = [];

    // Add steps
    if (this.options.steps instanceof Array) {
      for (let i = 0; i < this.options.steps.length; i += 1) {
        this.addStep(this.options.steps[i]);
      }
    }

    // Auto start guide
    if (this.options.autoStart) {
      this.start();
    }

    this.popup.onAnchored(() => {
      if (this.popup.isShown() && this.options.autoScroll) {
        const position = this.popup.calculatePosition();

        if (position.top + this.popup.outerHeight(true) > Cuic.screenHeight()
          || position.top < window.scrollY) {
          Cuic.scrollY(position.top);
        }
      }
    });

    this.popup.onOpened(() => {
      if (this.options.autoScroll) {
        const position = this.popup.calculatePosition();

        if (position.top + this.popup.outerHeight(true) > Cuic.screenHeight()) {
          window.scrollTo(window.scrollX, position.top);
        } else if (position.top < window.scrollY) {
          window.scrollTo(window.scrollX, position.top);
        }
      }
    });
  }

  /**
   * Adds a step to the guide
   * @param options
   * @return {Guide}
   */
  addStep(options) {
    // Check options
    if (!options.target) {
      throw new TypeError('Guide.addStep(options) must have a target option');
    }
    if (!options.title) {
      throw new TypeError('Guide.addStep(options) must have a title option');
    }
    if (!options.content) {
      throw new TypeError('Guide.addStep(options) must have a content option');
    }

    // todo parse buttons

    // Add the step
    this.steps.push(extend({
      title: null,
      content: null,
      buttons: null,
    }, options));

    return this;
  }

  /**
   * Returns current step
   * @return {*}
   */
  getCurrentStep() {
    return this.getStep(this.step);
  }

  /**
   * Returns current step
   * @return {number}
   */
  getCurrentStepIndex() {
    return this.step;
  }

  /**
   * Returns the last step
   * @return {*}
   */
  getLastStep() {
    return typeof this.lastStep === 'number' ? this.getStep(this.lastStep) : null;
  }

  /**
   * Returns guide popup
   * @return {Popup}
   */
  getPopup() {
    return this.popup;
  }

  /**
   * Returns the step by index
   * @param number
   * @return {*}
   */
  getStep(number) {
    if (typeof number !== 'number') {
      throw new TypeError('number must be a number');
    }
    return this.steps[number];
  }

  /**
   * Returns the step by ID
   * @param id
   * @return {*}
   */
  getStepById(id) {
    let step = null;

    if (typeof id !== 'string') {
      throw new TypeError('id must be a string');
    }
    for (let i = 0; i < this.steps.length; i += 1) {
      if (this.steps[i].id === id) {
        step = this.steps[i];
        break;
      }
    }
    return step;
  }

  /**
   * Returns the step index
   * @param id
   * @return {number}
   */
  getStepIndex(id) {
    let index = null;

    if (typeof id !== 'string') {
      throw new TypeError('id must be a string');
    }
    for (let i = 0; i < this.steps.length; i += 1) {
      if (this.steps[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * Returns guide steps
   * @return {Array}
   */
  getSteps() {
    return this.steps;
  }

  /**
   * Go to a specific step
   * @param idOrNumber
   * @return {Guide}
   */
  goTo(idOrNumber) {
    let step = null;

    if (typeof idOrNumber === 'number') {
      step = this.getStep(idOrNumber);
    } else if (typeof idOrNumber === 'string') {
      step = this.getStepById(idOrNumber);
    } else {
      throw new TypeError('idOrNumber must be a number or string');
    }

    // Continue if step is valid and different
    if (step && (this.step !== this.steps.indexOf(step) || this.popup.isClosed())) {
      this.lastStep = this.step;
      this.step = Number.parseInt(idOrNumber, 10);

      // Update popup content
      this.popup.setTitle(step.title);
      this.popup.setContent(step.content);
      this.popup.buttons.empty();

      // Update popup buttons
      if (step.buttons instanceof Array) {
        step.buttons.forEach((button) => {
          this.popup.addButton(button);
        });
      }

      // Move popup to step target
      const target = Cuic.element(step.target);

      if (target) {
        const anchor = step.anchor || target.data('anchor') || this.options.anchor;
        const anchorPoint = step.anchorPoint || target.data('anchor-point') || this.options.anchorPoint;
        this.popup.options.target = target;
        this.popup.options.anchor = anchor;
        this.popup.options.anchorPoint = anchorPoint;
        this.popup.open();
        this.debug('stepChanged', step, target);
        this.events.trigger('stepChanged', step, target);
      } else {
        throw new TypeError(`Invalid step target: ${step.target}`);
      }
    }
    return this;
  }

  /**
   * Go to the next step
   * @return {Guide}
   */
  next() {
    if (this.step + 1 >= this.steps.length) {
      this.stop();
    } else {
      this.goTo(this.step + 1);
    }
    return this;
  }

  /**
   * Called when guide is started
   * @param callback
   * @return {Guide}
   */
  onStarted(callback) {
    this.events.on('started', callback);
    return this;
  }

  /**
   * Called when step changed
   * @param callback
   * @return {Guide}
   */
  onStepChanged(callback) {
    this.events.on('stepChanged', callback);
    return this;
  }

  /**
   * Called when guide is stopped
   * @param callback
   * @return {Guide}
   */
  onStopped(callback) {
    this.events.on('stopped', callback);
    return this;
  }

  /**
   * Go to the previous step
   * @return {Guide}
   */
  previous() {
    if (this.step > 0) {
      if (this.step === (this.steps.length - 1) && this.popup.isClosed()) {
        this.goTo(this.step);
      } else {
        this.goTo(this.step - 1);
      }
    }
    return this;
  }

  /**
   * Resumes the guide from the last step
   * @return {Guide}
   */
  resume() {
    if (this.step >= 0) {
      this.goTo(this.step);
    }
    return this;
  }

  /**
   * Starts guide from the beginning
   * @return {Guide}
   */
  start() {
    this.goTo(0);
    this.events.trigger('started');
    this.debug('started');
    return this;
  }

  /**
   * Stops guide
   * @return {Guide}
   */
  stop() {
    if (!this.popup.isClosed()) {
      this.popup.close();
      this.events.trigger('stopped');
      this.debug('stopped');
    }
    return this;
  }
}

Guide.prototype.options = {
  anchor: 'top',
  autoClose: false,
  autoRemove: false,
  autoScroll: true,
  autoStart: false,
  closed: true,
  content: null,
  duration: 5000,
  namespace: 'guide',
  steps: null,
  zIndex: 9,
};

export default Guide;
