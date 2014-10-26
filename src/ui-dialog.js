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
            autoRemove: true,
            buttons: [],
            classes: "dialog",
            container: null,
            content: null,
            css: null,
            location: "center",
            modal: true,
            target: null,
            title: null,
            zIndex: 10
        }, options);

        // Copy options
        self.autoRemove = options.autoRemove;
        self.container = options.container;
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

        // Add the header
        self.header = $("<header>", {
            "class": "dialog-header"
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
            "class": "dialog-footer"
        }).appendTo(self.element);


        // Set custom styles
        Cuic.applyCss(options.css, self.element);

        // Override styles
        self.element.css({
            position: fixed ? "fixed" : "absolute"
        });


        // Add the buttons
        if (options.buttons) {
            for (var i = 0; i < options.buttons.length; i += 1) {
                var btn = options.buttons[i];
                self.addButton(btn.label, btn.listener)
            }
        }

        // If the dialog is not modal,
        // a click on the wrapper will close the dialog
        self.wrapper.on("click", function (ev) {
            if (!self.modal && ev.currentTarget == self.wrapper[0]) {
                self.close();
            }
        });
    };

    /**
     * The container used to position the dialog
     * @type {HTMLElement}
     */
    Cuic.Dialog.prototype.container = document.body;

    /**
     * The the dialog content
     * @type {jQuery}
     */
    Cuic.Dialog.prototype.content = null;

    /**
     * The the dialog footer
     * @type {jQuery}
     */
    Cuic.Dialog.prototype.footer = null;

    /**
     * The the dialog header
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
     * Adds a button to the dialog
     * @param label
     * @param listener
     * @return {jQuery}
     */
    Cuic.Dialog.prototype.addButton = function (label, listener) {
        var self = this;
        var button = $("<div>", {
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
        buttons.css("display", buttons.length > 1 ? "inline-block" : "block");

        return button;
    };

    /**
     * Closes the dialog
     * @param callback
     */
    Cuic.Dialog.prototype.close = function (callback) {
        var self = this;

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
        return this;
    };

    /**
     * Opens the dialog
     * @param callback
     */
    Cuic.Dialog.prototype.open = function (callback) {
        var self = this;

        function resizeContent() {
            var headerHeight = self.header.outerHeight();
            var footerHeight = self.footer.outerHeight();
            var contentPadding = self.content.innerHeight() - self.content.height();
            self.content.css("height", self.element.height() - headerHeight - footerHeight - contentPadding);
        }

        if (self.element.find("img").length > 0) {
            // Position the dialog when images are loaded
            self.element.find("img").on("load", function () {
                // todo clean code
                self.wrapper.show();
                self.element.show();
                Cuic.position(self.element, self.location, self.wrapper);
                resizeContent();
                self.element.hide();
                self.wrapper.hide();
            });
        }
        else {
            // Position the dialog in the wrapper
            // todo clean code
            self.wrapper.show();
            self.element.show();
            Cuic.position(self.element, self.location, self.wrapper);
            resizeContent();
            self.element.hide();
            self.wrapper.hide();
        }

        // Display the wrapper, then the dialog
        self.wrapper.fadeIn(200, function () {
            self.element.fadeIn(200, callback);

            var timer;
            $(window).on("resize.dialog", function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    Cuic.position(self.element, self.location, self.wrapper);
                }, 50);
            });
        });
        return this;
    };

    /**
     * Toggles the dialog visibility
     * @param callback
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