(function ($) {
    "use strict";

    /**
     * Creates a notification
     * @param options
     * @return {Cuic.Notification}
     */
    Cuic.notification = function (options) {
        return new Cuic.Notification(options);
    };

    /**
     * Creates a notification
     * @param options
     * @constructor
     */
    Cuic.Notification = function (options) {
        var self = this;

        // Set default options
        options = $.extend(true, {
            autoClose: true,
            classes: "notification",
            closeButton: "×",
            container: null,
            content: null,
            css: null,
            duration: 2000,
            location: "center",
            zIndex: 10
        }, options);

        // Copy options
        self.autoClose = options.autoClose;
        self.duration = options.duration;
        self.location = options.location;

        // Get the container
        self.container = $(options.container || document.body);

        // Create the element
        self.element = $("<div>", {
            "class": options.classes,
            css: {display: "none"},
            html: options.content
        }).appendTo(self.container);

        // Set custom styles
        Cuic.applyCss(options.css, self.element);

        // Override styles
        self.element.css({
            position: self.container[0].tagName === "BODY" ? "fixed" : "absolute",
            zIndex: options.zIndex
        });
    };

    /**
     * Close the notification after a given amount of time
     * @type {boolean}
     */
    Cuic.Notification.prototype.autoClose = true;

    /**
     * Remove the notification from the DOM when closed
     * @type {boolean}
     */
    Cuic.Notification.prototype.autoRemove = true;

    /**
     * The container used to position the notification
     * @type {HTMLElement}
     */
    Cuic.Notification.prototype.container = document.body;

    /**
     * How many milliseconds the notification should remain visible
     * @type {number}
     */
    Cuic.Notification.prototype.duration = 2000;

    /**
     * The HTML notification element
     * @type {jQuery}
     */
    Cuic.Notification.prototype.element = null;

    /**
     * Where to display the notification
     * @type {boolean}
     */
    Cuic.Notification.prototype.location = "center";

    /**
     * Closes the notification
     * @param callback
     */
    Cuic.Notification.prototype.close = function (callback) {
        var self = this;

        self.element.stop(true, false).fadeOut(200, function () {
            if (typeof callback === "function") {
                callback.call(self);
            }
            if (self.autoRemove) {
                self.element.remove();
            }
        });
        return this;
    };

    /**
     * Opens the notification
     * @param callback
     */
    Cuic.Notification.prototype.open = function (callback) {
        var self = this;

        // If the content of the notification has changed,
        // we need to check if there is a close button
        self.element.find(".notification-close").one("click", function () {
            self.close();
        });

        // Position the notification
        Cuic.position(self.element, self.location, self.container);

        var autoClose = function () {
            clearTimeout(self.timer);
            self.timer = setTimeout(function () {
                if (self.autoClose) {
                    self.close();
                }
            }, self.duration);
        };

        // Avoid closing the notification if the mouse is over
        self.element.hover(function () {
            clearTimeout(self.timer);
        }, function () {
            autoClose();
        });

        // Show the notification
        self.element.stop(true, false).fadeIn(200, function () {
            if (self.autoClose) {
                autoClose();
            }
            if (typeof callback === "function") {
                callback.call(self);
            }
        });
        return this;
    };

    /**
     * Toggles the notification visibility
     * @param callback
     */
    Cuic.Notification.prototype.toggle = function (callback) {
        if (this.element.is(":visible")) {
            this.close(callback);
        }
        else {
            this.open(callback);
        }
        return this;
    };


})(jQuery);