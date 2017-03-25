import merge from 'lodash.merge';
import has from '../utils/has';
import findIndex from '../utils/findindex';

function normalizeOptions(fallbackContext = null, options = {}) {
  const {
    once = false,
    context = fallbackContext
  } = options;
  return { once, context };
}

function createListener(event, handler, { once, context }) {
  return { event, handler, once, context };
}

export function normalizeListener(event, handler, options, fallbackContext) {
  return createListener(event, handler, normalizeOptions(fallbackContext, options));
}

export default class EventEmitter {
  constructor() {
    this.listeners = {};
    this.disabled = false;
  }
  disable(disabled) {
    this.disabled = disabled;
  }
  on(event, handler, options = {}) {
    if (Array.isArray(event)) {
      event.forEach((ev) => {
        this.on(ev, handler, options);
      });
      return this;
    }
    if (event.indexOf(', ') >= 0) {
      return this.on(event.split(', '), handler, options);
    }
    if (event.indexOf('*') === 0) {
      return this.on(event.substring(1), handler, merge(options, { once: true }));
    }
    if (!has(this.listeners, event)) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(
      normalizeListener(event, handler, options, this)
    );
    return this;
  }
  off(event, handler) {
    if (!event && !handler) {
      this.listeners = {};
    } else if (event && handler) {
      if (has(this.listeners, event)) {
        const index = findIndex(
          this.listeners[event],
          listener => listener.handler === handler
        );
        if (index !== -1) {
          this.listeners[event].splice(index, 1);
        }
      }
    } else if (event && !handler) {
      this.listeners[event] = [];
    } else {
      Object.keys(this.listeners).forEach((ev) => {
        this.off(ev, handler);
      });
    }
    return this;
  }
  emit(event, ...args) {
    if (this.disabled) {
      return false;
    }
    if (has(this.listeners, event) && this.listeners[event].length > 0) {
      this.listeners[event].forEach((listener) => {
        listener.handler.apply(listener.context, args.concat(this));
        if (listener.once) {
          setTimeout(this.off.bind(this), 0, listener.event, listener.handler);
        }
      });
      return true;
    }
    return false;
  }
}
