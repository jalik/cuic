(function ($) {
    "use strict";

    /**
     * Creates a panel
     * @param options
     * @constructor
     */
    Cuic.Panel = function (options) {
        var self = this;
        var body;
        var container;
        var element;
        var footer;
        var header;
        var isClosing = false;
        var isOpened = false;
        var isOpening = false;
        var position;
        var target;
        var title;

        // Set default options
        options = $.extend(true, {
            autoClose: self.autoClose,
            className: "panel",
            closeButton: "×",
            container: null,
            content: null,
            css: null,
            footer: null,
            maximized: false,
            onClosed: self.onClosed,
            onOpened: self.onOpened,
            position: "left top",
            target: null,
            title: null,
            visible: false,
            zIndex: 1
        }, options);

        // Define attributes
        self.autoClose = options.autoClose;
        self.onClosed = options.onClosed;
        self.onOpened = options.onOpened;

        // Define vars
        container = $(options.container);
        position = options.position;

        /**
         * Closes the panel
         * @param callback
         * @param duration
         * @return {Cuic.Panel}
         */
        self.close = function (callback, duration) {
            if (isOpening || (isOpened && !isClosing)) {
                var prop = {};
                isClosing = true;
                isOpening = false;

                duration = duration >= 0 ? 0 : 400;

                // Horizontal animation
                if (position.indexOf("left") !== -1) {
                    prop.left = -element.outerWidth(true)
                } else if (position.indexOf("right") !== -1) {
                    element.css("left", "");
                    prop.right = -element.outerWidth(true)
                }

                // Vertical animation
                if (position.indexOf("bottom") !== -1) {
                    element.css("top", "");
                    prop.bottom = -element.outerHeight(true)
                } else if (position.indexOf("top") !== -1) {
                    prop.top = -element.outerHeight(true)
                }

                // Stop animation
                element.stop(true, false);

                element.animate(prop, duration, function () {
                    if (self.autoRemove) {
                        element.remove();
                    }
                    element.css({display: "none"});
                    isClosing = false;
                    isOpened = false;

                    if (callback) {
                        callback.call(self);
                    }

                    if (self.onClosed) {
                        self.onClosed.call(self);
                    }
                });
            }
            return self;
        };

        /**
         * Returns the body
         * @return {jQuery}
         */
        self.getBody = function () {
            return body;
        };

        /**
         * Returns the element
         * @return {jQuery}
         */
        self.getElement = function () {
            return element;
        };

        /**
         * Returns the footer
         * @return {jQuery}
         */
        self.getFooter = function () {
            return footer;
        };

        /**
         * Returns the header
         * @return {jQuery}
         */
        self.getHeader = function () {
            return header;
        };

        /**
         * Checks if the panel is opened
         * @return {boolean}
         */
        self.isOpened = function () {
            return isOpened;
        };

        /**
         * Make the panel fit its parent
         * @param duration
         * @return {Cuic.Panel}
         */
        self.maximize = function (duration) {
            var prop = {};
            duration = duration >= 0 ? 0 : 400;

            // Save the original size
            if (!element.is(":animated")) {
                self.originalHeight = element.height();
                self.originalWidth = element.width();
            }

            var horizontalMargin = element.outerWidth() - element.width();
            var verticalMargin = element.outerHeight() - element.height();

            if (position.indexOf("bottom") !== -1 || position.indexOf("top") !== -1) {
                prop.width = container.width() - horizontalMargin;
                prop.left = 0;
            }

            if (position.indexOf("left") !== -1 || position.indexOf("right") !== -1) {
                prop.height = container.height() - verticalMargin;
                prop.top = 0;
            }

            element.stop(true, false).animate(prop, duration);

            return self;
        };

        /**
         * Make the panel fit its content
         * @param duration
         * @return {Cuic.Panel}
         */
        self.minimize = function (duration) {
            duration = duration >= 0 ? 0 : 400;

            var startHeight = element.height();
            var startWidth = element.width();

            element.css({
                height: "auto",
                width: "auto"
            });

            var height = element.height();
            var width = element.width();

            element.css({
                height: startHeight,
                width: startWidth
            });

            element.stop(true).animate({
                height: height,
                width: width
            }, duration);

            return self;
        };

        /**
         * Opens the panel
         * @param callback
         * @param duration
         * @return {Cuic.Panel}
         */
        self.open = function (callback, duration) {
            if (isClosing || (!isOpened && !isOpening)) {
                var isClosed = !isOpened && !isClosing && !isOpening;
                var prop = {};

                duration = duration >= 0 ? 0 : 400;

                isClosing = false;
                isOpening = true;

                // Stop animation
                element.stop(true, false);

                if (isClosed) {
                    // Reposition the panel if panel is not visible
                    Cuic.position(element, position, container);

                    // Resize the content
                    self.resizeContent();

                    // Reset horizontal position
                    if (position.indexOf("right") !== -1) {
                        element.css({right: -element.outerWidth()});
                    } else if (position.indexOf("left") !== -1) {
                        element.css({left: -element.outerWidth()});
                    }

                    // Reset vertical position
                    if (position.indexOf("bottom") !== -1) {
                        element.css({bottom: -element.outerHeight()});
                    } else if (position.indexOf("top") !== -1) {
                        element.css({top: -element.outerHeight()});
                    }
                }

                // Horizontal animation
                if (position.indexOf("right") !== -1) {
                    prop.right = 0
                } else if (position.indexOf("left") !== -1) {
                    prop.left = 0
                }

                // Vertical animation
                if (position.indexOf("bottom") !== -1) {
                    prop.bottom = 0
                } else if (position.indexOf("top") !== -1) {
                    prop.top = 0
                }

                // Display the panel
                element.css("display", "block");

                element.animate(prop, duration, function () {
                    isOpening = false;
                    isOpened = true;

                    if (callback) {
                        callback.call(self);
                    }

                    if (self.onOpened) {
                        self.onOpened.call(self);
                    }
                });
            }
            return self;
        };

        /**
         * Resizes the content
         * @return {Cuic.Panel}
         */
        self.resizeContent = function () {
            var display = element.css("display");
            var maxHeight = window.innerHeight;

            // Temporary display the panel
            // to get real height values
            element.show();

            // Use container for max height
            if (container && container !== document.body) {
                maxHeight = container.innerHeight();
            }

            // Set panel max height
            maxHeight -= element.outerHeight(true) - element.height();
            element.css("max-height", maxHeight);

            // Set content max height
            var contentMaxHeight = maxHeight;
            contentMaxHeight -= body.outerHeight(true) - body.height();

            if (header) {
                contentMaxHeight -= header.outerHeight(true);
            }

            if (footer) {
                contentMaxHeight -= footer.outerHeight(true);
            }

            body.css({
                maxHeight: contentMaxHeight,
                overflow: "auto"
            });

            // Restore the initial display state
            element.css("display", display);

            return self;
        };

        /**
         * Sets the content
         * @param html
         * @return {Cuic.Panel}
         */
        self.setContent = function (html) {
            body.html(html);
            return self;
        };

        /**
         * Sets the position of the panel and optionally its container
         * @param pos
         * @param cont
         * @return {Cuic.Panel}
         */
        self.setPosition = function (pos, cont) {
            position = pos;
            container = $(cont || container);
            Cuic.position(element, position, container);
            return self;
        };

        /**
         * Sets the title
         * @param html
         * @return {Cuic.Panel}
         */
        self.setTitle = function (html) {
            title.html(html);
            return self;
        };

        /**
         * Toggles the panel visibility
         * @param callback
         * @return {Cuic.Panel}
         */
        self.toggle = function (callback) {
            if (isClosing || (!isOpened && !isOpening)) {
                self.open(callback);
            } else {
                self.close(callback);
            }
            return self;
        };

        if (options.target) {
            // Use the target as panel
            element = $(options.target);

            // Find panel parts
            header = element.find(".panel-header");
            title = element.find(".panel-title");
            body = element.find(".panel-content");
            footer = element.find(".panel-footer");

        } else {
            // Create the panel
            element = $("<div>");

            // Add the header
            header = $("<header>", {
                "class": "panel-header"
            }).appendTo(element);

            // Add the title
            title = $("<h5>", {
                "class": "panel-title",
                html: options.title
            }).appendTo(header);

            // Add the body
            body = $("<section>", {
                "class": "panel-content",
                html: options.content
            }).appendTo(element);

            // Add the footer
            footer = $("<footer>", {
                "class": "panel-footer",
                html: options.footer
            }).appendTo(element);

            // Hide the header if not used
            if (!options.title) {
                header.hide();
            }

            // Hide the footer if not used
            if (!options.footer) {
                footer.hide();
            }
        }

        // Add the class
        element.addClass(options.className);

        // Set custom styles
        Cuic.applyCss(options.css, element);

        // Override styles
        element.css({
            display: "none",
            position: "absolute",
            zIndex: options.zIndex
        });

        // Set the top container of the element
        self.setPosition(position, container || element.offsetParent());

        // If the panel is in the body, then we use the window as container
        if (container.get(0).tagName === "BODY") {
            element.css("position", "fixed");
        } else {
            // To hide the panel in the container,
            // the container must have a hidden overflow
            container.css("overflow", "hidden");
        }

        // Set the panel visibility
        // Since the visible option is used to check if the panel is visible
        // we force the panel to show or hide by setting visible to the inverse value.
        if (options.visible) {
            self.open(null, 0);
        } else {
            self.close(null, 0);
        }

        // Maximize the panel
        if (options.maximized) {
            self.maximize(0);
        }

        // Find the close button
        var closeButton = element.find(".panel-close");
        closeButton.on("click", function (ev) {
            ev.preventDefault();
            self.close();
        });

        // Find the toggle button
        var toggleButton = element.find(".panel-toggle");
        toggleButton.on("click", function (ev) {
            ev.preventDefault();
            self.toggle();
        });

        // Close the panel when the user clicks outside of it
        $(document).on("mousedown.panel", function (ev) {
            var target = $(ev.target);

            if (target !== element && target.closest(element).length === 0) {
                if (self.autoClose && isOpened) {
                    self.close();
                }
            }
        });
    };

    /**
     * Close the panel when the user clicks outside
     * @type {boolean}
     */
    Cuic.Panel.prototype.autoClose = false;

    /**
     * Called when the panel is closed
     * @type {function}
     */
    Cuic.Panel.prototype.onClosed = null;

    /**
     * Called when the panel is opened
     * @type {function}
     */
    Cuic.Panel.prototype.onOpened = null;

    /**
     * The original height of the panel
     * @type {number}
     */
    Cuic.Panel.prototype.originalHeight = null;

    /**
     * The original width of the panel
     * @type {number}
     */
    Cuic.Panel.prototype.originalWidth = null;

})(jQuery);