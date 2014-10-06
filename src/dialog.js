(function ($) {
    "use strict";

    var counter = 0;

    /**
     * Creates a dialog
     * @param options
     * @return {jQuery}
     */
    Cuic.dialog = function (options) {
        // Set default options
        options = $.extend(true, {
            buttons: [],
            container: null,
            content: null,
            css: null,
            location: "center",
            modal: true,
            target: null,
            title: null,
            zIndex: 90
        }, options);

        // Get the container
        var container = $(options.container || document.body);

        // If the dialog is not in a container, then it is fixed
        var fixed = container[0].tagName === "BODY";

        // Create the wrapper
        var wrapper = $("<div>", {
            "class": "dialog-wrapper",
            css: {
                height: "100%",
                left: 0,
                position: fixed ? "fixed" : "absolute",
                top: 0,
                width: "100%",
                zIndex: options.zIndex + counter
            }
        }).appendTo(container);

        // Create the dialog
        var dialog = $("<div>", {
            "class": "dialog"
        }).appendTo(wrapper);

        // Set custom styles
        Cuic.applyCss(options.css, dialog);

        // Override styles
        dialog.css({
            position: fixed ? "fixed" : "absolute"
        });

        // Add the header
        var header = $("<header>", {
            "class": "dialog-header"
        }).appendTo(dialog);

        // Add the title
        var title = $("<h3>", {
            html: options.title,
            "class": "dialog-title"
        }).appendTo(header);

        // Add the content
        var content = $("<section>", {
            "html": options.content,
            "class": "dialog-content",
            style: "overflow: auto"
        }).appendTo(dialog);

        // Add the footer
        var footer = $("<footer>", {
            "class": "dialog-footer"
        }).appendTo(dialog);

        // Add the buttons
        if (options.buttons) {
            for (var i = 0; i < options.buttons.length; i += 1) {
                var btn = options.buttons[i];
                var button = $("<div>", {
                    "class": "dialog-button",
                    html: btn.label
                }).appendTo(footer);

                // By default a button closes the dialog
                if (!btn.callback) {
                    btn.callback = "close";
                }

                if (typeof btn.callback === "function") {
                    (function (btn) {
                        button.on("click", function (ev) {
                            btn.callback.call(dialog, ev);
                        });
                    })(btn);
                }
                else {
                    switch (btn.callback) {
                        case "close":
                            button.on("click", function () {
                                dialog.close();
                            });
                            break;
                    }
                }
            }

            if (options.buttons.length > 1) {
                footer.children(".dialog-button").css("display", "inline-block");
            }
            else if (options.buttons.length > 0) {
                footer.children(".dialog-button").css("display", "block");
            }
        }

        function resizeContent() {
            var headerHeight = header.outerHeight();
            var footerHeight = footer.outerHeight();
            var contentPadding = content.innerHeight() - content.height();
            content.css("height", dialog.height() - headerHeight - footerHeight - contentPadding);
        }

        dialog.close = function () {
            dialog.fadeOut(200, function () {
                var wrapper = dialog.parent(".dialog-wrapper");

                // Remove the dialog from the DOM
                dialog.remove();

                if (wrapper.length == 1) {
                    wrapper.fadeOut(200, function () {
                        // Remove the builder from the DOM
                        wrapper.remove();
                    });
                }
            });
            return this;
        };

        if (!options.modal) {
            // If the dialog is not modal,
            // a click on the wrapper will close the dialog
            wrapper.on("click", function (ev) {
                if (ev.currentTarget == ev.target) {
                    dialog.close();
                }
            });
        }

        var timer;

        $(window).on("resize.dialog", function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                Cuic.position(dialog, options.location, wrapper);
            }, 200);
        });

        //
        var images = dialog.find("img");

        if (images.length > 0) {
            // Position the notification when images are loaded
            dialog.find("img").on("load", function () {
                Cuic.position(dialog, options.location, wrapper);
                resizeContent();
            });
        }
        else {
            // Position the notification
            Cuic.position(dialog, options.location, wrapper);
            resizeContent();
        }

        // Display the dialog
        dialog.hide();
        wrapper.hide().fadeIn(200, function () {
            dialog.fadeIn(200);
        });

        return dialog;
    };

})(jQuery);