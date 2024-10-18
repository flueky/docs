---
title: C++面向对象（三）——封装和多态
date: 2016-04-30 21:34:44 +0800
categories: 
 - C/C++
tag:
---

# 封装

## 什么是封装

封装(encapsulation)又叫隐藏实现(Hiding the implementation)。就是只公开代码单元的对外接口，而隐藏其具体实现。

## 实现封装

在程序设计里，封装往往是通过访问控制实现的。C++，Java，Objective-C中都有 Public, Protected, Private 等访问控制符。通过用Public将信息暴露，Private，Protected将信息隐藏，来实现封装。

一个优秀的OOP程序员会尽量不对外公开代码，即最喜欢用Private关键字。因为在OOP中，对代码访问控制得越严格，日后你对代码修改的自由就越大。

## 封装的好处

 1. 封装使得对代码的修改更加安全和容易。将代码分成了一个个相对独立的单元。 
 2. 封装使整个软件开发复杂度大大降低。 
 3. 封装还避免了命名冲突的问题。

```C++
#include <iostream>
#include <ctime>

using namespace std;

//定义动物类
class Animal{
	protected:
		string species;//物种
	
	public:
		string getSpecies();
};

string Animal::getSpecies(){
	return species;
}

//哺乳动物继承动物类
class BreastfeedAnimal:public Animal{
	private:
		time_t birthday;//生日
	protected:
		string type;
	public:
		BreastfeedAnimal(string spec);
		~BreastfeedAnimal();
		int getAge();
};

BreastfeedAnimal::BreastfeedAnimal(string spec){
	species = spec;
	birthday = time(0);//生成构造函数时，生成出生日期
}

BreastfeedAnimal::~BreastfeedAnimal(){
	
}

int BreastfeedAnimal::getAge(){
	return time(0)-birthday;
}
//定义陆生生物
class LandAnimal{
	
};

//定义羊，继承自哺乳动物和陆生生物
class Sheep :public BreastfeedAnimal,public LandAnimal{
	
	public:
		Sheep();
		~Sheep();
};

//如果父类显示定义构造方法，子类构造方法必须调用父类构造方法
Sheep::Sheep():BreastfeedAnimal("sheep"){
	
}
Sheep::~Sheep(){
	
}


int main(int argc, char *argv[]) {
//	Animal* sheep = new BreastfeedAnimal("sheep");
	Sheep* sheep = new Sheep();
	
	cout<<"the animal's species is "<<sheep->getSpecies()<<endl;
	//生成一个耗时操作，阻塞程序运行
	int i=999999999;
	while(i-->0);
	cout<<"the animal's age is "<<sheep->getAge()<<endl;
}
```

> 定义哺乳动物类`BreastfeedAnimal`,它有物种名称和出生日期两个属性。由于这两个属性在生成对象之后是不可以改变的，所以需要用private隐藏起来。与此同时，获取该对象的年龄，只需要用当前时间减去生成这个对象的时间。换句话来说，获取对象的年龄也只是个只读权限，同时也是不可修改的。这就是封装的简单用途。

## 设计策略

通常情况下，我们都会设置类成员状态为私有（private），除非我们真的需要将其暴露，这样才能保证良好的封装性。

这通常应用于数据成员，但它同样适用于所有成员，包括虚函数。

# 多态

```C++
#include <iostream>
#include <ctime>

using namespace std;

//定义动物类
class Animal{
	protected:
		string species;//物种
	
	public:
		string getSpecies();
};

string Animal::getSpecies(){
	cout<<"animal species"<<endl;
	return species;
}

//哺乳动物继承动物类
class BreastfeedAnimal:public Animal{
	private:
		time_t birthday;//生日
	protected:
		string type;
	public:
		BreastfeedAnimal(string spec);
		~BreastfeedAnimal();
		int getAge();
};

BreastfeedAnimal::BreastfeedAnimal(string spec){
	species = spec;
	birthday = time(0);//生成构造函数时，生成出生日期
}

BreastfeedAnimal::~BreastfeedAnimal(){
	
}

int BreastfeedAnimal::getAge(){
	return time(0)-birthday;
}
//定义陆生生物
class LandAnimal{
	
};

//定义羊，继承自哺乳动物和陆生生物
class Sheep :public BreastfeedAnimal,public LandAnimal{
	
	public:
		Sheep();
		~Sheep();
		string getSpecies();
};

//如果父类显示定义构造方法，子类构造方法必须调用父类构造方法
Sheep::Sheep():BreastfeedAnimal("sheep"){
	
}
Sheep::~Sheep(){
	
}

string Sheep::getSpecies(){
	cout<<"sheep species"<<endl;
	return species;
}

//定义牛
class Ox:public BreastfeedAnimal,public LandAnimal{
	
	public:
		Ox();
		~Ox();		
		string getSpecies();
};

Ox::Ox():BreastfeedAnimal("ox"){
	
}

Ox::~Ox(){
	
}

string Ox::getSpecies(){
	cout<<"ox species"<<endl;
	return species;
}

int main(int argc, char *argv[]) {
	
	Animal sheep;
	Animal ox;
	
	sheep.getSpecies();
	ox.getSpecies();
}
```

运行结果

	animal species
	animal species

