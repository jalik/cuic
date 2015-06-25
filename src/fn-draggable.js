/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Karl STEIN
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

(function ($) {
    'use strict';

    /**
     * Makes an object draggable
     * @param options
     * @constructor
     */
    Cuic.Draggable = function (options) {
        var self = this;
        var area;
        var container;
        var element;

        // Default options
        options = $.extend(true, {}, Cuic.Draggable.prototype.options, options);

        // Define attributes
        self.className = options.className;
        self.fps = parseInt(options.fps);
        self.horizontal = options.horizontal === true;
        self.rootOnly = options.rootOnly === true;
        self.stepX = parseInt(options.stepX);
        self.stepY = parseInt(options.stepY);
        self.vertical = options.vertical === true;

        /**
         * Returns the element
         * @return {*}
         */
        self.getElement = function () {
            return element;
        };

        /**
         * Set the dragging area
         * @param obj
         * @return {*}
         */
        self.setArea = function (obj) {
            area = $(obj);

            // Add the draggable classes
            area.addClass(self.className);

            // Change cursor icon over dragging area
            area.css('cursor', 'move');

            // Start dragging
            area.on('mousedown', function (ev) {
                // Ignore dragging if the target is not the root
                if (self.rootOnly && ev.target !== ev.currentTarget) return;

                // Execute callback
                if (self.onDragStart && self.onDragStart.call(self, ev) === false) {
                    return;
                }

                // Prevent text selection
                ev.preventDefault();

                // Change element style
                element.addClass('dragging');

                var margin = Cuic.margin(element);
                var height = element.outerHeight();
                var width = element.outerWidth();
                var isInBody = container.get(0) == document.body;
                var startOffset = element.offset();
                var startX = Cuic.mouseX;
                var startY = Cuic.mouseY;
                var scrollX = window.scrollX;
                var scrollY = window.scrollY;

                var timer = setInterval(function () {
                    var containerOffset = container.offset() || {left: 0, top: 0};
                    var containerHeight = container.innerHeight();
                    var containerWidth = container.innerWidth();
                    var minX = (isInBody ? scrollX : 0) + containerOffset.left + margin.left;
                    var minY = (isInBody ? scrollY : 0) + containerOffset.top + margin.top;
                    var maxX = minX - margin.left + containerWidth - margin.right;
                    var maxY = minY - margin.top + containerHeight - margin.bottom;
                    var leftSup = Cuic.mouseX - startX;
                    var left = startOffset.left + (Math.round(leftSup / self.stepX) * self.stepX);
                    var topSup = Cuic.mouseY - startY;
                    var top = startOffset.top + (Math.round(topSup / self.stepY) * self.stepY);

                    // Check horizontal location
                    if (left < minX) {
                        left = minX;
                    } else if (left + width > maxX) {
                        left = maxX - width;
                    }

                    // Check vertical location
                    if (top < minY) {
                        top = minY;
                    } else if (top + height > maxY) {
                        top = maxY - height;
                    }

                    // Execute callback
                    if (self.onDrag && self.onDrag.call(self, left, top) === false) {
                        return;
                    }

                    // Move horizontally
                    if (self.horizontal) {
                        element.offset({left: left});
                    }

                    // Move vertically
                    if (self.vertical) {
                        element.offset({top: top});
                    }
                }, Math.round(1000 / self.fps));

                // Stop dragging
                $(document).one('mouseup', function (ev) {
                    clearInterval(timer);
                    element.removeClass('dragging');

                    if (self.onDragStop) {
                        self.onDragStop.call(self, ev);
                    }
                });
            });
            return self;
        };

        /**
         * Set the container
         * @param elm
         * @return {*}
         */
        self.setContainer = function (elm) {
            container = $(elm);
            return self;
        };

        // Find the target
        if (options.target) element = $(options.target);

        // Force the target to be the relative parent
        if (element.css('position') === 'static') {
            element.css('position', 'relative');
        }

        // Set the dragging area
        self.setArea(options.area || element);

        // Set the top container of the element
        self.setContainer(options.container || element.offsetParent());

        $(document).ready(function () {
            $(document.head).append($('<style>', {
                text: '.' + self.className + ' > * { cursor: auto }'
            }));
        });
    };

    /**
     * Called when dragging element
     * @type {function}
     */
    Cuic.Draggable.prototype.onDrag = null;

    /**
     * Called when drag starts
     * @type {function}
     */
    Cuic.Draggable.prototype.onDragStart = null;

    /**
     * Called when drag stops
     * @type {function}
     */
    Cuic.Draggable.prototype.onDragStop = null;

    /**
     * Default options
     * @type {*}
     */
    Cuic.Draggable.prototype.options = {
        className: 'draggable',
        fps: 60,
        horizontal: true,
        rootOnly: true,
        stepX: 1,
        stepY: 1,
        vertical: true
    };

})(jQuery);