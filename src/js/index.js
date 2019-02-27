/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Karl STEIN
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as index from './cuic';
import Button from './ui/button';
import Closable from './ui/closable';
import Dialog, { Dialogs } from './ui/dialog';
import Element from './ui/element';
import Elements from './ui/elements';
import Group from './ui/group';
import Guide from './ui/guide';
import Hook from './ui/hook';
import Movable from './ui/movable';
import Notification, { Notifications } from './ui/notification';
import NotificationStack from './ui/notification-stack';
import Overlay from './ui/overlay';
import Panel, { Panels } from './ui/panel';
import Popup, { Popups } from './ui/popup';
import Resizable from './ui/resizable';
import Selectable from './ui/selectable';
import Switcher from './ui/switcher';
import Tooltip, { Tooltips } from './ui/tooltip';
import Benchmark from './utils/benchmark';
import Collection from './utils/collection';
import Events from './utils/events';
import Shortcut from './utils/shortcut';

const Cuic = {
  ...index,
  // todo remove compatibility code for deprecated functions
  element(...args) {
    console.warn('DEPRECATED function element(), use asElement() instead.');
    return index.asElement(...args);
  },
  // Add components to global var
  Button,
  Closable,
  Dialog,
  Dialogs,
  Element,
  Elements,
  Group,
  Guide,
  Hook,
  Movable,
  Notification,
  Notifications,
  NotificationStack,
  Overlay,
  Panel,
  Panels,
  Popup,
  Popups,
  Resizable,
  Selectable,
  Switcher,
  Tooltip,
  Tooltips,
  // Add utils to global var
  Benchmark,
  Collection,
  Events,
  Shortcut,
};

export default Cuic;
