(function ($) {
    "use strict";

    /**
     * Creates a navbar
     * @param options
     * @return {*}
     */
    Cuic.navbar = function (options) {
        // Set default options
        options = $.extend(true, {
            attachedClass: "attached",
            closeButtonClass: "navbar-close",
            collapse: true,
            dropDownButton: "+",
            css: null,
            onAttach: null,
            onDetach: null,
            target: null,
            zIndex: 10
        }, options);

        var closed = false;
        var win = $(window);

        // Create the dropdown menu
        var dropdown = $("<div>", {
            "class": "navbar-dropdown",
            css: {
                display: "none"
            }
        }).appendTo(document.body);

        // Create the dropdown button
        var dropdownButton = $("<span>", {
            "class": "navbar-dropdown-button",
            html: options.dropDownButton
        });

        // Hook the navBar
        var navBar = Cuic.hook({
            onHook: function () {
                if (dropdown.is(":visible")) {
                    dropdown.css({
                        position: "fixed"
                    });
                    Cuic.anchor(dropdown, "bottom", dropdownButton);
                }

                // Resize the bar when the window is resized
                win.off("resize.navbar-resize");
                win.on("resize.navbar-resize", function () {
                    if (navBar.css("position") === "relative") {
                        barTop = navBar.offset().top;
                    }
                    else {
                        navBar.css("width", navBar.parent().width());
                    }
                });
            },
            onUnhook: function () {
                if (dropdown.is(":visible")) {
                    dropdown.css({
                        position: "absolute"
                    });
                    Cuic.anchor(dropdown, "bottom", dropdownButton);
                }
                closed = false;
            },
            target: options.target,
            zIndex: options.zIndex
        });

        if (navBar.length !== 1) {
            throw new Error("Target not found : " + options.target);
        }
        var barTop = navBar.offset().top;

        // Search close button
        var closeButton = navBar.find("." + options.closeButtonClass);
        closeButton.off("click.navbar").on("click.navbar", function (ev) {
            ev.preventDefault();
            navBar.unhook();
            closed = true;
        });

        // Show or hide children when screen size changes
        $("html").off("click.navbar");
        if (options.collapse) {
            dropdownButton.on("click", function (ev) {
                ev.stopPropagation();

                if (dropdown.is(":visible")) {
                    dropdown.hide();
                    $("html").off("click.navbar");
                }
                else {
                    dropdown.css({
                        position: navBar.css("position") === "fixed" ? "fixed" : "absolute",
                        zIndex: options.zIndex + 1
                    });
                    Cuic.anchor(dropdown, "bottom", dropdownButton);
                    dropdown.show();

                    $("html").on("click.navbar", function () {
                        dropdown.hide();
                    });
                }
            });

            var collapseItems = function () {
                // Add the class to items
                var items = navBar.children(".navbar-item");

                // Removes all items from dropdown menu
                dropdown.empty();

                // Moves the more button at the beginning
                navBar.prepend(dropdownButton);

                items.each(function () {
                    var item = $(this);

                    if (this.offsetTop > 0) {
                        var ddItem = item.clone(true);
                        ddItem.css("display", "");
                        ddItem.removeClass("navbar-item");
                        ddItem.addClass("navbar-dropdown-item");
                        ddItem.appendTo(dropdown);
                        item.hide();
                    }
                    else {
                        item.show();
                    }
                });

                if (dropdown.children().length > 0) {
                    // Move the dropdown button to the end
                    dropdownButton.appendTo(navBar);
                }
                else {
                    dropdownButton.hide();
                }

                var timer;
                win.off("resize.navbar-collapse");
                win.on("resize.navbar-collapse", function () {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        collapseItems();
                    }, 10);
                });
            };
            collapseItems();
        }

        return navBar;
    };

})(jQuery);
