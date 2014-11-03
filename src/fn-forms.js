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
        var fields = {};

        $(form).find("[name]").each(function () {
            var name = this.name;

            if (!fieldNames || fieldNames.indexOf(name) !== -1) {
                var field = this;
                var value = this.value;

                switch (field.nodeName.toUpperCase()) {
                    case "INPUT":
                        if (this.type === "checkbox") {
                            if (!fields.hasOwnProperty(name)) {
                                var checkboxes = $(form).find("[name=" + name + "]");

                                if (checkboxes.length > 1) {
                                    fields[name] = [];
                                    chkb.filter(":checked").each(function () {
                                        fields[name].push(this.value === "on" ? true : Cuic.parseValue(this.value));
                                    });
                                }
                                else {
                                    fields[name] = value === "on" ? true : Cuic.parseValue(value);
                                }
                            }
                        }
                        else if (this.type === "radio") {
                            if (this.checked) {
                                fields[name] = Cuic.parseValue(value);
                            }
                        }
                        else if (this.type !== "button" && this.type !== "reset" && this.type !== "submit") {
                            fields[name] = Cuic.parseValue(value);
                        }
                        break;

                    case "SELECT":
                        if (this.multiple) {
                            fields[name] = [];
                            $(field).find("option:selected").each(function () {
                                fields[name].push(Cuic.parseValue(this.value));
                            });
                        }
                        else {
                            fields[name] = Cuic.parseValue(value);
                        }
                        break;

                    case "TEXTAREA":
                        fields[name] = Cuic.parseValue(value);
                        break;
                }

                if (typeof fields[name] === "string") {
                    // Remove extra spaces
                    fields[name] = fields[name].trim();

                    if (fields[name] === "") {
                        fields[name] = null;
                    }
                }
            }
        });
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
            params = Cuic.serializeUrlArgs(options.params);
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