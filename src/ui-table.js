(function ($) {
    "use strict";

    var counter = 0;

    /**
     * Enables interactions on a table
     * @param options
     * @return {jQuery}
     */
    Cuic.table = function (options) {
        // Set default options
        options = $.extend(true, {
            onSorted: null,
            selectedClass: "selected",
            selectRowOnClick: false,
            sortableClass: "sortable",
            sortColumn: 0,
            sortOrder: "asc",
            target: null
        }, options);

        // Get target
        var table = $(options.target);

        if (table.length > 1) {
            throw "Only one table is expected as target";
        }
        else if (table.length === 0) {
            throw "Invalid table target";
        }

        // Check if the element table
        if (!table.is("table")) {
            throw "The target is not a table : " + options.target;
        }

        // Get the table zones
        var thead = table.children("thead");
        var tbody = table.children("tbody");
        var tfoot = table.children("tfoot");

        // Mark selected rows when clicked
        if (options.selectRowOnClick) {
            tbody.children("tr").off("click.table").on("click.table", function (ev) {
                if (ev.target.tagName === "TD") {
                    $(this).toggleClass(options.selectedClass);
                }
            });
        }

        /**
         * Sorts the table rows
         * @param index
         * @param order
         */
        table.sort = function (index, order) {
            var rows = [];

            // Get all rows
            tbody.children("tr").each(function () {
                rows.push($(this));
            });

            // Removes order from other columns
            var column = thead.find("tr > th").eq(index);
            thead.find("tr > th").not(column).removeClass("ascendant descendant sorted");

            // Add the sorted class to the column
            column.addClass("sorted");
            tbody.find("tr > td").removeClass("sorted");
            tbody.find("tr").each(function () {
                $(this).children().eq(index).addClass("sorted");
            });

            if (rows.length > 1) {
                // Sort the rows
                rows.sort(function (row1, row2) {
                    if (row1 !== undefined && row1 !== null && row2 !== undefined && row2 !== null) {
                        var value1 = row1.children("td").eq(index).html();
                        var value2 = row2.children("td").eq(index).html();

                        if (typeof value1 === "string") {
                            value1 = value1.toLowerCase();
                        }

                        if (typeof value2 === "string") {
                            value2 = value2.toLowerCase();
                        }

                        if (value1 > value2) {
                            return 1;
                        }

                        if (value1 === value2) {
                            return 0;
                        }
                    }
                    return -1;
                });

                // Reverse the order
                if (order === "desc" || order == -1) {
                    rows.reverse();
                }

                // Sort all rows
                for (var i = 0; i < rows.length; i += 1) {
                    rows[i].appendTo(tbody);
                }

                // Calls the callback
                if (typeof options.onSorted === "function") {
                    options.onSorted(index, order);
                }
            }
        };

        // Sort the table
        var defaultColumn = thead.find(".default");
        defaultColumn = defaultColumn.length === 1 ? defaultColumn : thead.find(".sortable:first");

        table.sort(defaultColumn.index(), defaultColumn.hasClass("descendant") ? "desc" : "asc");

        // Handle clicks on sortable columns
        thead.find("tr > ." + options.sortableClass).off("click.table").on("click.table", function (ev) {
            if (ev.currentTarget === ev.target) {
                var column = $(this);
                var index = column.index();
                var order;

                if (column.hasClass("ascendant")) {
                    column.removeClass("ascendant");
                    column.addClass("descendant");
                    order = "desc";
                }
                else {
                    column.removeClass("descendant");
                    column.addClass("ascendant");
                    order = "asc";
                }

                // Sort the column
                table.sort(index, order);
            }
        });

        return table;
    };

})(jQuery);
