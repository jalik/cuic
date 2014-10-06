(function ($) {
    "use strict";

    // Check if the namespace is not used
    if (typeof Cuic !== "undefined") {
        throw "Cuic already exists";
    }

    // Check if jQuery is loaded
    if (typeof jQuery === "undefined") {
        throw "jQuery not found";
    }

    /**
     * The base of the kit
     * @type {{}}
     */
    window.Cuic = {};

    /**
     * Applies the styles to the target.
     * Styles can be a string or an object.
     * @param styles
     * @param target
     */
    Cuic.applyCss = function (styles, target) {
        if (styles != null) {
            if (typeof styles === 'object') {
                target.css(styles);
            }
            else if (typeof styles === 'string') {
                target.attr('style', target.attr('style') + ';' + styles);
            }
        }
    };

    /**
     * Position an object from the exterior
     * @param obj
     * @param position
     * @param target
     */
    Cuic.anchor = function (obj, position, target) {
        var targetHeight = target.outerHeight();
        var targetHeightHalf = targetHeight / 2;
        var targetWidth = target.outerWidth();
        var targetWidthHalf = targetWidth / 2;
        var objWidth = obj.outerWidth(true);
        var objWidthHalf = objWidth / 2;
        var objHeight = obj.outerHeight(true);
        var objHeightHalf = objHeight / 2;

        var offset = target.offset();

        var posX = 0;
        var posY = 0;

        switch (position) {
            case "left":
                posX = offset.left - objWidth;
                posY = offset.top + targetHeightHalf - objHeightHalf;
                break;

            case "right":
                posX = offset.left + targetWidth;
                posY = offset.top + targetHeightHalf - objHeightHalf;
                break;

            case "top":
                posX = offset.left + targetWidthHalf - objWidthHalf;
                posY = offset.top - objHeight;
                break;

            default:
            case "bottom":
                posX = offset.left + targetWidthHalf - objWidthHalf;
                posY = offset.top + targetHeight;
                break;
        }

        if (obj.css("position") === "fixed") {
            posX -= window.scrollX;
            posY -= window.scrollY;
        }

        // Position the object
        obj.css({
            left: posX + "px",
            top: posY + "px"
        });
    };

    /**
     * Position an object from the interior
     * @param target
     * @param position
     * @param container
     */
    Cuic.position = function (target, position, container) {
        container = $(container || target.offsetParent());

        if (container.length === 1) {
            if (container[0].tagName === "HTML") {
                container = $(document.body);
            }
            container.append(target);
        }

        var fixed = false;
        var containerHeight = container.innerHeight();
        var containerWidth = container.innerWidth();

        // Use jQuery to get window's size because
        // it returns the value without scrollbars
        var windowHeight = $(window).innerHeight();
        var windowWidth = $(window).innerWidth();

        // If the target is fixed, we use the window as container
        if (target.css("position") === "fixed") {
            containerHeight = windowHeight;
            containerWidth = windowWidth;
            fixed = true;
        }

        // Check that the element is not bigger than the viewport
        if (target.outerWidth(true) > containerWidth) {
            target.width(containerWidth - (target.outerWidth(true) - target.width()));
        }
        else if (target.outerWidth(true) > windowWidth) {
            target.width(windowWidth - (target.outerWidth(true) - target.width()));
        }
        if (target.outerHeight(true) > containerHeight) {
            target.height(containerHeight - (target.outerHeight(true) - target.height()));
        }
        else if (target.outerHeight(true) > windowHeight) {
            target.height(windowHeight - (target.outerHeight(true) - target.height()));
        }

        var targetHeight = target.outerHeight(true);
        var targetWidth = target.outerWidth(true);
        var relativeLeft = fixed ? 0 : container[0].scrollLeft;
        var relativeTop = fixed ? 0 : container[0].scrollTop;
        var relativeBottom = fixed ? 0 : -relativeTop;
        var relativeRight = fixed ? 0 : -relativeLeft;

        var styles = {};

        function getCenterX() {
            return relativeLeft + (containerWidth / 2 - targetWidth / 2);
        }

        function getCenterY() {
            return relativeTop + (containerHeight / 2 - targetHeight / 2);
        }

        switch (position) {
            case "bottom":
                styles.bottom = relativeBottom + "px";
                styles.left = getCenterX() + "px";
                break;

            case "bottom left":
                styles.bottom = relativeBottom + "px";
                styles.left = relativeLeft + "px";
                break;

            case "bottom right":
                styles.bottom = relativeBottom + "px";
                styles.right = relativeRight + "px";
                break;

            case "left":
                styles.top = getCenterY() + "px";
                styles.left = relativeLeft + "px";
                break;

            case "right":
                styles.top = getCenterY() + "px";
                styles.right = relativeRight + "px";
                break;

            case "top":
                styles.top = relativeTop + "px";
                styles.left = getCenterX() + "px";
                break;

            case "top left":
                styles.top = relativeTop + "px";
                styles.left = relativeLeft + "px";
                break;

            case "top right":
                styles.top = relativeTop + "px";
                styles.right = relativeRight + "px";
                break;

            default :
            case "center":
                styles.top = getCenterY() + "px";
                styles.left = getCenterX() + "px";
                break;
        }

        // Check that the element is not positioned outside the viewport
        if (styles.bottom != null && styles.bottom < 0) {
            styles.bottom = 0;
        }
        if (styles.left != null && styles.left < 0) {
            styles.left = 0;
        }
        if (styles.right != null && styles.right < 0) {
            styles.right = 0;
        }
        if (styles.top != null && styles.top < 0) {
            styles.top = 0;
        }

        // Remove previous position
        target.css({
            bottom: "",
            left: "",
            right: "",
            top: ""
        });

        // Apply new position
        target.css(styles);
    };
})(jQuery);