---
title:  TrusNAS
category: 
 - pve
---

## 创建虚拟机

### 基本信息

- Node: 默认
- VM ID: 建议大于等于 100 任意数字，要求唯一，不重复。
- Name: 虚拟机名字

![](./assets/image/truenas/01.png)

### 系统

- 选择下载下来的 iso 文件

![](./assets/image/truenas/02.png)

### 主板

- 默认配置

![](./assets/image/truenas/03.png)

### 硬盘

- 系统盘 16G 刚好。
- 数据盘按照需求，或直接使用直通硬盘。

![](./assets/image/truenas/04.png)

### CPU

- 双核

![](./assets/image/truenas/05.png)

### 内存

- 8G

![](./assets/image/truenas/06.png)

### 网络

- 添加虚拟网卡。

![](./assets/image/truenas/07.png)

### 确认信息

- 最后检查配置结果

![](./assets/image/truenas/08.png)

### 修改引导顺序

- 将系统盘设置在最前面。

![](./assets/image/truenas/19.jpg)

## 安装虚拟机

找到目标虚拟机，右键，启动。

![](./assets/image/truenas/09.png)

- 正确进入引导页。

![](./assets/image/truenas/10.png)

- 选择 1 安装系统。

![](./assets/image/truenas/11.png)

- 通过空格键选择需要安装的系统盘。

![](./assets/image/truenas/12.png)

- 点击回车确认。

![](./assets/image/truenas/13.png)

- 选择 2 ，通过 web 页面添加账户。

![](./assets/image/truenas/14.png)

- 选择 EFI 启动

![](./assets/image/truenas/15.png)

- 安装成功。

![](./assets/image/truenas/16.png)

- 重启系统。

![](./assets/image/truenas/17.png)

- 直到图示页面，在浏览器中输入地址，进入系统。

![](./assets/image/truenas/18.png)