---
title:  配置 Proxmox VE
category: 
 - nas
 - pve
---

## 删除 LVM

LVM 在 linux 中具备如下作用。

- 动态调整存储空间：LVM允许在不需要重新分区物理磁盘的情况下动态调整逻辑卷的大小。
- 快照：LVM支持创建快照，这有助于进行备份和恢复操作。
- 条带化：LVM可以通过条带化技术提高I/O性能。
- 简化存储管理：LVM提供了一个统一的接口来管理物理存储设备上的逻辑卷。

如果磁盘空间有限，且不需要 LVM 具备的一些功能，可以删除。具体方式如下：

![](./assets/image/02/01.png)

右上角，点击更多按钮，出现销毁选项。点击即可删除。

![](./assets/image/02/02.png)

确认界面，输入磁盘 id。完成删除操作。还需要执行一些命令，将剩出来的空间全部给 `local` 。

```shell
# 将剩余空间，全部分配给 local
lvresize --extents +100%FREE --resizefs pve/root
# 重新执行 4k 对齐
resize2fs /dev/mapper/pve-root
```

最后如图所示，即完成全部操作。

![](./assets/image/02/03.png)