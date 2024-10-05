---
title: Ubuntu 开箱配置
category: 
 - Linux
 - Note
tag:
 - Others
---

记录 Ubuntu 从零到一的开箱配置。

<!-- more -->

## 用户与组

```shell
sudo useradd -m -s /bin/bash zkf # 新增用户 zkf
sudo usermod -a -G sudo zkf # 将 zkf 添加到 sudo 组
# 上述两行命令可以合并成一行
sudo useradd -m -G wheel -s /bin/bash zkf 
sudo passwd zkf # 设置/修改 zkf 密码
```

## 编辑器

```shell
sudo update-alternatives --config editor
```

## 挂载硬盘

```shell
sudo mount /dev/sda1 /media/data # 将 sda1 分区挂载到 /media/data
```

## 设置快捷方式

```shell
ln -sf /media/data ~/workspace # 对 /media/data 设置链接
```

## Git

### 安装

```shell
sudo apt install git
```

### 配置

```shell
git config --global user.name "your name"
git config --global user.email "your email"
git config --global core.autocrlf input
```

## GPG

### 配置

```shell
gpg --full-gen-key # 选择 rsa，4096，失效日期，姓名和邮箱地址（注意和 git config 设置的一致）
gpg --list-secret-keys --keyid-format LONG "your email" # 列出 Key 信息。
# sec   rsa4096/F212D2CFEBF50880 2024-04-20 [SC] 中，是 F212D2CFEBF50880 key id
gpg --armor --export F212D2CFEBF50880 # 导出公钥，配置到 gitlab GPG Keys 页面。
git config --global user.signingkey F212D2CFEBF50880 # 告诉 git，使用此密钥签名
git config --global commit.gpgsign true # 设置默认使用 GPG key 签名
```

## Python

```shell
sudo apt install python3 # 安装 python
```

`python` 通过 `pip` 管理安装包的依赖关系。安装 `pip` 有两种方式。

### virtual env

```shell
sudo apt install python3-venv  # 安装 virtual env
python3 -m venv "virtual env name" # 创建虚拟环境
```

### get-pip

```shell
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
sudo python3 get-pip.py # 安装 pip
rm -rf get-pip.py
```