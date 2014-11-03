(function ($) {
    "use strict";

    Cuic.keys = {
        BACKSPACE: 8,
        DEL: 46,
        DOWN: 40,
        ENTER: 13,
        ESC: 27,
        INSERT: 45,
        LEFT: 37,
        MINUS: 109,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        PLUS: 107,
        RIGHT: 39,
        TAB: 9,
        UP: 38
    };

    /**
     * Creates a shortcut
     * @param options
     * @param callback
     */
    Cuic.shortcut = function (options, callback) {
        options = $.extend(true, {
            altKey: false,
            ctrlKey: false,
            shiftKey: false,
            keyCode: null,
            key: null,
            target: null
        }, options);

        // Get the target
        var target = $(options.target);

        if (typeof callback !== "function") {
            throw  new Error("Callback is not a function");
        }

        // Monitor key up events
        var keyUp = function (ev) {
            if (ev.keyCode === options.keyCode || ev.key === options.key) {
                if (target.length === 0) {
                    $(document).off("keyup.dialog", keyUp);
                    callback.call();
                }
                else if ($(document.activeElement).closest(target).length > 0) {
                    $(document).off("keyup.dialog", keyUp);
                    callback.call(target);
                }
            }
        };
        $(document).on("keyup.dialog", keyUp);
    };

})(jQuery);