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
     * @return {jQuery}
     */
    Cuic.anchor = function (obj, position, target) {
        target = $(target);
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
        return obj;
    };

    /**
     * Position an object from the interior
     * @param target
     * @param position
     * @param container
     * @return {jQuery}
     */
    Cuic.position = function (target, position, container) {
        target = $(target);
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

        var pos = position.split(" ");

        if (pos[0]) {
            switch (pos[0]) {
                case "bottom":
                    styles.bottom = relativeBottom + "px";
                    styles.left = getCenterX() + "px";
                    break;

                case "center":
                    styles.left = getCenterX() + "px";
                    styles.top = getCenterY() + "px";
                    break;

                case "left":
                    styles.left = relativeLeft + "px";
                    styles.top = getCenterY() + "px";
                    break;

                case "right":
                    styles.right = relativeRight + "px";
                    styles.top = getCenterY() + "px";
                    break;

                case "top":
                    styles.left = getCenterX() + "px";
                    styles.top = relativeTop + "px";
                    break;

                default:
                    if (/^[0-9]+(\.[0-9]*)?[a-z%]*$/g.test(pos[0])) {
                        styles.left = pos[0];
                    }
            }
        }

        if (pos[1]) {
            switch (pos[1]) {
                case "bottom":
                    styles.top = "";
                    styles.bottom = relativeBottom + "px";
                    break;

                case "middle":
                    styles.bottom = "";
                    styles.top = getCenterY() + "px";
                    break;

                case "top":
                    styles.bottom = "";
                    styles.top = relativeTop + "px";
                    break;
            }
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

        return target;
    };

    /**
     * Returns the value depending of the type of the value,
     * for example, if it is a function, it will returns the result of the function.
     * @param value
     * @param context
     * @return {*}
     */
    Cuic.valueOf = function (value, context) {
        switch (typeof value) {
            case "function":
                value = value.call(context);
                break;
        }
        return value;
    };

})(jQuery);