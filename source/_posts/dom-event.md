---
title: DOM 事件模型详解
date: 2017-03-25 10:24:41
tags:
  - HTML
  - Event Propagation
---

### 事件监听方式

#### HTML 内联属性监听

```html
<button onclick="handleClick(event || window.event)"></button>
```

不推荐该方法：javascript 与 HTML 耦合，不便于维护；handleClick 必须定义在 window 对象上；同时 handleClick 函数内部的 this 默认指向 window 而非当前监听事件的元素。因此，除非有特殊需求（比如 BI 埋点）一般不使用该方法监听事件。

#### DOM 属性绑定

```javascript
element.onclick = function handleClick(event) {
  // ...
}
```

同样不推荐该方法监听事件，因为该方法不支持监听多次事件回调（虽然可以自己封装，但很麻烦）

#### 事件监听函数

添加事件监听

```javascript
element.addEventListener('click', handleClick, false);
```

移除事件监听

```javascript
element.removeEventListener('click', handleClick, false);
```

### 事件传播模型

先来看个 Demo

<script async src="//jsfiddle.net/wuhaohua/u99xnk3u/embed/js,html,result/"></script>

点击 child1，打开控制台，将输出：

![demo](/assets/images/DOM-event-propagation.png)

#### 事件捕获

```
---------------| |-----------------
| element1     | |                |
|   -----------| |-----------     |
|   |element2  \ /          |     |
|   -------------------------     |
|        Event CAPTURING          |
-----------------------------------
```

#### 事件冒泡

```
               / \
---------------| |-----------------
| element1     | |                |
|   -----------| |-----------     |
|   |element2  | |          |     |
|   -------------------------     |
|        Event BUBBLING           |
-----------------------------------
```

想当年，网景主张事件捕获、微软主张事件冒泡（IE < 9 只支持事件冒泡），而 W3C 采用了折中的方式：先捕获再冒泡

#### 阻止事件传播

```
event.stopPropagation(); // 阻止事件继续捕获或者冒泡
```

```
event.stopImmediatePropagation(); // 阻止调用该事件的其他事件监听
```

#### 阻止默认事件行为

```
event.preventDefault();
```

preventDefault 方法取消浏览器对当前事件的默认行为，比如点击链接后，浏览器跳转到指定页面，或者按一下空格键，页面向下滚动一段距离。该方法生效的前提是，事件的cancelable属性为true，如果为false，则调用该方法没有任何效果。

#### 事件代理/委托

事件会在冒泡阶段向上传播到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。这种方法叫做事件的代理。当子节点动态的插入 DOM 时，使用事件代理能避免对子元素进行频繁的事件注册，更加高效。

### 事件常见属性

```javascript
{
  bubbles: boolean, // 是否是在冒泡阶段触发的
  type: DOMString, // 事件类型, 'click', 'touchstart'
  target: EventTarget, // 事件目标节点（事件源）
  currentTarget: EventTarget, // 事件监听节点
  eventPhase: unsigned short, // 事件传播阶段
  defaultPrevented: boolean, // 是否调用过 preventDefault
  isTrusted: boolean // 事件是否由用户交互触发
}
```

### 事件的执行顺序

正常情况下，先捕获后冒泡，而当事件源为当前事件目标时，并且同一个事件，同一个元素在不同事件传播阶段都绑定了监听，则取决于事件注册顺序，谁先注册，谁先执行。

```javascript
parent.addEventListener('click', () => {
  console.log('冒泡');
}, false);
parent.addEventListener('click', () => {
  console.log('捕获');
}, true);
```

点击 parent，则输出:

冒泡
捕获

### 事件 this 指向

如果事件回调没有使用 `Function.prototype.bind` 的话，this 一般指向 currentTarget、全局对象（window、undefined等）

this 指向 element 节点：
```
// JavaScript代码
element.onclick = print
element.addEventListener('click', print, false)
element.onclick = function () {console.log(this.id);}

// HTML代码
<element onclick="console.log(this.id)">
```

this 指向全局对象
```
// JavaScript代码
element.onclick = function (){ doSomething() };
element.setAttribute('onclick', 'doSomething()');

// HTML代码
<element onclick="doSomething()">
```

### 浏览器兼容

这里的浏览器兼容问题主要在于 IE 8 及其以下与其他浏览器的差别

- 监听事件

```javascript
if (element.attachEvent) { // IE < 9
  element.attachEvent('click', handleClick);
} else {
  element.addEventListener('click', handleClick, false);
}
```

- 触发事件

```javascript
if (element.fireEvent) { // IE < 9
  element.fireEvent('click');
} else {
  element.dispatchEvent('click');
}
```

- 事件源

```
const target = event.target || event.srcElement;
```

- 获取事件对象

```
event = event || window.event
```

### 常用事件和技巧

- beforeunload

当浏览者在页面上的输入框输入一些内容时，未保存、误操作关掉网页可能会导致输入信息丢失，这时我们可以监听该事件：

```
window.addEventListener('beforeunload', function(event) {
  event.returnValue = '放弃当前未保存内容而关闭页面？';
});
```

- resize, scroll

当用户调整窗口大小或者滚动内容时，将触发大量的事件，如果事件回调比较耗时，那么大量的调用将会卡顿用户界面。我们可以通过函数节流或者去抖动函数将大量的事件触发整合成较少的函数调用

- error

当加载资源失败或者加载成功但是只加载一部分而无法使用时，就会触发 error 事件，我们可以利用该事件对资源加载做容错处理，比如给图片加占位图。

### 自定义事件 CustomEvent (IE 9+)

```
const event = document.createEvent('CustomEvent'); // deprecated, use new CustomEvent() instead in modern browsers
event.initCustomEvent(type, canBubble, cancelable, detail);
element.dispatchEvent(event);
```

参考
- [what-is-event-bubbling-and-capturing](https://stackoverflow.com/questions/4616694/what-is-event-bubbling-and-capturing)
- [JavaScript 标准参考教程（alpha）- 事件模型, by 阮一峰](http://javascript.ruanyifeng.com/dom/event.html)
- [Events Order](https://www.quirksmode.org/js/events_order.html)
- [DOM Event Spec](https://dom.spec.whatwg.org/#event)