/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Karl STEIN
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
     * @param container
     * @param options
     * @returns {{}}
     */
    Cuic.getFields = function (container, options) {
        var fields = {};
        container = $(container);

        options = $.extend(true, {
            dynamicTyping: true,
            filter: null,
            ignoreButtons: true,
            ignoreEmpty: false,
            smartTyping: true
        }, options);

        container.find('[name]').not(':disabled').each(function () {
            var field = this;
            var name = field.name;
            var type = field.type;

            // Check if node is a form field
            if (!Cuic.isField(field)) {
                return;
            }
            // Check if field matches the filter
            if (!Cuic.isNodeFiltered(field, options.filter)) {
                return;
            }
            // Ignore buttons
            if (options.ignoreButtons && ['button', 'reset', 'submit'].indexOf(type) !== -1) {
                return;
            }
            // Ignore unchecked input
            if (['checkbox', 'radio'].indexOf(type) !== -1 && !field.checked) {
                return;
            }
            var value = Cuic.getFieldValue(field, options);

            if ((value !== null && value !== undefined) || !options.ignoreEmpty) {
                // Check if field is an array or object
                if (name.indexOf('[') !== -1) {
                    var rootName = name.substr(0, name.indexOf('['));
                    var dimensions = name.substr(name.indexOf('['));
                    var match = /\[([0-9]+|[a-zA-Z_]+[a-zA-Z0-9_]*)?](?:\[([a-zA-Z_]+[a-zA-Z0-9_]*)])?/g.exec(dimensions);

                    if (match) {
                        var index = match[1]; // [], [0], [abc]
                        var attr = match[2];
                        var arr = fields[rootName];
                        var createArray = function () {
                            if (!(arr instanceof Array)) {
                                arr = [];
                            }
                            return arr;
                        };

                        // Index is null (array)
                        if (typeof index !== 'string' || !index.length) {
                            arr = createArray();

                            if ((value !== null && value !== undefined)) {
                                arr.push(value);
                            }
                        }
                        // Index is numeric (array)
                        else if (/^[0-9]+$/.test(index)) {
                            arr = createArray();

                            if (!arr.hasOwnProperty(index)) {
                                if (attr) {
                                    arr[index] = {};
                                }
                            }
                            if (attr) {
                                if ((value !== null && value !== undefined)) {
                                    arr[index][attr] = value;
                                }
                            } else {
                                if ((value !== null && value !== undefined)) {
                                    arr[index] = value;
                                }
                            }
                        }
                        // Index is alphanumeric (object)
                        else {
                            if (!arr || typeof arr !== 'object') {
                                arr = {};
                            }
                            if (!attr) {
                                arr[index] = value;
                            } else {
                                console.error('multi-dimensionnal input names are not supported !');
                                // arr[index][attr] = value;
                            }
                        }

                        // Replace name and value by the array name and values
                        name = rootName;
                        value = arr;
                    }
                }

                // Add field
                fields[name] = value;
            }
        });
        return fields;
    };

    /**
     * Returns the value of the field
     * @param field
     * @param options
     * @returns {*|Number|string|string}
     */
    Cuic.getFieldValue = function (field, options) {
        options = $.extend({
            dynamicTyping: true,
            smartTyping: true
        }, options);

        var value = field.value;
        var node = field.nodeName.toUpperCase();

        switch (node) {
            case 'INPUT':
                var type = typeof field.type === 'string' ? field.type.toLowerCase() : '';

                // Field is checkable
                if (['checkbox', 'radio'].indexOf(type) !== -1) {
                    if (field.checked) {
                        // If value is not set but the field is checked, the browser returns 'on'
                        value = (value === 'on' ? true : value);
                    } else {
                        // We don't want to return the value if the field is not checked
                        value = undefined; //todo return false
                    }
                }
                // Field is a button
                else if (['button', 'reset', 'submit'].indexOf(type) !== -1) {
                }
                // Field is a number
                else if (['number'].indexOf(type) !== -1) {
                    if (options.smartTyping) {
                        value = Cuic.parseValue(value);
                    }
                }
                break;

            case 'SELECT':
                if (field.multiple) {
                    var list = [];

                    // Get selected options
                    $(field).find('option').each(function () {
                        var option = this;

                        if (option.selected) {
                            list.push(option.value);
                        }
                    });
                }
                break;

            case 'TEXTAREA':
                break;
        }

        if (options.dynamicTyping && value !== null && value !== undefined) {
            // Add field value
            if (value instanceof Array) {
                for (var i = 0; i < value.length; i += 1) {
                    value[i] = Cuic.parseValue(value[i]);
                }
            } else {
                value = Cuic.parseValue(value);
            }
        }
        return value;
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
     * Returns the value as a boolean
     * @param val
     * @return {null|boolean}
     */
    Cuic.parseBoolean = function (val) {
        if (/^true$/i.test(val)) {
            return true;
        }
        if (/^false$/i.test(val)) {
            return false;
        }
        return null;
    };

    /**
     * Returns the typed value of a string value
     * @param val
     * @returns {*}
     */
    Cuic.parseValue = function (val) {
        if (typeof val === 'string') {
            val = val.trim();
            // Boolean
            var bool = this.parseBoolean(val);
            if (bool === true || bool === false) {
                return bool;
            }
            // Number
            if (/^-?[0-9]+$/.test(val)) {
                return parseInt(val);
            }
            if (/^-?[0-9]+\.[0-9]+$/.test(val)) {
                return parseFloat(val);
            }
        }
        return val === '' ? null : val;
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

})(jQuery);
