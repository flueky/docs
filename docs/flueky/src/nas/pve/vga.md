---
title:  虚拟化核显
category: 
 - nas
 - pve
---

在 PVE 中，直通硬件，通常只能给一台虚拟机使用，如直通 PCI 网卡 或 USB 网卡。如想支持多台虚拟机，共享设备硬件，则需要对硬件开启虚拟化，如虚拟网卡。
目前已有大佬对 Intel 核显，提供了虚拟化支持，见 [i915-sriov-dkms](https://github.com/strongtz/i915-sriov-dkms)。

<!-- more -->

此文严重参考 [小白学习PVE显卡直通及显卡虚拟化经验](https://blog.csdn.net/bigeightwind/article/details/143475931) 及其引用的文档。

## 检查内核

目前，i915 支持的 Linux 内核版本从 6.1~6.11。如果你的系统内核版本不在这个区间内，可能需要升级，或者降级内核。

```shell
uname -r # 检查 启用的内核版本
pveversion # pve 专用命令，效果同上
proxmox-boot-tool kernel list # 检查已安装的 pve 内核版本
apt-cache search pve-kernel # 查看全部 pve 内核版本
apt install proxmox-kernel-6.8.12-1-pve # 安装指定版本的内核
apt install pve-kernel-6.8.12-1-pve  # 命令同上，pve 用简写
proxmox-boot-tool kernel pin 6.8.12-1-pve # 固化内核
```

如更新内核后，执行 `update-grub` 更新引导，然后重启 pve 。

## 配置系统环境

- 开启 iommu

```shell
# 修改 /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash intel_iommu=on iommu=pt i915.enable_guc=3 i915.max_vfs=7"
# 更新引导
update-grub
update-initramfs -u -k all
```

## 安装 i915

- 下载源码

下载 [i915-sriov-dkms](https://github.com/strongtz/i915-sriov-dkms) 源码，并解压到 pve 中。

- 安装依赖

```shell
apt install mokutil sysfsutils dkms
```

- 修改配置文件

```shell
cd i915-sriov-dkms # 解压后的源码
# 吸修改dkms.conf 文件
PACKAGE_NAME="i915-sriov-dkms"
PACKAGE_VERSION="6.8.12-1"
```

- 安装 i915

```shell
dkms add . # 添加到源码目录
cd /usr/src/i915-sriov-dkms-6.8.12-1
dkms status # 查看已安装的 dkms 模块
# 安装 i915
dkms install -m i915-sriov-dkms -v 6.8.12-1 -k $(uname -r) --force
```

## 配置虚拟核显

```shell
lspci | grep VGA # 查看 核显 ID，我这里是 00:02:0 
echo "devices/pci0000:00/0000:00:02.0/sriov_numvfs = 7" > /etc/sysfs.conf
```

重启系统后，能看到成功虚拟后的显卡。

系统重启与引导项MOK配置 [^1]
执行到此, 应该对该虚拟机系统进行重启, 但需要额外强调下:

因为当前版本系统启用了安全引导, 因此必须在安装驱动后, 重启进入系统前, 在引导页面进行MOK相关配置. 只需在第一次重启配置成功, 之后不在需要设置.
开机启动/引导项MOK配置过程: Enroll MOK, Continue, Yes, , Reboot

[^1]: https://blog.csdn.net/Jon_c/article/details/142445719
