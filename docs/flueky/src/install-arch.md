---
title: Arch 安装教程
date: 2021-01-22 18:05:38 +0800
categories: Arch
tag:
---

Arch 安装教程，支持UEFI和BIOS两种方式。官方教程[地址](https://wiki.archlinux.org/index.php/Installation_guide_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87))。

<!-- more -->

## 环境准备

### 真机

#### 引导模式

在真机上装 Arch ，尤其是准备装双系统，建议了解下自己主板兼容的引导模式。开机时 按下 F2 键，进入主板系统界面。

<img src="/assets/image/103/014.jpg"/>

如图示的主板信息，支持 Legacy （传统模式，记BIOS）和 UEFI 模式。不同的模式，在后续分区操作、安装引导程序时略有区别。如需安装双系统，建议使用 UEFI 模式。

#### 制作启动盘

Arch 系统镜像比较小，约 700MB 。官方[下载地址](https://archlinux.org/download/)，通常比较慢，建议使用国内镜像下载地址：[清华镜像](https://mirrors.tuna.tsinghua.edu.cn/archlinux/iso/2021.01.01/)，[中科大镜像](https://mirrors.ustc.edu.cn/archlinux/iso/2021.01.01/)。

使用 [UtraIso](https://cn.ultraiso.net/) 工具将下载下来的 ios 文件写入 U 盘中。具体破解方式和制作启动盘的方式百度有很多。

最后在开机时，按住 F12 出现如下页面，选择从 U 盘启动。

<img src="/assets/image/103/015.jpg"/>

**不同主板之间略有差异，F2 和 F12 支持多数主板，如无效，则需要确认好主板厂商，了解到具体的设置方式。**


安装过程中，需要一根网线直连路由器，比在安装过程中使用拨号连接和 wifi 连接方便。

### 虚拟机

推荐使用 VirtualBox 虚拟机，[下载地址](https://www.virtualbox.org/wiki/Downloads)。

<img src="/assets/image/103/001.png"/>

新建虚拟电脑。

<img src="/assets/image/103/002.png"/>

设置系统类型。

<img src="/assets/image/103/003.png"/>

设置内存大小，根据实际内存大小分配。最少1G，建议2G。如果内存够大，请任性些。**1GB=1024MB**。

<img src="/assets/image/103/004.png"/>

创建虚拟硬盘。

<img src="/assets/image/103/005.png"/>

选择虚拟硬盘文件类型。

<img src="/assets/image/103/006.png"/>

设置使用动态分配的方式。即，设置虚拟硬盘100G，最后根据实际的系统占用空间，占用物理硬盘空间。

<img src="/assets/image/103/007.png"/>

确认虚拟硬盘文件位置和大小后，创建虚拟电脑。再次打开设置。

<img src="/assets/image/103/008.png"/>

设置系统启动顺序。硬盘第一，光驱第二。
设置是否启用 EFI 。同主板的 BIOS 和 UEFI 区别。

<img src="/assets/image/103/009.png"/>

如果主机是多核多线程 CPU ，可以适当添加 CPU 数量。

<img src="/assets/image/103/010.png"/>

设置显存大小，建议模式。

<img src="/assets/image/103/011.png"/>

对虚拟光驱，添加下载下来的安装镜像文件。

<img src="/assets/image/103/013.png"/>

网络模式中，选择 NAT 模式。这样，虚拟电脑可以使用真机网络。

<img src="/assets/image/103/012.png"/>

配置完成后，启动虚拟电脑。

## 安装系统

**为方便截图，后续操作都在虚拟机中执行**。

启动后，可以见到下面两图中的一个。第一个是 BIOS 模式启动，第二个是 UEFI 模式启动。

<img src="/assets/image/103/016.png"/>


<img src="/assets/image/103/017.png"/>

启动后，在图示状态下，判断联网情况。真机安装模式下，需要将网线连接路由器，虚拟机安装模式下，需要使用 NAT 联网方式（见虚拟机的配置）。

<img src="/assets/image/103/018.png"/>

```shell
ping www.baidu.com 
# 若 ping 测试发现联网失败，启用 dhcp 服务
systemctl enable dhcpcd # 启用
systemctl start dhcpcd  # 启动
```

### 硬盘分区

真机安装时，硬盘通常已有分区。如无重要数据，可以直接格式化全盘。如，保留硬盘中数据，或安装双系统，请确保至少有一个空的磁盘分区。

Linux 中磁盘概念与 Windows 不一样。第一块硬盘记 sda ，多块硬盘依次记 sda sdb sdc ... 。第一块硬盘的第一个分区记 sda1 ，多个分区依次记 sda1 sda2 sda3 ...。

虚拟机安装时，之前创建的是一块空硬盘，因此还需要设置分区表。如果在真机上安装时，允许全盘格式化硬盘，也可以重新设置分区表。

分区表有两种，MBR 和 GPT 。对应不同的主板模式。建议 BIOS + MBR ，UEFI + GPT 。换种组合，可能导致，无法正确进入系统，尤其是双系统安装的场景。

```shell
# 以下是修改硬盘分区时涉及到的命令，不一定需要全部执行。
fdisk -l # 查看硬盘及分区情况
parted /dev/sda # 修改硬盘分区表，只有新硬盘需执行
    mktable     # 设置分区表
        gpt     # GPT 分区表
        msdos   # MBR 分区表
    quit        # 退出 parted
cfdisk /dev/sda # 对硬盘进行分区。可以只操作硬盘中的一个分区。
```

cfdisk 命令弹出可交互式命令终端。真机安装时，希望只在其中一个硬盘分区中安装 Arch ，直接通过方向键选中待安装的分区，如，sda4 ，选择 Delete 删除分区信息。 New 新建分区，输入待分区大小。选择 Type 设置分区类型，主要有三个 ：EFI System，Linux swap Linux filesystem 。选择 Write 写入分区信息。选择 Quit ，退出分区程序。分区示例，如下。

<img src="/assets/image/103/019.png"/>

### 分区建议

#### BIOS+MBR

1. 交换空间，4G。挂载点，（可选）。
2. 根分区，40G，挂载点 / 。
3. 用户分区，剩余可用空间，挂载点 /home （可选）。

#### UEFI+GPT

1. EFI 系统分区，300M，挂载点 /boot/efi。
1. 交换空间，4G。挂载点，（可选）。
2. 根分区，40G，挂载点 / 。
3. 用户分区，剩余可用空间，挂载点 /home （可选）。

> * 真机安装时，如果内存够大，如8G，则无须使用交换空间。
>  * 用户分区非必须。若重装系统时，根分区需要格式化，用户分区则不需要。相当于 windows下 C 盘和 D 盘的区别。

### 格式化分区

```shell
mkfs.ext4 /dev/sda3 # 格式化根分区，Linux filesystem类型
mkfs.ext4 /dev/sda4 # 格式化用户分区
mkfs.vfat /dev/sda1 # 格式化EFI系统分区，EFI System类型
mkswap /dev/sda2    # 格式化交换空间，Linux swap 类型
```

### 挂载分区

```shell
mount /dev/sda3 /mnt         # 挂载根分区到 /mnt 目录
mkdir home                   # 建立用户分区目录
mount /dev/sda4 /mnt/home    # 挂载用户分区到 /mnt/home 目录
mkdir /mnt/boot
mkdir /mnt/boot/efi          # 建议efi分区目录
mount /dev/sda1 /mnt/boot/efi # 挂载 EFI系统分区到 /mnt/boot/efi
swapon /dev/sda2             # 挂载交换空间
```

以上命令根据实际分区情况执行。

### 修改安装源

安装过程，需要下载大量的系统文件，配置国内的安装源，有利于加快安装速度。

```shell
vim /etc/pacman.d/mirrorlist # 编辑安装源清单文件
# 以下是对 vim 的一些操作方式
    /China # 搜索 China 字符串
        回车 # 执行搜索
        n   # 搜索下一个
    2dd    #     看Server，找到 ustc 的地址，剪切两行
    gg     # 回到第一行
    p      # 移动光标到适当位置，粘贴
    esc    # 退出编辑状态
    !wq    # 保存并退出 vim 

# 正确修改安装源之后，更新源
pacman -Syy 
```

<img src="/assets/image/103/020.png"/>

### 安装系统文件

```shell
# 下载 arch 基础组件和 linux 内核，后面过程，全部回车
pacstrap -i /mnt base linux 
```

<img src="/assets/image/103/021.png"/>


```shell
# 生成 fstab 文件，用于启动时挂载硬盘
genfstab -U /mnt >> /mnt/etc/fstab
cat /mnt/etc/fstab # 查看刚刚生成的文件
```

<img src="/assets/image/103/022.png"/>

### 配置系统

```shell
arch-chroot /mnt         # 进入安装的系统
passwd root              # 设置 root 账户密码
pacman -S dhcpcd         # 下载 dhcp 服务
systemctl enable dhcpcd  # 启用 dhcp 服务
systemctl start dhcpcd   # 启动 dhcp 服务
```

```shell
pacamn -S grub               # 安装 grub 引导程序
pacman -S efibootmgr         # 安装 efi 启动程序，可选
# 双系统需要安装读 ntfs 分区和检测windows系统程序
pacman -S os-prober ntfs-3g  

# 安装 BIOS+MBR 的引导程序
grub-install --target=i386-pc /dev/sda
# 安装 UEFI+GPT 的引导程序
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=Arch
# 生成引导文件
grub-mkconfig -o /boot/grub/grub.cfg

```

<img src="/assets/image/103/023.png"/>

```shell
exit # 退出系统
reboot # 重启虚拟机或电脑
```

重新启动后，输入密码如图示：

<img src="/assets/image/103/024.png"/>

### 设置时区

```shell
# 设置时区
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# 设置在线同步时间
timedatectl set-ntp true
# 查看时间信息 UTC，格林威治时间，CST 北京时间。差8个时区
tiemdatectl status

```

<img src="/assets/image/103/025.png"/>

### 添加用户

```shell
useradd -m -G wheel -s /bin/bash zkf #用户名，做开发 首字母
passwd zkf # 设置 zkf 用户密码 ，需要输入两次 
# 提权操作，默认的 zkf 账户，无法获取 root 权限
pacman -S vi sudo # 安装必备程序
visudo            # 编辑提权文件
# 同 vim 的操作，删除 %wheel ALL=(ALL) ALL 或其下面一行之前的井号。下面使用 sudo 命令不需要密码
    /wheel        
    :wq 
```

### 本地化

```shell
pacman -S vim # 安装 vim，之前可以用 vim 是安装包附带的，新系统需要重新安装
vim /etc/locale.gen # 修改本地化配置文件
# 打开 en_US.UTF-8 ,zh_CN.UTF-8前的井号
locale-gen # 生成配置
```


至此，Arch 系统即安装配置完成。后续还会有图形化系统安装和桌面美化。

下次开机时，即可登录刚创建的 zkf 账户。或者输入 exit 退出 root ，直接登录 zkf 也可以。

最后两个命令

```shell
poweroff # 关机 
restart  # 重启
```

