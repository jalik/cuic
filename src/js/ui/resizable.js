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

(function ($) {
    'use strict';

    var ns = Cuic.namespace('resizable');

    /**
     * Makes an object resizable
     * @param options
     * @constructor
     */
    Cuic.Resizable = function (options) {
        var self = this;
        var $container;
        var $element;
        var handlers = [];
        var horizontalHandlers = [];
        var verticalHandlers = [];
        var ratio = 1;

        // Default options
        options = $.extend(true, Cuic.Resizable.prototype.options, options);

        // Define attributes
        self.className = options.className;
        self.fps = parseInt(options.fps);
        self.horizontal = options.horizontal === true;
        self.keepRatio = options.keepRatio === true;
        self.maxHeight = parseInt(options.maxHeight);
        self.maxWidth = parseInt(options.maxWidth);
        self.minHeight = parseInt(options.minHeight);
        self.minWidth = parseInt(options.minWidth);
        self.stepX = parseInt(options.stepX);
        self.stepY = parseInt(options.stepY);
        self.vertical = options.vertical === true;

        /**
         * Returns the element
         * @return {*}
         */
        self.getElement = function () {
            return $element;
        };

        /**
         * Set the container
         * @param obj
         * @return {*}
         */
        self.setContainer = function (obj) {
            $container = $(obj);
            return self;
        };

        // Find the target
        if (options.target) $element = $(options.target);

        // Add the resizable classes
        $element.addClass(self.className);

        // Force the target to be the relative parent
        if ($element.css('position') === 'static') {
            $element.css('position', 'relative');
        }

        // Set the top container of the element
        self.setContainer(options.container || $element.offsetParent());

        /**
         * This method is called the element is resizing
         * @param ev
         */
        var resize = function (ev) {
            // Execute callback
            if (self.onResizeStart && self.onResizeStart.call(self, ev) === false) {
                return;
            }

            // Prevent text selection
            ev.preventDefault();

            // Change element style
            $element.addClass('resizing');

            var containerLeft = $container.offset().left;
            var containerTop = $container.offset().top;
            var height = $element.height();
            var width = $element.width();
            var padding = Cuic.padding($element);

            // Calculate the ratio
            ratio = height / width;

            var timer = setInterval(function () {
                var containerHeight = $container.innerHeight();
                var containerWidth = $container.innerWidth();
                var elementLeft = $element.offset().left;
                var elementTop = $element.offset().top;
                var maxHeight = containerHeight - (elementTop - containerTop + padding.left + padding.right);
                var maxWidth = containerWidth - (elementLeft - containerLeft + padding.bottom + padding.top);
                var diffX = Cuic.mouseX - ev.clientX;
                var diffY = Cuic.mouseY - ev.clientY;
                var newHeight = null;
                var newWidth = null;

                // Check horizontal size
                if (horizontalHandlers.indexOf(ev.target) !== -1) {
                    newWidth = width + diffX;

                    if (newWidth > maxWidth) {
                        newWidth = maxWidth;
                    }
                }

                // Check vertical size
                if (verticalHandlers.indexOf(ev.target) !== -1) {
                    newHeight = height + diffY;

                    if (newHeight > maxHeight) {
                        newHeight = maxHeight;
                    }
                }

                if (self.keepRatio) {
                    if (newHeight !== null) {
                        newWidth = newHeight / ratio;
                    }
                    else if (newWidth !== null) {
                        newHeight = newWidth * ratio;
                    }
                }

                // Execute callback
                if (self.onResize && self.onResize.call(self) === false) {
                    return;
                }

                // Resize horizontally
                if (self.horizontal && newWidth !== null && self.checkWidth(newWidth)) {
                    $element.width(self.stepX ? Math.round(newWidth / self.stepX) * self.stepX : newWidth);
                }

                // Resize vertically
                if (self.vertical && newHeight !== null && self.checkHeight(newHeight)) {
                    $element.height(self.stepY ? Math.round(newHeight / self.stepY) * self.stepY : newHeight);
                }

            }, Math.round(1000 / self.fps));

            // Stop resizing
            $(document).off(ns('mouseup')).one(ns('mouseup'), function (ev) {
                clearInterval(timer);
                $element.removeClass('resizing');

                if (self.onResizeStop) {
                    self.onResizeStop.call(self, ev);
                }
            });
        };

        // Right handler
        var rightHandler = $('<div>', {
            css: {
                cursor: 'e-resize',
                display: 'none',
                height: '100%',
                position: 'absolute',
                right: 0,
                top: 0,
                width: options.handlerSize,
                zIndex: 1
            }
        }).off(ns('mousedown')).on(ns('mousedown'), resize).appendTo($element);

        // Bottom handler
        var bottomHandler = $('<div>', {
            css: {
                bottom: 0,
                cursor: 's-resize',
                display: 'none',
                height: options.handlerSize,
                position: 'absolute',
                left: 0,
                width: '100%',
                zIndex: 1
            }
        }).off(ns('mousedown')).on(ns('mousedown'), resize).appendTo($element);

        // Bottom-Right handler
        var bottomRightHandler = $('<div>', {
            css: {
                bottom: 0,
                cursor: 'se-resize',
                display: 'none',
                height: options.handlerSize,
                position: 'absolute',
                right: 0,
                width: options.handlerSize,
                zIndex: 2
            }
        }).off('mousedown').on(ns('mousedown'), resize).appendTo($element);

        handlers = [
            rightHandler,
            bottomHandler,
            bottomRightHandler
        ];
        horizontalHandlers = [
            rightHandler.get(0),
            bottomRightHandler.get(0)
        ];
        verticalHandlers = [
            bottomHandler.get(0),
            bottomRightHandler.get(0)
        ];

        // Display all handlers when mouse enters the target
        $element.off('mouseenter').on(ns('mouseenter'), function () {
            if (!$element.hasClass('resizing')) {
                for (var i = 0; i < handlers.length; i += 1) {
                    handlers[i].stop(true, false).fadeIn(0);
                }
            }
        });

        // Hide all handlers when mouse leaves the target
        $element.off('mouseleave').on(ns('mouseleave'), function () {
            if (!$element.hasClass('resizing')) {
                for (var i = 0; i < handlers.length; i += 1) {
                    handlers[i].stop(true, false).fadeOut(0);
                }
            }
        });
    };

    /**
     * Checks if the height is between min and max values
     * @param height
     * @return {boolean}
     */
    Cuic.Resizable.prototype.checkHeight = function (height) {
        return (!Number(this.maxHeight) || height <= this.maxHeight)
            && (!Number(this.minHeight) || height >= this.minHeight)
    };

    /**
     * Checks if the width is between min and max values
     * @param width
     * @return {boolean}
     */
    Cuic.Resizable.prototype.checkWidth = function (width) {
        return (!Number(this.maxWidth) || width <= this.maxWidth)
            && (!Number(this.minWidth) || width >= this.minWidth);
    };

    /**
     * Called when element is resizing
     * @type {function}
     */
    Cuic.Resizable.prototype.onResize = null;

    /**
     * Called when resize starts
     * @type {function}
     */
    Cuic.Resizable.prototype.onResizeStart = null;

    /**
     * Called when resize stops
     * @type {function}
     */
    Cuic.Resizable.prototype.onResizeStop = null;

    /**
     * Default options
     * @type {*}
     */
    Cuic.Resizable.prototype.options = {
        className: 'resizable',
        fps: 30,
        handlerSize: 10,
        horizontal: true,
        keepRatio: false,
        maxHeight: null,
        maxWidth: null,
        minHeight: 1,
        minWidth: 1,
        stepX: 1,
        stepY: 1,
        vertical: true
    };

})(jQuery);
