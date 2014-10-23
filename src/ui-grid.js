(function ($) {
    "use strict";

    Cuic.grid = function (options) {
        // Default options
        options = $.extend(true, {
            gridColor: "rgba(200,200,200,0.50)",
            gridHeight: 20,
            gridWidth: 20,
            intersection: false,
            target: null
        }, options);

        // Get the grid
        var grid = $(options.target);

        // Get the grid dimensions
        var height = grid.height();
        var width = grid.width();

        // Add the horizontal lines
        var y = 0;
        var lines = [];
        while (y < height) {
            var line = createShape("line", {
                x1: 0,
                y1: y,
                x2: width,
                y2: y,
                stroke: options.gridColor,
                "stroke-width": 1
            });
            grid.append(line);
            lines.push(line);
            y += parseFloat(options.gridHeight);
        }

        // Add the vertical lines
        var x = 1;
        var columns = [];
        while (x < width) {
            var column = createShape("line", {
                x1: x,
                y1: 0,
                x2: x,
                y2: height,
                stroke: options.gridColor,
                "stroke-width": 1
            });
            grid.append(column);
            columns.push(column);
            x += parseFloat(options.gridWidth);
        }

        if (options.intersection) {
            grid.empty();
            x = 1;
            while (x < width) {
                // Add the intersections
                y = 1;
                for (var i = 0; i < lines.length; i += 1) {
                    var circle = createShape("circle", {
                        cx: x,
                        cy: i * options.gridHeight,
                        fill: "#aaa",
                        r: 1
                    });
                    grid.append(circle);
                }
                x += parseFloat(options.gridWidth);
            }
        }
    };

    function createShape(shape, attributes) {
        var circle = document.createElementNS("http://www.w3.org/2000/svg", shape);

        for (var key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                circle.setAttribute(key, attributes[key]);
            }
        }
        return circle;
    }

})(jQuery);