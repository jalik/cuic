(function ($) {
    "use strict";

    /**
     * Creates a tooltip
     * @param options
     * @return {Cuic.Tooltip}
     */
    Cuic.tooltip = function (options) {
        return new Cuic.Tooltip(options);
    };

    /**
     * Creates a tooltip
     * @param options
     * @constructor
     */
    Cuic.Tooltip = function (options) {
        var self = this;

        // Set default options
        options = $.extend(true, {
            anchor: "bottom",
            classes: "tooltip",
            css: null,
            target: null,
            zIndex: 10
        }, options);

        // Set options
        self.anchor = options.anchor;

        // Get the target
        self.target = $(options.target);

        // Create the element
        self.element = $("<div>", {
            "class": options.classes,
            css: {display: "none"}
        }).appendTo(document.body);

        // Set custom styles
        Cuic.applyCss(options.css, self.element);

        // Set required styles
        self.element.css({
            position: "absolute",
            zIndex: options.zIndex
        });

        self.target.hover(function (ev) {
            var target = $(ev.currentTarget);
            var title = target.attr("title");
            target.attr("title", "");
            target.attr("data-title", title);
            self.element.html(title);
            self.target = target;
            self.open();

        }, function (ev) {
            var target = $(ev.currentTarget);
            var title = target.attr("data-title");
            target.attr("title", title);
            self.close();
        });
    };

    /**
     * Where to display the tooltip
     * @type {string}
     */
    Cuic.Tooltip.prototype.anchor = "right";

    /**
     * The HTML tooltip element
     * @type {jQuery}
     */
    Cuic.Tooltip.prototype.element = null;

    /**
     * The target used to position the tooltip
     * @type {jQuery}
     */
    Cuic.Tooltip.prototype.target = null;

    /**
     * Closes the tooltip
     * @param callback
     */
    Cuic.Tooltip.prototype.close = function (callback) {
        var self = this;

        self.element.stop(true, false).fadeOut(200, function () {
            if (typeof callback === "function") {
                callback.call(self);
            }
        });
        return this;
    };

    /**
     * Opens the tooltip
     * @param callback
     */
    Cuic.Tooltip.prototype.open = function (callback) {
        var self = this;

        // Position the tooltip
        Cuic.anchor(this.element, this.anchor, this.target);

        // Show the tooltip
        self.element.stop(true, false).fadeIn(200, callback);

        return this;
    };

})(jQuery);