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

Cuic.browser = {

    /**
     * Checks if the browser is Chrome 1+
     * @return {boolean}
     */
    isChrome() {
        return !!window.chrome && !!window.chrome.webstore;
    },

    /**
     * Checks if the browser is Edge 20+
     * @return {boolean}
     */
    isEdge() {
        return !isIE && !!window.StyleMedia;
    },

    /**
     * Checks if the browser is Firefox 1.0+
     * @return {boolean}
     */
    isFirefox() {
        return typeof InstallTrigger !== 'undefined';
    },

    /**
     * Checks if the browser is Internet Explorer 6-11
     * @return {boolean}
     */
    isIE() {
        return /*@cc_on!@*/!!document.documentMode;
    },

    /**
     * Checks if the browser is Opera 8.0+
     * @return {boolean}
     */
    isOpera() {
        return (!!window.opr && !!opr.addons)
            || !!window.opera
            || navigator.userAgent.indexOf(' OPR/') >= 0;
    },

    /**
     * Checks if the browser is Safari 3.0+
     * @return {boolean}
     */
    isSafari() {
        return /constructor/i.test(window.HTMLElement)
            || ((p) => {
                return p.toString() === "[object SafariRemoteNotification]";
            })(!window['safari']
                || safari.pushNotification);
    }
};
