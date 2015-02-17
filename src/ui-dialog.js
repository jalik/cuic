(function ($) {
    "use strict";

    /**
     * Creates a dialog
     * @param options
     * @constructor
     */
    Cuic.Dialog = function (options) {
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
        var title;
        var wrapper;

        // Set default options
        options = $.extend(true, {
            autoRemove: self.autoRemove,
            buttons: null,
            className: "dialog",
            container: document.body,
            content: null,
            contentHeight: null,
            contentWidth: null,
            css: null,
            draggable: self.draggable,
            position: "center",
            modal: self.modal,
            target: null,
            title: null,
            zIndex: 5
        }, options);

        // Define attributes
        self.autoClose = !!options.autoClose;
        self.autoRemove = !!options.autoRemove;
        self.draggable = !!options.draggable;
        self.modal = !!options.modal;

        // Define vars
        container = $(options.container);
        position = options.position;

        /**
         * Adds a button to the dialog
         * @param label
         * @param listener
         * @return {jQuery}
         */
        self.addButton = function (label, listener) {
            var button = $("<button>", {
                "class": "dialog-button",
                html: label
            }).appendTo(footer);

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
            var buttons = footer.children(".dialog-button");

            if (buttons.length > 1) {
                footer.show();
                buttons.css("display", "inline-block");
            }
            else if (buttons.length > 0) {
                footer.show();
                buttons.css("display", "block");
            }
            return button;
        };

        /**
         * Closes the dialog
         * @param callback
         * @return {Cuic.Dialog}
         */
        self.close = function (callback) {
            if (isOpening || (isOpened && !isClosing)) {
                isClosing = true;
                isOpening = false;

                wrapper.stop(true, false).fadeOut(200, function () {
                    if (self.autoRemove) {
                        wrapper.remove();
                    }
                });

                element.stop(true, false).fadeOut(200, function () {
                    if (callback) {
                        callback.call(self);
                    }
                    if (self.autoRemove) {
                        element.remove();
                    }
                    isClosing = false;
                    isOpened = false;
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
         * Checks if the dialog is opened
         * @return {boolean}
         */
        self.isOpened = function () {
            return isOpened;
        };

        /**
         * Opens the dialog
         * @param callback
         * @return {Cuic.Dialog}
         */
        self.open = function (callback) {
            if (isClosing || (!isOpened && !isOpening)) {
                isClosing = false;
                isOpening = true;

                // Find images
                var images = element.find("img");

                if (images.length > 0) {
                    // Position the dialog when images are loaded
                    images.on("load", function () {
                        self.resizeContent();
                    });
                } else {
                    // Position the dialog in the wrapper
                    self.resizeContent();
                }

                // If the content of the dialog has changed,
                // we need to check if there is a close button
                element.find(".dialog-close").one("click", function () {
                    self.close();
                });

                // Position the notification
                element.css({position: container.get(0).tagName === "BODY" ? "fixed" : "absolute"});

                // Set the position
                self.setPosition(position);

                // Stop animation
                element.stop(true, false);

                if (self.modal) {
                    wrapper.css({
                        height: "100%",
                        width: "100%"
                    });
                    wrapper.fadeIn(200, function () {
                        element.fadeIn(200, function () {
                            if (callback) {
                                callback.call(self);
                            }
                            isOpening = false;
                            isOpened = true;
                        });

                        // Focus the last button
                        footer.find("button:last").focus();
                    });
                } else {
                    element.fadeIn(200, function () {
                        if (callback) {
                            callback.call(self);
                        }
                        isOpening = false;
                        isOpened = true;

                        // Focus the last button
                        footer.find("button:last").focus();
                    });
                }
            }
            return self;
        };

        /**
         * Resizes the content
         * @return {Cuic.Dialog}
         */
        self.resizeContent = function () {
            var display = wrapper.css("display");
            var maxHeight = window.innerHeight;

            // Temporary display the dialog
            // to get real height values
            wrapper.show();
            element.show();

            // Use container for max height
            if (container !== document.body) {
                maxHeight = container.innerHeight();
            }

            // Set dialog max height
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

            Cuic.position(element, position, wrapper);

            // Restore the initial display state
            wrapper.css("display", display);
            element.css("display", display);

            return self;
        };

        /**
         * Sets the content
         * @param html
         * @return {Cuic.Dialog}
         */
        self.setContent = function (html) {
            body.html(html);
            return self;
        };

        /**
         * Sets the position of the dialog and optionally its container
         * @param pos
         * @param cont
         * @return {Cuic.Dialog}
         */
        self.setPosition = function (pos, cont) {
            position = pos;
            container = $(cont || container);
            Cuic.position(element, position, container);
            return self;
        };

        /**
         * Toggles the dialog visibility
         * @param callback
         * @return {Cuic.Dialog}
         */
        self.toggle = function (callback) {
            if (isClosing || (!isOpened && !isOpening)) {
                self.open(callback);
            } else {
                self.close(callback);
            }
            return self;
        };

        // If the dialog is not in a container, then it is fixed
        var fixed = container.get(0).tagName === "BODY";

        // Create the wrapper
        wrapper = $("<div>", {
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
        }).appendTo(container);

        // Create the dialog
        element = $("<div>", {
            "class": options.className,
            css: {
                display: "none",
                zIndex: options.zIndex
            }
        }).appendTo(wrapper);

        // Add the header
        header = $("<header>", {
            "class": "dialog-header",
            css: {
                display: options.title != null ? "block" : "none"
            }
        }).appendTo(element);

        // Add the title
        title = $("<h3>", {
            html: options.title,
            "class": "dialog-title"
        }).appendTo(header);

        // Add the content
        body = $("<section>", {
            "html": options.content,
            "class": "dialog-content",
            style: "overflow: auto"
        }).appendTo(element);

        // Add the footer
        footer = $("<footer>", {
            "class": "dialog-footer",
            css: {
                display: options.buttons != null ? "block" : "none"
            }
        }).appendTo(element);


        // Set custom styles
        Cuic.applyCss(options.css, element);

        // Override styles
        element.css({position: fixed ? "fixed" : "absolute"});

        // Set content height
        if (parseFloat(options.contentHeight) > 0) {
            body.css("height", options.contentHeight);
        }

        // Set content width
        if (parseFloat(options.contentWidth) > 0) {
            body.css("width", options.contentWidth);
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
        wrapper.on("click", function (ev) {
            if (!self.modal && ev.target == wrapper.get(0)) {
                self.close();
            }
        });

        // Make the dialog draggable
        self.draggable = new Cuic.Draggable({
            area: title,
            container: container,
            rootOnly: false,
            target: element
        });

        var timer;
        $(window).on("resize.dialog", function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                self.resizeContent();
            }, 50);
        });

        // Define the close shortcut
        new Cuic.Shortcut({
            keyCode: 27,
            target: element,
            callback: function () {
                self.close();
            }
        });
    };

    /**
     * Remove the dialog from the DOM when closed
     * @type {boolean}
     */
    Cuic.Dialog.prototype.autoRemove = true;

    /**
     * Is the dialog draggable
     * @type {Cuic.Draggable}
     */
    Cuic.Dialog.prototype.draggable = null;

    /**
     * Is the dialog important enough to only allow closing
     * by an explicit click on the close button
     * @type {boolean}
     */
    Cuic.Dialog.prototype.modal = true;

})(jQuery);