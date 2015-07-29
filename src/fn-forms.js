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

    var inputTypes = ['' +
    'checkbox',
        'color',
        'date',
        'datetime',
        'email',
        'hidden',
        'month',
        'number',
        'password',
        'radio',
        'range',
        'search',
        'tel',
        'text',
        'time',
        'url',
        'week'
    ];

    /**
     * Checks all form fields
     * @param form
     * @param options
     * @return {boolean}
     */
    Cuic.checkForm = function (form, options) {
        form = $(form);

        // Default options
        options = $.extend(true, {
            errorClass: 'error',
            filter: null,
            onError: null
        }, options);

        var errors = 0;

        // Removes all errors
        form.find('.' + options.errorClass).removeClass(options.errorClass);

        function errorFound(field) {
            if (typeof options.onError === 'function') {
                field = $(field);
                field.addClass(options.errorClass);
                options.onError.call(field, field.attr('name'), field.val());
                errors += 1;
            }
        }

        // Removes all errors
        form.find('.' + options.errorClass).removeClass(options.errorClass);

        // Get enabled elements
        form.find('[name]').not(':disabled').each(function () {
            var value = this.value;

            if (!Cuic.isField(this)) {
                return;
            }
            if (!Cuic.isNodeFiltered(this, options.filter)) {
                return;
            }

            // Checks if required
            if (this.required && value !== undefined && value !== null) {
                errorFound(this);
            } else {
                // Test pattern
                if (this.pattern && !new RegExp(this.pattern).test(value)) {
                    errorFound(this);
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
        form = $(form);

        options = $.extend(true, {
            filter: null,
            ignoreEmpty: false
        }, options);

        // Get enabled elements
        form.find('[name]').not(':disabled').each(function () {
            if (!Cuic.isField(this)) {
                return;
            }
            if (!Cuic.isNodeFiltered(this, options.filter)) {
                return;
            }

            var field = this;
            var value = this.value;
            var name = this.name;
            var safeName = name.replace(/\[[^\]]*]$/, '');
            var nodeName = field.nodeName.toUpperCase();

            // Check if name is an array
            if (/\[]$/.test(name) && !(fields[safeName] instanceof Array)) {
                fields[safeName] = [];
            }

            switch (nodeName) {
                case 'INPUT':
                    // Field is checkable
                    if (['checkbox', 'radio'].indexOf(field.type) !== -1) {
                        // We don't want to return the value
                        // if the field is not checked
                        if (!field.checked) {
                            return;
                        }
                        // If value is not set but the field is checked, the browser returns 'on'
                        value = (value === 'on' ? true : Cuic.parseValue(value));
                    }
                    // Field is not a button
                    else if (['button', 'reset', 'submit'].indexOf(field.type) === -1) {
                        value = Cuic.parseValue(value);
                    }
                    break;

                case 'SELECT':
                    if (field.multiple) {
                        value = [];

                        // Get selected options
                        $(field).find('option').each(function () {
                            var option = this;
                            if (option.selected) {
                                value.push(Cuic.parseValue(option.value));
                            }
                        });
                    } else {
                        value = Cuic.parseValue(value);
                    }
                    break;

                case 'TEXTAREA':
                    value = Cuic.parseValue(value);
                    break;
            }

            // Remove extra spaces
            if (typeof value === 'string') {
                value = value.trim();

                if (value === '') {
                    value = null;
                }
            }

            if (value !== null || !options.ignoreEmpty) {
                // Add field value
                if (fields[safeName] instanceof Array) {
                    fields[safeName].push(value);
                } else {
                    fields[safeName] = value;
                }
            }
        });
        return fields;
    };

    /**
     * Checks if node is a field
     * @param node
     * @return {boolean}
     */
    Cuic.isField = function (node) {
        var nodeName = node.nodeName.toUpperCase();
        return nodeName === 'TEXTAREA'
            || nodeName === 'SELECT'
            || (nodeName === 'INPUT' && inputTypes.indexOf(node.type) !== -1);
    };

    /**
     * Checks if node is filtered
     * @param node
     * @param filter
     * @return {boolean}
     */
    Cuic.isNodeFiltered = function (node, filter) {
        return filter === undefined || filter === null
            || (filter instanceof Array && filter.indexOf(node.name) !== -1)
            || (typeof filter === 'function' && filter.call(node, node.name))
    };

    /**
     * Returns the serialized query params
     * @param args
     * @returns {string}
     */
    Cuic.serializeQueryParams = function (args) {
        var output = '';

        if (args != null) {
            if (typeof args === 'string') {
                output = args;

            } else if (typeof args === 'object') {
                var arr = [];

                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        if (args[key] != null) {
                            arr.push('&');
                            arr.push(encodeURIComponent(key).trim());
                            arr.push('=');
                            arr.push(encodeURIComponent(args[key]).trim());
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
     * Returns the value as a boolean
     * @param val
     * @return {boolean}
     */
    Cuic.parseBoolean = function (val) {
        if (/^true$/i.test(val)) {
            return true;
        }
        if (/^false$/i.test(val)) {
            return false;
        }
    };

    /**
     * Returns the typed value of a string value
     * @param val
     * @returns {*}
     */
    Cuic.parseValue = function (val) {
        if (typeof val === 'string') {
            // Boolean
            var bool = this.parseBoolean(val);
            if (bool === true || bool === false) {
                return bool;
            }
            // Number
            if (/^[0-9]+$/.test(val)) {
                return parseInt(val);
            }
            if (/^[0.9]+\.[0-9]+$/.test(val)) {
                return parseFloat(val);
            }
        }
        return val;
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
            params = Cuic.serializeQueryParams(options.params);
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