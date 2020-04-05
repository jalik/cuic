/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Karl STEIN
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

import Element from './ui/element';

/**
 * Adds an event listener
 * @param element
 * @param event
 * @param listener
 * @param capture
 * @return {*}
 */
export function addEventListener(element, event, listener, capture = false) {
  if (typeof element.addEventListener === 'function') {
    return element.addEventListener(event, listener, capture);
  }
  if (typeof element.attachEvent === 'function') {
    return element.attachEvent(event, listener);
  }
  return null;
}

/**
 * Calls the function with an array of arguments
 * @param fn
 * @param context
 * @param args
 * @return {*}
 */
export function apply(fn, context, args) {
  if (typeof fn === 'function') {
    return fn.apply(context, args);
  }
  return null;
}

/**
 * Returns a Cuic element if possible
 * @param element
 * @return {*|Element}
 */
export function asElement(element) {
  if (element instanceof Element) {
    return element;
  }
  if (isNode(element)) {
    return new Element(element);
  }
  if (element instanceof Window) {
    return new Element(element);
  }
  if (isJQuery(element)) {
    return new Element(element.get(0));
  }
  if (typeof element === 'string') {
    return find(element).first();
  }
  return element;
}

/**
 * Returns the HTML node from the element
 * @param element
 * @return {null|HTMLDocument|HTMLElement|Window}
 */
export function asNode(element) {
  let node;

  // Is already an HTML element
  if (isNode(element)) {
    node = element;
  }
  // Is a Window
  if (element instanceof Window) {
    node = element;
  }
  // Is a CUIC element
  if (element instanceof Element) {
    node = element.node();
  }
  // Is a jQuery element
  if (isJQuery(element)) {
    node = element.get(0);
  }
  // Is a string selector
  if (typeof element === 'string') {
    if (element === 'body') {
      node = document.body;
    } else if (element === 'head') {
      node = document.head;
    } else if (element === 'window') {
      node = window;
    } else {
      node = find(element).get(0);
    }
  }
  // console.error('cannot get HTMLElement from element.', element);
  return node;
}

/**
 * Adds pixel unit to numeric values if needed
 * @param styles
 * @return {*}
 */
export function autoPixel(styles) {
  const properties = [
    // positioning
    'bottom',
    'left',
    'padding',
    'right',
    'top',
    // dimension
    'max-height',
    'max-width',
    'height',
    'width',
    // margin
    'margin',
    'margin-bottom',
    'margin-left',
    'margin-right',
    'margin-top',
    // padding
    'padding',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'padding-top',
  ];

  const newStyles = styles;
  const stylesKeys = Object.keys(newStyles);
  const stylesLength = stylesKeys.length;

  // Add pixel unit to numbers
  for (let i = 0; i < stylesLength; i += 1) {
    const style = stylesKeys[i];

    if (typeof newStyles[style] === 'number' && properties.indexOf(style) !== -1) {
      newStyles[style] = `${newStyles[style]}px`;
    }
  }
  return newStyles;
}

/**
 * Returns the scrollbar width
 * @return {number}
 */
export function calculateScrollbarWidth() {
  const inner = document.createElement('div');
  inner.style.width = '100%';
  inner.style.height = '200px';

  const outer = document.createElement('div');
  outer.style.position = 'absolute';
  outer.style.top = '0px';
  outer.style.left = '0px';
  outer.style.visibility = 'hidden';
  outer.style.width = '200px';
  outer.style.height = '150px';
  outer.style.overflow = 'hidden';
  outer.appendChild(inner);
  document.body.appendChild(outer);

  const w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  let w2 = inner.offsetWidth;

  if (w1 === w2) {
    w2 = outer.clientWidth;
  }
  document.body.removeChild(outer);

  return (w1 - w2);
}

/**
 * Calls the function with arguments
 * @return {*}
 */
