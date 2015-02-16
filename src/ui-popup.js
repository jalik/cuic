(function ($) {
    "use strict";

    /**
     * Creates a popup
     * @param options
     * @constructor
     */
    Cuic.Popup = function (options) {
        var self = this;

        // Set default options
        options = $.extend(true, {
            anchor: self.anchor,
            autoClose: self.autoClose,
            autoRemove: self.autoRemove,
            classes: "popup",
            content: null,
            css: null,
            target: null,
            zIndex: self.zIndex
        }, options);

        // Set options
        self.anchor = options.anchor;
        self.autoClose = options.autoClose;
        self.autoRemove = options.autoRemove;

        // Get the target
        self.target = $(options.target);

        if (self.target.length === 0) {
            throw  new Error("Popup target not found : " + options.target);
        }

        // Create the popup element
        self.element = $("<div>", {
            "class": options.classes,
            css: {display: "none"}
        }).appendTo(document.body);

        // Set custom styles
        Cuic.applyCss(options.css, self.element);

        // Set required styles
        self.element.css({
            position: "absolute",
            zIndex: options.zIndex
        });

        // Set popup content
        if (options.content != null) {
            self.element.html(options.content);
        }

        // Close the popup when the user clicks outside of it
        $(document).on("click.popup", function (ev) {
            var fn = this;
            var target = $(ev.target);

            if (target !== self.element && target.closest(self.element).length === 0) {
                if (self.autoClose && !self.element.is(":animated")) {
                    self.close();

                    if (self.autoRemove) {
                        $(document).off("click.popup", fn);
                    }
                }
            }
        });
    };

    /**
     * Where to display the popup
     * @type {string}
     */
    Cuic.Popup.prototype.anchor = "right";

    /**
     * Close the popup when the user clicks outside
     * @type {boolean}
     */
    Cuic.Popup.prototype.autoClose = true;

    /**
     * Remove the popup from the DOM when closed
     * @type {boolean}
     */
    Cuic.Popup.prototype.autoRemove = true;

    /**
     * The HTML popup element
     * @type {jQuery}
     */
    Cuic.Popup.prototype.element = null;

    /**
     * The target used to position the popup
     * @type {jQuery}
     */
    Cuic.Popup.prototype.target = null;

    /**
     * The popup z-position
     * @type {number}
     */
    Cuic.Popup.prototype.zIndex = 1;

    /**
     * Closes the popup
     * @param callback
     */
    Cuic.Popup.prototype.close = function (callback) {
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
     * Opens the popup
     * @param callback
     */
    Cuic.Popup.prototype.open = function (callback) {
        var self = this;

        // If the content of the popup has changed,
        // we need to check if there is a close button
        self.element.find(".popup-close").one("click", function () {
            self.close();
        });

        // Position the popup
        Cuic.anchor(this.element, this.anchor, this.target);

        // Show the popup
        self.element.stop(true, false).fadeIn(200, callback);

        return this;
    };

    /**
     * Toggles the popup visibility
     * @param callback
     */
    Cuic.Popup.prototype.toggle = function (callback) {
        if (this.element.is(":visible")) {
            this.close(callback);
        }
        else {
            this.open(callback);
        }
        return this;
    };

})(jQuery);