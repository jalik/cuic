# Cuic

Cuic stands for **Common User Interface Components** and aims to offer various UI components like dialogs, popups, notifications, tooltips, etc.

**The code is tested against bugs**.

## Styling

Cuic has a default styling that you must load to display components correctly.

```js
// Load styles
import cuicStyles from "cuic/dist/cuic.css";
```

## Components

### Element

This is the most generic component that contains all the logic of any component, all components inherit from `Element`.

```js
import Element from "cuit/dist/ui/element";

const element = new Element({
    className: null,
    css: null,
    debug: false,
    maximized: false,
    maximizedX: false,
    maximizedY: false,
    namespace: null,
    parent: null
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
element.debug();
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
import Component from "cuit/dist/ui/component";

const component = new Component();
```

### Button

A basic clickable button.

This component inherits from `Component`.

```js
import Button from "cuit/dist/ui/button";

const button = new Button({
    className: "btn-primary",
    disabled: false,
    label: "Submit",
    title: "Save modifications",
    type: "submit"
});

button.on("click", () => {
    console.log("button clicked");
});
```

### Closable

This is a generic component with opening and closing capabilities.

This component inherits from `Component`.

```js
import Closable from "cuit/dist/ui/closable";

const component = new Closable({
    closable: false,
    opened: true
});

// Closable methods
component.close(Function);
component.isOpened();
component.onClose(Function);
component.onClosed(Function);
component.onOpen(Function);
component.onOpened(Function);
component.open(Function);
component.toggle(Function);
```

### Dialog

A dialog can be configured with a header and title, a body and a footer with buttons.

This component inherits from `Closable`.

```js
import Button from "cuit/dist/ui/button";
import Dialog from "cuit/dist/ui/dialog";

const dialog = new Dialog({
    autoClose: false,
    autoRemove: true,
    autoResize: true,
    buttons: [Button],
    closable: true,
    closeButton: null,
    closeButtonClass: "glyphicon glyphicon-remove-sign",
    content: null,
    contentHeight: null,
    contentWidth: null,
    movable: true,
    maximized: false,
    modal: true,
    namespace: "dialog",
    opened: false,
    parent: document.body,
    position: "center",
    resizable: false,
    title: null,
    zIndex: 10
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
import Button from "cuit/dist/ui/button";
import Guide from "cuit/dist/ui/guide";

const guide = new Guide({
    anchor: "top",
    autoClose: true,
    autoRemove: false,
    content: null,
    opened: false,
    steps: [Button],
    target: null,
    zIndex: 9
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
import Element from "cuit/dist/ui/element";
import Movable from "cuit/dist/ui/movable";

const movable = new Movable({
    handle: null,
    handleClassName: "movable-handle",
    constraintToParent: true,
    horizontally: true,
    namespace: "movable",
    rootOnly: true,
    vertically: true
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
import Notification from "cuit/dist/ui/notification";

const notification = new Notification({
    autoClose: true,
    autoRemove: true,
    closable: true,
    closeButton: null,
    closeButtonClass: "glyphicon glyphicon-remove-sign",
    content: null,
    duration: 2000,
    opened: false,
    parent: document.body,
    position: "center",
    zIndex: 100
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
import NotificationStack from "cuit/dist/ui/notification-stack";

const stack = new NotificationStack({
    position: "right top",
    zIndex: 10
});

// NotificationStack methods
stack.close(Function);
stack.open(Function);
```

### Overlay

An overlay is used to cover areas with a screen.

This component inherits from `Closable`.

```js
import Overlay from "cuit/dist/ui/overlay";

const overlay = new Overlay({
    autoClose: false,
    autoRemove: false,
    opened: false,
    zIndex: 1
});

// Overlay methods
overlay.close(Function);
overlay.open(Function);
```

### Panel

A panel can be configured with a header and title, a body and a footer.

This component inherits from `Closable`.

```js
import Panel from "cuit/dist/ui/panel";

const panel = new Panel({
    autoClose: false,
    closable: true,
    closeButton: null,
    closeButtonClass: "glyphicon glyphicon-remove-sign",
    content: null,
    footer: null,
    maximized: false,
    opened: false,
    parent: null,
    position: "left top",
    title: null,
    zIndex: 1
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
import Popup from "cuit/dist/ui/popup";

const popup = new Popup({
    anchor: "top",
    autoClose: true,
    autoRemove: false,
    buttons: [],
    content: null,
    opened: false,
    target: null,
    zIndex: 9
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
import Resizable from "cuit/dist/ui/resizable";

const resizable = new Resizable({
    handleSize: 10,
    horizontally: true,
    keepRatio: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 1,
    minWidth: 1,
    namespace: "resizable",
    vertically: true
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
import Selectable from "cuit/dist/ui/selectable";

const selectable = new Selectable({
    selected: false
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
import Switcher from "cuit/dist/ui/switcher";

const switcher = new Switcher({
    autoStart: true,
    delay: 3000,
    repeat: true
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
import Tooltip from "cuit/dist/ui/tooltip";

const tooltip = new Tooltip({
    anchor: "right",
    attribute: "title",
    followPointer: true,
    opened: false,
    selector: "[title]",
    zIndex: 100
});

// Tooltip methods
tooltip.close(Function);
tooltip.getContent();
tooltip.open(Function);
tooltip.setContent(String);
tooltip.updateTail();
```

## Changelog

History of releases is in the [Changelog](./CHANGELOG.md).

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).

If you find this lib useful and would like to support my work, donations are welcome :)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7S7P9W7L2CNQG)