export function call(...args) {
  let context;
  let fn;

  if (args.length >= 2) {
    fn = args.shift();
    context = args.shift();
  } else if (args.length > 0) {
    fn = args.shift();
  }
  return apply(fn, context, args);
}

/**
 * Constraints position to limits
 * @param position
 * @param limit
 * @return {*}
 */
export function constraintPosition(position, limit) {
  const props = position;

  // Limit horizontal align
  if (typeof props.left === 'number') {
    if (props.left < limit.minX) {
      props.left = limit.minX;
    } else if (props.left > limit.maxX) {
      props.left = limit.maxX;
    }
  }
  if (typeof props.right === 'number') {
    if (props.right < limit.minX) {
      props.right = limit.minX;
    } else if (props.right > limit.maxX) {
      props.right = limit.maxX;
    }
  }

  // Limit vertical align
  if (typeof props.top === 'number') {
    if (props.top < limit.minY) {
      props.top = limit.minY;
    } else if (props.top > limit.maxY) {
      props.top = limit.maxY;
    }
  }
  if (typeof props.bottom === 'number') {
    if (props.bottom < limit.minY) {
      props.bottom = limit.minY;
    } else if (props.bottom > limit.maxY) {
      props.bottom = limit.maxY;
    }
  }
  return props;
}

/**
 * Exits full screen
 */
export function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

/**
 * Returns all elements matching the selector
 * @param selector
 * @param context DEPRECATED!
 * @return {Elements}
 */
export function find(selector, context) {
  if (context) {
    throw new SyntaxError('Context argument is deprecated in find(selector, context)');
  }
  if (selector === 'body') {
    return asElement(document.body);
  }
  if (selector === 'head') {
    return asElement(document.head);
  }
  if (selector === 'window') {
    return asElement(window);
  }
  return asElement(document).find(selector);
}

/**
 * Returns the computed style of the element
 * @param element
 * @param style
 * @return {*}
 */
export function getComputedStyle(element, style) {
  const elm = asNode(element);
  let prefixedStyle = style;
  const experimentalStyles = [
    'animation',
    'border-radius',
    'box-shadow',
    'transition',
  ];

  // Prefix style with browser name
  if (!elm.style[style] && style.indexOf(experimentalStyles) !== -1) {
    prefixedStyle = prefixStyle(style);
  }
  return window.getComputedStyle(elm, null)[prefixedStyle];
}

/**
 * Returns the CSS style prefix depending of the browser
 * @return {*}
 */
export function getStylePrefix() {
  const element = document.createElement('div');
  const { style } = element;

  // Check with animation
  if (typeof style.MozAnimation === 'string') return '-moz-';
  if (typeof style.OAnimation === 'string') return '-o-';
  if (typeof style.WebkitAnimation === 'string') return '-webkit-';

  // Check with transition
  if (typeof style.MozTransition === 'string') return '-moz-';
  if (typeof style.OTransition === 'string') return '-o-';
  if (typeof style.WebkitTransition === 'string') return '-webkit-';

  return '';
}

/**
 * Checks if the browser is Chrome 1+
 * @return {boolean}
 */
export function isChrome() {
  return !!window.chrome && !!window.chrome.webstore;
}

/**
 * Checks if the browser is Edge 20+
 * @return {boolean}
 */
export function isEdge() {
  return !isIE() && !!window.StyleMedia;
}

/**
 * Checks if the element is an instance of Element
 * @param obj
 * @return {*}
 */
export function isElement(obj) {
  return (
    typeof HTMLElement === 'object' ? obj instanceof HTMLElement
      : obj !== null
      && typeof obj === 'object'
      && obj.nodeType === 1
      && typeof obj.nodeName === 'string'
  );
}

/**
 * Checks if the browser is Firefox 1.0+
 * @return {boolean}
 */
export function isFirefox() {
  return typeof window.InstallTrigger !== 'undefined';
}

/**
 * Checks if full screen is enabled
 * @return {boolean}
 */
