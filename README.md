# Cuic
![GitHub package.json version](https://img.shields.io/github/package-json/v/jalik/cuic.svg)
[![Build Status](https://travis-ci.com/jalik/cuic.svg?branch=master)](https://travis-ci.com/jalik/cuic)
![GitHub](https://img.shields.io/github/license/jalik/cuic.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/jalik/cuic.svg)
[![GitHub issues](https://img.shields.io/github/issues/jalik/cuic.svg)](https://github.com/jalik/cuic/issues)
![npm](https://img.shields.io/npm/dt/cuic.svg)

Cuic stands for **Common User Interface Components** and aims to offer various UI components like dialogs, popups, notifications, tooltips, etc.

## Styling

Cuic has a default styling that you must load to display components correctly.

```js
// Load styles
import 'cuic/dist/cuic.css';
```

## Components

### Element

This is the most generic component that contains all the logic of any component, all components inherit from `Element`.

```js
import { Element } from 'cuic';

const element = new Element({
  animationClass: null,
  className: null,
  css: null,
  maximized: false,
  maximizedX: false,
  maximizedY: false,
  namespace: null,
  parent: null,
});

// Element methods
element.addClass(String);
element.addPositionClass(String, String);
element.align(String);
element.alignInParent();
element.alignInScreen();
element.anchor(String, String, Element);
element.append(Element);
element.appendTo(Element);
element.attr(String, Object);
element.autoFit();
element.autoResize();
element.border();
element.children(String);
element.click();
element.clone();
element.closest(String);
element.css(Object);
element.data(String, Object);
element.disable();
element.empty();
element.enable();
element.enterFullScreen();
element.find(String);
element.focus();
element.getClasses();
element.hasClass(String);
element.hasParent();
element.height();
element.hide();
element.html(html);
element.innerHeight();
element.innerWidth();
element.insertAfter(Element);
element.insertBefore(Element);
element.isAbsolute();
element.isAligned(String);
element.isAnchored(String);
element.isChildOf(Element);
element.isDisabled();
element.isDirectChildOf(Element);
element.isEnabled();
element.isFixed();
element.isHidden();
element.isInDOM();
element.isMaximized();
element.isMaximizedX();
element.isMaximizedY();
element.isMinimized();
element.isPosition(String);
element.isRelative();
element.isRemoved();
element.isShown();
element.isStatic();
element.margin();
element.maximize(Function);
element.maximizeX(Function);
element.maximizeY(Function);
element.minimize(Function);
element.node();
element.off(String, Function);
element.offset();
element.offsetParent();
element.offsetParentNode();
element.on(String, Function);
element.once(String, Function);
element.onAligned(Function);
element.onAnchored(Function);
element.onMaximize(Function);
element.onMaximized(Function);
element.onMinimize(Function);
element.onMinimized(Function);
element.onRemoved(Function);
element.outerHeight(Boolean);
element.outerWidth(Boolean);
element.padding();
element.parent();
element.parentNode();
element.position();
element.positionOnScreen();
element.prepend(Element);
element.prependTo(Element);
element.remove();
element.removeClass(String);
element.scrollHeight();
element.scrollLeft();
element.scrollTop();
element.scrollWidth();
element.show();
element.text(String);
element.val(Object);
element.width();
```

### Component

This is a generic component that most components inherit from, it only adds the `component` CSS class.

This component inherits from `Element`.

```js
import { Component } from 'cuic';

const component = new Component();
```

### Button

A basic clickable button.

This component inherits from `Component`.

```js
import { Button } from 'cuic';

const button = new Button({
  className: 'btn btn-default btn-secondary',
  disabled: false,
  label: null,
  shortcut: null,
  title: null,
  type: 'button',
});

button.on("click", () => {
    console.log("button clicked");
});
```

### Closable

This is a generic component with opening and closing capabilities.

This component inherits from `Component`.

```js
import { Closable } from 'cuic';

const closable = new Closable({
  autoClose: false,
  autoCloseDelay: 0,
  autoRemove: false,
  closable: true,
  closed: false,
  closeOnBlur: false,
  closeOnFocus: false,
  closeOnMouseLeave: false,
});

// Closable methods
closable.autoClose(Function);
closable.close(Function);
closable.isClosable();
closable.isClosed();
closable.onClose(Function);
closable.onClosed(Function);
closable.onOpen(Function);
closable.onOpened(Function);
closable.open(Function);
closable.toggle(Function);
```

### Dialog

A dialog can be configured with a header and title, a body and a footer with buttons.

This component inherits from `Closable`.

```js
import { Button, Dialog } from 'cuic';

const dialog = new Dialog({
  animationClass: 'cc-anim-fade cc-anim-resize',
  autoClose: false,
  autoCloseDelay: 0,
  autoRemove: true,
  autoResize: true,
  buttons: [],
  closable: true,
  closeButton: null,
  closeButtonClass: 'glyphicon glyphicon-remove-sign',
  closed: true,
  closeOnBlur: false,
  closeOnFocus: false,
  closeOnMouseLeave: false,
  content: null,
  contentHeight: null,
  contentWidth: null,
  movable: true,
  maximized: false,
  modal: true,
  namespace: 'dialog',
  parent: document.body,
  position: 'center',
  resizable: false,
  title: null,
  zIndex: 10,
});

// Dialog methods
dialog.addButton(Button);
dialog.close(Function);
dialog.getContent();
dialog.getFooter();
dialog.getHeader();
dialog.open(Function);
dialog.resizeContent();
dialog.setContent(String);
dialog.setFooter(String);
dialog.setHeader(String);
dialog.setTitle(String);
```

### Guide

A guide is used to assist users, to explain things in an interactive way like "click here, then here...".

```js
import { Guide } from 'cuic';

const guide = new Guide({
  anchor: 'top',
  autoClose: false,
  autoRemove: false,
  autoScroll: true,
  autoStart: false,
  closed: true,
  content: null,
  duration: 5000,
  namespace: 'guide',
  steps: null,
  zIndex: 9,
});

// Guide methods
guide.addStep(Object);
guide.getCurrentStep();
guide.getPopup();
guide.getSteps();
guide.goTo(Number);
guide.next();
guide.onStarted(Function);
guide.onStepChanged(Function);
guide.onStopped(Function);
guide.previous();
guide.start();
guide.stop();
```

### Movable

A generic component that can be moved with the mouse.

This component inherits from `Component`.

```js
import { Element, Movable } from 'cuic';

const movable = new Movable({
  constraintToParent: true,
  handle: null,
  handleClassName: 'cc-movable-handle',
  horizontally: true,
  namespace: 'movable',
  rootOnly: true,
  vertically: true,
});

// Resizable methods
movable.addMoveHandle(Element);
movable.onMove(Function);
movable.onMoveEnd(Function);
movable.onMoveStart(Function);
```

### Notification

A simple notification where you can put anything inside.

This component inherits from `Closable`.

```js
import { Notification } from 'cuic';

const notification = new Notification({
  animationClass: 'cc-anim-fade cc-anim-zoom',
  autoClose: true,
  autoCloseDelay: 2000,
  autoRemove: true,
  closable: true,
  closed: true,
  closeButton: '',
  closeButtonClass: 'glyphicon glyphicon-remove-sign',
  closeOnBlur: false,
  closeOnFocus: false,
  closeOnMouseLeave: true,
  content: null,
  namespace: 'notification',
  parent: document.body,
  position: 'center',
  zIndex: 100,
});

// Notification methods
notification.close(Function);
notification.getContent();
notification.open(Function);
notification.setContent(String);
```

### NotificationStack

A notification stack is a group of notifications, easier to manage.

This component inherits from `Group`.

```js
import { NotificationStack } from 'cuic';

const stack = new NotificationStack({
  namespace: 'notification-stack',
  position: 'right top',
  zIndex: 10,
});

// NotificationStack methods
stack.close(Function);
stack.open(Function);
```

### Overlay

An overlay is used to cover areas with a screen.

This component inherits from `Closable`.

```js
import { Overlay } from 'cuic';

const overlay = new Overlay({
  animationClass: 'cc-anim-fade',
  autoClose: false,
  autoCloseDelay: 0,
  autoRemove: false,
  closable: false,
  closed: false,
  closeOnBlur: false,
  closeOnFocus: false,
  closeOnMouseLeave: false,
  namespace: 'overlay',
  zIndex: 1,
});

// Overlay methods
overlay.close(Function);
overlay.open(Function);
```

### Panel

A panel can be configured with a header and title, a body and a footer.

This component inherits from `Closable`.

```js
import { Panel } from 'cuic';

const panel = new Panel({
  animationClass: 'cc-anim-fade cc-anim-slide',
  closable: true,
  closeButton: null,
  closeButtonClass: 'glyphicon glyphicon-remove-sign',
  closed: true,
  content: null,
  footer: null,
  maximized: false,
  namespace: 'panel',
  parent: null,
  position: 'left top',
  title: null,
  zIndex: 1,
});

// Panel methods
panel.close(Function);
panel.getContent();
panel.getFooter();
panel.getHeader();
panel.open(Function);
panel.resizeContent();
panel.setContent(String);
panel.setFooter(String);
panel.setHeader(String);
panel.setTitle(String);
```

### Popup

A popup can be used to display things that are hidden by default.

This component inherits from `Closable`.

```js
import { Popup } from 'cuic';

const popup = new Popup({
  anchor: 'top',
  animationClass: 'cc-anim-zoom',
  autoClose: false,
  autoCloseDelay: 0,
  autoRemove: false,
  buttons: [],
  closable: true,
  closed: true,
  closeOnBlur: true,
  closeOnFocus: false,
  closeOnMouseLeave: false,
  content: null,
  namespace: 'popup',
  target: null,
  title: null,
  zIndex: 9,
});

// Popup methods
popup.addButton(Button);
popup.close(Function);
popup.getContent();
popup.getFooter();
popup.getHeader();
popup.open(Function);
popup.setContent(String);
popup.setFooter(String);
popup.setHeader(String);
popup.setTitle(String);
popup.updateTail();
```

### Resizable

A generic component that can be resized.

This component inherits from `Component`.

```js
import { Resizable } from 'cuic';

const resizable = new Resizable({
  handleSize: 10,
  horizontally: true,
  keepRatio: false,
  maxHeight: null,
  maxWidth: null,
  minHeight: 1,
  minWidth: 1,
  namespace: 'resizable',
  vertically: true,
});

// Resizable methods
resizable.onResize(Function);
resizable.onResizeEnd(Function);
resizable.onResizeStart(Function);
```

### Selectable

A generic component that can be selected.

This component inherits from `Component`.

```js
import { Selectable } from 'cuic';

const selectable = new Selectable({
  namespace: 'selectable',
  selected: false,
});

// Selectable methods
selectable.deselect(Function);
selectable.isSelected();
selectable.onDeselected(Function);
selectable.onSelected(Function);
selectable.select(Function);
```

### Switcher

A switcher simply loops through its children, it can be used as a slider.

This component inherits from `Closable`.

```js
import { Switcher } from 'cuic';

const switcher = new Switcher({
  autoStart: true,
  delay: 3000,
  namespace: 'switcher',
  repeat: true,
});

// Switcher methods
switcher.first();
switcher.getActiveElement();
switcher.getElementAt();
switcher.getIndex();
switcher.goTo();
switcher.isStarted();
switcher.last();
switcher.next();
switcher.previous();
switcher.start();
switcher.stop();
```

### Tooltip

A tooltip is used to display text near the pointer, it can be static or it can follow the pointer.

This component inherits from `Closable`.

```js
import { Tooltip } from 'cuic';

const tooltip = new Tooltip({
  anchor: 'right',
  animationClass: 'cc-anim-zoom',
  attribute: 'title',
  autoClose: false,
  autoCloseDelay: 0,
  autoRemove: false,
  closable: true,
  closed: true,
  closeOnBlur: false,
  closeOnFocus: false,
  closeOnMouseLeave: false,
  followPointer: true,
  namespace: 'tooltip',
  selector: '[title]',
  zIndex: 100,
});

// Tooltip methods
tooltip.close(Function);
tooltip.getContent();
tooltip.open(Function);
tooltip.setContent(String);
tooltip.updateTail();
```

## Changelog

History of releases is in the [changelog](./CHANGELOG.md).

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).

If you find this lib useful and would like to support my work, donations are welcome :)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7S7P9W7L2CNQG)
