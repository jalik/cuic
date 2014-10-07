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
            animDuration: 500,
            closeButtonClass: "panel-close",
            closeButton: "×",
            closed: false,
            container: null,
            content: null,
            contentClass: "panel-content",
            css: null,
            footer: null,
            footerClass: "panel-footer",
            location: "left",
            panelClass: "panel",
            target: null,
            title: null,
            titleClass: "panel-title",
            zIndex: 70
        }, options);

        var panel;

        if (options.target) {
            // Use the target as panel
            panel = $(options.target);
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

        // Reset the size
        panel.css({
            width: "auto",
            height: "auto"
        });

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
        var containerHeight = container.height();
        var containerWidth = container.width();

        // If the panel is in the body, then we use the window as container
        if (container[0].tagName === "BODY") {
            containerHeight = $(window).innerHeight();
            containerWidth = $(window).innerWidth();
            panel.css("position", "fixed");
        } else {
            // To hide the panel in the container,
            // the container must have overflow set to hidden
            container.css("overflow", "hidden");
        }

        // Make the panel fit the container
        switch (options.location) {
            case "bottom":
            case "top":
                panel.width("100%");
                break;

            default :
            case "left":
            case "right":
                panel.height("100%");
                break;
        }

        // Position the panel
        Cuic.position(panel, options.location, options.container);

        /**
         * Hides the panel
         * @param duration
         * @param callback
         */
        panel.hide = function (duration, callback) {
            duration = duration || 0;

            // Stop the current animation
            panel.stop(true, false);

            switch (options.location) {
                case "bottom":
                    panel.animate({
                        bottom: -panel.outerHeight(true)
                    }, duration, callback);
                    break;

                case "left":
                    panel.animate({
                        left: -panel.outerWidth(true)
                    }, duration, callback);
                    break;

                case "right":
                    panel.animate({
                        right: -panel.outerWidth(true)
                    }, duration, callback);
                    break;

                case "top":
                    panel.animate({
                        top: -panel.outerHeight(true)
                    }, duration, callback);
                    break;
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

            switch (options.location) {
                case "bottom":
                    panel.css({
                        bottom: -panel.outerHeight(true),
                        display: ""
                    }).animate({
                        bottom: 0
                    }, duration, callback);
                    break;

                case "left":
                    panel.css({
                        left: -panel.outerWidth(true),
                        display: ""
                    }).animate({
                        left: 0
                    }, duration, callback);
                    break;

                case "right":
                    panel.css({
                        right: -panel.outerWidth(true),
                        display: ""
                    }).animate({
                        right: 0
                    }, duration, callback);
                    break;

                case "top":
                    panel.css({
                        top: -panel.outerHeight(true),
                        display: ""
                    }).animate({
                        top: 0
                    }, duration, callback);
                    break;
            }
        };

        // Watch events on the close button
        panel.find(".close-button").off("click.panel").on("click.panel", function (ev) {
            ev.preventDefault();
            panel.hide(options.animDuration);
        });

        if (options.closed) {
            panel.hide(options.animDuration);
        }
        else {
            panel.show(options.animDuration);
        }

        return panel;
    };

})(jQuery);