---
title:  "使用PlantUML绘制类图"
date:   2018-12-05 09:03:37 +0800
categories: 
 - 开发工具
tag:
 - UML
 - PlantUML
---

本文基于sublime的PlantUML插件绘制类图。如需了解插件安装，请点击[Sublime安装PlantUML插件](sublime-plantuml)

<!-- more -->

## 1 类的UML表示

使用UML表示一个类，主要由三部分组成。`类名`、`属性`、`方法`。其中`属性`和`方法`的访问修饰符用 `-` 、`#` 、`+` 表示 `private`、`protected`、`public`。

<img src="/assets/image/005/1.png" width="200">

如图所示，表示`A`类有一个`private`属性，`protected` 构造函数和`public`方法。

```UML
@startuml

class A{
	- String field
	+ A()
	# void method()
}
note right: 这是测试类 A

@enduml
```

## 2 类的关系

在面向对象语言中，类的关系有很多种，可以概括为三类：`泛化`、`依赖`、`关联`。

### 2.1 泛化

泛化指父类跟子类的关系,表示`is-a`的关系。如父类是抽象类或普通类，则这种关系叫继承。如，父类是接口，则这种关系叫实现。UML中，继承和实现由不同的标记表示。

#### 2.1.1 继承

PlantUML用 `--|>` 表示继承关系。实线和三角形的抽象表示，指向谁，即继承谁。

```UML
@startuml

    class A
    abstract B

    ' A 继承 B
    A --|> B

@enduml
```

<img src="/assets/image/005/2.png" width="60">

#### 2.1.2 实现

PlantUML用 `..|>` 表示实现关系。虚和三角形的抽象表示，指向谁，即实现谁。

```UML
@startuml

    class A
    interface C

    ' A 实现 C
    A ..|> C

@enduml
```
<img src="/assets/image/005/3.png" width="60">

### 2.2 依赖

类之间，最弱的关联方式。常用于在A类的方法中使用B类的对象作为参数、局部变量或者对B类静态方法的调用。

PlantUML用 `..>` 表示依赖关系。虚线和箭头的抽象表示，指向谁，即依赖谁。

```UML
@startuml

    class A
    class B

    ' A 依赖 B
    A ..> B

@enduml
```

<img src="/assets/image/005/4.png" width="60">

### 2.3 关联

关联关系，即对象之间的引用关系。常使用类的属性表达。

#### 2.3.1 单向关联

B类作为A类的属性，表示A类与B类有关联。
PlantUML用 `-->` 表示单向关联。实线线和箭头的抽象表示，指向谁，即关联谁。

```UML
@startuml

	class A{
		- B b
	}
	class B

	' A 关联 B
	A --> B

@enduml
```

<img src="/assets/image/005/5.png" width="60">

#### 2.3.2 双向关联

B类作为A类的属性同时，A类也是B类的属性，表示双向关联。
PlantUML用 `--` 表示双向关联。或者用`<-->`。

```UML
@startuml

	class A{
		- B b
	}
	class B{
		- A a
	}

	' A 关联 B
	A -- B

@enduml
```

<img src="/assets/image/005/6.png" width="60">

#### 2.3.3 自关联

A类关联A类自身。常见于单例模式。

<img src="/assets/image/005/7.png" width="100">

```UML
@startuml

	class A{
		- A a
	}
	

	' A 关联 A
	A --> A

@enduml
```

#### 2.3.4 聚合

在关联关系的基础上，延伸出聚合关系，强的关联关系，表示`has-a`关系。整体与部分的关系，部分不依赖于整体，可独立存在。常用于成员变量。

如；汽车和轮胎的关系，轮胎可作为独立的商品出售。

PlantUML用 `o--` 表示聚合关系。实线和空心菱形的抽象表示，指向谁，表示谁是整体。

```UML
@startuml

	class Car{
		- List<Wheel> wheels
	}
	class Wheel

	' Car 关联 Wheel
	Car "1" o-- "4" Wheel

@enduml
```
<img src="/assets/image/005/8.png" width="180">

图中数字`1`和`4`也表示一对多关联。`N`对`N`同理。

#### 2.3.5 组合

在关联关系的基础上，延伸出另外一种关联关系，组合关系，表示`contains-a`关系。整体与部分的关系，部分依赖于整体，不可独立存在。常用于成员变量。

如：身体和动作的关系。

PlantUML用 `*--` 表示聚合关系。实线和实心菱形的抽象表示，指向谁，表示谁是整体。

```UML
@startuml

	class Body{
		- List<Action> actions
	}
	class Action

	' Body 关联 Action
	Body "1" *-- "N" Action

@enduml
```

<img src="/assets/image/005/9.png" width="180">

## 3 PlantUML排版

相比较其他的UML软件或插件。PlantUML的优势在于，存储的是文本文件，可以方便的进行团队协作以及高度可定制化的依赖关系。但是，最大的缺点在于，排版是通过插件自动生成的，排版效果不尽人意。因此，PlantUML提供四个关键字 `up` `down` `left` `right`。指定类与类之间的相对关系。

### 3.1 default

```UML
@startuml

class A1
class B1

A1 --> B1

class A2
class B2
A2 <-- B2

@enduml
```

<img src="/assets/image/005/10.png" width="180">

箭头向左时，被指向对象在上；
箭头向右时，被指向对象在下。

### 3.2 up

```UML
@startuml

class A1
class B1

A1 -up-> B1

class A2
class B2
A2 <-up- B2

@enduml
```

<img src="/assets/image/005/11.png" width="180">

使用up时，被指向对象在上。

### 3.3 down

```UML
@startuml

class A1
class B1

A1 -down-> B1

class A2
class B2
A2 <-down- B2

@enduml
```

<img src="/assets/image/005/12.png" width="180">

使用down时，被指向对象在下。

### 3.4 left

```UML
@startuml

class A1
class B1

A1 -left-> B1

class A2
class B2
A2 <-left- B2

@enduml
```

使用left时，被指向对象在左。

<img src="/assets/image/005/13.png" width="350">

### 3.5 right

```UML
@startuml

class A1
class B1

A1 -right-> B1

class A2
class B2
A2 <-right- B2

@enduml
```

<img src="/assets/image/005/14.png" width="350">

使用right时，被指向对象在右。


## 4 总结

画类图，只是PlantUML的功能之一，还可以使用它画用例图、顺序图、活动图。更多用法，请关注后续博客或[访问官网](http://plantuml.com/)。
