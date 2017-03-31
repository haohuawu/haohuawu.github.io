---
title: CSS 代码风格指南
sticky: 0
date: 2017-03-31 10:24:41
tags:
  - CSS
---

### 书写格式

- 2 个空格缩进

- 每行不超过 80 个字符

- 多行 CSS（便于`diff`）

- SASS 规则嵌套前后加空行

  ```sass
  .home {
    color: red;

    .banner {
      width: 100%;
    }
  }
  ```

- 有意义的空行

  - 相关规则（紧耦合）之间 1 个空行

  - 弱相关规则（弱耦合）之间 2 个空行

  - 规则集之间 5 个空行

  比如：

  ```css
  .icon {}

  .icon__item {}


  .icon--person {}




  .foo {}
  ```