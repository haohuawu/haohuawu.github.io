---
title: CSS 权重及优先级
date: 2017-03-28 16:17:22
sticky: 0
tags:
  - CSS
---

CSS样式应用到元素上的规则可以简述为：先将所有样式按来源、权重排序，然后应用权重高的样式，权重相同的样式根据“就近原则”应用。

<!-- more -->

### CSS 权重

- `内联样式(1000)`

- `ID选择器(100)`

- `class、属性、伪类选择器(10)`

- `元素、伪元素(1)`

- `通配符*(0)`

```css
/* 0001 */
h1 {
  color: red;
}

/* 0012 */
p.siderbar > em {
  color: purple;
}

/* 0020 */
.clearfloat::after {
  content: "";
  display:block;
  clear:both;
}

/* 0101 */
li#answer {
  color:navy;
}

/* 0012 */
ul > li[id="answer"] {
  color:navy;
}
```

**注意：**

- 使用属性选择器选择ID，其权重为10

- 权重值不会进位，即使有 10 个元素选择器，其权重也不如一个类选择器权重高，即 `000(10)` < `0010`

- 拥有 `!important` 声明的样式声明其权重单独计算

- (默认)继承的样式没有权重，会被通配符样式覆盖

  ```css
  * { color:yellow; }
  h1 { color:red; }
  ```

  ```html
  <h1>RED and <em>YELLOW</em></h1>
  ```

  `em` 元素继承了 `h1` 的 `color` 样式，但是因为其无权重，所以会被 `* { color:yellow; }` 覆盖。

### CSS 样式应用优先级分析

1. 列出每一条样式规则，每条规则都含有一个匹配给定元素的选择器

2. 按照来源和重要声明对所有样式排序

  CSS的来源有三种：

    - User Agent Stylesheet 用户代理的默认 CSS（浏览器默认的 CSS）

    - Author Stylesheet 开发人员定义的 CSS

    - User Stylesheet 用户自定义的 CSS

3. 再考虑到重要声明，可以将样式如下排序（优先级从高到低）：

  1. User Stylesheet (!important)

  2. Author Stylesheet (!important)

  3. Author Stylesheet (Normal)

  4. User Stylesheet (Normal)

  5. User Agent Stylesheet

4. 按照选择器权重给所有样式声明排序

5. 按照样式声明出现的顺序给其排序，同一权重的，后申明优先级越高，即“就近原则”

  所以，对于推荐下面的链接样式的排序(link-visited-hover-active, LVHA)

  ```css
  :link { color:blue; }
  :visited { color:purple; }
  :hover { color:red; }
  :active { color:orange; }
  ```

  而不是：

  ```css
  :active { color:orange; }
  :hover { color:red; }
  :link { color:blue; }
  :visited { color:purple; }
  ```

  这样任何链接都不会显示 `:hover` 或 `:active` 样式。因为任何链接要么已访问，要么未访问，所以前两个样式会被覆盖。