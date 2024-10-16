---
title:  "Sublime安装PlantUML插件"
date:   2018-12-04 17:39:37 +0800
categories: 
    - 开发工具
tag:
    - Sublime
    - PlantUML
---

## 1 安装 graphviz

Graphviz的是AT&T Labs Research开发的图形绘制工具,他可以很方便的用来绘制结构化的图形网络,支持多种格式输出,生成图片的质量和速度都不错。（摘自[百度百科](https://baike.baidu.com/item/Graphviz/2314699)）

Mac 安装 `graphviz`只需一条命令。

    brew install graphviz

## 2 安装Sublime Text

笔者使用的文本编辑工具比较多。`VScode`、`Atom`、`Sublime`、`UltraEdit`。其实都没有掌握太高深的用法，只觉得哪个好用就用哪个。

下载地址见[官网](http://www.sublimetext.com/)。

## 3 安装PlantUml

这其实是一个支持安装`Sublime`的插件,支持`VScode`等其他文本编辑工具。

打开`Package Control`，输入`install`

<img src="/assets/image/004/1.png" width="300">

选中`Install Package`后，在新页面输入`plantuml`。

<img src="/assets/image/004/2.png" width="350">

点击`PlantUMLDiagrams`进行安装。

## 4 配置快捷键

安装后，配置好快捷键，按照图中步骤，配置默认快捷键。

<img src="/assets/image/004/3.png" width="450">

粘贴以下内容，将可以使用`command+m`快捷键显示UML图片。

    [ 
    {"keys": ["super+m"], "command": "display_diagrams"}
    ]


## 5 添加依赖jar

切记，最后一步，需要指定`plantuml.jar`，不然将生成不了最终的UML效果图片。

并提示:**<font color='red'>No diagrams overlap selections.Nothing to process。</font>**

<img src="/assets/image/004/5.png" width="450">

plantuml.jar[下载地址](https://download.csdn.net/download/flueky/10828200)。

将下载下来的jar文件复制到**Application Support/Sublime Text 3/Packages/PlantUmlDiagrams/diagram/**目录下

<img src="/assets/image/004/6.png" width="450">

## 6 设置语法高亮

在页面右下角，选择需要高亮的语法，推荐PlantUmlDiagrams->Diagram。

<img src="/assets/image/004/4.png" width="450">

## 7 验证

```Uml
@startuml

class A
note right: 这是测试类 A

@enduml
```

复制上面的内容，command+m生成下面的图片。

<img src="/assets/image/004/7.png" width="200">

*注：**针对中文乱码的情况，可以添加utf-8编码支持。**

<img src="/assets/image/004/8.png" width="300">

修改标记的文件最后一行`"charset": null` 为 `"charset": "UTF-8"`。
