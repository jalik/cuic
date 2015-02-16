(function ($) {
    "use strict";

    /**
     * Makes an object draggable
     * @param options
     * @constructor
     */
    Cuic.Draggable = function (options) {
        var self = this;

        // Default options
        options = $.extend(true, {
            classes: self.classes,
            fps: self.fps,
            horizontal: self.horizontal,
            onDrag: self.onDrag,
            onDragStart: self.onDragStart,
            onDragStop: self.onDragStop,
            rootOnly: self.rootOnly,
            stepX: self.stepX,
            stepY: self.stepY,
            vertical: self.vertical
        }, options);

        // Define attributes
        self.classes = options.classes;
        self.fps = Number(options.fps);
        self.horizontal = options.horizontal;
        self.onDrag = options.onDrag;
        self.onDragStart = options.onDragStart;
        self.onDragStop = options.onDragStop;
        self.rootOnly = options.rootOnly;
        self.stepX = Number(options.stepX);
        self.stepY = Number(options.stepY);
        self.vertical = options.vertical;

        // Get the target
        if (options.target) {
            self.element = $(options.target);
        }

        // Get the container
        self.container = $(options.container || self.element.offsetParent());

        // Force the parent to be relative
        if (self.element.parent().css("position") === "static") {
            self.element.parent().css("position", "relative");
        }

        // Get the area that received the focus for dragging
        self.area = $(options.area || self.element);

        // Add the draggable classes
        self.area.addClass(self.classes);

        // Change cursor icon over dragging area
        self.area.css("cursor", "move");

        $(document).ready(function () {
            $(document.head).append($("<style>", {
                text: "." + self.classes + " > * { cursor: auto }"
            }));
        });

        // Start the drag event on mouse down
        self.area.on("mousedown", function (ev) {
            // Ignore dragging if the target is not the root
            if (self.rootOnly && ev.target !== ev.currentTarget) {
                return;
            }

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
    Cuic.Draggable.prototype.classes = "draggable";
    Cuic.Draggable.prototype.container = null;
    Cuic.Draggable.prototype.element = null;
    Cuic.Draggable.prototype.fps = 30;
    Cuic.Draggable.prototype.horizontal = true;
    Cuic.Draggable.prototype.onDrag = null;
    Cuic.Draggable.prototype.onDragStart = null;
    Cuic.Draggable.prototype.onDragStop = null;
    Cuic.Draggable.prototype.rootOnly = true;
    Cuic.Draggable.prototype.stepX = null;
    Cuic.Draggable.prototype.stepY = null;
    Cuic.Draggable.prototype.vertical = true;

})(jQuery);