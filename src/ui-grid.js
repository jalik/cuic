(function ($) {
    "use strict";

    var counter = 0;

    /**
     * Creates a Grid
     * @param options
     * @constructor
     */
    Cuic.Grid = function (options) {
        var grid = this;

        // Default options
        options = $.extend(true, {
            animSpeed: grid.animSpeed,
            autoResize: grid.autoResize,
            cols: grid.cols,
            colsWidth: grid.colsWidth,
            editable: grid.editable,
            fps: grid.fps,
            maxCols: grid.maxCols,
            maxRows: grid.maxRows,
            minCols: grid.minCols,
            minRows: grid.minRows,
            onWidgetMoved: grid.onWidgetMoved,
            onWidgetResized: grid.onWidgetResized,
            rows: grid.rows,
            rowsHeight: grid.rowsHeight,
            spacing: grid.spacing,
            widgetSelector: grid.widgetSelector
        }, options);

        // Set the options
        grid.animSpeed = parseInt(options.animSpeed);
        grid.autoResize = /^true$/gi.test(options.autoResize);
        grid.colsWidth = parseFloat(options.colsWidth);
        grid.editable = /^true$/gi.test(options.editable);
        grid.fps = parseInt(options.fps);
        grid.maxCols = parseInt(options.maxCols);
        grid.maxRows = parseInt(options.maxRows);
        grid.minCols = parseInt(options.minCols);
        grid.minRows = parseInt(options.minRows);
        grid.onWidgetMoved = options.onWidgetMoved;
        grid.onWidgetResized = options.onWidgetResized;
        grid.rowsHeight = parseFloat(options.rowsHeight);
        grid.spacing = parseFloat(options.spacing);

        // Get the grid
        grid.element = $(options.target);

        // Set the grid style
        grid.element.css({
            display: "block",
            minHeight: options.height,
            minWidth: options.width
        });

        // Set the grid size
        grid.resize(options.cols, options.rows);

        // Set the grid resizable
        new Cuic.Resizable({
            target: grid.element,
            onResizeStop: function () {
                var cols = grid.getSizeX(grid.element.outerWidth());
                var rows = grid.getSizeY(grid.element.outerHeight());
                grid.maxCols = cols;
                grid.maxRows = rows;
                grid.maximize();
            }
        });

        // Create the widget preview
        grid.preview = $("<div>", {
            "class": "preview",
            css: {
                "box-sizing": "border-box",
                height: grid.rowsHeight,
                left: grid.spacing,
                position: "absolute",
                top: grid.spacing,
                width: grid.colsWidth,
                zIndex: 1
            }
        });

        // Add widgets to the grid
        grid.element.children(options.widgetSelector).each(function () {
            var id = this.id || "widget-" + (counter += 1);
            grid.addWidget(id, new Cuic.Grid.Widget({
                target: this
            }));
        });

        if (grid.autoResize) {
            grid.minimize();
        }
    };

    /**
     * Adds a widget to the grid
     * @param id
     * @param widget
     * @return {Cuic.Widget}
     */
    Cuic.Grid.prototype.addWidget = function (id, widget) {
        var grid = this;
        var element = widget.element;
        var preview = grid.preview;

        // Remove any widget having the same id
        grid.removeWidget(id);

        // Keep a reference to the widget
        grid.widgets[id] = widget;

        // Add the widget to the grid
        grid.element.append(widget.element);

        // Set the widget id
        widget.element.attr("id", id);

        // Override widget style
        widget.element.css({
            "box-sizing": "border-box",
            display: "block",
            margin: 0,
            overflow: "hidden",
            position: "absolute"
        });

        // Position the widget
        grid.moveWidget(widget, widget.col, widget.row);

        // Resize the widget
        grid.resizeWidget(widget, widget.sizeX, widget.sizeY);

        // Extend the grid if needed
        if (widget.col - 1 + widget.sizeX > grid.cols) {
            grid.resize(widget.col - 1 + widget.sizeX, widget.sizeY);
        }
        if (widget.row - 1 + widget.sizeY > grid.rows) {
            grid.resize(widget.sizeX, widget.row - 1 + widget.sizeY);
        }

        var height;
        var width;

        new Cuic.Resizable({
            target: widget.element,
            container: grid.element,
            onResize: function () {
                var tmpHeight = element.outerHeight();
                var tmpWidth = element.outerWidth();
                var sizeX = Math.round(tmpWidth / (grid.colsWidth + grid.spacing));
                var sizeY = Math.round(tmpHeight / (grid.rowsHeight + grid.spacing));

                // Make sure the widget does not overlap the grid
                if (sizeX + widget.col - 1 > grid.maxCols) {
                    sizeX = grid.maxCols - (widget.col - 1);
                }
                else if (sizeX < widget.minSizeX) {
                    sizeX = widget.minSizeX;
                }
                // Make sure the widget does not overlap the grid
                if (sizeY + widget.row - 1 > grid.maxRows) {
                    sizeY = grid.maxRows - (widget.row - 1);
                }
                else if (sizeY < widget.minSizeY) {
                    sizeY = widget.minSizeY;
                }

                // Resize the preview
                preview.css({
                    height: grid.calculateHeight(sizeY),
                    width: grid.calculateWidth(sizeX)
                });
            },
            onResizeStart: function () {
                if (grid.editable && widget.resizable && !widget.isDragging()) {
                    height = element.outerHeight();
                    width = element.outerWidth();

                    // Move widget to foreground
                    element.css({zIndex: 2});

                    // Display the widget preview
                    grid.element.append(preview.css({
                        left: element.css("left"),
                        height: height,
                        top: element.css("top"),
                        width: width
                    }));

                    // Maximize the grid
                    if (grid.autoResize) {
                        grid.maximize();
                    }
                    return true;
                }
                return false;
            },
            onResizeStop: function () {
                // Remove the preview
                preview.detach();

                // Resize the widget
                var sizeX = grid.getSizeX(preview.outerWidth());
                var sizeY = grid.getSizeY(preview.outerHeight());
                grid.resizeWidget(widget, sizeX, sizeY);

                // Fit the grid to its content
                if (grid.autoResize) {
                    grid.minimize();
                }
            }
        });

        new Cuic.Draggable({
            target: widget.element,
            rootOnly: true,
            container: grid.element,
            onDrag: function () {
                var left = parseFloat(element.css("left"));
                var top = parseFloat(element.css("top"));
                var col = grid.getPositionX(left);
                var row = grid.getPositionY(top);

                if (!(col > 0 && col + widget.sizeX <= grid.cols + 1
                    && row > 0 && row + widget.sizeY <= grid.rows + 1)) {
                    col = widget.col;
                    row = widget.row;
                }
                preview.css({
                    left: grid.calculateLeft(col),
                    top: grid.calculateTop(row)
                });
            },
            onDragStart: function (ev) {
                if (grid.editable && widget.draggable && !widget.isResizing()) {
                    height = element.outerHeight();
                    width = element.outerWidth();

                    // Move widget to foreground
                    element.css({zIndex: 2});

                    // Display the widget preview
                    grid.element.append(preview.css({
                        left: element.css("left"),
                        height: height,
                        top: element.css("top"),
                        width: width
                    }));

                    // Maximize the grid
                    if (grid.autoResize) {
                        grid.maximize();
                    }
                    return true;
                }
                return false;
            },
            onDragStop: function () {
                // Remove the preview
                preview.detach();

                // Position the widget
                var left = parseFloat(element.css("left"));
                var top = parseFloat(element.css("top"));
                var col = grid.getSizeX(left) + 1;
                var row = grid.getSizeY(top) + 1;
                grid.moveWidget(widget, col, row);

                // Fit the grid to its content
                if (grid.autoResize) {
                    grid.minimize();
                }
            }
        });
        return widget;
    };

    /**
     * Returns the height of a size
     * @param sizeY
     * @return {number}
     */
    Cuic.Grid.prototype.calculateHeight = function (sizeY) {
        return parseInt(sizeY) * (this.rowsHeight + this.spacing) - this.spacing;
    };

    /**
     * Returns the left offset of a position
     * @param posX
     * @return {number}
     */
    Cuic.Grid.prototype.calculateLeft = function (posX) {
        return parseInt(posX) * (this.colsWidth + this.spacing) - this.colsWidth;
    };

    /**
     * Returns the top offset of a position
     * @param posY
     * @return {number}
     */
    Cuic.Grid.prototype.calculateTop = function (posY) {
        return parseInt(posY) * (this.rowsHeight + this.spacing) - this.rowsHeight;
    };

    /**
     * Returns the width of a size
     * @param sizeX
     * @return {number}
     */
    Cuic.Grid.prototype.calculateWidth = function (sizeX) {
        return parseInt(sizeX) * (this.colsWidth + this.spacing) - this.spacing;
    };

    /**
     * Removes all widgets from the grid
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.clear = function () {
        for (var id in this.widgets) {
            if (this.widgets.hasOwnProperty(id)) {
                this.removeWidget(id);
            }
        }
        return this;
    };

    /**
     * Returns the column and row of a position
     * @param left
     * @param top
     * @return {number[]}
     */
    Cuic.Grid.prototype.getPosition = function (left, top) {
        return [this.getPositionX(left), this.getPositionY(top)];
    };

    /**
     * Returns the column of a position
     * @param posX
     * @return {number}
     */
    Cuic.Grid.prototype.getPositionX = function (posX) {
        return Math.round(parseFloat(posX) / (this.colsWidth + this.spacing)) + 1;
    };

    /**
     * Returns the row of a position
     * @param posY
     * @return {number}
     */
    Cuic.Grid.prototype.getPositionY = function (posY) {
        return Math.round(parseFloat(posY) / (this.rowsHeight + this.spacing)) + 1;
    };

    /**
     * Returns a size from a width and height
     * @param width
     * @param height
     * @return {number[]}
     */
    Cuic.Grid.prototype.getSize = function (width, height) {
        return [this.getSizeX(width), this.getSizeY(height)];
    };

    /**
     * Returns a size from a width
     * @param width
     * @return {number}
     */
    Cuic.Grid.prototype.getSizeX = function (width) {
        return Math.round(parseFloat(width) / (this.colsWidth + this.spacing));
    };

    /**
     * Returns a size from a height
     * @param height
     * @return {number}
     */
    Cuic.Grid.prototype.getSizeY = function (height) {
        return Math.round(parseFloat(height) / (this.rowsHeight + this.spacing));
    };

    /**
     * Returns a widget
     * @param id
     * @return {Cuic.Grid.Widget}
     */
    Cuic.Grid.prototype.getWidget = function (id) {
        return this.widgets[id];
    };

    /**
     * Makes the grid as big as possible
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.maximize = function () {
        return this.resize(this.maxCols, this.maxRows);
    };

    /**
     * Makes the grid fit its content
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.minimize = function () {
        var col = this.minCols || 1;
        var row = this.minRows || 1;

        for (var id in this.widgets) {
            if (this.widgets.hasOwnProperty(id)) {
                var widget = this.widgets[id];

                if (widget.col + widget.sizeX - 1 > col) {
                    col = widget.col + widget.sizeX - 1;
                }
                if (widget.row + widget.sizeY - 1 > row) {
                    row = widget.row + widget.sizeY - 1;
                }
            }
        }
        return this.resize(col, row);
    };

    /**
     * Moves a widget to a new position
     * @param widget
     * @param col
     * @param row
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.moveWidget = function (widget, col, row) {
        var grid = this;

        if (!(col > 0 && col - 1 + widget.sizeX <= grid.cols && row > 0 && row - 1 + widget.sizeY <= grid.rows )) {
            col = widget.col;
            row = widget.row;
        }

        if (col > 0 && row > 0) {
            widget.col = col;
            widget.row = row;
            widget.element.css({zIndex: 2});
            widget.element.animate({
                left: grid.calculateLeft(col),
                top: grid.calculateTop(row)
            }, {
                complete: function () {
                    widget.element.removeClass("dragging");
                    widget.element.css({zIndex: 1});

                    // Execute callback
                    if (typeof grid.onWidgetMoved === "function") {
                        grid.onWidgetMoved.call(grid, widget);
                    }
                },
                duration: grid.animSpeed,
                queue: false
            });
        }
        return grid;
    };

    /**
     * Removes the widget from the grid
     * @param id
     * @return {Cuic.Grid.Widget}
     */
    Cuic.Grid.prototype.removeWidget = function (id) {
        var widget = this.widgets[id];

        if (widget) {
            delete this.widgets[id];
            widget.element.stop(true, false).animate({
                height: 0,
                width: 0
            }, {
                complete: function () {
                    $(this).remove();
                },
                duration: this.animSpeed,
                queue: false
            });
        }
        return widget;
    };

    /**
     * Sets the grid size
     * @param cols
     * @param rows
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.resize = function (cols, rows) {
        cols = parseInt(cols);
        rows = parseInt(rows);

        if (cols < 1) {
            cols = 1;
        }
        if (rows < 1) {
            rows = 1;
        }

        if (cols > 0 && cols <= this.maxCols && rows > 0 && rows <= this.maxRows) {
            this.cols = cols;
            this.rows = rows;
            this.element.stop(true, false).animate({
                height: this.calculateHeight(rows) + this.spacing * 2,
                width: this.calculateWidth(cols) + this.spacing * 2
            }, {
                duration: this.animSpeed,
                queue: false
            });
        }
        return this;
    };

    /**
     * Sets the size of a widget
     * @param widget
     * @param sizeX
     * @param sizeY
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.resizeWidget = function (widget, sizeX, sizeY) {
        var grid = this;
        sizeX = parseInt(sizeX);
        sizeY = parseInt(sizeY);

        if (sizeX < widget.minSizeX) {
            sizeX = widget.minSizeX;
        }
        if (sizeY < widget.minSizeY) {
            sizeY = widget.minSizeY;
        }

        if ((!grid.maxSizeX || sizeX <= grid.maxSizeX) && (!grid.maxSizeY || sizeY >= grid.maxSizeY)) {
            widget.sizeX = sizeX;
            widget.sizeY = sizeY;
            widget.element.css({zIndex: 2});
            widget.element.animate({
                height: sizeY * (grid.rowsHeight + grid.spacing) - grid.spacing,
                width: sizeX * (grid.colsWidth + grid.spacing) - grid.spacing
            }, {
                complete: function () {
                    widget.element.removeClass("resizing");
                    widget.element.css({zIndex: 1});

                    // Execute callback
                    if (typeof grid.onWidgetResized === "function") {
                        grid.onWidgetResized.call(grid, widget);
                    }
                },
                duration: grid.animSpeed,
                queue: false
            });
        }
        return grid;
    };

    Cuic.Grid.prototype.animSpeed = 200;
    Cuic.Grid.prototype.autoResize = true;
    Cuic.Grid.prototype.cols = null;
    Cuic.Grid.prototype.colsWidth = 100;
    Cuic.Grid.prototype.editable = true;
    Cuic.Grid.prototype.element = null;
    Cuic.Grid.prototype.fps = 30;
    Cuic.Grid.prototype.maxCols = null;
    Cuic.Grid.prototype.maxRows = null;
    Cuic.Grid.prototype.onWidgetMoved = null;
    Cuic.Grid.prototype.onWidgetResized = null;
    Cuic.Grid.prototype.rows = null;
    Cuic.Grid.prototype.rowsHeight = 100;
    Cuic.Grid.prototype.spacing = 10;
    Cuic.Grid.prototype.widgets = {};
    Cuic.Grid.prototype.widgetSelector = ".widget";

    /**
     * Creates a grid widget
     * @param options
     * @constructor
     */
    Cuic.Grid.Widget = function (options) {
        var self = this;

        // Default options
        options = $.extend(true, {
            col: self.col,
            content: null,
            draggable: self.draggable,
            maxSizeX: self.maxSizeX,
            maxSizeY: self.maxSizeY,
            minSizeX: self.minSizeX,
            minSizeY: self.minSizeY,
            resizable: self.resizable,
            row: self.row,
            sizeX: self.sizeX,
            sizeY: self.sizeY,
            target: null
        }, options);

        // Set the options
        self.col = parseInt(options.col);
        self.draggable = /^true$/gi.test(options.draggable);
        self.resizable = /^true$/gi.test(options.resizable);
        self.row = parseInt(options.row);
        self.maxSizeX = parseInt(options.maxSizeX);
        self.maxSizeY = parseInt(options.maxSizeY);
        self.minSizeX = parseInt(options.minSizeX);
        self.minSizeY = parseInt(options.minSizeY);
        self.sizeX = parseInt(options.sizeX);
        self.sizeY = parseInt(options.sizeY);

        // Find the target
        if (options.target) {
            self.element = $(options.target);

            if (self.element.length > 0) {
                self.col = parseInt(self.element.attr("data-col")) || options.col;
                self.draggable = !!self.element.attr("data-draggable") ? /^true$/gi.test(self.element.attr("data-draggable")) : options.draggable;
                self.maxSizeX = parseInt(self.element.attr("data-max-size-x")) || options.maxSizeX;
                self.maxSizeY = parseInt(self.element.attr("data-max-size-y")) || options.maxSizeY;
                self.minSizeX = parseInt(self.element.attr("data-min-size-x")) || options.minSizeX;
                self.minSizeY = parseInt(self.element.attr("data-min-size-y")) || options.minSizeY;
                self.resizable = !!self.element.attr("data-resizable") ? /^true$/gi.test(self.element.attr("data-resizable")) : options.resizable;
                self.row = parseInt(self.element.attr("data-row")) || options.row;
                self.sizeX = parseInt(self.element.attr("data-size-x")) || options.sizeX;
                self.sizeY = parseInt(self.element.attr("data-size-y")) || options.sizeY;
            }
        }

        // Create the element HTML node
        if (!self.element || self.element.length < 1) {
            self.element = $("<div>", {
                html: options.content
            });
        }

        // Set the style
        self.element.addClass("widget");
    };

    /**
     * Checks if the widget is dragging
     * @return {Boolean}
     */
    Cuic.Grid.Widget.prototype.isDragging = function () {
        return this.element.hasClass("dragging");
    };

    /**
     * Checks if the widget is resizing
     * @return {Boolean}
     */
    Cuic.Grid.Widget.prototype.isResizing = function () {
        return this.element.hasClass("resizing");
    };

    Cuic.Grid.Widget.prototype.col = 1;
    Cuic.Grid.Widget.prototype.draggable = true;
    Cuic.Grid.Widget.prototype.element = null;
    Cuic.Grid.Widget.prototype.maxSizeX = null;
    Cuic.Grid.Widget.prototype.maxSizeY = null;
    Cuic.Grid.Widget.prototype.minSizeX = 1;
    Cuic.Grid.Widget.prototype.minSizeY = 1;
    Cuic.Grid.Widget.prototype.resizable = true;
    Cuic.Grid.Widget.prototype.row = 1;
    Cuic.Grid.Widget.prototype.sizeX = 1;
    Cuic.Grid.Widget.prototype.sizeY = 1;

})(jQuery);