---
title:  安装 Proxmox VE
category: 
 - nas
 - pve
---

## 下载镜像

目前最新版本 [8.3](https://enterprise.proxmox.com/iso/proxmox-ve_8.3-1.iso)

## 制作引导盘

推荐使用 [Ventoy](https://www.ventoy.net/), 这是我目前见过最轻量，兼容性最好的 制作 USB 启动盘的共工具。

可同时将多个系统的镜像文件拷入 Ventoy 制作好的启动盘中。 盗用一张来自官网的图片。

![](https://www.ventoy.net/static/img/screen/screen_uefi_cn.png?v=4)

## 安装 PVE

### 虚拟机

如果还不熟悉 PVE 系统的安装与使用，可先通过 VirtualBox 虚拟机练手。关于怎样使用 VirtualBox，见 [此文档](/virtualbox.md)。

![](./assets/image/01/02.png)
![](./assets/image/01/03.png)
![](./assets/image/01/04.png)
![](./assets/image/01/05.png)
![](./assets/image/01/06.png)
![](./assets/image/01/07.png)
![](./assets/image/01/08.png)
![](./assets/image/01/09.png)

做好以上配置后，即可启动虚拟机。

### 实体机

将 U 盘插入机器中，并选择从 U 盘启动。选择 proxmox iso 文件后，进入安装页面。

下面的安装步骤和界面，虚拟机与实体机完全一致。

![](./assets/image/01/10.png)
![](./assets/image/01/11.png)
![](./assets/image/01/12.png)
![](./assets/image/01/13.png)
![](./assets/image/01/14.png)
![](./assets/image/01/15.png)
![](./assets/image/01/16.png)
![](./assets/image/01/17.png)
![](./assets/image/01/18.png)

## 启动 PVE

成功进入系统后，在屏幕上显示出了访问地址。后续操作和配置均可通过浏览器远程访问。

![](./assets/image/01/19.png)

登录 PVE 系统，要求输入用户： root， 密码： 安装系统时设置的。

![](./assets/image/01/20.png)

最后看到完整管理界面如图

![](./assets/image/01/21.png)