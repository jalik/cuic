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

    var ns = Cuic.namespace('tabs');
    var tabIndex = 0;

    /**
     * Creates a group of tabs
     * @param options
     * @constructor
     */
    Cuic.Tabs = function (options) {
        var self = this;

        // Set default options
        options = $.extend(true, {
            content: null,
            defaultTab: 0,
            target: null
        }, options);

        // Get the tabs
        var target = $(options.target);
        self.tabs = target.children('.tab');
        self.content = $(options.content);

        var defaultTab = self.tabs.filter('.default');

        if (defaultTab.length === 1) {
            // Set the default tab
            self.defaultTab = defaultTab.index();
        }
        else {
            // Set the first tab as default if the default tab is not defined in the HTML
            self.defaultTab = options.defaultTab;
            self.tabs.eq(self.defaultTab).addClass('default');
        }

        // Set default tab as active
        self.tabs.filter('.default').addClass('active');

        self.tabs.each(function () {
            var tab = $(this);
            var tabContent = self.content.find('#' + tab.attr('data-content'));

            // Set the tabindex for keyboard tabulation
            tab.attr('tabindex', tabIndex += 1);

            // Hide all tabs but not the default tab
            if (!tab.hasClass('default')) {
                tabContent.hide();
            }
        });

        // Display the content of the tab when it is focused
        self.tabs.off(ns('focus')).on(ns('focus'), function (ev) {
            self.selectTab($(ev.currentTarget).index());
        });
    };

    /**
     * Disables a tab
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.disableTab = function (index) {
        if (index == this.getActiveTabIndex()) {
            this.selectPreviousTab();
        }
        return this.getTab(index).addClass('disabled');
    };

    /**
     * Enables a tab
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.enableTab = function (index) {
        return this.getTab(index).removeClass('disabled');
    };

    /**
     * Returns the active tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.getActiveTab = function () {
        return this.tabs.filter('.active:first');
    };

    /**
     * Returns the index of the active tab
     * @return {number}
     */
    Cuic.Tabs.prototype.getActiveTabIndex = function () {
        return this.getActiveTab().index();
    };

    /**
     * Returns a tab
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.getTab = function (index) {
        return this.tabs.eq(index);
    };

    /**
     * Returns a tab content
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.getTabContent = function (index) {
        var tab = this.getTab(index);
        return this.content.find('#' + tab.attr('data-content'));
    };

    /**
     * Selects the default tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectDefaultTab = function () {
        return this.selectTab(this.defaultTab);
    };

    /**
     * Selects the next tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectNextTab = function () {
        return this.selectTab(this.getActiveTab().next(':not(.disabled)').index());
    };

    /**
     * Selects the previous tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectPreviousTab = function () {
        return this.selectTab(this.getActiveTab().prev(':not(.disabled)').index());
    };

    /**
     * Selects a tab by index
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectTab = function (index) {
        var tab = this.getTab(index);
        var tabContent = this.getTabContent(index);

        if (!tab.hasClass('disabled')) {
            this.tabs.removeClass('active');
            tab.addClass('active');
            this.content.children().not(tabContent).hide();
            tabContent.stop(true, false).fadeIn(200);
        }
    };

})(jQuery);
