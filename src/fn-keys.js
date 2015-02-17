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
     */
    Cuic.Shortcut = function (options) {
        var self = this;

        options = $.extend(true, {
            altKey: false,
            callback: null,
            ctrlKey: false,
            shiftKey: false,
            keyCode: null,
            target: document.body
        }, options);

        // Define attributes
        self.altKey = options.altKey;
        self.callback = options.callback;
        self.ctrlKey = options.ctrlKey;
        self.keyCode = options.keyCode;
        self.shiftKey = options.shiftKey;

        // Get the target
        var target = $(options.target);

        // Watch key up event
        target.on("keyup", function (ev) {
            if (self.keyCode === ev.keyCode
                && self.altKey === ev.altKey
                && self.ctrlKey === ev.ctrlKey
                && self.shiftKey === ev.shiftKey) {
                options.callback.call(target);
            }
        });
    };

    /**
     * Should alt key be pressed
     * @type {boolean}
     */
    Cuic.Shortcut.prototype.altKey = false;

    /**
     * The callback method
     * @type {function}
     */
    Cuic.Shortcut.prototype.callback = null;

    /**
     * Should ctrl key be pressed
     * @type {boolean}
     */
    Cuic.Shortcut.prototype.ctrlKey = false;

    /**
     * The key code
     * @type {number}
     */
    Cuic.Shortcut.prototype.keyCode = null;

    /**
     * Should shift key be pressed
     * @type {boolean}
     */
    Cuic.Shortcut.prototype.shiftKey = false;

})(jQuery);