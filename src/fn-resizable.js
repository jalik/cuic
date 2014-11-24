(function ($) {
    "use strict";

    /**
     * Makes an object resizable
     * @param options
     * @return {Cuic.Resizable}
     */
    Cuic.resizable = function (options) {
        return new Cuic.Resizable(options);
    };

    /**
     * Makes an object resizable
     * @param options
     * @constructor
     */
    Cuic.Resizable = function (options) {
        var self = this;

        // Default options
        options = $.extend(true, {
            fps: self.fps,
            handlerSize: 10,
            horizontal: self.horizontal,
            keepRatio: self.keepRatio,
            maxHeight: self.maxHeight,
            maxWidth: self.maxWidth,
            minHeight: self.minHeight,
            minWidth: self.minWidth,
            onResize: self.onResize,
            onResizeStart: self.onResizeStart,
            onResizeStop: self.onResizeStop,
            stepX: self.stepX,
            stepY: self.stepY,
            vertical: self.vertical
        }, options);

        var handlers = [];
        var horizontalHandlers = [];
        var verticalHandlers = [];
        var ratio = 1;

        // Define attributes
        self.fps = Number(options.fps) || self.fps;
        self.horizontal = !!options.horizontal;
        self.keepRatio = !!options.keepRatio;
        self.maxHeight = Number(options.maxHeight) || self.maxWidth;
        self.maxWidth = Number(options.maxWidth) || self.maxWidth;
        self.minHeight = Number(options.minHeight) || self.minHeight;
        self.minWidth = Number(options.minWidth) || self.minWidth;
        self.onResize = options.onResize || self.onResize;
        self.onResizeStart = options.onResizeStart || self.onResizeStart;
        self.onResizeStop = options.onResizeStop || self.onResizeStop;
        self.stepX = Number(options.stepX) || self.stepX;
        self.stepY = Number(options.stepY) || self.stepY;
        self.vertical = !!options.vertical;

        // Get the target
        if (options.target) {
            self.element = $(options.target);
        }

        // Force the target to be the relative parent
        if (self.element.css("position") === "static") {
            self.element.css("position", "relative");
        }

        /**
         * This method is called the element is resizing
         * @param ev
         */
        var resize = function (ev) {
            if (typeof self.onResizeStart === "function") {
                if (self.onResizeStart.call(self, ev) === false) return;
            }

            // Prevent selection
            ev.preventDefault();

            var height = self.element.height();
            var width = self.element.width();

            // Calculate the ratio
            ratio = height / width;

            self.element.addClass("resizing");

            var timer = setInterval(function () {
                var newHeight = null;
                var newWidth = null;

                if (self.horizontal && horizontalHandlers.indexOf(ev.target) !== -1) {
                    newWidth = width + Cuic.mouseX - ev.clientX;
                }

                if (self.vertical && verticalHandlers.indexOf(ev.target) !== -1) {
                    newHeight = height + Cuic.mouseY - ev.clientY;
                }

                if (self.keepRatio) {
                    if (newHeight !== null) {
                        newWidth = newHeight / ratio;
                    }
                    else if (newWidth !== null) {
                        newHeight = newWidth * ratio;
                    }
                }

                if (typeof self.onResize === "function"
                    && self.onResize.call(self) === false) {
                    return;
                }

                if (newHeight !== null && self.checkHeight(newHeight)) {
                    self.element.height(self.stepY ? Math.round(newHeight / self.stepY) * self.stepY : newHeight);
                }

                if (newWidth !== null && self.checkWidth(newWidth)) {
                    self.element.width(self.stepX ? Math.round(newWidth / self.stepX) * self.stepX : newWidth);
                }
            }, Math.round(1000 / self.fps));

            $(document).one("mouseup", function (ev) {
                clearInterval(timer);

                self.element.removeClass("resizing");

                if (typeof self.onResizeStop === "function") {
                    self.onResizeStop.call(self, ev);
                }
            });
        };

        // Add the right resize handler
        var rightHandler = $("<div>", {
            css: {
                cursor: "e-resize",
                display: "none",
                height: "100%",
                position: "absolute",
                right: 0,
                top: 0,
                width: options.handlerSize,
                zIndex: 1
            }
        }).on("mousedown", resize).appendTo(self.element);

        // Add the bottom resize handler
        var bottomHandler = $("<div>", {
            css: {
                bottom: 0,
                cursor: "s-resize",
                display: "none",
                height: options.handlerSize,
                position: "absolute",
                left: 0,
                width: "100%",
                zIndex: 1
            }
        }).on("mousedown", resize).appendTo(self.element);

        // Add the bottom right resize handler
        var bottomRightHandler = $("<div>", {
            css: {
                bottom: 0,
                cursor: "se-resize",
                display: "none",
                height: options.handlerSize,
                position: "absolute",
                right: 0,
                width: options.handlerSize,
                zIndex: 2
            }
        }).on("mousedown", resize).appendTo(self.element);

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

        // Display all resize handlers when mouse is over the target
        self.element.on("mouseover", function () {
            if (!self.element.hasClass("resizing")) {
                for (var i = 0; i < handlers.length; i += 1) {
                    handlers[i].stop(true, false).fadeIn(200);
                }
            }
        });

        // Hide all resize handlers when mouse leaves the target
        self.element.on("mouseout", function () {
            if (!self.element.hasClass("resizing")) {
                for (var i = 0; i < handlers.length; i += 1) {
                    handlers[i].stop(true, false).fadeOut(200);
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

    Cuic.Resizable.prototype.element = null;
    Cuic.Resizable.prototype.fps = 30;
    Cuic.Resizable.prototype.horizontal = true;
    Cuic.Resizable.prototype.keepRatio = false;
    Cuic.Resizable.prototype.maxHeight = null;
    Cuic.Resizable.prototype.maxWidth = null;
    Cuic.Resizable.prototype.minHeight = null;
    Cuic.Resizable.prototype.minWidth = null;
    Cuic.Resizable.prototype.onResize = null;
    Cuic.Resizable.prototype.onResizeStart = null;
    Cuic.Resizable.prototype.onResizeStop = null;
    Cuic.Resizable.prototype.stepX = null;
    Cuic.Resizable.prototype.stepY = null;
    Cuic.Resizable.prototype.vertical = true;

})(jQuery);