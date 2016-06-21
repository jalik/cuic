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

    /**
     * Hook an element to the viewport,
     * so it is scrolled with the viewport
     * @param options
     * @return {*}
     */
    Cuic.Hook = function (options) {
        var self = this;
        var ns = Cuic.namespace('hook');

        // Default options
        options = $.extend(true, {}, Cuic.Hook.prototype.options, options);

        var win = $(window);

        // Get the target
        var target = $(options.target);
        if (target.length === 0) {
            throw new Error('No target found for : ' + options.target);
        }

        // This is a fix to avoid offsetTop > 0
        target.css({
            position: 'relative',
            top: '',
            width: ''
        });

        // Create the spacer item that will replace
        // the bar when it is scrolled
        var spacer = $('<div>', {
            css: {display: 'none'}
        }).insertBefore(target);

        // Get the target's offset
        var offset = target.offset();

        if (options.fixed) {
            options.offsetTop = offset.top;
        }

        /**
         * Hook the element
         */
        self.hook = function () {
            spacer.css({
                display: target.css('display'),
                float: target.css('float'),
                height: target.height(),
                marginBottom: target.css('margin-bottom'),
                marginLeft: target.css('margin-left'),
                marginRight: target.css('margin-right'),
                marginTop: target.css('margin-top'),
                width: target.width()
            });
            target.css({
                position: 'fixed',
                left: offset.left,
                top: options.offsetTop,
                width: spacer.width(),
                zIndex: options.zIndex
            }).addClass(options.hookedClass);

            // Execute the hooked listener
            if (typeof options.onHook === 'function') {
                options.onHook.call(target);
            }
        };

        /**
         * Unhook the element
         */
        self.unhook = function () {
            spacer.hide();
            target.css({
                position: 'relative',
                bottom: '',
                left: '',
                right: '',
                top: '',
                width: ''
            }).removeClass(options.hookedClass);

            // Execute the unhooked listener
            if (typeof options.onUnhook === 'function') {
                options.onUnhook.call(target);
            }
        };

        var onScroll = function () {
            if (options.fixed) {
                if (target.css('position') !== 'fixed') {
                    self.hook();
                }
            } else {
                if (win.scrollTop() > offset.top - parseFloat(target.css('margin-top'))) {
                    if (target.css('position') !== 'fixed') {
                        self.hook();
                    }
                } else if (target.css('position') !== 'relative') {
                    self.unhook();
                }
            }
        };

        // If the window is scrolled when reloading the page,
        // the bar must be shown
        onScroll();

        // Scroll the bar when the window is scrolled
        win.off('scroll').on(ns('scroll'), function () {
            onScroll();
        });
    };

    /**
     * Called when element is hooked
     * @type {function}
     */
    Cuic.Hook.prototype.onHook = null;

    /**
     * Called when element is unhooked
     * @type {function}
     */
    Cuic.Hook.prototype.onUnhook = null;

    /**
     * Default options
     * @type {*}
     */
    Cuic.Hook.prototype.options = {
        fixed: false,
        hookedClass: 'hooked',
        offsetBottom: 0,
        offsetLeft: 0,
        offsetRight: 0,
        offsetTop: 0,
        target: null,
        zIndex: 4
    };

})(jQuery);
