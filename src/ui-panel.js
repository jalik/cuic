(function ($) {
    "use strict";

    /**
     * Creates a panel
     * @param options
     * @return {jQuery}
     */
    Cuic.panel = function (options) {
        // Set default options
        options = $.extend(true, {
            animDuration: 400,
            autoClose: true,
            closeButtonClass: "panel-close",
            closeButton: "×",
            container: null,
            content: null,
            contentClass: "panel-content",
            css: null,
            footer: null,
            footerClass: "panel-footer",
            location: null,
            maximized: false,
            orientation: "horizontal",
            panelClass: "panel",
            target: null,
            title: null,
            titleClass: "panel-title",
            toggleButtonClass: "panel-toggle",
            visible: false,
            zIndex: 10
        }, options);

        var panel;

        if (options.target) {
            // Use the target as panel
            panel = $(options.target);

            if (panel.length !== 1) {
                throw new Error("Target not found : " + options.target);
            }
        } else {
            // Create the panel
            panel = $("<div>", {
                "class": options.panelClass
            });

            // Add the title
            var title = $("<header>", {
                "class": options.titleClass,
                html: options.title
            }).prependTo(panel);

            // Add the content
            var content = $("<section>", {
                "class": options.contentClass,
                html: options.content
            }).appendTo(panel);

            // Add the footer
            var footer = $("<footer>", {
                "class": options.footerClass,
                html: options.footer
            }).appendTo(panel);

            // Hide the header if not used
            if (!options.title) {
                title.hide();
            }

            // Hide the footer if not used
            if (!options.footer) {
                footer.hide();
            }
        }

        // Set custom styles
        Cuic.applyCss(options.css, panel);

        // Override styles
        panel.css({
            position: "absolute",
            zIndex: options.zIndex
        });

        // Add the panel class
        panel.addClass(options.panelClass);

        // Get the container
        var container = $(options.container || panel.parent());

        // If the panel is in the body, then we use the window as container
        if (container[0].tagName === "BODY") {
            panel.css("position", "fixed");
        } else {
            // To hide the panel in the container,
            // the container must have overflow set to hidden
            container.css("overflow", "hidden");
        }

        // Maximize the panel
        if (options.maximized) {
            switch (options.orientation) {
                case "vertical":
                    panel.css({
                        "box-sizing": "border-box",
                        top: 0,
                        height: "100%"
                    });
                    break;

                default:
                    panel.css({
                        "box-sizing": "border-box",
                        left: 0,
                        width: "100%"
                    });
            }
        }

        // Position the panel
        if (options.location) {
            Cuic.position(panel, options.location, options.container);
        }

        /**
         * Hides the panel
         * @param duration
         * @param callback
         */
        panel.hide = function (duration, callback) {
            duration = duration || 0;

            // Stop the current animation
            panel.stop(true, false);

            if (options.location.indexOf("left") > -1) {
                panel.animate({
                    left: -panel.outerWidth(true)
                }, duration, callback);
            }
            else if (options.location.indexOf("right") > -1) {
                panel.animate({
                    right: -panel.outerWidth(true)
                }, duration, callback);
            }
            else if (options.location.indexOf("bottom") > -1) {
                panel.animate({
                    bottom: -panel.outerHeight(true)
                }, duration, callback);
            }
            else if (options.location.indexOf("top") > -1) {
                panel.animate({
                    top: -panel.outerHeight(true)
                }, duration, callback);
            }
        };

        /**
         * Shows the panel
         * @param duration
         * @param callback
         */
        panel.show = function (duration, callback) {
            duration = duration || 0;

            // Stop the current animation
            panel.stop(true, false);

            if (options.location.indexOf("left") > -1) {
                panel.css({
                    left: -panel.outerWidth(true),
                    display: ""
                }).animate({
                    left: 0
                }, duration, callback);
            }
            else if (options.location.indexOf("right") > -1) {
                panel.css({
                    right: -panel.outerWidth(true),
                    display: ""
                }).animate({
                    right: 0
                }, duration, callback);
            }
            else if (options.location.indexOf("bottom") > -1) {
                panel.css({
                    bottom: -panel.outerHeight(true),
                    display: ""
                }).animate({
                    bottom: 0
                }, duration, callback);
            }
            else if (options.location.indexOf("top") > -1) {
                panel.css({
                    top: -panel.outerHeight(true),
                    display: ""
                }).animate({
                    top: 0
                }, duration, callback);
            }
        };

        /**
         * Toggles the panel visibility
         * @param duration
         */
        panel.toggle = function (duration) {
            duration = duration || 0;

            if (panel.is(":visible")) {
                panel.hide(duration);
            }
            else {
                panel.show(duration);
            }
        };

        // Watch events on the close button
        var closeButton = panel.find("." + options.closeButtonClass);
        closeButton.off("click.panel").on("click.panel", function (ev) {
            ev.preventDefault();
            panel.hide(options.animDuration);
        });

        // Watch events on the toggle button
        var toggleButton = panel.find("." + options.toggleButtonClass);
        toggleButton.off("click.panel").on("click.panel", function (ev) {
            ev.preventDefault();
            panel.slideToggle(options.animDuration);
        });

        if (options.visible) {
            panel.show(300);
        }
        else {
            panel.hide(0);
        }

        // Auto close the panel when the user clicks outside of it
        if (options.autoClose) {
            setTimeout(function () {
                $(document).on("click.panel", function (ev) {
                    $(document).off("click.panel", this);
                    var target = $(ev.target);

                    if (target !== panel && target.closest(panel).length === 0) {
                        panel.hide(300);
                    }
                });
            }, 1);
        }

        return panel;
    };

})(jQuery);