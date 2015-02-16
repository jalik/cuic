(function ($) {
    "use strict";

    /**
     * Creates a tooltip
     * @param options
     * @constructor
     */
    Cuic.Tooltip = function (options) {
        var self = this;

        // Set default options
        options = $.extend(true, {
            anchor: self.anchor,
            attribute: self.attribute,
            classes: "tooltip",
            css: null,
            followPointer: self.followPointer,
            target: null,
            zIndex: self.zIndex
        }, options);

        // Set options
        self.anchor = options.anchor;
        self.attribute = options.attribute;
        self.followPointer = options.followPointer;
        self.zIndex = options.zIndex;

        // Get the target
        self.target = $(options.target);

        // Create the element
        self.element = $("<div>", {
            "class": options.classes
        }).appendTo(document.body);

        // Set custom styles
        Cuic.applyCss(options.css, self.element);

        // Set required styles
        self.element.css({
            display: "none",
            position: "absolute",
            zIndex: options.zIndex
        });

        self.target.each(function () {
            var target = $(this);
            var text = target.attr(self.attribute);

            target.on("mouseenter", function (ev) {
                target.attr("data-tooltip", text);
                target.attr(self.attribute, "");
                self.element.html(text);

                if (self.followPointer) {
                    Cuic.anchor(self.element, self.anchor, [ev.pageX, ev.pageY]);
                } else {
                    Cuic.anchor(self.element, self.anchor, target);
                }
                self.open();
            });

            target.on("mousemove", function (ev) {
                if (self.followPointer) {
                    Cuic.anchor(self.element, self.anchor, [ev.pageX, ev.pageY]);
                }
            });

            target.on("mouseleave", function (ev) {
                var text = target.attr("data-tooltip");
                target.attr("data-tooltip", "");
                target.attr(self.attribute, text);
                self.close();
            });
        });
    };

    /**
     * Where to display the tooltip
     * @type {string}
     */
    Cuic.Tooltip.prototype.anchor = "right";

    /**
     * The attribute used to get the tooltip content
     * @type {string}
     */
    Cuic.Tooltip.prototype.attribute = "title";

    /**
     * The tooltip element
     * @type {jQuery}
     */
    Cuic.Tooltip.prototype.element = null;

    /**
     * Tells if the notification follows the pointer
     * @type {boolean}
     */
    Cuic.Tooltip.prototype.followPointer = true;

    /**
     * The target used to position the tooltip
     * @type {jQuery}
     */
    Cuic.Tooltip.prototype.target = null;

    /**
     * The tooltip visibility
     * @type {boolean}
     */
    Cuic.Tooltip.prototype.visible = false;

    /**
     * The tooltip z-position
     * @type {number}
     */
    Cuic.Tooltip.prototype.zIndex = 1;

    /**
     * Closes the tooltip
     * @param callback
     */
    Cuic.Tooltip.prototype.close = function (callback) {
        var self = this;

        self.element.stop(true, false).fadeOut(100, function () {
            if (typeof callback === "function") {
                callback.call(self);
            }
            self.visible = false;
        });
        return this;
    };

    /**
     * Opens the tooltip
     * @param callback
     */
    Cuic.Tooltip.prototype.open = function (callback) {
        var self = this;

        // Show the tooltip
        self.element.stop(true, false).fadeIn(200, function () {
            if (typeof callback === "function") {
                callback.call(self)
            }
            self.visible = true;
        });

        return this;
    };

})(jQuery);