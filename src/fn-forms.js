/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($) {
    'use strict';

    /**
     * Checks all form fields
     * @param options
     */
    Cuic.checkForm = function (options) {
        // Set default options
        options = $.extend(true, {
            errorCallback: null,
            errorClass: 'error',
            fields: null,
            target: null
        }, options);

        var errors = 0;

        // Get the fields
        var form = $(options.target);
        var fields = form.find('[name]');

        // Removes all errors
        form.find('.' + options.errorClass).removeClass(options.errorClass);

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
                if (this.required && value == '') {
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
     * @param options
     * @returns {{}}
     */
    Cuic.getFields = function (form, options) {
        var fields = {};

        options = $.extend(true, {
            fields: null,
            ignore: null,
            ignoreEmpty: false
        }, options);

        $(form).find('[name]').not(':disabled').each(function () {
            var field = this;
            var name = field.name;
            var value = field.value;
            var safeName = name.replace(/\[[^\]]+\]/, '');
            var nodeName = field.nodeName.toUpperCase();

            // Ignore non field elements
            if (['INPUT', 'SELECT', 'TEXTAREA'].indexOf(nodeName) === -1) {
                return;
            }

            // Check if the field should be collected
            if (options.fields && options.fields.indexOf(name) === -1) {
                return;
            }

            // Check if the field should be ignored
            if (options.ignore && options.ignore.indexOf(name) !== -1) {
                return;
            }

            switch (nodeName) {
                case 'INPUT':
                    if (field.type === 'checkbox') {
                        // Ignore the field if it was already collected
                        if (!fields.hasOwnProperty(safeName)) {
                            var checkboxes = $(form).find('[name="' + name + '"]');

                            if (checkboxes.length > 1) {
                                fields[safeName] = [];

                                checkboxes.filter(':checked').each(function () {
                                    fields[safeName].push(value === 'on' ? true : Cuic.parseValue(value));
                                });
                            } else if (field.checked) {
                                fields[safeName] = (value === 'on' ? true : Cuic.parseValue(value));
                            }
                        }
                    } else if (field.type === 'radio') {
                        if (field.checked) {
                            fields[safeName] = (value === 'on' ? true : Cuic.parseValue(value));
                        }
                    } else if (field.type !== 'button' && field.type !== 'reset' && field.type !== 'submit') {
                        fields[safeName] = Cuic.parseValue(value);
                    }
                    break;

                case 'SELECT':
                    if (field.multiple) {
                        fields[safeName] = [];
                        $(field).find('option:selected').each(function () {
                            fields[safeName].push(Cuic.parseValue(value));
                        });
                    } else {
                        fields[safeName] = Cuic.parseValue(value);
                    }
                    break;

                case 'TEXTAREA':
                    fields[safeName] = Cuic.parseValue(value);
                    break;
            }

            // Remove extra spaces
            if (typeof fields[safeName] === 'string') {
                fields[safeName] = fields[safeName].trim();

                if (fields[safeName] === '') {
                    fields[safeName] = null;
                }
            }

            // Remove empty fields
            if (fields[safeName] === null && options.ignoreEmpty) {
                delete fields[safeName];
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
        var output = '';

        if (args != null) {
            if (typeof args === 'string') {
                output = args;
            }
            else if (typeof args === 'object') {
                var arr = [];

                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        if (args[key] != null) {
                            var value = encodeURIComponent(args[key]);
                            arr.push('&');
                            arr.push(key);
                            arr.push('=');
                            arr.push(value.trim());
                        }
                    }
                }
                if (arr.length > 0) {
                    arr.unshift(arr);
                    output = arr.join('');
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
        if (typeof str === 'string') {
            if (str.toLowerCase() === 'true') {
                return true;

            } else if (str.toLowerCase() === 'false') {
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
            url: options.url + (params ? '?' + params : ''),
            type: 'POST',
            data: data,
            cache: false,
            processData: false,
            contentType: false
        });

        $.ajax(options);
    };

})(jQuery);