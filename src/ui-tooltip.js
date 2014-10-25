(function ($) {
    "use strict";

    var tooltip;

    /**
     * Creates a tooltip
     * @param options
     * @return {jQuery}
     */
    Cuic.tooltip = function (options) {
        // Set default options
        options = $.extend(true, {
            anchor: "bottom",
            anim: {
                open: function (tt) {
                    tt.fadeIn(200);
                },
                close: function (tt) {
                    tt.fadeOut(100);
                }
            },
            css: null,
            target: null,
            tooltipClass: "tooltip",
            zIndex: 10
        }, options);

        // Get the target
        var target = $(options.target);

        // Remove attached listeners
        target.off("mouseenter mouseleave");
        target.hover(function (ev) {
            showTooltip($(ev.currentTarget), options);

        }, function (ev) {
            hideTooltip($(ev.currentTarget), options);
        });

        return target;
    };

    /**
     * Creates a tooltip
     * @param options
     * @return {jQuery}
     */
    function createTooltip(options) {
        if (!tooltip) {
            tooltip = $("<div>", {
                "class": options.tooltipClass
            }).appendTo(document.body);
        }

        // Set custom styles
        Cuic.applyCss(options.css, tooltip);

        // Set required styles
        tooltip.css({
            position: "absolute",
            zIndex: options.zIndex
        });

        return tooltip;
    }

    /**
     * Hides the tooltip
     * @param target
     * @param options
     */
    function hideTooltip(target, options) {
        var tooltip = createTooltip(options);
        tooltip.stop(true, false);
        options.anim.close(tooltip);
        target.attr("title", target.attr("data-title"));
    }

    /**
     * Shows the tooltip
     * @param target
     * @param options
     */
    function showTooltip(target, options) {
        // Set default options
        options = $.extend(true, {
            anchor: "bottom"
        }, options);

        if (target.attr("title")) {
            // Create the tooltip
            var tooltip = createTooltip(options);

            // Stop current animation
            tooltip.stop(true, false);

            // Reset dimensions
            tooltip.css({
                bottom: "",
                left: "",
                right: "",
                top: "",
                height: "",
                width: ""
            });

            // Add the content
            tooltip.html(target.attr("title"));
            target.attr("data-title", target.attr("title"));
            target.removeAttr("title");

            // Position the tooltip
            Cuic.anchor(tooltip, options.anchor, target);

            options.anim.open(tooltip);
        }
    }

})(jQuery);