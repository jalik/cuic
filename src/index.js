/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Karl STEIN
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

import Cuic from "./js/cuic";
import Benchmark from "./js/utils/benchmark";
import Button from "./js/ui/button";
import Closable from "./js/ui/closable";
import Collection from "./js/utils/collection";
import Dialog from "./js/ui/dialog";
import {Dialogs} from "./js/ui/dialog";
import Element from "./js/ui/element";
import Elements from "./js/ui/elements";
import Events from "./js/utils/events";
import Group from "./js/ui/group";
import Guide from "./js/ui/guide";
import Hook from "./js/ui/hook";
import Movable from "./js/ui/movable";
import Notification from "./js/ui/notification";
import {Notifications} from "./js/ui/notification";
import NotificationStack from "./js/ui/notification-stack";
import Overlay from "./js/ui/overlay";
import Panel from "./js/ui/panel";
import Popup from "./js/ui/popup";
import Resizable from "./js/ui/resizable";
import Selectable from "./js/ui/selectable";
import Shortcut from "./js/utils/shortcut";
import Switcher from "./js/ui/switcher";
import Tooltip from "./js/ui/tooltip";

// Add components to global var
Cuic.Button = Button;
Cuic.Closable = Closable;
Cuic.Dialog = Dialog;
Cuic.Dialogs = Dialogs;
Cuic.Element = Element;
Cuic.Elements = Elements;
Cuic.Group = Group;
Cuic.Guide = Guide;
Cuic.Hook = Hook;
Cuic.Movable = Movable;
Cuic.Notification = Notification;
Cuic.Notifications = Notifications;
Cuic.NotificationStack = NotificationStack;
Cuic.Overlay = Overlay;
Cuic.Panel = Panel;
Cuic.Popup = Popup;
Cuic.Resizable = Resizable;
Cuic.Selectable = Selectable;
Cuic.Switcher = Switcher;
Cuic.Tooltip = Tooltip;

// Add utils to global var
Cuic.Benchmark = Benchmark;
Cuic.Collection = Collection;
Cuic.Events = Events;
Cuic.Shortcut = Shortcut;

export default Cuic;
