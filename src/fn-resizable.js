(function ($) {
    "use strict";

    /**
     * Makes an object resizable
     * @param options
     * @constructor
     */
    Cuic.Resizable = function (options) {
        var self = this;
        var container;
        var element;
        var handlers = [];
        var horizontalHandlers = [];
        var verticalHandlers = [];
        var ratio = 1;

        // Default options
        options = $.extend(true, {
            className: self.className,
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

        // Define attributes
        self.className = options.className;
        self.fps = options.fps || self.fps;
        self.horizontal = !!options.horizontal;
        self.keepRatio = !!options.keepRatio;
        self.maxHeight = options.maxHeight || self.maxWidth;
        self.maxWidth = options.maxWidth || self.maxWidth;
        self.minHeight = options.minHeight || self.minHeight;
        self.minWidth = options.minWidth || self.minWidth;
        self.onResize = options.onResize || self.onResize;
        self.onResizeStart = options.onResizeStart || self.onResizeStart;
        self.onResizeStop = options.onResizeStop || self.onResizeStop;
        self.stepX = options.stepX || self.stepX;
        self.stepY = options.stepY || self.stepY;
        self.vertical = !!options.vertical;

        /**
         * Returns the element
         * @return {*}
         */
        self.getElement = function () {
            return element;
        };

        /**
         * Set the container
         * @param obj
         * @return {*}
         */
        self.setContainer = function (obj) {
            container = $(obj);
            return self;
        };

        // Find the target
        if (options.target) element = $(options.target);

        // Add the resizable classes
        element.addClass(self.className);

        // Force the target to be the relative parent
        if (element.css("position") === "static") {
            element.css("position", "relative");
        }

        // Set the top container of the element
        self.setContainer(options.container || element.offsetParent());

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
            element.addClass("resizing");

            var containerLeft = container.offset().left;
            var containerTop = container.offset().top;
            var height = element.height();
            var width = element.width();
            var padding = Cuic.padding(element);

            // Calculate the ratio
            ratio = height / width;

            var timer = setInterval(function () {
                var containerHeight = container.innerHeight();
                var containerWidth = container.innerWidth();
                var elementLeft = element.offset().left;
                var elementTop = element.offset().top;
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
                    element.width(self.stepX ? Math.round(newWidth / self.stepX) * self.stepX : newWidth);
                }

                // Resize vertically
                if (self.vertical && newHeight !== null && self.checkHeight(newHeight)) {
                    element.height(self.stepY ? Math.round(newHeight / self.stepY) * self.stepY : newHeight);
                }

            }, Math.round(1000 / self.fps));

            // Stop resizing
            $(document).one("mouseup", function (ev) {
                clearInterval(timer);
                element.removeClass("resizing");

                if (self.onResizeStop) {
                    self.onResizeStop.call(self, ev);
                }
            });
        };

        // Right handler
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
        }).on("mousedown", resize).appendTo(element);

        // Bottom handler
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
        }).on("mousedown", resize).appendTo(element);

        // Bottom-Right handler
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
        }).on("mousedown", resize).appendTo(element);

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
        element.on("mouseenter", function () {
            if (!element.hasClass("resizing")) {
                for (var i = 0; i < handlers.length; i += 1) {
                    handlers[i].stop(true, false).fadeIn(0);
                }
            }
        });

        // Hide all handlers when mouse leaves the target
        element.on("mouseleave", function () {
            if (!element.hasClass("resizing")) {
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
     * The class name
     * @type {string}
     */
    Cuic.Draggable.prototype.className = "resizable";

    /**
     * The animation speed
     * @type {number}
     */
    Cuic.Resizable.prototype.fps = 30;

    /**
     * Allows horizontal resizing
     * @type {boolean}
     */
    Cuic.Resizable.prototype.horizontal = true;

    /**
     * Keeps ratio when resizing
     * @type {boolean}
     */
    Cuic.Resizable.prototype.keepRatio = false;

    /**
     * The maximum height of the element
     * @type {number}
     */
    Cuic.Resizable.prototype.maxHeight = null;

    /**
     * The maximum width of the element
     * @type {number}
     */
    Cuic.Resizable.prototype.maxWidth = null;

    /**
     * The minimum height of the element
     * @type {number}
     */
    Cuic.Resizable.prototype.minHeight = 1;

    /**
     * The minimum width of the element
     * @type {number}
     */
    Cuic.Resizable.prototype.minWidth = 1;

    /**
     * Called when the element is resizing
     * @type {function}
     */
    Cuic.Resizable.prototype.onResize = null;

    /**
     * Called when the resizing starts
     * @type {function}
     */
    Cuic.Resizable.prototype.onResizeStart = null;

    /**
     * Called when the resizing stops
     * @type {function}
     */
    Cuic.Resizable.prototype.onResizeStop = null;

    /**
     * The number of pixels to resize horizontally
     * @type {number}
     */
    Cuic.Resizable.prototype.stepX = 1;

    /**
     * The number of pixels to resize vertically
     * @type {number}
     */
    Cuic.Resizable.prototype.stepY = 1;

    /**
     * Allows vertical resizing
     * @type {boolean}
     */
    Cuic.Resizable.prototype.vertical = true;

})(jQuery);