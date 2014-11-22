(function ($) {
    "use strict";

    var mousePosition = [0, 0];

    $(document).ready(function () {
        $(document).on("mousemove", function (ev) {
            mousePosition = [ev.clientX, ev.clientY];
        });
    });

    Cuic.resizable = function (options) {
        // Default options
        options = $.extend(true, {
            fps: 30,
            horizontal: true,
            maxHeight: null,
            maxWidth: null,
            minHeight: null,
            minWidth: null,
            onResizeStart: null,
            onResizeEnd: null,
            target: null,
            vertical: true
        }, options);

        var handlers = [];
        var handlerSize = 10;

        // Get the target
        var target = $(options.target);

        // Force the target to be the relative parent
        if (target.css("position") === "static") {
            target.css("position", "relative");
        }

        /**
         * Called when the resizing starts
         * @return {boolean}
         */
        var startResize = function () {
            target.addClass("resizing");

            if (typeof options.onResizeStart === "function") {
                return options.onResizeStart.call(target) !== false;
            }
            return true;
        };

        /**
         * Called when the resizing ends
         * @return {boolean}
         */
        var stopResize = function () {
            target.removeClass("resizing");

            if (typeof options.onResizeEnd === "function") {
                return options.onResizeEnd.call(target) !== false;
            }
            return true;
        };

        var resizeVertically = function (ev) {
            startResize();
            ev.preventDefault();

            var height = target.height();
            var timer = setInterval(function () {
                var newHeight = height + mousePosition[1] - ev.clientY;

                if ((!options.maxHeight || newHeight <= options.maxHeight)
                    && (!options.minHeight || newHeight >= options.minHeight)) {
                    target.height(newHeight);
                }
            }, Math.round(1000 / options.fps));

            $(document).one("mouseup", function () {
                clearInterval(timer);
                stopResize();
            });
        };

        var resizeHorizontally = function (ev) {
            startResize();
            ev.preventDefault();

            var width = target.width();
            var timer = setInterval(function () {
                var newWidth = width + mousePosition[0] - ev.clientX;

                if ((!options.maxWidth || newWidth <= options.maxWidth)
                    && (!options.minWidth || newWidth >= options.minWidth)) {
                    target.width(newWidth);
                }
            }, Math.round(1000 / options.fps));

            $(document).one("mouseup", function () {
                clearInterval(timer);
                stopResize();
            });
        };

        // Add the horizontal resize handler
        if (options.horizontal) {
            var eHandler = $("<div>", {
                css: {
                    cursor: "e-resize",
                    display: "none",
                    height: "100%",
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: handlerSize,
                    zIndex: 1
                }
            }).on("mousedown", resizeHorizontally).appendTo(target);
            handlers.push(eHandler);
        }

        // Add the vertical resize handler
        if (options.vertical) {
            var sHandler = $("<div>", {
                css: {
                    bottom: 0,
                    cursor: "s-resize",
                    display: "none",
                    height: handlerSize,
                    position: "absolute",
                    left: 0,
                    width: "100%",
                    zIndex: 1
                }
            }).on("mousedown", resizeVertically).appendTo(target);
            handlers.push(sHandler);
        }

        // Add the bottom right resize handler
        if (options.horizontal && options.vertical) {
            var seHandler = $("<div>", {
                css: {
                    bottom: 0,
                    cursor: "se-resize",
                    display: "none",
                    height: handlerSize,
                    position: "absolute",
                    right: 0,
                    width: handlerSize,
                    zIndex: 2
                }
            }).on("mousedown", resizeVertically).on("mousedown", resizeHorizontally).appendTo(target);
            handlers.push(seHandler);
        }

        // Display all resize handlers when mouse is over the target
        target.on("mouseover", function (ev) {
            if (!target.hasClass("resizing")) {
                for (var i = 0; i < handlers.length; i += 1) {
                    handlers[i].stop(true, false).show();
                }
            }
        });

        // Hide all resize handlers when mouse leaves the target
        target.on("mouseout", function (ev) {
            // todo hide only if not child
            if (!target.hasClass("resizing")) {
                for (var i = 0; i < handlers.length; i += 1) {
                    handlers[i].stop(true, false).hide();
                }
            }
        });

        return target;
    };

    $(document).ready(function () {
        Cuic.resizable({
            maxHeight: 700,
            maxWidth: 700,
            minHeight: 300,
            minWidth: 300,
            target: "#sb-grid"
        })
    });

})(jQuery);