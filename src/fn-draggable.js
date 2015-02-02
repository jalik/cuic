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

        // Get the area that received the focus for dragging
        self.area = $(options.area || self.element);

        // Get the container
        self.container = $(options.container || self.element.offsetParent());

        // Force the parent to be relative
        if (self.element.parent().css("position") === "static") {
            self.element.parent().css("position", "relative");
        }

        // Change cursor icon over dragging area
        self.area.css("cursor", "move");

        // Start the drag event on mouse down
        self.area.on("mousedown", function (ev) {
            if (typeof self.onDragStart === "function") {
                if (self.onDragStart.call(self, ev) === false) return;
            }

            // Prevent selection
            ev.preventDefault();

            var elementHeight = self.element.outerHeight();
            var elementWidth = self.element.outerWidth();
            var elementMarginBottom = parseInt(self.element.css("margin-bottom"));
            var elementMarginLeft = parseInt(self.element.css("margin-left"));
            var elementMarginRight = parseInt(self.element.css("margin-right"));
            var elementMarginTop = parseInt(self.element.css("margin-top"));
            var isInBody = self.container.get(0) == document.body;
            var startOffset = self.element.offset();
            var startX = Cuic.mouseX;
            var startY = Cuic.mouseY;
            var scrollX = window.scrollX;
            var scrollY = window.scrollY;

            self.element.addClass("dragging");

            var timer = setInterval(function () {
                var containerOffset = self.container.offset() || {left: 0, top: 0};
                var containerHeight = self.container.innerHeight();
                var containerWidth = self.container.innerWidth();
                var minX = (isInBody ? scrollX : 0) + containerOffset.left + elementMarginLeft;
                var minY = (isInBody ? scrollY : 0) + containerOffset.top + elementMarginTop;
                var maxX = minX - elementMarginLeft + containerWidth - elementMarginRight;
                var maxY = minY - elementMarginTop + containerHeight - elementMarginBottom;
                var leftSup = Cuic.mouseX - startX;
                var left = startOffset.left + (self.stepX ? Math.round(leftSup / self.stepX) * self.stepX : leftSup);
                var topSup = Cuic.mouseY - startY;
                var top = startOffset.top + (self.stepY ? Math.round(topSup / self.stepY) * self.stepY : topSup);

                // Limit horizontal move
                if (left < minX) {
                    left = minX;
                } else if (left + elementWidth > maxX) {
                    left = maxX - elementWidth;
                }

                // Limit vertical move
                if (top < minY) {
                    top = minY;
                } else if (top + elementHeight > maxY) {
                    top = maxY - elementHeight;
                }

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
        });
    };

    Cuic.Draggable.prototype.area = null;
    Cuic.Draggable.prototype.container = null;
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