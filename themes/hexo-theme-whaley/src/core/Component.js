import * as Dom from '../shared/dom';
import EventEmitter from './EventEmitter';

export default class Component extends EventEmitter {
  constructor(options = {}, innerHTML) {
    const {
      delegates = [],
      disabled = false,
      visible = true,
      events = {}
    } = options;
    super();
    this.emit('beforeCreate');
    this.components = {};
    this.disabled = disabled;
    this.visible = visible;
    const forward = (event) => {
      if (this.disabled) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.emit(event.type, event, this);
    };
    this.on('detachListeners', () => {
      if (!this.el) {
        return;
      }
      delegates.forEach((evt) => {
        this.el.removeEventListener(evt, forward);
      });
    });
    Object.keys(events).forEach((evt) => {
      this.on(evt, events[evt]);
    });
    this.el = Dom.createElement(options, innerHTML);
    delegates.forEach((evt) => {
      this.el.addEventListener(evt, forward, false);
    });
    this.disable(disabled);
    this.show(visible);
    this.emit('created');
  }
  ref(selector) {
    if (!selector) {
      return this.el;
    }
    return this.el.querySelector(selector);
  }
  show(visible = true) {
    this.visible = visible;
    if (visible) {
      return this.applyAttributes({ hidden: false });
    }
    return this.applyAttributes({ hidden: true });
  }
  disable(disabled = true) {
    super.disable(disabled);
    if (disabled) {
      this.el.setAttribute('disabled', '');
      this.addClass('disabled');
    } else {
      this.el.removeAttribute('disabled');
      this.removeClass('disabled');
    }
    return this;
  }
  removeClass(className) {
    Dom.removeClass(this.el, className);
    return this;
  }
  addClass(className) {
    Dom.addClass(this.el, className);
    return this;
  }
  hasClass(className) {
    return Dom.hasClass(this.ref(), className);
  }
  applyStyle(style) {
    Dom.applyStyle(this.el, style);
    return this;
  }
  applyAttributes(attributes) {
    Dom.applyAttributes(this.el, attributes);
    return this;
  }
  get(name) {
    return this.components[name];
  }
  add(name, component, events = {}, context = component) {
    this.components[name] = component;
    component.mount(this.el);
    Object.keys(events).forEach((evt) => {
      component.on(evt, events[evt], { context });
    });
  }
  remove(name, destroy = true, removeDOMListeners = true, events = {}) {
    const component = this.get(name);
    if (component) {
      delete this.components[name];
      component.unmount(removeDOMListeners);
      Object.keys(events).forEach((evt) => {
        component.off(evt, events[evt]);
      });
      if (destroy) {
        component.destroy();
      }
    }
  }
  mount(parentNode) {
    if (parentNode) {
      if (this.el && !this.el.parentNode) {
        if (document.contains(parentNode)) {
          this.emit('beforeMount');
          parentNode.appendChild(this.el);
          this.emit('mounted');
          Object.keys(this.components).forEach((id) => {
            this.get(id).mount(this.el);
          });
        }
      } else if (this.el && this.el.parentNode && this.el.parentNode !== parentNode) {
        return this.unmount(false).mount(parentNode);
      }
    }
    return this;
  }
  unmount(removeDOMListeners = true, connect = false, dispatch = true) {
    if (this.el && this.el.parentNode) {
      if (!connect) {
        this.emit('beforeUnmount');
        this.el.parentNode.removeChild(this.el);
        if (removeDOMListeners) {
          this.emit('detachListeners');
        }
        this.emit('unmounted');
      } else if (connect) {
        this.emit('beforeUnmount');
        if (removeDOMListeners) {
          this.emit('detachListeners');
        }
        this.emit('unmounted');
      }
      if (dispatch) {
        Object.keys(this.components).forEach((id) => {
          this.components[id].unmount(removeDOMListeners, true);
        });
      }
    }
    return this;
  }
  destroy() {
    this.unmount(true, false, false);
    this.emit('beforeDestroy');
    this.off();
    Object.keys(this.components).forEach((id) => {
      this.components[id].destroy();
    });
    this.components = {};
    this.el = null;
  }
}
