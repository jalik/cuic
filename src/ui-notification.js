(function ($) {
    "use strict";

    /**
     * Creates a notification
     * @param options
     * @return {jQuery}
     */
    Cuic.notification = function (options) {
        // Set default options
        options = $.extend(true, {
            autoClose: true,
            closeButtonClass: "close-button",
            closeButton: "×",
            container: null,
            content: null,
            css: null,
            duration: 2000,
            location: "center",
            notificationClass: "notification",
            zIndex: 10
        }, options);

        // Get the container
        var container = $(options.container || document.body);

        // If the dialog is not in a container, then it is fixed
        var fixed = container[0].tagName === "BODY";

        var notif = $("<div>", {
            "class": options.notificationClass,
            html: options.content
        });

        // Set custom styles
        Cuic.applyCss(options.css, notif);

        // Override styles
        notif.css({
            display: "none",
            position: fixed ? "fixed" : "absolute",
            zIndex: options.zIndex
        });

        // Position the notification
        Cuic.position(notif, options.location, container);

        var timer;

        function autoClose() {
            clearTimeout(timer);
            timer = setTimeout(function () {
                hideNotification(notif, options);
            }, options.duration);
        }

        if (options.autoClose) {
            notif.hover(function () {
                clearTimeout(timer);
            }, function () {
                autoClose();
            });
        }
        else {
            notif.prepend($("<span>", {
                "class": options.closeButtonClass,
                text: options.closeButton
            }).on("click.notification", function () {
                hideNotification(notif, options);
            }));
        }

        notif.fadeIn(200, function () {
            if (options.autoClose) {
                autoClose();
            }
        });

        return notif;
    };

    function hideNotification(target, options) {
        target.stop(true, false).fadeOut(200, function () {
            target.remove()
        });
    }

})(jQuery);