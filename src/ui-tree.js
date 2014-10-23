(function ($) {
    "use strict";

    /**
     * Enables interactions on a tree
     * @param options
     * @return {jQuery}
     */
    Cuic.tree = function (options) {
        // Set default options
        options = $.extend(true, {
            collapsed: true,
            itemClass: "tree-item",
            itemContentClass: "tree-item-content",
            itemNameClass: "tree-item-name",
            target: null
        }, options);

        var tree = $(options.target);

        if (tree.length !== 1) {
            throw new Error("Target not found : " + options.target);
        }

        var items = tree.find("." + options.itemClass);

        // Set the first item as default
        if (items.filter(".default").length == 0) {
            items.first().addClass("default");
        }

        items.filter(".default").addClass("active");

        if (options.collapsed) {
            tree.find("." + options.itemClass).not(".expanded").not(".default").children("." + options.itemContentClass).hide();
        }
        else {
            tree.find(".collapsed").children("." + options.itemContentClass).hide();
        }

        items.each(function () {
            var item = $(this);
            var name = item.children("." + options.itemNameClass);
            var content = item.children("." + options.itemContentClass);

            // Apply the class corresponding to the state
            if (content.length == 1) {
                item.addClass(content.is(":visible") ? "expanded" : "collapsed");
            }

            item.children("." + options.itemNameClass).off("click.tree").on("click.tree", function () {
                if (!item.hasClass("disabled")) {
                    if (content.length === 1) {
                        // Update the active item
                        tree.find(".active").removeClass("active");

                        if (content.is(":visible")) {
                            item.removeClass("expanded").addClass("collapsed");
                        } else {
                            item.addClass("active");
                            item.removeClass("collapsed").addClass("expanded");
                        }
                        content.toggle(200);
                    }
                }
            });
        });
        return tree;
    };

})(jQuery);