export function isFullScreenEnabled() {
  return (document.fullscreenEnabled
    || document.webkitFullscreenEnabled
    || document.mozFullScreenEnabled
    || document.msFullscreenEnabled) === true;
}

/**
 * Checks if the browser is Internet Explorer 6-11
 * @return {boolean}
 */
export function isIE() {
  return /* @cc_on!@ */ !!document.documentMode;
}

/**
 * Checks if element is an instance of an object
 * @param fn
 * @param obj
 * @return {boolean}
 */
export function isInstanceOf(fn, obj) {
  return typeof fn !== 'undefined'
    && fn !== null
    && obj instanceof fn;
}

/**
 * Checks if element is a JQuery object
 * @param obj
 * @return {boolean}
 */
export function isJQuery(obj) {
  return typeof obj === 'object' && obj && typeof obj.jquery !== 'undefined';
}

/**
 * Checks if the element is an instance of Node
 * @param obj
 * @return {*}
 */
export function isNode(obj) {
  return (
    typeof Node === 'object' ? obj instanceof Node : obj
      && typeof obj === 'object'
      && typeof obj.nodeType === 'number'
      && typeof obj.nodeName === 'string'
  );
}

/**
 * Checks if the browser is Opera 8.0+
 * @return {boolean}
 */
export function isOpera() {
  return (typeof window.opr !== 'undefined' && typeof window.opr.addons !== 'undefined')
    || window.opera
    || navigator.userAgent.indexOf(' OPR/') >= 0;
}

/**
 * Checks if the browser is Safari 3.0+
 * @return {boolean}
 */
export function isSafari() {
  return /constructor/i.test(window.HTMLElement)
    || ((p) => p.toString() === '[object SafariRemoteNotification]')(typeof window.safari === 'undefined' || typeof window.safari.pushNotification !== 'undefined');
}

/**
 * Removes an event listener
 * @param event
 * @param element
 * @param callback
 * @return {*}
 */
export function off(event, element, callback) {
  let duration = 0;
  let elm = element;

  if (elm instanceof Element) {
    elm = elm.node();
  } else if (isJQuery(elm)) {
    elm = elm.get(0);
  } else if (!isNode(elm) && !(elm instanceof Window)) {
    throw new TypeError('Cannot add event listener on unsupported element.');
  }

  // Get browser event name
  const browserEvent = whichEvent(event, elm);

  // Check if event is supported
  if (!browserEvent) {
    // eslint-disable-next-line no-console
    console.warn(`Event "${event}" is not supported by this browser.`);
  }

  // Event is an animation
  if (event.indexOf('animation') !== -1) {
    duration = getComputedStyle(elm, 'animation-duration');

    // Execute callback now
    if (!browserEvent && (!('animation' in elm.style) || duration === '0s')) {
      apply(callback, elm);
    }
  } else if (event.indexOf('transition') !== -1) {
    // Event is a transition
    duration = getComputedStyle(elm, 'transition-duration');

    // Execute callback now
    if (!browserEvent && (!('transition' in elm.style) || duration === '0s')) {
      apply(callback, elm);
    }
  }
  return removeEventListener(elm, browserEvent, callback);
}

/**
 * Attaches an event listener
 * @param event
 * @param element
 * @param callback
 * @return {*}
 */
export function on(event, element, callback) {
  let duration = 0;
  let elm = element;

  if (elm instanceof Element) {
    elm = elm.node();
  } else if (isJQuery(elm)) {
    elm = elm.get(0);
  } else if (!isNode(elm) && !(elm instanceof Window)) {
    throw new TypeError('Cannot add event listener on unsupported element.');
  }

  // Get browser event name
  const browserEvent = whichEvent(event, elm);

  // Check if event is supported
  if (!browserEvent) {
    // eslint-disable-next-line no-console
    console.warn(`Event "${event}" is not supported by this browser.`);
  }

  // Event is an animation
  if (event.indexOf('animation') !== -1) {
    duration = getComputedStyle(elm, 'animation-duration');

    // Execute callback now
    if (!browserEvent && (!('animation' in elm.style) || duration === '0s')) {
      apply(callback, elm);
    }
  } else if (event.indexOf('transition') !== -1) {
    // Event is a transition
    duration = getComputedStyle(elm, 'transition-duration');

    // Execute callback now
    if (!browserEvent && (!('transition' in elm.style) || duration === '0s')) {
      apply(callback, elm);
    }
  }
  return addEventListener(elm, browserEvent, callback);
}

