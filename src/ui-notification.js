(function ($) {
    "use strict";

    /**
     * Creates a notification
     * @param options
     * @constructor
     */
    Cuic.Notification = function (options) {
        var self = this;

        // Set default options
        options = $.extend(true, {
            autoClose: self.autoClose,
            autoRemove: self.autoRemove,
            classes: "notification",
            closeButton: "×",
            container: null,
            content: null,
            css: null,
            duration: self.duration,
            location: self.location,
            zIndex: self.zIndex
        }, options);

        // Copy options
        self.autoClose = options.autoClose;
        self.autoRemove = options.autoRemove;
        self.duration = options.duration;
        self.location = options.location;

        // Get the container
        self.container = $(options.container || document.body);

        // Create the element
        self.element = $("<div>", {
            "class": options.classes,
            html: options.content
        }).appendTo(self.container);

        // Set custom styles
        Cuic.applyCss(options.css, self.element);

        // Override styles
        self.element.css({
            display: "none"
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
     * @type {string}
     */
    Cuic.Notification.prototype.location = "center";

    /**
     * Tells if the notification is visible
     * @type {boolean}
     */
    Cuic.Notification.prototype.visible = false;

    /**
     * The notification z-position
     * @type {number}
     */
    Cuic.Notification.prototype.zIndex = 1;

    /**
     * Closes the notification
     * @param callback
     */
    Cuic.Notification.prototype.close = function (callback) {
        var self = this;

        if (self.visible) {
            self.element.stop(true, false).fadeOut(200, function () {
                if (typeof callback === "function") {
                    callback.call(self);
                }
                if (self.autoRemove) {
                    self.element.remove();
                }
                self.visible = false;
            });
        }
        return self;
    };

    /**
     * Opens the notification
     * @param callback
     */
    Cuic.Notification.prototype.open = function (callback) {
        var self = this;

        if (!self.visible) {
            var autoClose = function () {
                clearTimeout(self.timer);
                self.timer = setTimeout(function () {
                    if (self.autoClose) {
                        self.close();
                    }
                }, self.duration);
            };

            // If the content of the notification has changed,
            // we need to check if there is a close button
            self.element.find(".notification-close").one("click", function () {
                self.close();
            });

            // Avoid closing the notification if the mouse is over
            self.element.hover(function () {
                clearTimeout(self.timer);
            }, function () {
                autoClose();
            });

            // Position the notification
            self.element.css({
                position: self.container[0].tagName === "BODY" ? "fixed" : "absolute",
                zIndex: self.zIndex
            });
            Cuic.position(self.element, self.location, self.container);

            // Show the notification
            self.element.stop(true, false).fadeIn(200, function () {
                if (self.autoClose) {
                    autoClose();
                }
                if (typeof callback === "function") {
                    callback.call(self);
                }
                self.visible = true;
            });
        }
        return self;
    };

    /**
     * Toggles the notification visibility
     * @param callback
     */
    Cuic.Notification.prototype.toggle = function (callback) {
        if (this.element.is(":visible")) {
            this.close(callback);
        } else {
            this.open(callback);
        }
        return this;
    };

    /**
     * Creates a notification area
     * @param options
     * @constructor
     */
    Cuic.Notification.Stack = function (options) {
        var self = this;

        // Set default options
        options = $.extend(true, {
            classes: "notification-area",
            container: null,
            css: null,
            location: self.location,
            zIndex: self.zIndex
        }, options);

        // Copy options
        self.location = options.location;

        // Get the container
        self.container = $(options.container || document.body);

        // Create the element
        self.element = $("<div>", {
            "class": options.classes,
            html: options.content
        }).appendTo(self.container);

        // Set custom styles
        Cuic.applyCss(options.css, self.element);

        // Override styles
        self.element.css({
            position: self.container[0].tagName === "BODY" ? "fixed" : "absolute",
            zIndex: self.zIndex
        });

        // Position the element
        Cuic.position(self.element, self.location, self.container);
    };

    /**
     * Display a notification on the stack
     * @param options
     * @param callback
     */
    Cuic.Notification.Stack.prototype.add = function (options, callback) {
        var self = this;
        options = $.extend({}, options, {
            container: self.element,
            location: ""
        });

        var notif = new Cuic.Notification(options);
        var element = notif.element;

        var original = {
            height: element.height(),
            marginBottom: element.css("margin-bottom"),
            marginTop: element.css("margin-top"),
            opacity: 1,
            overflow: "",
            paddingBottom: element.css("padding-bottom"),
            paddingTop: element.css("padding-top")
        };

        var autoClose = function () {
            clearTimeout(notif.timer);
            notif.timer = setTimeout(function () {
                if (notif.autoClose) {
                    notif.close();
                }
            }, notif.duration);
        };

        // If the content of the notification has changed,
        // we need to check if there is a close button
        notif.element.find(".notification-close").one("click", function () {
            notif.close();
        });

        // Avoid closing the notification if the mouse is over
        notif.element.hover(function () {
            clearTimeout(notif.timer);
        }, function () {
            autoClose();
        });

        // Insert the notification
        if (self.location.indexOf("bottom") !== -1) {
            self.element.append(notif.element);
        } else {
            self.element.prepend(notif.element);
        }

        // Display the notification
        notif.element.css({
            display: "block",
            height: 0,
            marginBottom: 0,
            marginTop: 0,
            opacity: 0,
            overflow: "hidden",
            paddingBottom: 0,
            paddingTop: 0
        }).animate(original, 200, function () {
            if (notif.autoClose) {
                autoClose();
            }
            if (typeof callback === "function") {
                callback.call(notif);
            }
            notif.visible = true;
        });
    };

    /**
     * Returns the number of elements in the stack
     * @return {Number}
     */
    Cuic.Notification.Stack.getLength = function () {
        return this.element.children().length;
    };

    /**
     * The container used to position the notifications
     * @type {HTMLElement}
     */
    Cuic.Notification.Stack.prototype.container = document.body;

    /**
     * The notification area element
     * @type {jQuery}
     */
    Cuic.Notification.Stack.prototype.element = null;

    /**
     * Where to display the notifications
     * @type {string}
     */
    Cuic.Notification.Stack.prototype.location = "center";

    /**
     * The notifications z-position
     * @type {number}
     */
    Cuic.Notification.Stack.prototype.zIndex = 1;

})
(jQuery);