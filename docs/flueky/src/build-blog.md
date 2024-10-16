---
title: 搭建个人知识库
category:
 - Note
tag:
star: true
date: 2024-10-15 22:09:40 +0800
---

个人知识库，可以是一个只包含静态页面的网站。作为新手，不需要买域名以及服务器。[GitHub Pages](https://pages.github.com/) 就够用了。 

<!-- more -->

## 准备工作

基于 GitHub Pages 搭建知识库网站，需要基于一些主流的平台与框架编译，用 Markdown 编写文件内容。因此需要做如下准备。

- 安装 git
- 安装 nodejs
- 熟练编写 md 文件

## 安装 git

https://git-scm.com/

## 安装 Node.js

[Node.js](https://nodejs.org/zh-cn) 版本较多，遇到兼容性要求时，对不同版本管理不太友好。建议使用 NVM 。

### Windows

[GitHub 地址](https://github.com/coreybutler/nvm-windows)

下载 [最新版本](https://github.com/coreybutler/nvm-windows/releases)， 直接解压安装即可。

查询 [最新版本 Node.js](https://nodejs.org/zh-cn/download/prebuilt-installer)

```cmd
nvm install 20.18.0 # 当前最新版本
nvm list # 查看已安装版本
nvm use 20.18.0 # 选择需要的版本
```

### Mac/Linux

[GitHub 地址](https://github.com/nvm-sh/nvm)

安装命令如下：

```shell
# 使用 curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# 使用 wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

nvm ls-remote # 查看最新版本号，建议选择 LTS
nvm install 20.18.0 # 当前最新版本
nvm list # 查看已安装版本
nvm use 20.18.0 # 选择需要的版本
```

## Markdown

Markdown 语法，支持快速排版内容。入门较简单，参考[文档](markdown)。除了基本的 Markdown 语法，还支持 Vuepress 支持的高级功能。如：数学公式，图表以及脑图。

## Hexo

[Hexo](https://hexo.io/zh-cn/) 是快速简洁且高效的博客框架。需要搭配合适 [主题](https://hexo.io/themes/) 使用。

推荐主题 [hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly) 。

也可参照之前写的[文档](hexo-basic) 。

## Vuepress

[Vuepress](https://vuepress.vuejs.org/zh/) 是 Vue 驱动的静态网站生成器。

推荐主题 [Vuepress Theme Hope](https://theme-hope.vuejs.press/) 。