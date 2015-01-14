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
            horizontal: true,
            location: null,
            maximized: false,
            target: null,
            title: null,
            visible: false,
            zIndex: 10
        }, options);

        // Copy options
        self.autoClose = options.autoClose;
        self.location = options.location;
        self.horizontal = options.horizontal;

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

        // Maximize the panel
        if (options.maximized) {
            //self.maximize();
        }

        // Set the panel visibility
        if (options.visible) {
            self.open(null, 0);
        } else {
            self.close(null, 0);
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
     * Indicates if the panel is closing
     * @type {boolean}
     */
    Cuic.Panel.prototype.closing = false;

    /**
     * The HTML panel element
     * @type {jQuery}
     */
    Cuic.Panel.prototype.element = null;

    /**
     * The panel can be horizontal or vertical
     * @type {boolean}
     */
    Cuic.Panel.prototype.horizontal = true;

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
        duration = duration >= 0 ? 0 : 400;

        // Stop the current animation
        panel.stop(true, false);

        // Start closing
        self.closing = true;

        var cb = function () {
            self.closing = false;
            panel.css({
                display: "none"
            });
            if (typeof callback === "function") {
                callback.call(self);
            }
        };

        if (self.horizontal) {
            if (location.indexOf("bottom") > -1) {
                panel.animate({
                    bottom: -panel.outerHeight(true)
                }, duration, cb);
            }
            else if (location.indexOf("top") > -1) {
                panel.animate({
                    top: -panel.outerHeight(true)
                }, duration, cb);
            }
        }
        else {
            if (location.indexOf("left") > -1) {
                panel.animate({
                    left: -panel.outerWidth(true)
                }, duration, cb);
            }
            else if (location.indexOf("right") > -1) {
                panel.animate({
                    right: -panel.outerWidth(true)
                }, duration, cb);
            }
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

        duration = duration || 0;

        // Save the original size
        self.originalHeight = self.element.height();
        self.originalWidth = self.element.width();

        if (self.horizontal) {
            self.element.animate({width: "100%"}, duration);
        } else {
            self.element.animate({height: "100%"}, duration);
        }
        return self;
    };

    /**
     * Make the panel fit its content
     * @param duration
     * @return {Cuic.Panel}
     */
    Cuic.Panel.prototype.minimize = function (duration) {
        var self = this;

        duration = duration || 0;

        if (self.horizontal) {
            self.element.animate({width: self.originalWidth + "px"}, duration);
        } else {
            self.element.animate({height: self.originalHeight + "px"}, duration);
        }
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
        duration = duration >= 0 ? 0 : 400;

        // Stop the current animation
        panel.stop(true, false);

        // Stop closing
        self.closing = false;

        // Resize the content
        self.resizeContent();

        if (self.horizontal) {
            if (location.indexOf("bottom") > -1) {
                panel.css({
                    top: "",
                    display: ""
                }).animate({
                    bottom: 0
                }, duration, callback);
            }
            else if (location.indexOf("top") > -1) {
                panel.css({
                    bottom: "",
                    display: ""
                }).animate({
                    top: 0
                }, duration, callback);
            }
        } else {
            if (location.indexOf("left") > -1) {
                panel.animate({
                    left: 0
                }, duration, callback);
            }
            else if (location.indexOf("right") > -1) {
                panel.css({
                    left: "",
                    display: ""
                }).animate({
                    right: 0
                }, duration, callback);
            }
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
            maxHeight = self.container.height();
        }

        // Set panel max height
        maxHeight -= parseFloat(self.element.css("margin-top"));
        maxHeight -= parseFloat(self.element.css("margin-bottom"));
        maxHeight -= parseFloat(self.element.css("padding-top"));
        maxHeight -= parseFloat(self.element.css("padding-bottom"));
        self.element.css("max-height", maxHeight + "px");

        // Set content max height
        var contentMaxHeight = maxHeight;
        contentMaxHeight -= parseFloat(self.content.css("margin-top"));
        contentMaxHeight -= parseFloat(self.content.css("margin-bottom"));
        contentMaxHeight -= parseFloat(self.content.css("padding-top"));
        contentMaxHeight -= parseFloat(self.content.css("padding-bottom"));

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

        if (!self.element.is(":visible") || self.closing) {
            self.open(callback);
        }
        else {
            self.close(callback);
        }
        return self;
    };


})(jQuery);