(function ($) {
    "use strict";

    /**
     * Creates a tooltip
     * @param options
     * @constructor
     */
    Cuic.Tooltip = function (options) {
        var self = this;
        var element;
        var isClosing = false;
        var isOpened = false;
        var isOpening = false;
        var position;
        var target;

        // Set default options
        options = $.extend(true, {
            attribute: self.attribute,
            className: "tooltip",
            css: null,
            followPointer: self.followPointer,
            position: "right bottom",
            target: null,
            zIndex: 10
        }, options);

        // Define attributes
        self.attribute = options.attribute;
        self.followPointer = options.followPointer;

        // Define vars
        position = options.position;
        target = $(options.target);

        /**
         * Closes the tooltip
         * @param callback
         * @return {Cuic.Tooltip}
         */
        self.close = function (callback) {
            if (isOpening || (isOpened && !isClosing)) {
                isClosing = true;
                isOpening = false;
                element.stop(true, false).fadeOut(200, function () {
                    if (callback) {
                        callback.call(self);
                    }
                    if (self.autoRemove) {
                        element.remove();
                    }
                    isClosing = false;
                    isOpened = false;
                });
            }
            return self;
        };

        /**
         * Returns the element
         * @return {*}
         */
        self.getElement = function () {
            return element;
        };

        /**
         * Checks if the tooltip is opened
         * @return {boolean}
         */
        self.isOpened = function () {
            return isOpened;
        };

        /**
         * Opens the tooltip
         * @param callback
         * @return {Cuic.Tooltip}
         */
        self.open = function (callback) {
            if (isClosing || (!isOpened && !isOpening)) {
                isClosing = false;
                isOpening = true;

                // Position the element
                self.setAnchor(position, target);

                element.stop(true, false).fadeIn(200, function () {
                    if (callback) {
                        callback.call(self);
                    }
                    isOpening = false;
                    isOpened = true;
                });
            }
            return self;
        };

        /**
         * Sets the position relative to a target
         * @param pos
         * @param targ
         * @return {Cuic.Tooltip}
         */
        self.setAnchor = function (pos, targ) {
            position = pos;
            target = $(targ || target);
            Cuic.anchor(element, pos, target);
            return self;
        };

        /**
         * Sets the tooltip content
         * @param html
         * @return {Cuic.Tooltip}
         */
        self.setContent = function (html) {
            element.html(html);
            return self;
        };

        /**
         * Toggles the tooltip visibility
         * @param callback
         * @return {Cuic.Tooltip}
         */
        self.toggle = function (callback) {
            if (isClosing || (!isOpened && !isOpening)) {
                self.open(callback);
            } else {
                self.close(callback);
            }
            return self;
        };

        // Create the element
        element = $("<div>", {
            "class": options.className
        }).appendTo(document.body);

        // Set custom styles
        Cuic.applyCss(options.css, element);

        // Set required styles
        element.css({
            display: "none",
            position: "absolute",
            zIndex: options.zIndex
        });

        // Find the targets
        $(options.target).each(function () {
            var target = $(this);
            var content = target.attr(self.attribute);

            // Display the tooltip
            target.on("mouseenter", function (ev) {
                target.attr("data-tooltip", content);
                target.attr(self.attribute, "");
                element.html(content);

                if (self.followPointer) {
                    Cuic.anchor(element, position, [ev.pageX, ev.pageY]);
                } else {
                    Cuic.anchor(element, position, target);
                }
                self.open();
            });

            // Move the tooltip
            target.on("mousemove", function (ev) {
                if (self.followPointer) {
                    Cuic.anchor(element, position, [ev.pageX, ev.pageY]);
                }
            });

            // Close the tooltip
            target.on("mouseleave", function (ev) {
                var text = target.attr("data-tooltip");
                target.attr("data-tooltip", "");
                target.attr(self.attribute, text);
                self.close();
            });
        });
    };

    /**
     * The attribute used to get the tooltip content
     * @type {string}
     */
    Cuic.Tooltip.prototype.attribute = "title";

    /**
     * Tells if the notification follows the pointer
     * @type {boolean}
     */
    Cuic.Tooltip.prototype.followPointer = true;

})(jQuery);