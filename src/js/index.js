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

import { asElement } from './cuic';

export * from './cuic';

export { default as Button } from './ui/button';
export { default as Closable } from './ui/closable';
export {
  default as Dialog,
  Dialogs,
} from './ui/dialog';
export { default as Element } from './ui/element';
export { default as Elements } from './ui/elements';
export { default as Group } from './ui/group';
export { default as Guide } from './ui/guide';
export { default as Hook } from './ui/hook';
export { default as Movable } from './ui/movable';
export {
  default as Notification,
  Notifications,
} from './ui/notification';
export { default as NotificationStack } from './ui/notification-stack';
export { default as Overlay } from './ui/overlay';
export {
  default as Panel,
  Panels,
} from './ui/panel';
export { default as Resizable } from './ui/resizable';
export { default as Selectable } from './ui/selectable';
export { default as Switcher } from './ui/switcher';
export {
  default as Tooltip,
  Tooltips,
} from './ui/tooltip';
export { default as Benchmark } from './utils/benchmark';
export { default as Collection } from './utils/collection';
export { default as Events } from './utils/events';

export {
  default as Popup,
  Popups,
} from './ui/popup';
export { default as Shortcut } from './utils/shortcut';

export function element(...args) {
  // todo remove compatibility code for deprecated functions
  console.warn('DEPRECATED function element(), use asElement() instead.');
  return asElement(...args);
}
