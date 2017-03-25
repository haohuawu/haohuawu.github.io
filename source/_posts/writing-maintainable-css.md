---
layout: post
title:  "编写可维护的CSS"
date: 2017-03-13
author: 吴浩华
tags: [CSS]
---

HTML、JS、CSS并列为前端的三驾马车，其中HTML已标准化到HTML5，JS随着ES2015/2016的快速普及（Babel、Webpack功不可没）发展迅猛，CSS被远远的抛在了后面，彻底成为大型项目工程化、模块化的痛点、难题。当然，不能说CSS社区毫无进展，SASS、Less、Stylus、PostCSS、Stylelint这些工具的产生确实

## 命名范式

> There are only two hard things in Computer Science: cache invalidation and **naming things**.
>
> --- Phil Karlton

良好的命名对于编写可维护的CSS尤为重要。CSS的命名范式主要有：Atomic、[CSS Modules](https://github.com/css-modules/css-modules)、[OOCSS](http://oocss.org/)、[SMACSS](https://smacss.com/)、[BEM](http://getbem.com/)。

<!-- more -->

#### Atomic

以非语义化的CSS类名描述元素的基本样式（一组样式的集合、工具类），灵活但不可读（同时意味着难以维护），偏原子化、过于抽象、代码冗余：

```html
<div class="pull-left"></div>
<div class="grid row"></div>
<div class="col-xs-4 black-70"></div>
```

#### CSS Modules

而语义化的CSS类名一般应用于HTML、CSS、JavaScript甚至自动化测试，偏应用化/模块化。语义化的CSS类名易读，少了二义性，HTML结构简单直接，清晰地表达了模块化的设计思想，易于定位，重构风险小（模块化的设计影响范围小）：

```html
<div class="basket"></div>
<div class="tag-cloud"></div>
<div class="auto-complete"></div>
<div class="avatar"></div>
```

显然，语义化的CSS类名更易于维护，为了灵活扩展及复用，我们可以通过SASS、LESS或者Stylus等CSS处理器定义、提取原子样式，将其组合为一个个语义化的CSS组件。

## 抽象与复用

语义化的CSS不利于复用，对于一些公共的、抽象的样式（垂直居中、网格布局、清除浮动、多行省略、主题样式等等），我们可以通过CSS处理器定义变量、mixin（够用就好、不要太复杂，过于复杂则增加了维护成本，限制了复用）解决。

## 避免（正确）使用id

id的权重太大，同时id表示元素唯一，不利于应用样式，除了以下场景，应当避免使用：

  - 关联 label 标签
  - 作为 hash URL
  - 关联 aria 属性，增加可访问性
  - 用于BI埋点、自动化测试

## 类BEM的约定范式

```css
.<module>[--<component>][attribute for state][---<modifier>] {}
```

```scss
<!-- SASS -->
.search-result {
  &--head {}
  &[loading] {}
  &---bg-sunny {}
}
```

## 什么是模块

模块是一个独立的单元，也可以和其他模块组成更复杂的模块，比如：电视、沙发以及衣柜组成卧室，拿掉电视，卧室还是卧室。

## 什么是组件

组件是模块不可分割的一部分，当然有时候组件与模块之间的边界比较模糊，比如网站的用户头像与头部导航，用户头像可以是组件，也可以是模块。

## 状态

用户界面不是一成不变的，尤其是响应式的、富交互的。随着用户界面与用户产生交互，元素就会有各种状态：

- 显示/隐藏
- 激活/未激活
- 禁用/非禁用
- 加载中/加载完毕

## 修饰符

修饰符和状态类似，但是一般用于区别各个同类组件/模块实例，比如同样的海报banner，背景图不一样；同样的按钮，主色不一样

参考：

- [maintainablecss](http://maintainablecss.com/)
