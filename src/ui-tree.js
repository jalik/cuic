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

    var ns = Cuic.namespace('tree');

    /**
     * Enables interactions on a tree
     * @todo create an object
     * @param options
     * @return {jQuery}
     */
    Cuic.Tree = function (options) {
        // Set default options
        options = $.extend(true, {
            collapsed: true,
            itemClass: 'tree-item',
            itemContentClass: 'tree-item-content',
            itemNameClass: 'tree-item-name',
            target: null
        }, options);

        var tree = $(options.target);

        if (tree.length !== 1) {
            throw new Error('Target not found : ' + options.target);
        }

        var items = tree.find('.' + options.itemClass);

        // Set the first item as default
        if (items.filter('.default').length == 0) {
            items.first().addClass('default');
        }

        items.filter('.default').addClass('active');

        if (options.collapsed) {
            tree.find('.' + options.itemClass).not('.expanded').not('.default').children('.' + options.itemContentClass).hide();
        }
        else {
            tree.find('.collapsed').children('.' + options.itemContentClass).hide();
        }

        items.each(function () {
            var item = $(this);
            var name = item.children('.' + options.itemNameClass);
            var content = item.children('.' + options.itemContentClass);

            // Apply the class corresponding to the state
            if (content.length == 1) {
                item.addClass(content.is(':visible') ? 'expanded' : 'collapsed');
            }

            item.children('.' + options.itemNameClass).off(ns('click')).on(ns('click'), function () {
                if (!item.hasClass('disabled')) {
                    if (content.length === 1) {
                        // Update the active item
                        tree.find('.active').removeClass('active');

                        if (content.is(':visible')) {
                            item.removeClass('expanded').addClass('collapsed');
                        } else {
                            item.addClass('active');
                            item.removeClass('collapsed').addClass('expanded');
                        }
                        content.toggle(200);
                    }
                }
            });
        });
        return tree;
    };

})(jQuery);
