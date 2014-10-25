(function ($) {
    "use strict";

    var counter = 0;

    /**
     * Creates a popup
     * @param options
     * @return {jQuery}
     */
    Cuic.popup = function (options) {
        // Set default options
        options = $.extend(true, {
            anchor: "bottom",
            autoClose: true,
            content: null,
            css: null,
            target: null,
            popupClass: "popup",
            zIndex: 10
        }, options);

        // Get the target
        var target = $(options.target);

        if (target.length === 0) {
            throw  new Error("Popup target not found : " + options.target);
        }

        // Create the popup
        var popup = $("<div>", {
            "class": options.popupClass,
            id: "popup-" + (counter += 1)
        }).appendTo(document.body);

        // Set custom styles
        Cuic.applyCss(options.css, popup);

        // Set required styles
        popup.css({
            position: "absolute",
            zIndex: options.zIndex
        });

        // Set the content
        if (options.content != null) {
            popup.html(options.content);
        }

        // Position the popup
        Cuic.anchor(popup, options.anchor, target);

        // Display the popup
        popup.hide().fadeIn(200);

        // Auto close the popup when the user clicks outside of it
        if (options.autoClose) {
            setTimeout(function () {
                $(document).on("click.popup", function (ev) {
                    $(document).off("click.popup", this);
                    var target = $(ev.target);

                    if (target !== popup && target.closest(popup).length === 0) {
                        popup.stop(true, false).fadeOut(100, function () {
                            this.remove();
                        });
                    }
                });
            }, 1);
        }
        return popup;
    };

})(jQuery);