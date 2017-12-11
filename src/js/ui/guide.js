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

import Cuic from "../cuic";
import {Popup} from "./popup";
import {Events} from "../utils/events";

export class Guide {

    constructor(options) {
        // Set default options
        this.options = Cuic.extend({}, Guide.prototype.options, options, {
            mainClass: "guide",
            className: "guide guide-popup"
        });

        // Create guide popup
        this.popup = new Popup(Cuic.extend({}, options, {
            mainClass: "guide",
            className: "guide guide-popup"
        }));
        this.popup.guide = this;

        // Add events handler
        this.events = new Events(this);

        this.step = -1;
        this.steps = [];

        // Auto start guide
        if (this.options.autoStart) {
            this.start();
        }
    }

    /**
     * Adds a step to the guide
     * @param options
     * @return {Guide}
     */
    addStep(options) {
        // Check options
        if (!options.target) {
            throw new TypeError(`Guide.addStep(options) must have a 'target' option`);
        }
        if (!options.title) {
            throw new TypeError(`Guide.addStep(options) must have a 'title' option`);
        }
        if (!options.content) {
            throw new TypeError(`Guide.addStep(options) must have a 'content' option`);
        }

        // Add the step
        this.steps.push(Cuic.extend({
            title: null,
            content: null,
            buttons: null
        }, options));

        return this;
    }

    /**
     * Returns current step
     * @return {null|object}
     */
    getCurrentStep() {
        return this.step >= this.steps.length ? this.steps[this.step] : null;
    }

    /**
     * Returns guide popup
     * @return {Popup}
     */
    getPopup() {
        return this.popup;
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
     * @param number
     * @return {Guide}
     */
    goTo(number) {
        number = Number.parseInt(number);

        if (typeof number === "number" && !isNaN(number) && number >= 0 && number < this.steps.length) {
            this.step = Number.parseInt(number);
            const step = this.steps[this.step];

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
            const anchor = target.data("anchor") || this.options.anchor;
            const anchorPoint = target.data("anchor-point") || this.options.anchorPoint;
            this.popup.anchor(anchor, anchorPoint, target);
            this.popup.open();
            this.events.trigger("stepChanged", this.step, step);
        }
        return this;
    }

    /**
     * Go to the next step
     * @return {Guide}
     */
    next() {
        if (this.step + 1 >= this.steps.length) {
            return this.stop();
        } else {
            return this.goTo(this.step + 1);
        }
    }

    /**
     * Called when step changed
     * @param callback
     */
    onStepChanged(callback) {
        this.events.on("stepChanged", callback);
    }

    /**
     * Called when guide is started
     * @param callback
     */
    onStarted(callback) {
        this.events.on("started", callback);
    }

    /**
     * Called when guide is stopped
     * @param callback
     */
    onStopped(callback) {
        this.events.on("stopped", callback);
    }

    /**
     * Go to the previous step
     * @return {Guide}
     */
    previous() {
        return this.goTo(this.step - 1);
    }

    /**
     * Starts guide from the beginning
     * @return {Guide}
     */
    start() {
        this.goTo(0);
        this.events.trigger("started");
        return this;
    }

    /**
     * Stops guide
     * @return {Guide}
     */
    stop() {
        this.popup.close();
        this.events.trigger("stopped");
        return this;
    }
}

Guide.prototype.options = {
    anchor: "top",
    autoClose: true,
    autoRemove: false,
    autoStart: false,
    content: null,
    duration: 5000,
    namespace: "guide",
    opened: false,
    zIndex: 9
};
