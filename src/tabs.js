(function ($) {
    "use strict";

    var tabIndex = 0;

    /**
     * Enables interactions on tabs
     * @param options
     * @return {jQuery}
     */
    Cuic.tabs = function (options) {
        // Set default options
        options = $.extend(true, {
            activeClass: "active",
            content: null,
            defaultClass: "default",
            tabClass: "tab",
            tabs: null
        }, options);

        var root = $(options.tabs);
        var tabs = root.children("." + options.tabClass);
        var content = $(options.content);

        // Set the first tab as default
        if (tabs.filter("." + options.defaultClass).length == 0) {
            tabs.first().addClass(options.defaultClass);
        }

        // Set default tab as active
        tabs.filter("." + options.defaultClass).addClass(options.activeClass);

        tabs.each(function () {
            var tab = $(this);
            var tabContent = content.find("#" + tab.attr("data-content"));

            tab.attr("tabindex", tabIndex += 1);

            // Do not hide the default tab
            if (!tab.hasClass(options.defaultClass)) {
                tabContent.hide();
            }

            // Display the content of the tab
            // when it is clicked or focused
            tab.off("click.table focus.table").on("click.table focus.table", function () {
                if (!tab.hasClass("disabled")) {
                    tabs.removeClass(options.activeClass);
                    tab.addClass(options.activeClass);
                    content.children().not(tabContent).hide();
                    tabContent.stop(true, false).fadeIn(200);
                }
            });
        });

        /**
         * Selects the default tab
         */
        tabs.selectDefaultTab = function () {
            tabs.filter("." + options.defaultClass).trigger("click");
        };

        /**
         * Selects the tab by index
         * @param index
         */
        tabs.selectTab = function (index) {
            tabs.eq(index).trigger("click");
        };

        return tabs;
    };

})(jQuery);