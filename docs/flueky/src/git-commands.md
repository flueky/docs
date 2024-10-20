---
title: "Git常用命令"
date: 2018-11-30 09:08:04 +0800
categories: 
 - 开发工具
tag:
 - Git
---


## init

毫无疑问，这是学习`git`使用的第一个命令。在本地初始化`git`仓库。

```Shell
cd Demo
git init
```

表示切换到`Demo`目录并在该目录初始化`git`仓库。会生成`.git`文件夹。

<img src="/assets/image/002/1.png" width="450"/>

如图，是一个`Android`初始工程目录，创建`git`仓库后多出`.git`文件夹。

## status

查看仓库中文件状态。

```Shell
git status
```

<img src="/assets/image/002/2.png" width="450"/>

图中表示全部文件均未添加至仓库，无需要提交至仓库文件。

有些不需要提交至仓库的文件，可以添加到`.gitignore`文件中。

<img src="/assets/image/002/3.png" width="450"/>

`.gitignore`文件内容：

    .idea
    .gradle
    gradle
    gradlew
    gradlew.bat
    local.properties
    build
    *.iml


## add

添加文件至仓库。

```Shell
git add <file> # 添加一个文件至仓库
git add <file1> <file2>... # 添加多个文件至仓库
git add . # 添加全部文件至仓库
git add -f <file> # 强制将已忽略的文件添加至仓库
```

<img src="/assets/image/002/4.png" width="450"/>

可以每次只添加一个文件（夹），也可以每次添加多个文件（夹）。甚至可以使用`git add . `添加全部文件（夹）至仓库。

最新添加至仓库的文件（夹）会有`new file`标记。

在未commit之前，修改文件，也能看见修改标记。

<img src="/assets/image/002/5.png" width="450"/>

## commit

提交文件至仓库。

```Shell
git commit -m 描述 #提交已在仓中的文件，不包括修改的内容
git commit -am 描述 #提交已在仓库中的文件，包括修改的内容
```

创建三种场景：
1. 三个新文件。
2. 其中一个文件修改过。
3. 还有个文件夹未添加至版本库。

<img src="/assets/image/002/6.png" width="450"/>

执行commit命令之后，再次查看提交前后的状态发现，修改的文件和为添加至版本库的文件没有提交。准确说，修改文件中的修改内容未提交至版本库。


## log

提交记录

```Shell
git log # 查看提交记录
git log --pretty=oneline # 查看精简后的提交记录
```

<img src="/assets/image/002/7.png" width="450"/>

每条提交记录都对应一条40字节的id，该id在后面有很大用途。

## branch

分支管理

```Shell
git branch # 查看全部分支，当前分支会有标记
git branch name # 创建名称为name的分支
git checkout name # 将分支切换到name
git checkout -b name # 创建并切换到name分支
git branch -d name # 删除name分支
```

<img src="/assets/image/002/8.png" width="500"/>

图中依次显示了上述指令用法。需要注意，删除指定分支时，不可以删除被`checkout`的分支。

## tag

标签管理

```Shell
git tag # 查看全部标签
git tag name # 创建name标签
git tag name -m 描述 # 创建name标签，并指定描述
git tag name id # 在指定的提交id上创建标签,id 只需要写前几位
git tag -d name # 删除name标签

```

<img src="/assets/image/002/9.png" width="500"/>

演示了创建标签，在指定id上创建标签，查看标签，删除标签。

<img src="/assets/image/002/10.png" width="450"/>

查看标签信息。

<img src="/assets/image/002/11.png" width="600"/>

查看自定义描述的标签信息。

## remote

```Shell
# 将本地仓库关联到远程库
# 远程库名称 origin
# git@github.com:user/project.git表示远程仓库地址。
git remote add origin git@github.com:user/project.git
# 查看本地仓库关联的远程仓库
git remote -v 
# 删除远程仓库
git remote rm origin
```

如果需要同时关联多个远程仓库，如 GitHub 和 码云。

```Shell
# 远程仓库名 github 关联到 github 仓库
git remote add github git@github.com:user/project.git
# 远程仓库名 gitee 关联到 gitee 仓库
git remote add gitee git@gitee.com:user/project.git
```

## push

```Shell
git push origin master # 将 master 分支推送到远程库
git push --tags # 推送标签到远程服务
```

## pull

```Shell
// 拉取远程分支 branch1 到本地分支 branch2
git pull origin branch1:branch2
```


