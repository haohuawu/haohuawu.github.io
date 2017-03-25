---
title: 欢迎！让我们愉快的 markdown 吧
date: 2017-03-22 11:32:39
sticky: 9
categories: [Tutorial]
tags: [Markdown]
---

小伙伴们，欢迎使用 Markdown 编写博客！

### 前言

本博客系统使用 [Hexo](https://hexo.io/) 搭建，主题自定义，身为 微鲸VR 的一员，博客的主题就取名为白鲸吧。该博客系统没有后台及数据库，基本零配置，在 Markdown 文件生成纯静态资源，访问非常的快，每一篇博文自动生成文章目录、标签/分类索引、按时间归档。可以 Markdown 中可以插入**图片**、**简单的表格**、**外链**、**iframe**（如在线代码演示）、**gist**、**keynote**（集成[reveal.js](http://lab.hakim.se/reveal-js/)），然后使用 git 提交，一篇排版友好的博客即可展现。下面我来说明一下怎么利用 Markdown 编写博客：

<!-- more -->

### Markdown 语法

Markdown 语法可以参照这个[教程](https://guides.github.com/features/mastering-markdown/)。

### git 仓库目录结构

```txt
.
├─ _config.yml
├─ package.json
├─ scaffolds
├─ source
├    ├─ _drafts
├    ├─ _posts
├    ├─ _data
├    └─ assets
├        └─ images
└─ themes
```

- _config.yml，博客配置文件

- package.json，nodejs 模块说明文件

- scaffolds，新建文件脚手架

- source，工作目录

  - _drafts，存放草稿

  - _posts，发布的博客

  - _data，自定义网站数据

  - assets，其他静态文件，可以放一些博客引用的图片，视频等

- themes，主题

### 引用外链

- 外部链接

语法：`[外链名称](URL地址)`

示例：[Markdown 使用教程](https://guides.github.com/features/mastering-markdown/)

- 站内其他文章

语法：`{% raw %}{% post_link <文章文件名> [标题] %}{% endraw %}`

示例：{% post_link setup-fe-server %}

### 插入图片

语法：`![图片说明](图片地址)`

其中图片地址可以是外部链接，也可以是本地图片的相对地址，按照上文的目录结构，如果想引用 assets 下 images 文件夹下的图片，则该图片地址为：/assets/images/xxx.png

示例1，外部图片：

![外部图片](http://i.wekin.cn/www/pkg/img/activity/cola/hero1_d582cdf.jpg)

示例2，本地图片：

![本地图片](/assets/images/html5-video-browser-support.png)

### 插入 gist 代码片段

语法：`{% raw %}{% gist <gistHash> %}{% endraw %}`

示例：**gist 加载比较慢，可能需要翻墙**

<!-- 访问太慢了，影响页面加载，注释掉 -->

### keynote

请移步 {% post_link welcome-keynote %}

### plantuml

语法：

```
{% plantuml %}
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response
@enduml
{% endplantuml %}
```

示例：

{% plantuml %}
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response
@enduml
{% endplantuml %}

### FrontMatter

每一篇博客都有 front matter，用于描述博客的一些属性（创建时间、作者、标题、所属标签、所属分类等等）

```txt
---
title: 欢迎！让我们愉快的 markdown 吧
date: 2017-03-22 11:32:39
sticky: 9
author: 吴浩华
categories: [Tutorial]
tags: [Markdown]
---
```

front matter 位于文件顶部，以 `---` 定义，下面介绍一些 front matter 相关的特性：

#### 博客置顶

正常情况下，首页所有的博客按照创建时间 `date` 倒序排序，若想让谋篇或者若干博客常驻首页顶部，则可以在 front matter 上定义 `sticky` 属性，属性值为置顶权重，越大则置顶越靠前。

#### 利用标签、分类归档博客

可以为博客设置若干标签、分类为博客归档，所有的标签及分类下的博客按照时间按年进行归档。

附录

- [Markdown 使用教程](https://guides.github.com/features/mastering-markdown/)
- [Hexo 官网](https://hexo.io/)
- [reveal.js](http://lab.hakim.se/reveal-js/)