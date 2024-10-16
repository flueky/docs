---
title: "安装AndroidStudio"
date: 2018-08-02 15:50:04 +0800
categories: 
 - 开发工具
tag:
 - AndroidStudio
---

公司准备招聘一批具备 Java 基础的实习生学习 Android 开发。因此，后续会出一系列的 Android 开发入门、基础、高级教程。那么，从第零步，搭建开发环境开始。由于 Android 是基于 Java 平台开发的，因此还需要[安装 Java 环境](install-java)。

<!-- more -->

网上有很多搭建 Android 开发环境的教程，主要是基于 Eclipse 和  AndroidStudio 。其中，在下载 SDK 模块时，讲到需要设置代理。个人认为该方式可有可无，目前已经可以在大陆下载全部 SDK 代码，和访问 [Android 官网](https://developer.android.google.cn/)。

## 1 下载AndroidStudio

AndroidStudio 3.3下载

1. [android-studio-2024.2.1.10-windows](https://redirector.gvt1.com/edgedl/android/studio/install/2024.2.1.10/android-studio-2024.2.1.10-windows.exe)

2. [android-studio-2024.2.1.10-mac](https://redirector.gvt1.com/edgedl/android/studio/install/2024.2.1.10/android-studio-2024.2.1.10-mac.dmg)

3. [android-studio-2024.2.1.10-mac_arm](https://redirector.gvt1.com/edgedl/android/studio/install/2024.2.1.10/android-studio-2024.2.1.10-mac_arm.dmg)

4. [android-studio-2024.2.1.10-linux](https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2024.2.1.10/android-studio-2024.2.1.10-linux.tar.gz)


## 2 安装AndroidStudio

安装步骤如下：

<img src="/assets/image/101/1.png" width="400"/>
<img src="/assets/image/101/2.png" width="400"/>
<img src="/assets/image/101/3.png" width="400"/>
<img src="/assets/image/101/4.png" width="400"/>
<img src="/assets/image/101/5.png" width="400"/>
<img src="/assets/image/101/6.png" width="400"/>
<img src="/assets/image/101/7.png" width="400"/>

## 3 配置AndroidStudio

第一次启动AndroidStudio，会弹出配置提示。如果电脑中已经安装过AS，可以使用上一个AS的配置，在这里，展示如何第一次配置AS。步骤如下：

<img src="/assets/image/101/8.png" width="400"/>

建议采用自定义配置模式。

<img src="/assets/image/101/9.png" width="400"/>
<img src="/assets/image/101/10.png" width="400"/>

为不增加配置后的下载时间，此处暂不下载安卓模拟器和硬件加速插件。指定的sdk路径即之前下载的SDK Tools 解压后的路径。

<img src="/assets/image/101/11.png" width="400"/>

下图显示需要下载的组件大小，点击finish后，开始下载模式。

<img src="/assets/image/101/12.png" width="400"/>
<img src="/assets/image/101/13.png" width="400"/>

如果安装`jdk11`之后，无法正确打开`AndroidStudio`。请检查是否配置`jre`目录。其他版本 `jdk` 不存在这个问题。如果是下载的 `zip` 包，建议将 `studio.exe` 添加到桌面快捷方式，而不是 `studio64.exe`

创建第一个Android工程，[请跳转](hello-android)。
