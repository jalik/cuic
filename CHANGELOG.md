# Changelog

## v0.50.6
- Upgraded dependencies

## v0.50.5
- Upgraded dependencies

## v0.50.4
- Upgraded dependencies

## v0.50.3
- Upgraded dependencies

## v0.50.2
- Upgraded dependencies

## v0.50.1
- Fixed named exports in `index.js`

## v0.50.0
- Removed functions `body()` and `debug()`
- Renamed function `ready()` to `onDOMReady()`
- Renamed function `element()` to `asElement()`
- Renamed function `node()` to `asNode()`
- Lib available in ES6+ syntax (see `src` folder) to enable auto-completion in IDEs
- Upgraded dependencies

## v0.14.1
- Upgraded dependencies

## v0.14.0
- Fixed tooltip closing with option `followPointer: true` when mouse is over tooltip
- Fixed missing dependency `babel-core@7.0.0-bridge.0` in `package.json`
- Added classes `closing` and `opening` on component during animations
- Added method `Closable.closeAfterDelay(delay, callback)`
- Added method `Closable.isClosing()`
- Added method `Closable.isOpening()`
- Added method `Elements.focus()`

## v0.13.1
- Fixed application of CSS styles with dash in method `Cuic.css()`

## v0.13.0
- Upgraded dependencies
- Fixed positioning of method `Element.align()`
- Deprecated method `Closable.isOpened()`
- Added method `Closable.cancelCloseTimer()`
- Added method `Closable.isAutoClosable()`
- Added method `Closable.isClosable()`
- Added method `Closable.isClosed()`
- Added option `animationClass` in all components
- Added option `autoClose` in `Closable` components
- Added option `autoCloseDelay` in `Closable` components
- Added option `autoRemove` in `Closable` components
- Added option `closeOnBlur` in `Closable` components
- Added option `closeOnFocus` in `Closable` components
- Added option `closeOnMouseLeave` in `Closable` components
- Renamed option `opened` to `closed` in all components

## v0.12.1
- Upgraded dependencies
- Renamed method `Cuic._calculateAlign()` to `Cuic.calculateAlign()`
- Renamed method `Cuic._calculateAnchor()` to `Cuic.calculateAnchor()`
- Renamed method `Cuic._calculateAvailablePosition()` to `Cuic.calculateAvailablePosition()`
- Renamed method `Cuic._calculateAvailableSpace()` to `Cuic.calculateAvailableSpace()`
- Renamed method `Cuic._calculateMaximize()` to `Cuic.calculateMaximize()`
- Renamed method `Cuic._calculateMinimize()` to `Cuic.calculateMinimize()`
- Renamed method `Cuic._disableTransitions()` to `Cuic.disableTransitions()`
- Renamed method `Cuic._display()` to `Cuic.display()`
- Renamed method `Cuic._enableTransitions()` to `Cuic.enableTransitions()`
- Renamed method `Cuic._restoreDisplay()` to `Cuic.restoreDisplay()`

## v0.12.0
- Added prefixes to style passed to `getComputedStyle()`
- Added resolvers for `animationend` in `cuic.whichEvent()`
- Added default class `btn-secondary` to `Button` component to support Bootstrap v4
- Changed dialog transitions
- Changed closing transitions speed
- Closes dialog overlay only when needed
- Export all classes using `export default` ES6 syntax
- Renamed all component CSS class name with the prefix `cc-`
- Renamed class `debug` to `debugging`
- Fixed overlay opening transition
- Fixed calls to `cuic.getComputedStyle()`
- Disabled transitions for elements with `hidden` CSS class

## v0.11.0
- Added `options` argument to method `Element._calculateAlign(position, options)`
- Added `options` argument to method `Element.align(position, options)`
- Added `Element.focus()`
- Added `Element.scrollHeight()`
- Added `Element.scrollWidth()`
- Added option `inScreen: Boolean` to `Element.align(position, options)`
- Auto-focuses the last button with `autofocus` attribute in `Dialog`
- Fixed `Element._calculateAlign()` with scrolling
- Fixed `Element._calculateAvailablePosition()` with scrolling
- Fixed `Element._calculateMaximize()` with scrolling
- Fixed `Element.scrollLeft()` on body and window
- Fixed `Element.scrollTop()` on body and window

## v0.10.2
- Added `Cuic.body()`
- Added `Cuic.calculateScrollbarWidth()`
- Added `Cuic.screenHeight()`
- Added `Cuic.screenWidth()`
- Added `Cuic.scrollTo()`
- Added `Cuic.scrollX()`
- Added `Cuic.scrollY()`
- Added `Element.calculatePosition()`
- Added `Element.calculatePositionOnScreen()`
- Added `Element.isDirectChildOf()`
- Added `Guide.getCurrentStepIndex()`
- Added `Guide.getLastStep()`
- Added `Guide.getStep()`
- Added `Guide.getStepById()`
- Added `Guide.getStepIndex()`
- Added `Guide.resume()`
- Added `Switcher.onIndexChanged()`
- Added `Switcher.onStarted()`
- Added `Switcher.onStopped()`
- Added option `autoScroll: Boolean` to `Guide`
- Fixed notification animation in `NotificationStack`
- Fixed `Element._disableTransitions()` to hide element
- Fixed `Element._enableTransitions()` to show element
- Fixed `Element.anchor()` to animate changes only when element is in the same parent node then the target
- Fixed `Element.isInDOM()`
- Fixed `Element.offsetParent()` to return null if no parent is found
- Fixed `Cuic.isJQuery()` causing webpack error: "module not found 'jquery'"

## v0.10.1
- Fixed `Guide` auto close issue
- Fixed `Guide` animations
- Added option `steps: Array` in `Guide` to work with `autoStart: Boolean` option

## v0.10.0
- Added `Guide` component
- Added `Popup.addButton(Object)`
- Added `Popup.getFooter()`
- Added `Popup.getHeader()`
- Added `Popup.setHeader(String)`
- Added `Popup.setHeader(String)`
- Added `Popup.setTitle(String)`
- Allows to pass all valid button options to `Dialog.addButton(Object)` 
- Fixed `Cuic.append()`, `Cuic.prepend()` and `Cuic.prependTo()` with old browsers using compatible syntax not requiring polyfills

## v0.9.3
- Fixed dialog closing origin animation
- Fixed dialog content size when footer is hidden
- Fixed method `Events.trigger()` to allow returning value

## v0.9.2
- Added `Closable` component
- Added `Dialog.setHeader(html)`
- Added `Notification.getContent()`
- Added `Panel.setHeader(html)`
- Added `Popup.getContent()`
- Added `Tooltip.getContent()`
- Added option `selected: false` to `Selectable` component
- Renamed option `vertical` to `vertically` for `Movable` and `Resizable` components
- Renamed option `horizontal` to `horizontally` for `Movable` and `Resizable` components
- Renamed `Fader` component to `Overlay`
- Returns `Element` inside `click` method of every components
- Fixed movable components aligned to bottom

## v0.9.0
- Uses ES6 import/export syntax
