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
     * Hook an element to the viewport,
     * so it is scrolled with the viewport
     * @param options
     * @return {*}
     */
    Cuic.hook = function (options) {
        // Set default options
        options = $.extend(true, {
            hookedClass: 'hooked',
            onHook: null,
            onUnhook: null,
            target: null,
            zIndex: 4
        }, options);

        var win = $(window);

        // Get the target
        var target = $(options.target);
        if (target.length !== 1) {
            throw new Error('Target not found : ' + options.target);
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

        /**
         * Hook the target to the viewport
         */
        target.hook = function () {
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
                top: 0,
                width: spacer.width(),
                zIndex: options.zIndex
            }).addClass(options.hookedClass);

            // Execute the hooked listener
            if (typeof options.onHook === 'function') {
                options.onHook.call(target);
            }
        };

        /**
         * Unhook the bar from the viewport
         */
        target.unhook = function () {
            spacer.hide();
            target.css({
                position: 'relative',
                top: '',
                width: ''
            }).removeClass(options.hookedClass);

            // Execute the unhooked listener
            if (typeof options.onUnhook === 'function') {
                options.onUnhook.call(target);
            }
        };

        // Get the target's top offset
        var offsetTop = target.offset().top;

        var onScroll = function () {
            if (win.scrollTop() > offsetTop - parseFloat(target.css('margin-top'))) {
                if (target.css('position') !== 'fixed') {
                    target.hook();
                }
            }
            else if (target.css('position') !== 'relative') {
                target.unhook();
            }
        };

        // If the window is scrolled when reloading the page,
        // the bar must be shown
        onScroll();

        // Scroll the bar when the window is scrolled
        win.on('scroll.hook', function () {
            onScroll();
        });

        return target;
    };

})(jQuery);