/**
 * Attaches a unique event listener
 * @param event
 * @param element
 * @param callback
 * @return {*}
 */
export function once(event, element, callback) {
  let duration = 0;
  let elm = element;

  if (elm instanceof Element) {
    elm = elm.node();
  } else if (isJQuery(elm)) {
    elm = elm.get(0);
  } else if (!isNode(elm) && !(elm instanceof Window)) {
    throw new TypeError('Cannot add event listener on unsupported element.');
  }

  // Get browser event name
  const browserEvent = whichEvent(event, elm);

  // Check if event is supported
  if (!browserEvent) {
    // eslint-disable-next-line no-console
    console.warn(`Event "${event}" is not supported by this browser.`);
  }

  // Event is an animation
  if (event.indexOf('animation') !== -1) {
    duration = getComputedStyle(elm, 'animation-duration');

    // Execute callback now
    if (!browserEvent && (!('animation' in elm.style) || duration === '0s')) {
      apply(callback, elm);
    }
  } else if (event.indexOf('transition') !== -1) {
    // Event is a transition
    duration = getComputedStyle(elm, 'transition-duration');

    // Execute callback now
    if (!browserEvent && (!('transition' in elm.style) || duration === '0s')) {
      apply(callback, elm);
    }
  }

  // fixme sometimes, no callback is executed, so components stays with opening class...

  const listener = (ev) => {
    const isTransitionOrAnimation = (event.indexOf('animation') !== -1 || event.indexOf('transition') !== -1);

    if (!isTransitionOrAnimation || ev.target === elm) {
      removeEventListener(elm, browserEvent, listener);
      apply(callback, elm, Array.prototype.slice.call(ev));
    }
  };

  return addEventListener(elm, browserEvent, listener);
}

/**
 * Executes the callback when the DOM is ready
 * @param callback
 */
export function onDOMReady(callback) {
  document.addEventListener('DOMContentLoaded', callback);
}

/**
 * Executes a callback when the window is resized
 * @param callback
 * @param delay
 */
export function onWindowResized(callback, delay = 50) {
  let timer;

  if (isInstanceOf(Window, window)) {
    on('resize', window, (event) => {
      clearTimeout(timer);
      timer = setTimeout(() => { callback(event); }, delay);
    });
  }
}

/**
 * Returns the prefixed style
 * @param style
 * @return {string}
 */
export function prefixStyle(style) {
  let newStyle = style;

  if (!newStyle.startsWith('-')) {
    const prefix = getStylePrefix();

    if (typeof prefix === 'string' && prefix.length > 0) {
      newStyle = prefix + newStyle;
    }
  }
  return newStyle;
}

/**
 * Removes an event listener
 * @param element
 * @param event
 * @param listener
 * @return {*}
 */
export function removeEventListener(element, event, listener) {
  if (typeof element.removeEventListener === 'function') {
    return element.removeEventListener(event, listener);
  }
  if (typeof element.detachEvent === 'function') {
    return element.detachEvent(event, listener);
  }
  return undefined;
}

/**
 * Returns screen height
 * @return {number}
 */
export function screenHeight() {
  return window.screen.height;
}

/**
 * Returns screen width
 * @return {number}
 */
export function screenWidth() {
  return window.screen.width;
}

/**
 * Sets of returns the window horizontal scroll
 * @param x
 * @param y
 */
