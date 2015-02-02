(function ($) {
    "use strict";

    /**
     * Creates a panel
     * @param options
     * @return {Cuic.Panel}
     */
    Cuic.panel = function (options) {
        return new Cuic.Panel(options);
    };

    /**
     * Creates a panel
     * @param options
     * @constructor
     */
    Cuic.Panel = function (options) {
        var self = this;

        // Set default options
        options = $.extend(true, {
            autoClose: true,
            classes: "panel",
            closeButton: "×",
            container: null,
            content: null,
            css: null,
            footer: null,
            location: null,
            maximized: false,
            onClosed: self.onClosed,
            onOpened: self.onOpened,
            target: null,
            title: null,
            visible: false,
            zIndex: 10
        }, options);

        // Copy options
        self.autoClose = options.autoClose;
        self.location = options.location;
        self.onClosed = options.onClosed;
        self.onOpened = options.onOpened;

        if (options.target) {
            // Use the target as panel
            self.element = $(options.target);

            if (self.element.length !== 1) {
                throw new Error("Target not found : " + options.target);
            }

            // Find panel parts
            self.header = self.element.find(".panel-header");
            self.title = self.element.find(".panel-title");
            self.content = self.element.find(".panel-content");
            self.footer = self.element.find(".panel-footer");

        } else {
            // Create the panel
            self.element = $("<div>");

            // Add the header
            self.header = $("<header>", {
                "class": "panel-header"
            }).appendTo(self.element);

            // Add the title
            self.title = $("<h5>", {
                "class": "panel-title",
                html: options.title
            }).appendTo(self.header);

            // Add the content
            self.content = $("<section>", {
                "class": "panel-content",
                html: options.content
            }).appendTo(self.element);

            // Add the footer
            self.footer = $("<footer>", {
                "class": "panel-footer",
                html: options.footer
            }).appendTo(self.element);

            // Hide the header if not used
            if (!options.title) {
                self.header.hide();
            }

            // Hide the footer if not used
            if (!options.footer) {
                self.footer.hide();
            }
        }

        // Add the panel class
        self.element.addClass(options.classes);

        // Set custom styles
        Cuic.applyCss(options.css, self.element);

        // Override styles
        self.element.css({
            position: "absolute",
            zIndex: options.zIndex
        });

        // Get the container
        self.container = $(options.container || self.element.parent());

        // If the panel is in the body, then we use the window as container
        if (self.container[0].tagName === "BODY") {
            self.element.css("position", "fixed");
        } else {
            // To hide the panel in the container,
            // the container must have a hidden overflow
            self.container.css("overflow", "hidden");
        }

        // Position the panel
        if (self.location) {
            Cuic.position(self.element, self.location, self.container);
        }

        // Set the panel visibility
        // Since the visible option is used to check if the panel is visible
        // we force the panel to show or hide by setting visible to the inverse value.
        if (options.visible) {
            self.visible = false;
            self.open(null, 0);
        } else {
            self.visible = true;
            self.close(null, 0);
        }

        // Maximize the panel
        if (options.maximized) {
            self.maximize(0);
        }

        // Find the close button
        var closeButton = self.element.find(".panel-close");
        closeButton.on("click", function (ev) {
            ev.preventDefault();
            self.close();
        });

        // Find the toggle button
        var toggleButton = self.element.find(".panel-toggle");
        toggleButton.on("click", function (ev) {
            ev.preventDefault();
            self.toggle();
        });

        // Close the panel when the user clicks outside of it
        $(document).on("click.panel", function (ev) {
            var fn = this;
            var target = $(ev.target);

            if (target !== self.element && target.closest(self.element).length === 0) {
                if (self.autoClose && !self.element.is(":animated")) {
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
     * Tells if the panel is closing
     * @type {boolean}
     */
    Cuic.Panel.prototype.closing = false;

    /**
     * The HTML panel element
     * @type {jQuery}
     */
    Cuic.Panel.prototype.element = null;

    /**
     * Where to display the panel
     * @type {string}
     */
    Cuic.Panel.prototype.location = "left top";

    /**
     * Make the panel fit its parent
     * @type {boolean}
     */
    Cuic.Panel.prototype.maximized = false;

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
     * Tells if the panel is opening
     * @type {boolean}
     */
    Cuic.Panel.prototype.opening = false;

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

    /**
     * Closes the panel
     * @param callback
     * @param duration
     * @return {Cuic.Panel}
     */
    Cuic.Panel.prototype.close = function (callback, duration) {
        var self = this;
        var panel = self.element;
        var location = self.location;
        var prop = {};

        if (self.visible || self.opening) {
            self.opening = false;
            self.closing = true;
            duration = duration >= 0 ? 0 : 400;

            panel.stop(true, false);

            // Horizontal animation
            if (location.indexOf("left") !== -1) {
                panel.css("right", "");
                prop.left = -panel.outerWidth(true)
            }
            else if (location.indexOf("right") !== -1) {
                panel.css("left", "");
                prop.right = -panel.outerWidth(true)
            }

            // Vertical animation
            if (location.indexOf("bottom") !== -1) {
                panel.css("top", "");
                prop.bottom = -panel.outerHeight(true)
            }
            else if (location.indexOf("top") !== -1) {
                panel.css("bottom", "");
                prop.top = -panel.outerHeight(true)
            }

            // Close the panel
            panel.animate(prop, duration, function () {
                self.closing = false;
                self.visible = false;
                panel.css({display: "none"});

                if (typeof self.onClosed === "function") {
                    self.onClosed.call(self);
                }
                if (typeof callback === "function") {
                    callback.call(self);
                }
            });
        }
        return self;
    };

    /**
     * Make the panel fit its parent
     * @param duration
     * @return {Cuic.Panel}
     */
    Cuic.Panel.prototype.maximize = function (duration) {
        var self = this;
        var prop = {};

        duration = duration >= 0 ? 0 : 400;

        // Save the original size
        if (!self.element.is(":animated")) {
            self.originalHeight = self.element.height();
            self.originalWidth = self.element.width();
        }

        var horizontalMargin = self.element.outerWidth() - self.element.width();
        var verticalMargin = self.element.outerHeight() - self.element.height();

        if (self.location.indexOf("bottom") !== -1 || self.location.indexOf("top") !== -1) {
            prop.width = self.container.width() - horizontalMargin;
        }

        if (self.location.indexOf("left") !== -1 || self.location.indexOf("right") !== -1) {
            prop.height = self.container.height() - verticalMargin;
        }

        self.element.stop(true).animate(prop, duration);

        return self;
    };

    /**
     * Make the panel fit its content
     * @param duration
     * @return {Cuic.Panel}
     */
    Cuic.Panel.prototype.minimize = function (duration) {
        var self = this;

        duration = duration >= 0 ? 0 : 400;

        self.element.stop(true).animate({
            width: self.originalWidth,
            height: self.originalHeight
        }, duration);

        return self;
    };

    /**
     * Opens the panel
     * @param callback
     * @param duration
     * @return {Cuic.Panel}
     */
    Cuic.Panel.prototype.open = function (callback, duration) {
        var self = this;
        var panel = self.element;
        var location = self.location;
        var prop = {};

        if (!self.visible || self.closing) {
            self.closing = false;
            self.opening = true;
            duration = duration >= 0 ? 0 : 400;

            // Resize the content
            self.resizeContent();

            // Set auto display
            panel.stop(true, false).css("display", "");

            // Horizontal animation
            if (location.indexOf("right") !== -1) {
                panel.css({
                    left: "",
                    right: -panel.outerWidth()
                });
                prop.right = 0
            } else if (location.indexOf("left") !== -1) {
                panel.css({
                    right: "",
                    left: -panel.outerWidth()
                });
                prop.left = 0
            }

            // Vertical animation
            if (location.indexOf("bottom") !== -1) {
                panel.css({
                    top: "",
                    bottom: -panel.outerHeight()
                });
                prop.bottom = 0
            }
            else if (location.indexOf("top") !== -1) {
                panel.css({
                    bottom: "",
                    top: -panel.outerHeight()
                });
                prop.top = 0
            }

            // Fill missing properties
            if ((prop.left != null || prop.right != null) && prop.bottom == null && prop.top == null) {
                prop.top = 0;
                prop.bottom = "";
            }
            if ((prop.bottom != null || prop.top != null) && prop.left == null && prop.right == null) {
                prop.left = 0;
                prop.right = "";
            }

            // Open the panel
            panel.animate(prop, duration, function () {
                self.opening = false;
                self.visible = true;

                if (typeof self.onOpened === "function") {
                    self.onOpened.call(self);
                }
                if (typeof callback === "function") {
                    callback.call(self);
                }
            });
        }
        return self;
    };

    /**
     * Sets the position of the panel and optionally its container
     * @param location
     * @param container
     * @return {Cuic.Panel}
     */
    Cuic.Panel.prototype.position = function (location, container) {
        var self = this;

        // Set the location
        self.location = location;

        // Set the container
        if (container != null) {
            self.container = $(container);
        }
        Cuic.position(self.element, self.location, self.container);
        return self;
    };

    /**
     * Resizes the content
     * @return {Cuic.Panel}
     */
    Cuic.Panel.prototype.resizeContent = function () {
        var self = this;
        var display = self.element.css("display");
        var maxHeight = window.innerHeight;

        // Temporary display the panel
        // to get real height values
        self.element.show();

        // Use container for max height
        if (self.container && self.container !== document.body) {
            maxHeight = self.container.innerHeight();
        }

        // Set panel max height
        maxHeight -= self.element.outerHeight(true) - self.element.height();
        self.element.css("max-height", maxHeight);

        // Set content max height
        var contentMaxHeight = maxHeight;
        contentMaxHeight -= self.content.outerHeight(true) - self.content.height();

        if (self.header) {
            contentMaxHeight -= self.header.outerHeight(true);
        }

        if (self.footer) {
            contentMaxHeight -= self.footer.outerHeight(true);
        }

        self.content.css({
            maxHeight: contentMaxHeight,
            overflow: "auto"
        });

        // Restore the initial display state
        self.element.css("display", display);

        return self;
    };

    /**
     * Toggles the panel visibility
     * @param callback
     * @return {Cuic.Panel}
     */
    Cuic.Panel.prototype.toggle = function (callback) {
        var self = this;

        if (self.opening) {
            self.close(callback);
        }
        else if (self.closing) {
            self.open(callback);
        }
        else if (self.visible) {
            self.close(callback);
        }
        else {
            self.open(callback);
        }
        return self;
    };


})(jQuery);