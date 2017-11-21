# Cuic

Cuic stands for **Common User Interface Components** and aims to offer various UI components like dialogs, popups, notifications, tooltips, etc.

## Components

### Button

```js
import {Button} from "cuic/ui/button";

const button = new Button({
    className: "btn-primary",
    disabled: false,
    label: "Submit",
    title: "Save modifications",
    type: "submit"
});
```

### Dialog

```js
import {Dialog} from "cuic/ui/dialog";

const dialog = new Dialog({
    autoClose: false,
    autoRemove: true,
    autoResize: true,
    buttons: [],
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
```

### Fader

```js
import {Fader} from "cuic/ui/fader";

const fader = new Fader({
    autoClose: false,
    autoRemove: false,
    opened: false,
    zIndex: 1
});
```

### Notification

```js
import {Notification} from "cuic/ui/notification";

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
```

### NotificationStack

```js
import {NotificationStack} from "cuic/ui/notification-stack";

const notificationStack = new NotificationStack({
    position: "right top",
    zIndex: 10
});
```

### Panel

```js
import {Panel} from "cuic/ui/panel";

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
```

### Popup

```js
import {Popup} from "cuic/ui/popup";

const popup = new Popup({
    anchor: "top",
    autoClose: true,
    autoRemove: false,
    content: null,
    opened: false,
    target: null,
    zIndex: 9
});
```

### Switcher

```js
import {Switcher} from "cuic/ui/switcher";

const switcher = new Switcher({
    autoStart: true,
    delay: 3000,
    repeat: true
});
```

### Tooltip

```js
import {Tooltip} from "cuic/ui/tooltip";

const tooltip = new Tooltip({
    anchor: "right",
    attribute: "title",
    followPointer: true,
    opened: false,
    selector: "[title]",
    zIndex: 100
});
```

## Changelog

### v0.9.0
- Uses ES6 import/export syntax

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).

If you find this lib useful and would like to support my work, donations are welcome :)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7S7P9W7L2CNQG)
