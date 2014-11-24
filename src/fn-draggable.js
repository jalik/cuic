(function ($) {
    "use strict";

    /**
     * Makes an object draggable
     * @param options
     * @return {Cuic.Draggable}
     */
    Cuic.draggable = function (options) {
        return new Cuic.Draggable(options);
    };

    /**
     * Makes an object draggable
     * @param options
     * @constructor
     */
    Cuic.Draggable = function (options) {
        var self = this;

        // Default options
        options = $.extend(true, {
            fps: self.fps,
            horizontal: self.horizontal,
            onDrag: self.onDrag,
            onDragStart: self.onDragStart,
            onDragStop: self.onDragStop,
            stepX: self.stepX,
            stepY: self.stepY,
            vertical: self.vertical
        }, options);

        // Define attributes
        self.fps = Number(options.fps);
        self.horizontal = options.horizontal;
        self.onDrag = options.onDrag;
        self.onDragStart = options.onDragStart;
        self.onDragStop = options.onDragStop;
        self.stepX = Number(options.stepX);
        self.stepY = Number(options.stepY);
        self.vertical = options.vertical;

        // Get the target
        if (options.target) {
            self.element = $(options.target);
        }

        // Force the parent to be relative
        if (self.element.parent().css("position") === "static") {
            self.element.parent().css("position", "relative");
        }

        /**
         * This method is called when the element is dragging
         * @param ev
         */
        var drag = function (ev) {
            if (typeof self.onDragStart === "function") {
                if (self.onDragStart.call(self, ev) === false) return;
            }

            // Prevent selection
            ev.preventDefault();

            var startOffset = self.element.offset();
            var startX = Cuic.mouseX;
            var startY = Cuic.mouseY;

            self.element.addClass("dragging");

            var timer = setInterval(function () {
                var leftSup = Cuic.mouseX - startX;
                var left = startOffset.left + (self.stepX ? Math.round(leftSup / self.stepX) * self.stepX : leftSup);
                var topSup = Cuic.mouseY - startY;
                var top = startOffset.top + (self.stepY ? Math.round(topSup / self.stepY) * self.stepY : topSup);

                if (typeof self.onDrag === "function"
                    && self.onDrag.call(self, left, top) === false) {
                    return;
                }

                if (self.horizontal) {
                    self.element.offset({left: left});
                }
                if (self.vertical) {
                    self.element.offset({top: top});
                }
            }, Math.round(1000 / self.fps));

            $(document).one("mouseup", function (ev) {
                clearInterval(timer);

                self.element.removeClass("dragging");

                if (typeof self.onDragStop === "function") {
                    self.onDragStop.call(self, ev);
                }
            });
        };

        self.element.on("mousedown", drag);
    };

    Cuic.Draggable.prototype.element = null;
    Cuic.Draggable.prototype.fps = 30;
    Cuic.Draggable.prototype.horizontal = true;
    Cuic.Draggable.prototype.onDrag = null;
    Cuic.Draggable.prototype.onDragStart = null;
    Cuic.Draggable.prototype.onDragStop = null;
    Cuic.Draggable.prototype.stepX = null;
    Cuic.Draggable.prototype.stepY = null;
    Cuic.Draggable.prototype.vertical = true;

})(jQuery);