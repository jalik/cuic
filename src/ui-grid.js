(function ($) {
    "use strict";

    var mousePosition = [0, 0];

    $(document).ready(function () {
        $(document).on("mousemove", function (ev) {
            mousePosition = [ev.clientX, ev.clientY];
        });
    });

    /**
     * Creates a Grid
     * @param options
     * @return {Cuic.Grid}
     */
    Cuic.grid = function (options) {
        return new Cuic.Grid(options);
    };

    /**
     * Creates a Grid
     * @param options
     * @constructor
     */
    Cuic.Grid = function (options) {
        var self = this;

        // Default options
        options = $.extend(true, {
            cols: 1,
            colsWidth: 100,
            editable: true,
            fps: 60,
            rows: 1,
            rowsHeight: 100,
            spacing: 10,
            target: null
        }, options);

        // Set the options
        self.cols = parseInt(options.cols);
        self.colsWidth = parseFloat(options.colsWidth);
        self.editable = Boolean(options.editable);
        self.fps = parseInt(options.fps);
        self.rows = parseInt(options.rows);
        self.rowsHeight = parseFloat(options.rowsHeight);
        self.spacing = parseFloat(options.spacing);

        // Get the grid
        self.element = $(options.target);

        // Set the grid style
        self.element.css({
            display: "block",
            minHeight: options.height,
            minWidth: options.width,
            position: "relative"
        });

        // Set the grid size
        self.resize(options.cols, options.rows);

        // Create the widget preview
        self.preview = new Cuic.Grid.Widget();
        self.preview.element.addClass("preview");
        self.preview.element.appendTo(self.element).hide();
        self.preview.element.css({
            position: "absolute",
            top: self.spacing,
            left: self.spacing,
            width: self.colsWidth,
            height: self.rowsHeight
        });

        // Add widgets to the grid
        self.element.children().not(".preview").each(function () {
            var widget = self.addWidget(new Cuic.Grid.Widget({
                target: this
            }));

            widget.element.on("mousedown", function (ev) {
                // Do nothing if the event does not concern the widget directly
                if (ev.target !== ev.currentTarget) return;

                // Do nothing if not editable
                if (!self.editable) return;

                ev.preventDefault();

                var element = widget.element;
                var offsetTop = ev.clientY - ev.target.offsetTop;
                var offsetLeft = ev.clientX - ev.target.offsetLeft;

                element.addClass("dragging");
                element.css("zIndex", 10);

                self.preview.element.css({
                    display: "block",
                    height: element.outerHeight(),
                    width: element.outerWidth()
                }, 200);

                var timer = setInterval(function () {
                    var left = mousePosition[0] - offsetLeft;
                    var top = mousePosition[1] - offsetTop;

                    element.css({
                        left: left,
                        top: top
                    });

                    var col = Math.round(left / (self.colsWidth + self.spacing)) + 1;
                    var row = Math.round(top / (self.rowsHeight + self.spacing)) + 1;

                    if (!(col > 0 && col + widget.sizeX <= self.cols + 1
                        && row > 0 && row + widget.sizeY <= self.rows + 1)) {
                        col = widget.col;
                        row = widget.row;
                    }
                    self.preview.element.css({
                        top: row * (self.rowsHeight + self.spacing) - self.rowsHeight,
                        left: col * (self.colsWidth + self.spacing) - self.colsWidth
                    }, 200);

                }, Math.round(self.fps / 1000));

                element.on("mouseup", function () {
                    clearInterval(timer);

                    element.off("mouseup");
                    self.preview.element.hide();

                    var left = parseFloat(element.css("left"));
                    var top = parseFloat(element.css("top"));
                    var col = Math.round(left / (self.colsWidth + self.spacing)) + 1;
                    var row = Math.round(top / (self.rowsHeight + self.spacing)) + 1;

                    self.moveWidget(widget, col, row);
                });
            });
        });
    };

    Cuic.Grid.prototype.cols = null;
    Cuic.Grid.prototype.colsWidth = 100;
    Cuic.Grid.prototype.editable = true;
    Cuic.Grid.prototype.element = null;
    Cuic.Grid.prototype.fps = 60;
    Cuic.Grid.prototype.widgets = [];
    Cuic.Grid.prototype.rows = null;
    Cuic.Grid.prototype.rowsHeight = 100;
    Cuic.Grid.prototype.spacing = 10;

    /**
     * Adds a widget to the grid
     * @param widget
     * @return {Cuic.Widget}
     */
    Cuic.Grid.prototype.addWidget = function (widget) {
        this.widgets.push(widget);
        this.resizeWidget(widget, widget.sizeX, widget.sizeY);
        this.moveWidget(widget, widget.col, widget.row);
        return widget;
    };

    /**
     * Moves a widget to a new position
     * @param widget
     * @param col
     * @param row
     */
    Cuic.Grid.prototype.moveWidget = function (widget, col, row) {
        if (!(col > 0 && col + widget.sizeX <= this.cols + 1
            && row > 0 && row + widget.sizeY <= this.rows + 1)) {
            col = widget.col;
            row = widget.row;
        }

        widget.element.animate({
            top: row * (this.rowsHeight + this.spacing) - this.rowsHeight,
            left: col * (this.colsWidth + this.spacing) - this.colsWidth
        }, 200, function () {
            widget.element.removeClass("dragging");
            widget.element.css("zIndex", "");
        });
        widget.col = col;
        widget.row = row;
    };

    /**
     * Sets the grid size
     * @param cols
     * @param rows
     */
    Cuic.Grid.prototype.resize = function (cols, rows) {
        this.cols = parseInt(cols);
        this.rows = parseInt(rows);
        this.element.css({
            height: rows * (this.rowsHeight + this.spacing) + this.spacing,
            width: cols * (this.colsWidth + this.spacing) + this.spacing
        });
    };

    /**
     * Sets the size of a widget
     * @param widget
     * @param sizeX
     * @param sizeY
     */
    Cuic.Grid.prototype.resizeWidget = function (widget, sizeX, sizeY) {
        widget.element.css({
            height: sizeY * (this.rowsHeight + this.spacing) - this.spacing,
            width: sizeX * (this.colsWidth + this.spacing) - this.spacing
        });
        widget.sizeX = sizeX;
        widget.sizeY = sizeY;
    };

    /**
     * Creates a grid widget
     * @param options
     * @constructor
     */
    Cuic.Grid.Widget = function (options) {
        var self = this;

        // Default options
        options = $.extend(true, {
            col: 1,
            content: null,
            enabled: true,
            maxSizeX: null,
            maxSizeY: null,
            resizable: true,
            row: 1,
            sizeX: 1,
            sizeY: 1,
            target: null
        }, options);

        // Set the options
        self.col = parseInt(options.col);
        self.enabled = Boolean(options.enabled);
        self.resizable = Boolean(options.resizable);
        self.row = parseInt(options.row);
        self.sizeX = parseInt(options.sizeX);
        self.sizeY = parseInt(options.sizeY);

        // Find the target
        if (options.target) {
            self.element = $(options.target);

            if (self.element.length > 0) {
                self.col = parseInt(self.element.attr("data-col")) || 1;
                self.enabled = Boolean(self.element.attr("data-enabled")) || true;
                self.resizable = Boolean(self.element.attr("data-resizable")) || true;
                self.row = parseInt(self.element.attr("data-row")) || 1;
                self.sizeX = parseInt(self.element.attr("data-size-x")) || 1;
                self.sizeY = parseInt(self.element.attr("data-size-y")) || 1;
            }
        }

        // Create the element HTML node
        if (!self.element || self.element.length < 1) {
            self.element = $("<div>", {
                html: options.content
            });
        }

        // Set the style
        self.element.css({
            "box-sizing": "border-box",
            display: "block",
            position: "absolute"
        });
    };

    Cuic.Grid.Widget.prototype.col = 1;
    Cuic.Grid.Widget.prototype.element = null;
    Cuic.Grid.Widget.prototype.enabled = true;
    Cuic.Grid.Widget.prototype.maxSizeX = null;
    Cuic.Grid.Widget.prototype.maxSizeY = null;
    Cuic.Grid.Widget.prototype.resizable = true;
    Cuic.Grid.Widget.prototype.row = 1;
    Cuic.Grid.Widget.prototype.sizeX = 1;
    Cuic.Grid.Widget.prototype.sizeY = 1;

})(jQuery);