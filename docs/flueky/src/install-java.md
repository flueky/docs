---
title:  安装Java环境-Windows
date:   2018-08-01 15:47:04 +0800
categories: 
- 开发工具
- Java
tag:
---


## 1 下载jdk
[jdk 8 下载链接](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

[jdk 10 下载链接](http://www.oracle.com/technetwork/java/javase/downloads/jdk10-downloads-4416644.html)

## 2 安装jdk

双击下载下来的exe文件执行安装。安装过程截图如下：

<img src="/assets/image/100/6.png" width="400"/>
<br/>
<img src="/assets/image/100/1.png" width="400"/>
<br/>
<img src="/assets/image/100/2.png" width="400"/>
<br/>
<img src="/assets/image/100/7.png" width="400"/>
<br/>
<img src="/assets/image/100/3.png" width="500"/>
<br/>
<img src="/assets/image/100/4.png" width="500"/>
<br/>
<img src="/assets/image/100/5.png" width="400"/>


安装后，使用快捷键 win+R 输入cmd 运行终端程序，在终端中 输入 `java -version` 校验安装结果。

<img src="/assets/image/100/8.png" width="400"/>

如图所示，安装成功。

## 3 配置环境变量

1. 打开系统属性

<img src="/assets/image/100/9.png" width="800"/>

2. 点击高级系统设置

<img src="/assets/image/100/10.png" width="400"/>

3. 点击环境变量

<img src="/assets/image/100/11.png" width="500"/>

4. 在系统变量中新建变量

新建`JAVA_HOME`变量，变量值是`jdk`安装目录。

<img src="/assets/image/100/15.png" width="350"/>

5. 在系统变量中选择Path变量

<img src="/assets/image/100/12.png" width="700"/>

6. 编辑Path变量，在变量值的末尾添加下面的内容。

> C:\Program Files\Java\jdk1.8.0_181\bin;C:\Program Files\Java\jdk1.8.0_181\jre\bin

或者使用

> %JAVA_HOME%\bin;%JAVA_HOME%\jre\bin

7. 保存退出后，再在终端中依次输入 `javac`、`javah`校验环境变量是否修改成功。

<img src="/assets/image/100/13.png" width="700"/>

<img src="/assets/image/100/14.png" width="700"/>

## jdk 11

jdk 11 默认没有 `jre` 目录，需要手动生成。在 jdk 目录下执行下面的命令。

> bin\jlink.exe --module-path jmods --add-modules java.desktop --output jre

jdk 8 之后，不再支持 `javah` 命令生成头文件，使用 `javac -h` 替换。
