---
title: Hexo 建站手札——基础
category:
  - Hexo
date: 2019-11-02 00:00:00
tag:
---

2016 年 2 月，写了工作中第一篇博客。至今快 4 年时间，写了几十篇文章，也使用过几个平台。

1. **CSDN** 一直在用，上面有着几乎全部的文章。[传送门](https://blog.csdn.net/flueky)
2. **掘金** 这两年掘金顺势崛起，也在上面同步过数篇博客。[传送门](https://juejin.im/user/5a97e5df518825558358a1bd)

<!-- more -->

直到接触到 **jekyll** 、 **Hexo** 这样的博客生成工具。前者使用一年，没多研究其扩展功能。本文将介绍使用 **Hexo** 建站的步骤。

本文适用于初学者，如果您已具备 Hexo 建站技能，需要丰富下网页的功能，请参阅[进阶篇](hexo-advanced)。

## 1. 准备工作

万事开头难，建站也是需要做一些准备的。

- 搭建 **Hexo** 环境。
- 熟悉用 **MarkDown** 写作。
- 代码托管平台。

1. 使用 **Hexo** 建站，建议参照[官方文档](https://hexo.io/zh-cn/docs/)。
2. 如果您还在使用 html 排版的方式，只能说 out 了。使用 md 写作，快速排版，实时对比。
3. 将文章存放在 GitHub 或 GitLab 等这样的开源平台，或者购买域名服务器。

建议前期使用开源平台，因为**免费**，入门简单。甚至不需要编码基础。

### 1.1 创建仓库

1. 注册 **GitHub** 。假如用户名是 `flueky` ,那么你的 **GitHub** 主页地址是 [https://github.com/flueky](https://github.com/flueky)。
2. 创建仓库，必须名字是 **flueky.github.io** ,其中 `flueky` 替换成你自己的 **GitHub** 账户名字。即，创建完后，仓库地址是 [https://github.com/flueky/flueky.github.io](https://github.com/flueky/flueky.github.io)。

将此仓库作为博客主页后 ，可以直接使用域名 [https://flueky.github.io/](https://flueky.github.io/) 访问 。

主题来自于 [xaoxuu](https://xaoxuu.com/) 的 **matrial x** 。

## 2. Hexo 常用命令

### 2.1 创建目录

```Shell
# 创建 blog 目录
hexo init blog
```

下面的命令，如无特殊说明，都是在 **blog** 目录下执行。

### 2.2 启动服务

```Shell
# 默认启动参数，访问地址：http://127.0.0.1:4000
hexo server
# 使用指定端口，用在端口冲突的情况下 访问地址：http://127.0.0.1:4001
hexo server -p 4001
# 带草稿箱文件启动
hexo server --draft
```

### 2.3 部署博客

```Shell
# 在配置好站点后，将博客文件推送至站点
hexo deploy
# 清楚生成文件
hexo clean
# 通常使用下面的方式合用两条命令
hexo clean && hexo deploy
```

## 3.  初始化博客

正确搭建好 **Hexo** 环境后，可以使用 `init` 命令完成博客目录创建。

`init` 命令完成后，启动服务见到下面的页面表示成功。

<img src="/assets/image/026/1.png" width="800"/>

文件列表如下，**未列出的皆为命令生成的文件，无须添加到版本控制工具中**。

```yaml
# 博客文件
├── _config.yml # 博客配置文件，可修改大多数配置，需要重启服务。
├── package.json # 程序配置文件。无须修改。
├── scaffolds # 模板目录，使用 hexo new 命令新建博客文件时使用。
├── source # 博客资源文件，存放博客文本和图片。
│   └── _drafts # drafts (草稿箱目录)，使用  hexo publish 命令移动到 _posts 目录。
│   └── _posts # post 目录，部署时直接部署此目录的博客文本。
└── themes # 所有主题都存放在此目录下。
    └── landscape #主题
```

使用主题 **material-x**。

```Shell
# 在 blog 目录中执行，获取主题源码
git clone https://github.com/xaoxuu/hexo-theme-material-x themes/material-x
# 安装相关依赖包
npm i -S hexo-generator-search hexo-generator-json-content hexo-renderer-less
```

或者直接使用 **xaoxuu** 或 **flueky** 整理好的 demo 。

```Shell
# 获取 xaoxuu 源码
git clone https://github.com/xaoxuu/blog-example blog
# 获取 flueky 源码，可以使用其它版本，具体见说明
git clone --branch v0.0.2 https://github.com/flueky/hexo-blog.git 
# 在 blog 目录中执行，安装 hexo 有关文件后方可使用 hexo 命令
npm install
```

在博客配置文件 `_config.yml` 中切换主题。

```yaml
# theme: landscape # 注释旧主题
theme: material-x
```

再次启动服务见到下面的页面表示成功。

<img src="/assets/image/026/2.png" width="800"/>

## 4. 个性化配置

以下配置 ，均是基于  `material-x` 主题。

### 4.1 修改站点 logo 和 标题

修改前：

<img src="/assets/image/026/3.png" width="200"/>

修改博客配置文件 `_config.yml`。

```yaml
# Site
# 站点名称
title: Flukey 小站
# 站点图标
favicon: pic/user_icon.png
```

修改后：

<img src="/assets/image/026/4.png" width="200"/>

### 4.2 修改主页标题

修改前：

<img src="/assets/image/026/5.png" width="350"/>

修改主题配置文件 `_config.yml`。

```yaml
# page的封面
cover:
  title: FLUEKY # 不设置 ，默认显示站点的标题。
  # logo: assets/logo.png    # logo和title只显示一个，若同时设置，则只显示logo
```

<img src="/assets/image/026/6.png" width="350"/>

### 4.3 修改用户LOGO

修改前：

<img src="/assets/image/026/7.png" width="300"/>

修改主题配置文件 `_config.yml`。

```yaml
# 侧边栏小部件配置
sidebar:
  - widget: author
    avatar: pic/user_icon.png # 此处替换 logo
    social: true
```

<img src="/assets/image/026/8.png" width="300"/>

### 4.4 修改作者信息

<img src="/assets/image/026/10.png" width="300"/>

```yaml
# Site
# 作者名称
author: Flueky
# 作者图标，使用相对路径时，需要关注文章实际生成的目录。
# 此路径在文章中使用，但是pic文件夹在source目录下
# 如果更改了 permalink ，下面的路径需要做修改。
avatar: /assets/image/img/user_icon.png
```

<img src="/assets/image/026/11.png" width="300"/>

### 4.5 配置菜单 

菜单指主页标题，搜索框下四个模块。

<img src="/assets/image/026/6.png" width="350"/>

```yaml
# page的封面
cover:
  # 主页封面菜单
  features:
    - name: 博文
      icon: fas fa-rss
      url: /
    - name: 项目
      icon: fas fa-code-branch
      url: projects/
    - name: 友链
      icon: fas fa-link
      url: friends/
      rel: nofollow
    - name: 关于
      icon: fas fa-info-circle
      url: about/
      rel: nofollow
```

按照上面的配置修改后，请在 `source` 目录下做如下操作。

1. 建立 **projects**  文件夹，创建 index.md 文件。内容：

   ```
   ---
   title: 项目
   ---
   ```

2. 建立 **friends**  文件夹，创建 index.md 文件。内容：

   ```
   ---
   layout: links
   title: 我的朋友们
   sidebar: []
   links:
     - group: 欢迎各行各业的朋友
       icon: fas fa-handshake
       items:
       - name: '<i class="fas fa-comment fa-fw" aria-hidden="true"></i> 赶快留言吧'
         avatar: https://cdn.jsdelivr.net/gh/xaoxuu/assets@18.12.27/avatar/avatar.png
         url: '#comments'
         backgroundColor: '#869989'
         textColor: '#FFFD'
         tags:
         - 1~4个标签
         - 两个最佳
   ---
   
   <br>
   
   各位大佬想交换友链的话可以在下方留言，必须要有名称、头像链接、和至少一个标签哦～
   
   > 名称： Flueky Tech-site
   头像： https://flueky.github.io/pic/img/user_icon.gif
   网址： https://flueky.github.io
   标签： Android
   ```

3. 建立 **about**  文件夹，创建 index.md 文件。内容：

   ```
   ---
   title: 公开的秘密
   ---
   ```

### 4.6 配置导航栏

**material-x** 导航栏默认不可见，电脑端需要上滑页面至主页图片消失时显示 。手机端点击右上角图标显示。此处只 列出 电脑端的配置 。

<img src="/assets/image/026/9.png" width="800"/>

```yaml
# 桌面端导航栏菜单
menu_desktop:
  - name: 示例
    icon: fas fa-grin
    url: /
  - name: 分类
    icon: fas fa-folder-open
    url: categories/
    rel: nofollow
  - name: 标签
    icon: fas fa-hashtag
    url: tags/
    rel: nofollow
  - name: 归档
    icon: fas fa-archive
    url: archives/
    rel: nofollow
```

按照上面的配置修改后，请在 `source` 目录下做如下操作。

1. 建立 **categories**  文件夹，创建 index.md 文件。内容：

   ```
   ---
   layout: category
   index: true
   title: 所有分类
   ---
   ```

2. 建立 **tags** 文件夹，并创建 index.md 文件。内容：

   ```
   ---
   layout: tag
   index: true
   title: 所有标签
   ---
   ```

3. 建立 **archives** 文件夹。无须创建 **index.md** 文件， **hexo**  已经处理 。

### 4.7 使用 icon

**material-x** 支持使用 [fontawesome](https://fontawesome.com/icons) 的 icon 。

```yaml
icon: fas fa-grin # 图片名是 grin
```

### 4.8 配置部署

修改博客配置文件 `_config.yml`。

```yaml
deploy:
	# 配置部署到 GitHub 上的示例。
  type: git
  repo: https://github.com/flueky/flueky.github.io.git
  branch: master
```

之后使用 `deploy` 命令部署到指定的仓库地址上 ，就可以使用 [https://flueky.github.io](https://flueky.github.io)访问。**可能需要等待几分钟**。

**截止到这里，已经可以尽情的写文章了。文章中以 GitHub 为例，所有用户名 `flueky` 需要换成自己的。**

[源码地址](https://github.com/flueky/hexo-blog)