export function scrollTo(x, y) {
  window.scrollTo(x, y);
}

/**
 * Sets of returns the window horizontal scroll
 * @param x
 * @return {number}
 */
export function scrollX(x) {
  let result;

  if (typeof x === 'undefined') {
    result = window.scrollX;
  } else {
    window.scrollTo(x, window.scrollY);
  }
  return result;
}

/**
 * Sets of returns the window vertical scroll
 * @param y
 * @return {number}
 */
export function scrollY(y) {
  let result;

  if (typeof y === 'undefined') {
    result = window.scrollY;
  } else {
    window.scrollTo(window.scrollX, y);
  }
  return result;
}

/**
 * Removes all special characters
 * @param text
 * @return {string}
 */
export function slug(text) {
  let newText = text;

  if (typeof newText === 'string') {
    newText = newText.replace(/ +/g, '-');
    newText = newText.replace(/[^a-zA-Z0-9_-]+/g, '');
  }
  return newText;
}

/**
 * Removes HTML tags leaving only text
 * @param html
 * @return {*}
 */
export function stripTags(html) {
  let newHtml = html;

  if (typeof newHtml === 'string' && newHtml.length) {
    // Replaces <br> with new line
    newHtml = newHtml.replace(/<br[^>]>/gi, '\r\n');
    // Removes tags
    newHtml = newHtml.replace(/<[^>]+>/g, '');
    // Removes extra spaces
    newHtml = newHtml.trim();
  }
  return newHtml;
}

/**
 * Returns the string converted to CamelCase
 * todo remove this unused method
 * @param str
 * @return {string}
 */
export function toCamelCase(str) {
  // Lower cases the string
  return str.toLowerCase()
  // Replaces any - or _ characters with a space
    .replace(/[-_]+/g, ' ')
    // Removes any non alphanumeric characters
    .replace(/[^\w\s]/g, '')
    // Uppercases the first character in each group immediately following a space
    // (delimited by spaces)
    .replace(/ (.)/g, (($1) => $1.toUpperCase()))
    // Removes spaces
    .replace(/ /g, '');
}

/**
 * Returns the value depending of the type of the value,
 * for example, if it is a function, it will returns the result of the function.
 * @param value
 * @param context
 * @return {*}
 */
export function valueOf(value, context) {
  let newValue = value;

  if (typeof newValue === 'function') {
    newValue = newValue.call(context);
  }
  return newValue;
}

/**
 * Returns the event supported by the current environment
 * @param event
 * @param element
 * @return {*}
 */
export function whichEvent(event, element) {
  if (element) {
    let resolver = {};

    switch (event) {
      case 'animationend':
        resolver = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'animationend',
          WebkitAnimation: 'webkitAnimationEnd',
        };
        break;

      case 'transitionend':
        resolver = {
          transition: 'transitionend',
          OTransition: 'oTransitionEnd',
          MozTransition: 'transitionend',
          WebkitTransition: 'webkitTransitionEnd',
        };
        break;

      default:
    }

    // Check in resolver
    const resolverKeys = Object.keys(resolver);
    const resolverLength = resolverKeys.length;

    for (let i = 0; i < resolverLength; i += 1) {
      const key = resolverKeys[i];

      if (typeof element.style[key] !== 'undefined') {
        return resolver[key];
      }
    }

    // Check in element
    if (typeof element[event] !== 'undefined') {
      return event;
    }
    if (typeof element[`on${event}`] !== 'undefined') {
      return event;
    }
  } else {
    // Check in document
    if (typeof document[event] !== 'undefined') {
      return event;
    }
    if (typeof document[`on${event}`] !== 'undefined') {
      return event;
    }

    // Check in window
    if (typeof window[event] !== 'undefined') {
      return event;
    }
    if (typeof window[`on${event}`] !== 'undefined') {
      return event;
    }
  }
  return undefined;
}
