(function ($) {
    "use strict";

    /**
     * Creates a dialog
     * @param options
     * @return {Cuic.Dialog}
     */
    Cuic.dialog = function (options) {
        return new Cuic.Dialog(options);
    };

    /**
     * Creates a dialog
     * @param options
     * @constructor
     */
    Cuic.Dialog = function (options) {
        var self = this;

        // Set default options
        options = $.extend(true, {
            autoRemove: self.autoRemove,
            buttons: null,
            classes: "dialog",
            container: null,
            content: null,
            contentHeight: null,
            contentWidth: null,
            css: null,
            draggable: self.draggable,
            location: self.location,
            modal: self.modal,
            target: null,
            title: null,
            zIndex: self.zIndex
        }, options);

        // Copy options
        self.autoRemove = options.autoRemove;
        self.draggable = options.draggable;
        self.location = options.location;
        self.modal = options.modal;

        // Get the container
        self.container = $(options.container || document.body);

        // If the dialog is not in a container, then it is fixed
        var fixed = self.container[0].tagName === "BODY";

        // Create the wrapper
        self.wrapper = $("<div>", {
            "class": "dialog-wrapper",
            css: {
                display: "none",
                height: "100%",
                left: 0,
                position: fixed ? "fixed" : "absolute",
                top: 0,
                width: "100%",
                zIndex: options.zIndex
            }
        }).appendTo(self.container);

        // Create the dialog
        self.element = $("<div>", {
            "class": options.classes,
            display: "none"
        }).appendTo(self.wrapper);

        Cuic.shortcut({
            key: "Esc",
            target: self.element
        }, function () {
            self.close();
        });

        // Add the header
        self.header = $("<header>", {
            "class": "dialog-header",
            css: {
                display: options.title != null ? "block" : "none"
            }
        }).appendTo(self.element);

        // Add the title
        self.title = $("<h3>", {
            html: options.title,
            "class": "dialog-title"
        }).appendTo(self.header);

        // Add the content
        self.content = $("<section>", {
            "html": options.content,
            "class": "dialog-content",
            style: "overflow: auto"
        }).appendTo(self.element);

        // Add the footer
        self.footer = $("<footer>", {
            "class": "dialog-footer",
            css: {
                display: options.buttons != null ? "block" : "none"
            }
        }).appendTo(self.element);


        // Set custom styles
        Cuic.applyCss(options.css, self.element);

        // Override styles
        self.element.css({
            position: fixed ? "fixed" : "absolute"
        });

        // Set content height
        if (parseFloat(options.contentHeight) > 0) {
            self.content.css("height", options.contentHeight);
        }

        // Set content width
        if (parseFloat(options.contentWidth) > 0) {
            self.content.css("width", options.contentWidth);
        }

        // Add the buttons
        if (options.buttons instanceof Array) {
            for (var i = 0; i < options.buttons.length; i += 1) {
                var btn = options.buttons[i];
                self.addButton(btn.label, btn.callback)
            }
        }

        // If the dialog is not modal,
        // a click on the wrapper will close the dialog
        self.wrapper.on("click", function (ev) {
            if (!self.modal && ev.target == self.wrapper[0]) {
                self.close();
            }
        });

        // Make the dialog draggable
        if (self.draggable) {
            new Cuic.Draggable({
                area: self.header,
                container: self.container,
                target: self.element
            });
        }
    };

    /**
     * Remove the dialog from the DOM when closed
     * @type {boolean}
     */
    Cuic.Dialog.prototype.autoRemove = true;

    /**
     * The container used to position the dialog
     * @type {HTMLElement}
     */
    Cuic.Dialog.prototype.container = document.body;

    /**
     * The dialog content
     * @type {jQuery}
     */
    Cuic.Dialog.prototype.content = null;

    /**
     * Is the dialog draggable
     * @type {boolean}
     */
    Cuic.Dialog.prototype.draggable = true;

    /**
     * The dialog footer
     * @type {jQuery}
     */
    Cuic.Dialog.prototype.footer = null;

    /**
     * The dialog header
     * @type {jQuery}
     */
    Cuic.Dialog.prototype.header = null;

    /**
     * Where to display the dialog
     * @type {string}
     */
    Cuic.Dialog.prototype.location = "center";

    /**
     * Is the dialog important enough to only allow closing
     * by an explicit click on the close button
     * @type {boolean}
     */
    Cuic.Dialog.prototype.modal = true;

    /**
     * The dialog z-position
     * @type {number}
     */
    Cuic.Dialog.prototype.zIndex = 1;

    /**
     * Adds a button to the dialog
     * @param label
     * @param listener
     * @return {jQuery}
     */
    Cuic.Dialog.prototype.addButton = function (label, listener) {
        var self = this;
        var button = $("<button>", {
            "class": "dialog-button",
            html: label
        }).appendTo(self.footer);

        // By default a button closes the dialog
        if (!listener) {
            listener = "close";
        }

        if (typeof listener === "function") {
            button.on("click", function (ev) {
                listener.call(self, ev);
            });
        }
        else {
            switch (listener) {
                case "close":
                    button.on("click", function () {
                        self.close();
                    });
                    break;
            }
        }

        // Resize buttons
        var buttons = self.footer.children(".dialog-button");

        if (buttons.length > 1) {
            self.footer.show();
            buttons.css("display", "inline-block");
        }
        else if (buttons.length > 0) {
            self.footer.show();
            buttons.css("display", "block");
        }
        return button;
    };

    /**
     * Closes the dialog
     * @param callback
     * @return {Cuic.Dialog}
     */
    Cuic.Dialog.prototype.close = function (callback) {
        var self = this;

        if (self.element.is(":visible")) {
            self.element.stop(true, false).fadeOut(200, function () {
                self.wrapper.stop(true, false).fadeOut(200, function () {
                    if (self.autoRemove) {
                        self.wrapper.remove();
                    }
                    if (typeof callback === "function") {
                        callback.call(self);
                    }
                });
            });
        }
        return self;
    };

    /**
     * Opens the dialog
     * @param callback
     * @return {Cuic.Dialog}
     */
    Cuic.Dialog.prototype.open = function (callback) {
        var self = this;

        if (!self.element.is(":visible")) {
            var images = self.element.find("img");

            if (images.length > 0) {
                // Position the dialog when images are loaded
                images.on("load", function () {
                    self.resizeContent();
                });
            }
            else {
                // Position the dialog in the wrapper
                self.resizeContent();
            }

            if (self.modal) {
                self.wrapper.css({
                    height: "100%",
                    width: "100%"
                });
            }

            // Display the wrapper, then the dialog
            self.wrapper.fadeIn(200, function () {
                self.element.fadeIn(200, callback);

                // Focus the last button
                self.footer.find("button:last").focus();

                var timer;

                $(window).on("resize.dialog", function () {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        self.resizeContent();
                    }, 50);
                });
            });
        }
        return self;
    };

    /**
     * Resizes the content
     * @return {Cuic.Dialog}
     */
    Cuic.Dialog.prototype.resizeContent = function () {
        var self = this;
        var display = self.wrapper.css("display");
        var maxHeight = window.innerHeight;

        // Temporary display the dialog
        // to get real height values
        self.wrapper.show();
        self.element.show();

        // Use container for max height
        if (self.container !== document.body) {
            maxHeight = self.container.innerHeight();
        }

        // Set dialog max height
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

        Cuic.position(self.element, self.location, self.wrapper);

        // Restore the initial display state
        self.wrapper.css("display", display);
        self.element.css("display", display);

        return self;
    };

    /**
     * Toggles the dialog visibility
     * @param callback
     * @return {Cuic.Dialog}
     */
    Cuic.Dialog.prototype.toggle = function (callback) {
        if (this.element.is(":visible")) {
            this.close(callback);
        }
        else {
            this.open(callback);
        }
        return this;
    };

})(jQuery);