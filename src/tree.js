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
            target: null
        }, options);

        var tree = $(options.target);
        var items = tree.find(".item");

        // Set the first item as default
        if (items.filter(".default").length == 0) {
            items.first().addClass("default");
        }

        items.filter(".default").addClass("active");

        if (options.collapsed) {
            tree.find(".item").not(".expanded").not(".default").children(".item-content").hide();
        }
        else {
            tree.find(".collapsed").children(".item-content").hide();
        }

        items.each(function () {
            var item = $(this);
            var name = item.children(".item-name");
            var content = item.children(".item-content");

            // Apply the class corresponding to the state
            if (content.length == 1) {
                item.addClass(content.is(":visible") ? "expanded" : "collapsed");
            }

            item.children(".item-name").off("click.tree").on("click.tree", function () {
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
