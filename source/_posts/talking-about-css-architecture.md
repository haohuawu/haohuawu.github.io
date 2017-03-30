---
title: 谈谈 CSS 架构
date: 2017-03-28 11:32:39
sticky: 0
tags:
  - CSS
---

### 良好的 CSS 架构

一个好的架构是可预测的、拥抱变化的、低耦合的以及弹性可扩展的，CSS 也不例外。

#### 可预测的

编写可预测的 CSS 意味着对于每一条 CSS 规则的增删及改动不应该影响页面其他部分。

#### 可复用的

CSS 规则应该充分提取并且解耦，使得新的组件能够复用 patterns。

#### 可维护的

当添加新的功能或者修改现有功能时，不应该需要重构现有的 CSS，新增的组件同样不能影响现有组件。

#### 弹性伸缩的

随着业务量及复杂度的增加，弹性伸缩的 CSS 能够保持简单。

### 一些反模式

#### CSS 样式紧耦合 HTML 结构

就像下面的例子一样，很多 CSS 新手（甚至一些经验丰富的老手）都会根据特定的 HTML 结构为组件添加特殊样式。一开始可能不会有什么副作用，不过，我们可以对照上面的原则来测试一下。首先，`.widget` 是不可预测的，因为我们对 `#sidebar` 和 `body.homepage` 下的 `.widget` 做了特殊处理，导致同样的选择器在页面的不同部分呈现不一样；第二，不满足可复用性，如果我们希望其他页面的某个模块和 `body.homepage` 下的 `.widget` 样式一样呢？这时候为了实现效果，我们不得不照搬 `body.homepage` 下对于 `.widget` 的特殊处理样式；最后，不满足可维护性，因为一旦我们需要重新设计 `.widget` 的样式，那么，我们需要将所有的特殊处理找出来并进行重新设计。

其实，一句话概括就是，我们不应该在一个地方定义了样式，而在其他地方因为业务场景而改变其定义，完全违反了软件开发中的开闭原则。

```css
.widget {
  background: yellow;
  border: 1px solid black;
  color: black;
  width: 50%;
}

#sidebar .widget {
  width: 200px;
}

body.homepage .widget {
  background: white;
}
```

#### 过度复杂的选择器

过度使用复杂的选择器（多层嵌套、链接）意味着深度耦合 HTML 结构，同时增加样式覆盖的难度，无论是哪一个都不利于维护 CSS，因为 HTML 结构不是一成不变的，过度复杂的选择器增加了权重，同时无法复用。

```css
#main-nav ul li ul li div { }
#content article h1:first-child { }
#sidebar > div > h3 + p { }
```

#### 过于通用的 CSS 类名

在设计组件的时候，通常会将组件的子元素类名嵌套定义于组件内部，然而如果子元素的类名过于通用，则很容易导致不可预测的 CSS 样式，因为这样虽然防止组件内部的样式影响页面其他部分，但却无法防止页面其他部分不影响组件的样式。比如下面的 `.title`

```html
<div class="widget">
  <h3 class="title">...</h3>
  <div class="contents">
    <button class="action">Click Me!</button>
  </div>
</div>
```

```css
.widget {}
.widget .title {}
.widget .contents {}
.widget .action {}
```

#### 杂糅太多 CSS 规则

在一个选择器中定义太多的 CSS 规则并不是好的方法，这样就失去了灵活性，不易复用。比如像布局、定位这一类的规则应该在组件外部定义，不具有复用性，而组件的颜色、字体大小、交互细节等等易于复用，同时也是该组件的真实表现，应该封装于组件内部。

```css
.widget {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: red;
  font-size: 1.5em;
  text-transform: uppercase;
}
```

### 一些建议

#### 类名语义化、表明意图

语义化的类名应该能清晰地表明 CSS 的表现内容及其作用对象，使其可预测。

#### 去权重

保持选择器的低权重是编写轻量级、可复用及可维护的 CSS 的关键，权重太大不利于灵活复用。id选择器的权重太大，同时id表示元素唯一，不适用于应用样式，除了以下场景，应当避免使用：

  - 关联 label 标签

  - 作为 hash URL

  - 关联 aria 属性，增加可访问性

  - 用于BI埋点、自动化测试

具体关于权重的计算可参考：{% post_link css-specific-and-priority %}

#### 避免全局选择器（*，标签选择器，属性选择器）

#### 单一职责，划分样式

#### 模块化命名

#### 区分样式及非样式

#### 类 BEM 命名

- Block

- Element

- Modifier

- State

  - 显示/隐藏

  - 激活/未激活

  - 禁用/非禁用

  - 加载中/加载完毕

#### 正确使用 @extend


参考：

- [CSS Architecture -- Philip Walton @ Google](https://philipwalton.com/articles/css-architecture/)

- [maintainablecss](http://maintainablecss.com/)

