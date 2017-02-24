/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
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

/**
 * Returns the form fields
 * @param parent
 * @param options
 * @returns {Object}
 */
Cuic.getFields = function (parent, options) {
    parent = this.element(parent);

    // Default options
    options = Cuic.extend(true, {
        dynamicTyping: true,
        filter: null,
        ignoreButtons: true,
        ignoreEmpty: false,
        ignoreUnchecked: false,
        smartTyping: true
    }, options);

    let fields = {};

    parent.find('[name]').not(':disabled').each((el) => {
        let field = el.node();
        let name = field.name;
        let type = field.type;
        let isButton = ['button', 'reset', 'submit'].indexOf(type) !== -1;
        let isCheckbox = ['checkbox', 'radio'].indexOf(type) !== -1;

        // Check if node is a form field
        if (!Cuic.isFormField(field)) {
            return;
        }
        // Check if field matches the filter
        if (!Cuic.isNodeFiltered(field, options.filter)) {
            return;
        }
        // Ignore buttons
        if (options.ignoreButtons && isButton) {
            return;
        }
        // Ignore unchecked input
        if (options.ignoreUnchecked && isCheckbox && !field.checked) {
            return;
        }
        let value = Cuic.getFieldValue(field, options);

        if ((value !== null && value !== undefined) || !options.ignoreEmpty) {

            // Handle multiple select specific case
            if (field.multiple === true) {
                name = name.replace(/\[]$/g, '');
            }

            // Check if field is an array or object
            if (name.indexOf('[') !== -1) {
                let rootName = name.substr(0, name.indexOf('['));
                let tree = name.substr(name.indexOf('['));
                fields[rootName] = Cuic.resolveDimensionsTree(tree, fields[rootName], value);
                return;
            }

            // Add field
            if (isCheckbox) {
                if (field.checked) {
                    fields[name] = value;
                } else if (['true', 'TRUE'].indexOf(value) !== -1) {
                    fields[name] = false;
                } else if (fields[name] === undefined) {
                    fields[name] = null;
                }
            } else {
                fields[name] = value;
            }
        }
    });
    return fields;
};

/**
 * Returns the value of the field
 * @param field
 * @param options
 * @returns {*}
 */
Cuic.getFieldValue = function (field, options) {
    options = Cuic.extend({
        dynamicTyping: true,
        smartTyping: true
    }, options);

    let value = field.value;
    const node = field.nodeName.toUpperCase();

    switch (node) {
        case 'INPUT':
            let type = typeof field.type === 'string' ? field.type.toLowerCase() : '';

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
                value = [];

                // Get selected options
                this.element(field).find('option').each((el) => {
                    const option = el.node();

                    if (option.selected) {
                        value.push(option.value);
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
            for (let i = 0; i < value.length; i += 1) {
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
Cuic.isFormField = function (node) {
    const nodeName = node.nodeName.toUpperCase();
    return nodeName === 'TEXTAREA'
        || nodeName === 'SELECT'
        || (nodeName === 'INPUT' && [
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
        ].indexOf(node.type) !== -1);
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
 * Returns the typed value of a string value
 * @param val
 * @returns {*}
 */
Cuic.parseValue = function (val) {
    if (typeof val === 'string') {
        val = val.trim();
        // Boolean
        const bool = this.parseBoolean(val);
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
 * Resolves a dimensions tree (ex: [colors][0][code])
 * @param tree
 * @param obj
 * @param value
 * @return {*}
 */
Cuic.resolveDimensionsTree = function (tree, obj, value) {
    if (tree.length === 0) {
        return value;
    }

    // Check missing brackets
    if (obj === undefined || obj === null) {
        let opening = tree.match(/\[/g).length;
        let closing = tree.match(/]/g).length;

        if (opening > closing) {
            throw new SyntaxError("Missing closing ']' in '" + tree + "'");
        } else if (closing < opening) {
            throw new SyntaxError("Missing opening '[' in '" + tree + "'");
        }
    }

    let index = tree.indexOf('[');

    if (index !== -1) {
        let end = tree.indexOf(']', index + 1);
        let subtree = tree.substr(end + 1);
        let key = tree.substring(index + 1, end);
        let keyLen = key.length;

        // Object
        if (keyLen && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
            if (obj === undefined || obj === null) {
                obj = {};
            }
            const result = this.resolveDimensionsTree(subtree, obj[key], value);

            if (result !== undefined) {
                obj[key] = result;
            }
        }
        // Array
        else {
            if (obj === undefined || obj === null) {
                obj = [];
            }
            // Dynamic index
            if (keyLen === 0) {
                const result = this.resolveDimensionsTree(subtree, obj[key], value);

                if (result !== undefined) {
                    obj.push(result);
                }
            }
            // Static index
            else if (/^[0-9]+$/.test(key)) {
                const result = this.resolveDimensionsTree(subtree, obj[key], value);

                if (result !== undefined) {
                    obj[parseInt(key)] = result;
                }
            }
        }
    }
    return obj;
};

/**
 * Returns the serialized query params
 * @param args
 * @returns {string}
 */
Cuic.serializeQueryParams = function (args) {
    let output = '';

    if (args != null) {
        if (typeof args === 'string') {
            output = args;
        }
        else if (typeof args === 'object') {
            let arr = [];

            for (let key in args) {
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
