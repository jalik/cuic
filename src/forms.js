(function ($) {
    "use strict";

    /**
     * Checks all form fields
     * @param options
     */
    Cuic.checkForm = function (options) {
        // Set default options
        options = $.extend(true, {
            errorCallback: null,
            errorClass: "error",
            fields: null,
            target: null
        }, options);

        var errors = 0;

        // Get the fields
        var form = $(options.target);
        var fields = form.find("[name]");

        // Removes all errors
        form.find("." + options.errorClass).removeClass(options.errorClass);

        function errorFound(field) {
            if (typeof options.errorCallback === 'function') {
                field.addClass(options.errorClass);
                options.errorCallback.call(field, field.attr('name'), field.val());
                errors += 1;
            }
        }

        fields.each(function () {
            var field = $(this);
            var value = field.val();

            // Filter field
            if (!(options.fields instanceof Array) || options.fields.indexOf(field.attr('name')) !== -1) {
                // Checks if the field is required
                if (this.required && value == "") {
                    errorFound(field);
                } else {
                    // Checks if the field value matches the pattern
                    if (this.pattern && !new RegExp(this.pattern).test(value)) {
                        errorFound(field);
                    }
                }
            }
        });
        return errors === 0;
    };

    /**
     * Returns the form fields
     * @param form
     * @param fieldNames
     * @returns {{}}
     */
    Cuic.getFields = function (form, fieldNames) {
        // Set default options
        options = $.extend(true, {
            errorCallback: null,
            errorClass: "error",
            fields: null,
            target: null
        }, options);

        form = $(form);
        var fields = {};
        var checkboxes = {};
        var name;

        // Get input values
        form.find("input[name]").each(function () {
            // Ignores unwanted fields
            if (!fieldNames || fieldNames.indexOf(this.name) !== -1) {
                var value = Cuic.forms.parseValue(this.value);
                var name = this.name;

                switch (this.type) {
                    case "button":
                    case "submit":
                    case "reset":
                        // Ignores buttons
                        break;

                    case "checkbox":
                        if (!fields[name]) {
                            fields[name] = [];
                            checkboxes[name] = 0;
                        }
                        fields[name].push(this.checked);
                        checkboxes[name] += 1;
                        break;

                    case "radio":
                        if (this.checked) {
                            fields[name] = value;
                        }
                        break;

                    default:
                        fields[name] = value;
                        break;
                }
            }
        });

        for (name in checkboxes) {
            if (checkboxes.hasOwnProperty(name) && checkboxes[name] == 1) {
                fields[name] = fields[name][0];
            }
        }

        // Get list values
        form.find("select[name]").each(function () {
            // Ignores unwanted fields
            if (!fieldNames || fieldNames.indexOf(this.name) !== -1) {
                var value = Cuic.forms.parseValue(this.value);
                var name = this.name;

                if (this.multiple) {
                    if (!fields[name]) {
                        fields[name] = [];
                    }
                    if (this.checked) {
                        fields[name].push(value);
                    }
                } else {
                    fields[name] = value;
                }
            }
        });

        // Get textarea values
        form.find("textarea[name]").each(function () {
            // Ignores unwanted fields
            if (!fieldNames || fieldNames.indexOf(this.name) !== -1) {
                var value = Cuic.forms.parseValue(this.value);
                var name = this.name;
                fields[name] = value;
            }
        });

        for (name in fields) {
            if (fields.hasOwnProperty(name)) {
                if (typeof fields[name] === "string") {
                    fields[name] = fields[name].trim();

                    if (fields[name] === "") {
                        fields[name] = null;
                    }
                }
            }
        }
        return fields;
    };

    /**
     * Returns a serialized version of the arguments
     * @param args
     * @returns {string}
     */
    Cuic.serializeUrlArgs = function (args) {
        var output = "";

        if (args != null) {
            if (typeof args === "string") {
                output = args;
            }
            else if (typeof args === "object") {
                var arr = [];

                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        if (args[key] != null) {
                            var value = encodeURIComponent(args[key]);
                            arr.push("&");
                            arr.push(key);
                            arr.push("=");
                            arr.push(value.trim());
                        }
                    }
                }
                if (arr.length > 0) {
                    arr.unshift(arr);
                    output = arr.join("");
                }
            }
        }
        return output;
    };

    /**
     * Returns the typed value of a string value
     * @param str
     * @returns {*}
     */
    Cuic.parseValue = function (str) {
        if (typeof str === "string") {
            if (str.toLowerCase() === "true") {
                return true;

            } else if (str.toLowerCase() === "false") {
                return false;

            } else if (/^[0-9]+$/.test(str)) {
                return parseInt(str);

            } else if (/^[0.9]+\.[0-9]+$/.test(str)) {
                return parseFloat(str);
            }
        }
        return str;
    };

    /**
     * Automatically uploads files when they are selected
     * @param files
     * @param options
     * @return jQuery.ajax
     */
    Cuic.uploadFiles = function (files, options) {
        var data = new FormData();
        var params = null;

        if (options.params) {
            params = Cuic.forms.serialize(options.params);
        }

        $.each(files, function (key, value) {
            data.append(key, value);
        });

        options = $.extend(true, options, {
            url: options.url + (params ? "?" + params : ""),
            type: "POST",
            data: data,
            cache: false,
            processData: false,
            contentType: false
        });

        $.ajax(options);
    };

})(jQuery);