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
            attachedClass: "attached",
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

        // Get the top offset of the target
        var targetOffsetTop = target.offset().top;

        // Create the spacer item that will replace
        // the bar when it is scrolled
        var spacer = $("<div>", {
            css: {
                display: "none"
            }
        }).insertBefore(target);

        /**
         * Hook the bar to the viewport
         */
        target.hook = function () {
            targetOffsetTop = target.offset().top;
            spacer.css({
                display: "block",
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
            }).addClass(options.attachedClass);

            // Execute the hooked callback
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
            }).removeClass(options.attachedClass);
            targetOffsetTop = target.offset().top;

            // Execute the unhooked callback
            if (typeof options.onUnhook === "function") {
                options.onUnhook.call(target);
            }
        };

        var onScroll = function () {
            if (win.scrollTop() > targetOffsetTop - parseFloat(target.css("margin-top"))) {
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
        win.off("scroll.hook");
        win.on("scroll.hook", function () {
            onScroll();
        });

        return target;
    };

})(jQuery);