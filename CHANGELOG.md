# Changelog

## v0.12.0
- Adds prefixes to style passed to `getComputedStyle()`
- Adds resolvers for `animationend` in `cuic.whichEvent()`
- Adds default class `btn-secondary` to `Button` component to support Bootstrap v4
- Changes dialog transitions
- Changes closing transitions speed
- Closes dialog overlay only when needed
- Exports all classes using `export default` ES6 syntax
- Renames all component CSS class name with the prefix `cc-`
- Renames class `debug` to `debugging`
- Fixes overlay opening transition
- Fixes calls to `cuic.getComputedStyle()`
- Disables transitions for elements with `hidden` CSS class

## v0.11.0
- Adds `options` argument to method `Element._calculateAlign(position, options)`
- Adds `options` argument to method `Element.align(position, options)`
- Adds `Element.focus()`
- Adds `Element.scrollHeight()`
- Adds `Element.scrollWidth()`
- Adds option `inScreen: Boolean` to `Element.align(position, options)`
- Auto-focuses the last button with `autofocus` attribute in `Dialog`
- Fixes `Element._calculateAlign()` with scrolling
- Fixes `Element._calculateAvailablePosition()` with scrolling
- Fixes `Element._calculateMaximize()` with scrolling
- Fixes `Element.scrollLeft()` on body and window
- Fixes `Element.scrollTop()` on body and window

## v0.10.2
- Adds `Cuic.body()`
- Adds `Cuic.calculateScrollbarWidth()`
- Adds `Cuic.screenHeight()`
- Adds `Cuic.screenWidth()`
- Adds `Cuic.scrollTo()`
- Adds `Cuic.scrollX()`
- Adds `Cuic.scrollY()`
- Adds `Element.calculatePosition()`
- Adds `Element.calculatePositionOnScreen()`
- Adds `Element.isDirectChildOf()`
- Adds `Guide.getCurrentStepIndex()`
- Adds `Guide.getLastStep()`
- Adds `Guide.getStep()`
- Adds `Guide.getStepById()`
- Adds `Guide.getStepIndex()`
- Adds `Guide.resume()`
- Adds `Switcher.onIndexChanged()`
- Adds `Switcher.onStarted()`
- Adds `Switcher.onStopped()`
- Adds option `autoScroll: Boolean` to `Guide`
- Fixes notifications animation in `NotificationStack`
- Fixes `Element._disableTransitions()` to hide element
- Fixes `Element._enableTransitions()` to show element
- Fixes `Element.anchor()` to animate changes only when element is in the same parent node then the target
- Fixes `Element.isInDOM()`
- Fixes `Element.offsetParent()` to return null if no parent is found
- Fixes `Cuic.isJQuery()` causing webpack error: "module not found 'jquery'"

## v0.10.1
- Fixes `Guide` auto close issue
- Fixes `Guide` animations
- Adds option `steps: Array` in `Guide` to work with `autoStart: Boolean` option

## v0.10.0
- Adds `Guide` component
- Adds `Popup.addButton(Object)`
- Adds `Popup.getFooter()`
- Adds `Popup.getHeader()`
- Adds `Popup.setHeader(String)`
- Adds `Popup.setHeader(String)`
- Adds `Popup.setTitle(String)`
- Allows to pass all valid button options to `Dialog.addButton(Object)` 
- Fixes `Cuic.append()`, `Cuic.prepend()` and `Cuic.prependTo()` with old browsers using compatible syntax not requiring polyfills

## v0.9.3
- Fixes dialog closing origin animation
- Fixes dialog content size when footer is hidden
- Fixes method `Events.trigger()` to allow returning value

## v0.9.2
- Adds `Closable` component
- Adds `Dialog.setHeader(html)`
- Adds `Notification.getContent()`
- Adds `Panel.setHeader(html)`
- Adds `Popup.getContent()`
- Adds `Tooltip.getContent()`
- Adds option `selected: false` to `Selectable` component
- Renames option `vertical` to `vertically` for `Movable` and `Resizable` components
- Renames option `horizontal` to `horizontally` for `Movable` and `Resizable` components
- Renames `Fader` component to `Overlay`
- Returns `Element` inside `click` method of every components
- Fixes movable components aligned to bottom

## v0.9.0
- Uses ES6 import/export syntax
