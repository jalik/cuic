(function ($) {
    "use strict";

    /**
     * Hook an element to the viewport,
     * so it is scrolled with the viewport
     * @param options
     * @return {*}
     */
    Cuic.hook = function (options) {
        // Set default options
        options = $.extend(true, {
            hookedClass: "hooked",
            onHook: null,
            onUnhook: null,
            target: null,
            zIndex: 10
        }, options);

        var win = $(window);

        // Get the target
        var target = $(options.target);
        if (target.length !== 1) {
            throw new Error("Target not found : " + options.target);
        }

        // This is a fix to avoid offsetTop > 0
        target.css({
            position: "relative",
            top: "",
            width: ""
        });

        // Create the spacer item that will replace
        // the bar when it is scrolled
        var spacer = $("<div>", {
            css: { display: "none" }
        }).insertBefore(target);

        /**
         * Hook the target to the viewport
         */
        target.hook = function () {
            spacer.css({
                display: target.css("display"),
                float: target.css("float"),
                height: target.height(),
                marginBottom: target.css("margin-bottom"),
                marginLeft: target.css("margin-left"),
                marginRight: target.css("margin-right"),
                marginTop: target.css("margin-top"),
                width: target.width()
            });
            target.css({
                position: "fixed",
                top: 0,
                width: spacer.width(),
                zIndex: options.zIndex
            }).addClass(options.hookedClass);

            // Execute the hooked listener
            if (typeof options.onHook === "function") {
                options.onHook.call(target);
            }
        };

        /**
         * Unhook the bar from the viewport
         */
        target.unhook = function () {
            spacer.hide();
            target.css({
                position: "relative",
                top: "",
                width: ""
            }).removeClass(options.hookedClass);

            // Execute the unhooked listener
            if (typeof options.onUnhook === "function") {
                options.onUnhook.call(target);
            }
        };

        // Get the target's top offset
        var offsetTop = target.offset().top;

        var onScroll = function () {
            if (win.scrollTop() > offsetTop - parseFloat(target.css("margin-top"))) {
                if (target.css("position") !== "fixed") {
                    target.hook();
                }
            }
            else if (target.css("position") !== "relative") {
                target.unhook();
            }
        };

        // If the window is scrolled when reloading the page,
        // the bar must be shown
        onScroll();

        // Scroll the bar when the window is scrolled
        win.on("scroll.hook", function () {
            onScroll();
        });

        return target;
    };

})(jQuery);