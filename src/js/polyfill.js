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

// Add support for Number.parseFloat
if (!Number || typeof Number.parseFloat === 'undefined') {
  Number.parseFloat = window.parseFloat;
}
// Add support for Number.parseInt
if (!Number || typeof Number.parseInt === 'undefined') {
  Number.parseInt = window.parseInt;
}

/**
 * Element.matches()
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector
    || Element.prototype.mozMatchesSelector
    || Element.prototype.msMatchesSelector
    || Element.prototype.oMatchesSelector
    || Element.prototype.webkitMatchesSelector
    || function matchesElement(s) {
      const matches = (this.document || this.ownerDocument).querySelectorAll(s);
      let i;

      for (i = 0; i < matches.length; i += 1) {
        if (matches.item(i) === this) {
          break;
        }
      }
      return i > -1;
    };
}

/**
 * Element.remove()
 */
if (!Element.prototype.remove) {
  Element.prototype.remove = function removeElement() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

/**
 * Node.append()
 */
// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
((arr) => {
  arr.forEach((item) => {
    if (typeof item.append !== 'undefined') {
      return;
    }
    Object.defineProperty(item, 'append', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function append(...args) {
        const docFrag = document.createDocumentFragment();

        args.forEach((argItem) => {
          const isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        this.appendChild(docFrag);
      },
    });
  });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

/**
 * Node.prepend()
 */
// from: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
((arr) => {
  arr.forEach((item) => {
    if (typeof item.prepend !== 'undefined') {
      return;
    }
    Object.defineProperty(item, 'prepend', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function prepend(...args) {
        const docFrag = document.createDocumentFragment();

        args.forEach((argItem) => {
          const isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });

        this.insertBefore(docFrag, this.firstChild);
      },
    });
  });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
