import merge from 'lodash.merge';
import typeOf from '../utils/typeof';

export function contains(element, child) {
  if (element && child) {
    return element.contains(child);
  }
  return false;
}

export function domReady(fn) {
  if (document.readyState === 'interactive') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn, false);
  }
}

export function hasClass(el, className) {
  if (el) {
    return el.className.indexOf(className) >= 0;
  }
  return false;
}

/* eslint-disable no-param-reassign */
export function addClass(el, className) {
  if (el && className) {
    if (className.indexOf(' ') >= 0) {
      className.split(' ').forEach(addClass.bind(null, el));
    } else {
      el.className = el.className.split(' ').filter(
        name => name && name !== className
      ).concat([className]).join(' ');
    }
  }
  return el;
}

/* eslint-disable no-param-reassign */
export function removeClass(el, className) {
  if (el && className) {
    if (className.indexOf(' ') >= 0) {
      className.split(' ').forEach(removeClass.bind(null, el));
    } else {
      el.className = el.className.split(' ').filter(
        name => name && name !== className
      ).join(' ');
    }
  }
  return el;
}

export function normalizeElement(el) {
  if (typeOf(el, 'string')) {
    return document.querySelector(el);
  }
  return el;
}

/* eslint-disable no-param-reassign */
export function applyAttributes(el, attributes = {}) {
  if (el) {
    Object.keys(attributes).forEach((attr) => {
      if (attributes[attr] === false) {
        el.removeAttribute(attr);
      } else if (attributes[attr] === true) {
        el.setAttribute(attr, '');
      } else {
        el.setAttribute(attr, attributes[attr]);
      }
    });
  }
  return el;
}

export function hasAttribute(el, name) {
  if (!el) {
    return false;
  }
  return el.hasAttribute(name);
}

export function applyStyle(el, style = {}) {
  if (el) {
    merge(el.style, style);
  }
  return el;
}

/* eslint-disable no-param-reassign */
export function setInnerHTML(el, innerHTML) {
  if (el && innerHTML) {
    el.innerHTML = innerHTML;
  }
  return el;
}

export function createElement(options = {}, innerHTML = '') {
  const {
    tagName = 'div',
    className,
    style = {},
    attributes,
    el
  } = options;
  return setInnerHTML(
    applyAttributes(
      applyStyle(
        addClass(
          normalizeElement(el) || document.createElement(tagName),
          className
        ),
        style
      ),
      attributes
    ),
    innerHTML
  );
}
