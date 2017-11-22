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

import Cuic from "../dist/cuic";
import {Button} from "../dist/ui/button";
import {Component} from "../dist/ui/component";
import {Dialog} from "../dist/ui/dialog";
import {Element} from "../dist/ui/element";
import {Elements} from "../dist/ui/elements";
import {Overlay} from "../dist/ui/overlay";
import {Group} from "../dist/ui/group";
import {Hook} from "../dist/ui/hook";
import {Movable} from "../dist/ui/movable";
import {Notification} from "../dist/ui/notification";
import {NotificationStack} from "../dist/ui/notification-stack";
import {Panel} from "../dist/ui/panel";
import {Popup} from "../dist/ui/popup";
import {Resizable} from "../dist/ui/resizable";
import {Selectable} from "../dist/ui/selectable";
import {Switcher} from "../dist/ui/switcher";
import {Tooltip} from "../dist/ui/tooltip";

describe(`dist files`, () => {

    it(`Cuic should be importable from package`, () => {
        expect(typeof Cuic.element).toEqual("function");
    });

    it(`Button should be importable from package`, () => {
        expect(typeof Button).toEqual("function");
    });

    it(`Component should be importable from package`, () => {
        expect(typeof Component).toEqual("function");
    });

    it(`Dialog should be importable from package`, () => {
        expect(typeof Dialog).toEqual("function");
    });

    it(`Element should be importable from package`, () => {
        expect(typeof Element).toEqual("function");
    });

    it(`Elements should be importable from package`, () => {
        expect(typeof Elements).toEqual("function");
    });

    it(`Group should be importable from package`, () => {
        expect(typeof Group).toEqual("function");
    });

    it(`Hook should be importable from package`, () => {
        expect(typeof Hook).toEqual("function");
    });

    it(`Movable should be importable from package`, () => {
        expect(typeof Movable).toEqual("function");
    });

    it(`Notification should be importable from package`, () => {
        expect(typeof Notification).toEqual("function");
    });

    it(`NotificationStack should be importable from package`, () => {
        expect(typeof NotificationStack).toEqual("function");
    });

    it(`Overlay should be importable from package`, () => {
        expect(typeof Overlay).toEqual("function");
    });

    it(`Panel should be importable from package`, () => {
        expect(typeof Panel).toEqual("function");
    });

    it(`Popup should be importable from package`, () => {
        expect(typeof Popup).toEqual("function");
    });

    it(`Resizable should be importable from package`, () => {
        expect(typeof Resizable).toEqual("function");
    });

    it(`Selectable should be importable from package`, () => {
        expect(typeof Selectable).toEqual("function");
    });

    it(`Switcher should be importable from package`, () => {
        expect(typeof Switcher).toEqual("function");
    });

    it(`Tooltip should be importable from package`, () => {
        expect(typeof Tooltip).toEqual("function");
    });
});
