---
title:  VirtualBox 虚拟机
category: 
 - 虚拟机
---

虚拟机，模拟器，Docker 是 PC 端比较常见的虚拟化软件。使用户可以在 Windows/Mac/Linux 等系统的机器上运行其他类型的系统，甚至 Android。 Docker 与前两着有些差异，因为它不是虚拟化出一个完整的 OS 。将在 Docker 专栏中介绍

<!-- more -->

## 下载安装

Virtual Box [官网](https://www.virtualbox.org/)

- Windows [下载地址](https://download.virtualbox.org/virtualbox/7.1.4/VirtualBox-7.1.4-165100-Win.exe)
- Mac Intel Chip [下载地址](https://download.virtualbox.org/virtualbox/7.1.4/VirtualBox-7.1.4-165100-OSX.dmg)
- Mac Apple Chip [下载地址](https://download.virtualbox.org/virtualbox/7.1.4/VirtualBox-7.1.4-165100-macOSArm64.dmg)
- Ubuntu [下载地址](https://download.virtualbox.org/virtualbox/7.1.4/virtualbox-7.1_7.1.4-165100~Ubuntu~noble_amd64.deb)

> 以上下载地址，均接截止于 2024-11-23 `7.1.4`。Linux 发行版本比较多，可点此 [跳转](https://www.virtualbox.org/wiki/Linux_Downloads)。如需下载最新版，见官方 [下载页面](https://www.virtualbox.org/wiki/Downloads)。

## 新建虚拟机

![](/assets/image/virtualbox/01.png)

点击新建，首先配置虚拟机名称和系统。从上到下，一依次是：

- 设置虚拟机名称
- 设置虚拟系统存储位置
- 选择系统安装镜像文件，通常是 iso 格式。Mac 系统镜像文件需要转换成 iso。 
- 选择系统类型，支持 Windows Mac Linux 等众多主流系统。
- 选择发行版本，主要用于 Linux 系统。支持 Ubuntu Debian Fedora 等等。
- 选择系统版本，windows 支持全部历史版本，Mac 只能兼容到 10.13. 

![](/assets/image/virtualbox/02.png)
![](/assets/image/virtualbox/03.png)

以上完成系统选择，接下载还需要配置硬件参数。

![](/assets/image/virtualbox/04.png)

设置 CPU 核数和内存，建议按照目标系统的需求分配。如， Linux 系统 4 核 2G 内存即可。Windows 建议至少 8G 内存。但是也不能分配太大，可能导致宿主系统卡死。

![](/assets/image/virtualbox/05.png)

设置硬盘大小，对应到宿主系统中是一个 vdi 为后缀的文件。默认设置下，文件占用硬盘空间会动态增加，并不会占用你实际分配大小的空间。

## 配置虚拟机

配置界面，区分基础模式和专家模式。作为新手，基本模式下的配置已经够用。

### 常规

![](/assets/image/virtualbox/06.png)

这个配置在新建虚拟机的时候已经设置过，此时主要是确认。

![](/assets/image/virtualbox/07.png)

- 共享剪贴板，可在宿主机和虚拟机之间共享剪贴板数据。
- 拖放，这个配置一直没用过，可能是两个系统之间传递文件。

### 系统

![](/assets/image/virtualbox/08.png)

- 内存：在新建虚拟机时已经配置过，此处可调整。
- 启动顺序：依次是硬盘、光驱、软驱、网络。 之前的 iso 镜像文件存在虚拟光驱中。安装系统时，需要先从光驱启动，等安装成功后，再从硬盘启动。
- 鼠标设备: 默认选项，因为 VirtualBox 支持光标无缝切换。

![](/assets/image/virtualbox/09.png)

- 处理器：在新建虚拟机时已经配置过，此处可调整。

### 显示

![](/assets/image/virtualbox/10.png)

- 显存：不知道其原理，建议直接拉满
- 显示器数量： 默认一。
- 缩放比例：不建议修改。

### 存储

![](/assets/image/virtualbox/11.png)
![](/assets/image/virtualbox/12.png)
![](/assets/image/virtualbox/13.png)
![](/assets/image/virtualbox/14.png)

以上配置，建议用默认选项。控制器相当于多块硬盘，多个 vdi 文件相当于硬盘分区。

### 音频

![](/assets/image/virtualbox/15.png)

### 网络

![](/assets/image/virtualbox/16.png)

- NAT 模式：网络地址转换，共享主机 ip 访问外网。
- 桥接模式：直接连接物理网络，从路由器中单独获取一个 ip ，可被整个局域网内设备访问到。

### USB

![](/assets/image/virtualbox/17.png)

### 共享目录

![](/assets/image/virtualbox/18.png)

将宿主机中的文件目录共享到虚拟机中。

## 增强功能

包括共享目录等部分功能，需要虚拟机中安装驱动，即增强功能。

`C:\Program Files\Oracle\VirtualBox\VBoxGuestAdditions.iso` 挂载到虚拟光驱。