> 并没有达到期望中预想的值。有人说将sheep 和ox**强制类型转换**（以下简称：强转）成Sheep 和Ox 对象，事实上编译器会报错。**怎样做，编译器才能够正确强转**？而怎样做，才能正确调用sheep和ox的`getSpecies()`函数？

修改main函数

```C++
int main(int argc, char *argv[]) {
	
	Animal* sheep = new Sheep();
	Animal ox;
	
	sheep->getSpecies();
	ox.getSpecies();
	
//	((Ox)ox).getSpecies();//这种强转会报错
	((Sheep *)sheep)->getSpecies();//强转通过
	
	delete sheep;
//	delete ((Sheep *)sheep)
}
```

	Animal 构造函数
	Sheep 构造函数
	Animal 构造函数
	animal species
	animal species
	sheep species
	Animal 析构函数
	Animal 析构函数

> 程序中分别用两种方式声明sheep和ox对象。分析前三行，sheep是Sheep类的对象，因此会先调用基类（Animal类）的构造函数，再调用Sheep类的构造函数。ox是Animal类的对象，所以只调用Animal类的构造函数。分析第六行，正确强转之后就会调用Sheep类的`getSpecies()`函数。分析最后两行，ox是编译器释放资源时调用的，此处只调用Animal的析构函数。sheep 是delete之后，调用析构函数。预期情况是先调用Sheep类的析构函数再调用Animal类的析构函数。然而，此处sheep 是Animal类的实例，所以只调用Animal类的析构函数。修改main函数如下，自行分析输出。

```C++
int main(int argc, char *argv[]) {
	
	Sheep* sheep = new Sheep();
	Ox ox;
	
	sheep->getSpecies();
	ox.getSpecies();
	
	delete sheep;
}
```

	Animal 构造函数
	Sheep 构造函数
	Animal 构造函数
	Ox 构造函数
	sheep species
	ox species
	Sheep 析构函数
	Animal 析构函数
	Ox 析构函数
	Animal 析构函数

再回到上一个问题：**而怎样做，才能正确调用sheep和ox的`getSpecies()`函数**？这里引入两个概念：**静态多态**和**虚函数**

**静态多态**或静态链接是指函数调用在程序执行前就准备好了。有时候这也被称为**早绑定**，因为 `getSpecies()`函数在程序编译期间就已经设置好了。出问题的原因是被设置为基类的版本。

## 虚函数

**虚函数**是在基类中使用关键字 virtual 声明的函数。在派生类中重新定义基类中定义的虚函数时，会告诉编译器不要静态链接到该函数。

我们想要的是在程序中任意点可以根据所调用的对象类型来选择调用的函数，这种操作被称为**动态链接**或后期绑定。

```C++
//定义动物类
class Animal{
	protected:
		string species;//物种
	
	public:
		Animal();
		~Animal();
		virtual string getSpecies();//定义为虚函数
};

int main(int argc, char *argv[]) {
	
	Animal* sheep = new Sheep();
	Animal ox;
	
	sheep->getSpecies();
	ox.getSpecies();
	
	delete sheep;
}	
```
	Animal 构造函数
	Sheep 构造函数
	Animal 构造函数
	sheep species
	animal species
	Animal 析构函数
	Animal 析构函数

> 分析输出，sheep已经正确调用了Sheep类中的 `getSpecies()`，而ox仍然调用Animal中的 `getSpecies()`函数。之前已经提到，ox是Animal的对象，自然只能调用Animal的函数。

## 纯虚函数

纯虚函数是一种特殊的虚函数，在许多情况下，在基类中不能对虚函数给出有意义的实现，而把它声明为纯虚函数，它的实现留给该基类的派生类去做。这就是纯虚函数的作用。

纯虚函数可以让类先具有一个操作名称，而没有操作内容，让派生类在继承时再去具体地给出定义。凡是含有纯虚函数的类叫做抽象类。这种类不能声明对象，只是作为基类为派生类服务。除非在派生类中完全实现基类中所有的的纯虚函数，否则，派生类也变成了抽象类，不能实例化对象。

一般而言**纯虚函数**的函数体是缺省的，但是也可以给出纯虚函数的函数体（此时纯虚函数变为虚函数），这一点经常被人们忽视，调用纯虚函数的方法为baseclass::virtual function。

```C++
//定义动物类
class Animal{
	protected:
		string species;//物种
	
	public:
		Animal();
		~Animal();
		virtual string getSpecies() = 0;//纯虚函数
};
```
> = 0告诉编译器，函数没有主体，所以`getSpecies()`就是纯虚函数，Animal类因此也成为了抽象类。学过Java的也许会联想到抽象类和接口中才有的抽象函数。

# 抽象类

设计抽象类的目的，是为了给其他类提供一个可以继承的适当的基类。抽象类不能被用于实例化对象，它只能作为接口使用。如果试图实例化一个抽象类的对象，会导致编译错误。

因此，如果一个抽象类的子类需要被实例化，则必须实现每个虚函数，这也意味着 C++ 支持使用抽象类声明接口。如果没有在派生类中重载纯虚函数，就尝试实例化该类的对象，会导致编译错误。

子类没有实现抽象父类中的函数，则子类也是抽象类，该子类不能实例化对象。可用于实例化对象的类被称为具体类。
