---
title: "设计模式之策略模式"
date: 2016-04-07 22:12:04 +0800
categories: 
 - Java
 - 设计模式
tag:
 - 策略模式
---

#  设计模式介绍

设计模式是什么？百度百科这么说的：设计模式（Design pattern）是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性。

# 引入问题

如果还不懂，那就先请看下面这一段看上去似乎没有问题的代码。

Animal类

```Java
/**
 * 动物类
 * @author flueky flueky@sina.com
 * @date 2016年4月7日 下午9:43:50
 */
public class Animal {

	private Type type;//动物种类
	
	public Animal(Type type) {
		super();
		this.type = type;
	}

	/**
	 * 动物移动方法
	 * @author flueky flueky@sina.com
	 * @date 2016年4月7日 下午9:49:44
	 */
	public void move() {
		if (type == Type.FISH) {
			System.out.println("鱼在水里游");
		} else if (type == Type.DOG) {
			System.out.println("狗在地上跑");
		} else if (type == Type.BIRD) {
			System.out.println("鸟在空中飞");
		}
	}

	/**
	 * 动物类型
	 * @author flueky flueky@sina.com
	 * @date 2016年4月7日 下午9:44:06
	 */
	enum Type {
		FISH, DOG, BIRD
	}

}
```

测试用的Main方法

```Java
	public static void main(String[] args) {

		Animal fish = new Animal(Type.FISH);
		fish.move();

		Animal dog = new Animal(Type.DOG);
		dog.move();

		Animal bird = new Animal(Type.BIRD);
		bird.move();

	}
```

以下是上述代码的输出。

	鱼在水里游
	狗在地上跑
	鸟在空中飞

现假设引入一个新的动物——乌龟。它只能在地上爬的份了。Animal类就得这样改

- **枚举类型Type中添加一个枚举TORTOISE**
- **move 方法中新增else if 判断 Type.TORTOISE**

如果你也同样觉得只是改两个地方，so easy！倘若这个类是别人封装在jar包中供你使用的类，现在需要扩展，要求能够描述乌龟的移动动作，那是否又是只有哭的份了？

# 解决方案

现将上述代码重构如下：

- **抽象出动作接口**

```Java
/**
 * 动作接口
 * @author flueky flueky@sina.com
 * @date 2016年4月7日 下午10:16:27
 */
public interface Action {

	/**
	 * 移动
	 * @author flueky flueky@sina.com
	 * @date 2016年4月7日 下午10:16:42
	 */
	public void move();
}
```

- **抽象出动物类的动作，在动物类的move方法中调用动作接口的move方法**

```Java
/**
 * 动物类
 * 
 * @author flueky flueky@sina.com
 * @date 2016年4月7日 下午9:43:50
 */
public class Animal {

	protected Action action;// 动物的动作

	/**
	 * 动物移动方法
	 * 
	 * @author flueky flueky@sina.com
	 * @date 2016年4月7日 下午9:49:44
	 */
	public void move() {
		action.move();
	}

}
```

- **实现动物类的子类，bird**

```Java
/**
 * bird类
 * 
 * @author flueky flueky@sina.com
 * @date 2016年4月7日 下午10:21:26
 */
public class Bird extends Animal {

	public Bird() {
		// 给bird 赋值跑的动作
		action = new Fly();
	}

}
```

- **实现bird类的移动动作，fly**

```Java
/**
 * 飞的动作
 * @author flueky flueky@sina.com
 * @date 2016年4月7日 下午10:19:41
 */
public class Fly implements Action{

	@Override
	public void move() {
		System.out.println("鸟在空中飞");
	}

}
```

```Java
	public static void main(String[] args) {

		Animal fish = new Fish();
		fish.move();

		Animal dog = new Dog();
		dog.move();

		Animal bird = new Fish();
		bird.move();

	}
```

>注意：此处指提供bird类和fly类源码，其余类可以参照这两个类的实现。

也许会觉得在定义这些接口和实现这些类的地方，代码过于繁琐。由刚刚的一个类变成现在的七个类。但是这种设计，却将工程的扩展性大大提高，新增一个乌龟类的爬行动作，只需要新增两个类，不需要在原有代码的基础上再做修改。**这就是设计模式的好处**

---
# 关于策略模式

## 介绍

策略模式是对动作的包装，是把动作执行者和动作本身分开，委派给不同的执行者管理。策略模式通常吧一个系列的动作包装到一系列的动作类里面，作为一个抽象动作类的子类。

<img src="/assets/image/208/1.jpg" width="300"/>

## 使用场景

1.  如果在一个系统中有许多类，它们之间的区别仅在于它们的行为，那么使用策略模式可以动态地让一个对象在许多行为中选择一种行为。
2.  一个系统需要动态地在几种算法中选择一种。那么这些算法可以包装到一个个的具体算法类里面，而这些具体算法都是一个抽象算法的子类。换言之，这些具体算法类均有统一的接口，由于多态性原则，客户端可以选择使用任何一个具体算法类，并只持有一个数据类型是抽象算法类的对象。
3.  一个系统的算法使用的数据不可以让客户端知道。策略模式可以避免让客户端涉及到不必要接触到的复杂的和只与算法有关的数据。
4.  如果一个对象有很多行为，如果使用不恰当的模式，这些行为就只好使用多重的条件选择语句来实现。此时，使用策略模式，把这些行为转移到对应的具体策略类里面，就可以避免使用难以维护的多重条件选择语句，并体现面向对象设计的概念。**上述代码举出的例子**