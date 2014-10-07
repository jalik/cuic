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
            dropDownButton: "+",
            collapse: true,
            css: null,
            scroll: true,
            target: null,
            zIndex: 80
        }, options);

        var closed = false;
        var win = $(window);

        // Get the target
        var bar = $(options.target);

        var barTop = bar.offset().top;
        var barWidth = bar.width();
        var barHeight = bar.height();

        // Use the outer size if box-sizing is border
        if (bar.css('box-sizing') === 'border-box') {
            barWidth = bar.outerWidth();
        }

        // Force the bar to have a fixed size
        bar.width(bar.width());

        bar.close = function () {
            spacer.hide();
            bar.css({
                position: "relative",
                top: "",
                width: ""
            });
            barTop = bar.offset().top;
            barWidth = bar.outerWidth();
        };

        bar.open = function () {
            spacer.show();
            bar.css({
                position: "fixed",
                top: 0,
                width: barWidth,
                zIndex: options.zIndex
            });
        };

        // Search close button
        bar.find('.close-button').off('click.navbar').on('click.navbar', function (ev) {
            ev.preventDefault();
            bar.close();
            closed = true;
        });

        win.off('resize.navbar');
        $("html").off("click.navbar-collapse");

        // FThis is a fix to avoid offsetTop > 0
        bar.css({
            position: "relative",
            top: "",
            width: ""
        });

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

        // Show or hide children when screen size changes
        if (options.collapse) {
            dropdownButton.on("click", function (ev) {
                ev.stopPropagation();

                if (dropdown.is(":visible")) {
                    dropdown.hide();
                }
                else {
                    dropdown.css({
                        position: bar.css("position") === "fixed" ? "fixed" : "absolute",
                        zIndex: options.zIndex + 1
                    });
                    Cuic.anchor(dropdown, "bottom", dropdownButton);
                    dropdown.show();
                }
            });

            $("html").on("click.navbar-collapse", function () {
                dropdown.hide();
            });

            var collapseItems = function () {
                // Add the class to items
                var items = bar.children('.navbar-item');

                // Removes all items from dropdown menu
                dropdown.empty();

                // Moves the more button at the beginning
                bar.prepend(dropdownButton);

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
                    dropdownButton.appendTo(bar);
                }
                else {
                    dropdownButton.hide();
                }

                var timer;

                win.on("resize", function () {
                    clearTimeout(timer);

                    timer = setTimeout(function () {
                        collapseItems();
                    }, 10);
                });
            };
            collapseItems();
        }

        var onScroll = function () {
            var scrollTop = win.scrollTop();

            if (scrollTop > barTop) {
                if (!closed && bar.css("position") !== "fixed") {
                    bar.open();
                    dropdown.css({
                        position: "fixed"
                    });
                    Cuic.anchor(dropdown, "bottom", dropdownButton);
                }
            }
            else {
                if (bar.css("position") !== "relative") {
                    bar.close();
                }
                closed = false;
                dropdown.css({
                    position: "absolute"
                });
                Cuic.anchor(dropdown, "bottom", dropdownButton);
            }
        };

        // Scrolls the bar with the page to keep it on the screen
        if (options.scroll) {
            // Create the spacer item that will replace
            // the bar when it scrolls
            var spacer = $("<div>", {
                height: bar.outerHeight(true),
                width: bar.outerWidth(true),
                css: {
                    display: "none"
                }
            }).insertBefore(bar);

            // If the window is scrolled when reloading the page,
            // the bar must be shown
            onScroll();
        }

        // Resize the bar when the window is resized
        win.on("resize.navbar", function () {
            if (bar.css("position") === "relative") {
                barTop = bar.offset().top;
                barWidth = bar.width();
            }
            else {
                bar.css("width", bar.parent().width());
            }
        });

        // Scroll the bar when the window is scrolled
        win.off('scroll.navbar');
        win.on("scroll.navbar", function () {
            onScroll();
        });

        return bar;
    };

})(jQuery);
