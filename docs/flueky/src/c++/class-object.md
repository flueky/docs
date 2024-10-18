---
title: C++面向对象（一）——类与对象
date: 2016-04-28 21:30:27 +0800
categories: 
 - C/C++
tag:
---

# 定义类

关键字class开头，后跟类的名称。类的主体被包在花括号中。类定义后必须跟着一个分号或列表。

```C++
class Line{
	private:
		double length;
	public:
		void setLength(double len);
		double getLength();
};
```
# 定义对象

声明类的对象，就像声明基本类型的变量一样。**注意区分普通变量和引用变量的区别。**

```C++
Line line1 ;//声明普通变量

Line* line2 = new Line;//声明指针变量
delete line2;
```

> 普通变量的内存占用由编译器去管理 。指针变量的内存占用由开发人员手动管理

# 访问数据成员

普通变量和指针变量访问数据成员的方式不一样，都只能访问公共成员变量和函数——用public 声明。

```C++
Line line1 ;
Line* line2 = new Line;
	
line1.setLength(10.0);
line2->setLength(11.1);
	
cout<<"line1 "<<line1.getLength()<<endl;
cout<<"line2 "<<line2->getLength()<<endl;
	
delete line2;
```

> 普通变量的公共成员用运算符（.）访问。指针变量的公共成员用运算符（->）访问。

# 类成员函数

类的成员函数是指那些把定义和原型写在类定义内部的函数，就像类定义中的其他变量一样。类成员函数是类的一个成员，它可以操作类的任意对象，可以访问对象中的所有成员。

> 成员函数可以定义在类定义内部，或者单独使用范围解析运算符（::）来定义。在类定义中定义的成员函数把函数声明为**内联**的，即便没有使用 inline 标识符。

```C++
class Line{
	private:
		double length;
	public:
		void setLength(double len);
		double getLength();
		void print(){//定义在类内部，也就是内联函数
			cout<<"line's length is "<<length<<endl;
			cout<<"called by print"<<endl;
		}
};

/**
 *类的外部使用范围解析运算符 :: 定义该函数
 */
void Line::setLength(double len){
	length = len;
}

double Line::getLength(){
	return length;
}

```

# 内联函数

内联函数从源代码层看，有函数的结构，而在编译后，却不具备函数的性质。内联函数不是在调用时发生控制转移，而是在编译时将函数体嵌入在每一个调用处。编译时，类似宏替换，使用函数体替换调用处的函数名。一般在代码中用inline修饰，但是能否形成内联函数，需要看编译器对该函数定义的具体处理。

```C++
//用关键字inline定义内联函数
inline void printLine(Line line){
	cout<<"line's length is "<<line.getLength()<<endl;
	cout<<"called by printLine"<<endl;
}
```
# 构造函数与析构函数

**构造函数**是一种特殊的成员函数，会在每次创建类的新对象时执行。**析构函数**函数则在每次删除所创建的对象时执行。

|特征|构造函数|析构函数|
|:--:|:--|:--|
|名称|类名|~类名|
|返回类型|无|无|
|参数|可以有参数|不可以有参数|
|用途|为某些成员变量设置初始值|在跳出程序前释放资源|
|其他|能够重载|不能够重载|

关于函数重载将在后后续博文中介绍

```C++
class Line{
	private:
		double length;
	public:
		void setLength(double len);
		double getLength();
		void print(){
			cout<<"line's length is "<<length<<endl;
			cout<<"called by print"<<endl;
		}
		Line();//没有参数的构造函数
		Line(double len);//带有参数的构造函数
		~Line();//析构函数
};

Line::Line(){
	length=0;
	cout<<"object is created "<<length<<endl;

}

Line::Line(double len){
	length = len;
	cout<<"object is created "<<length<<endl;
}

Line::~Line(){
	cout<<"object is deleted"<<endl;
}

int main(int argc, char *argv[]) {
	
	Line line1(12) ;//调用有参数的构造函数
	Line* line2 = new Line;//调用无参数的构造函数
	
	line1.setLength(10.0);
	line2->setLength(11.1);
	
	cout<<"line1 "<<line1.getLength()<<endl;
	cout<<"line2 "<<line2->getLength()<<endl;
	
	delete line2;//调用析构函数。程序结束时编译器自动释放line1 的资源，再次调用析构函数一次
}
```
运行结果

	object is created 12
	object is created 0
	line1 10
	line2 11.1
	object is deleted
	object is deleted

> 分析运行结果得知，定义两个变量，构造函数和析构函数各调用两次。其中，指针变量需要手动`delete`才能调用析构函数。**有兴趣的可以自行验证**。

# 拷贝构造函数

一种特殊的构造函数，它在创建对象时，是使用同一类中之前创建的对象来初始化新创建的对象。
拷贝构造函数通常用于：

 1. 通过使用另一个同类型的对象来初始化新创建的对象。
 2. 复制对象，把它作为参数传递给函数。
 3. 复制对象，并从函数返回这个对象

> 如果在类中没有定义拷贝构造函数，编译器会自行定义一个。**如果类带有指针变量，并有动态内存分配，则它必须有一个拷贝构造函数。**定义拷贝构造函数，参照如下形式：

```C++
classname (const classname &obj) {
	// 构造函数的主体
}
```

给Line类添加上拷贝构造函数

```C++
class Line{
	private:
		double length;
	public:
		void setLength(double len);
		double getLength();
		void print(){
			cout<<"line's length is "<<length<<endl;
			cout<<"called by print"<<endl;
		}
		Line();//没有参数的构造函数
		Line(double len);//带有参数的构造函数
		~Line();//析构函数
		Line(const Line &obj);//拷贝构造函数
};

Line::Line(const Line &obj){
	cout<<"copy Line"<<endl;
	length = obj.length;
}

int main(int argc, char *argv[]) {
	
	Line line1(12) ;//调用有参数的构造函数
	Line* line2 = new Line;//调用无参数的构造函数
	
	line1.setLength(10.0);
	line2->setLength(11.1);
	
	printLine(line1);
	
	cout<<"line1 "<<line1.getLength()<<endl;
	cout<<"line2 "<<line2->getLength()<<endl;
	
	delete line2;//调用析构函数。程序结束时编译器自动释放line1 的资源，再次调用析构函数一次
}
```

	object is created 12
	object is created 0
	copy Line
	line's length is 10
	called by printLine
	object is deleted
	line1 10
	line2 11.1
	object is deleted
	object is deleted
	
> 眼尖的伙伴也许发现了这里调用了三次析构函数。分析第三行到第6行的输出，调用函数`printLine`首先会调用拷贝构造函数给形参复初始化，再执行`printLine`的函数体，最后释放形参暂用的资源。

# 友元函数

- 友元可以是一个函数，该函数被称为友元函数。友元也可以是一个类，该类被成为友元类。在这种情况下，整个类及其所有成员都是友元。
- 友元函数是定义在类的外部却可以访问类的内部成员（private 和protected）。友元函数的原型在类的内部定义，但是不是类的成员函数。通常用关键字 friend 修饰声明的函数为一个类的友元。

```C++
class Line{
	private:
		double length;
	public:
		void setLength(double len);
		double getLength();
		void print(){
			cout<<"line's length is "<<length<<endl;
			cout<<"called by print"<<endl;
		}
		Line();//没有参数的构造函数
		Line(double len);//带有参数的构造函数
		~Line();//析构函数
		Line(const Line &obj);//拷贝构造函数
		
		friend void print(Line line);//定义为line类的友元函数
};

inline void printLine(Line line){
	cout<<"line's length is "<<line.getLength()<<endl;
	cout<<"called by printLine"<<endl;
}

//printf不是任何类的成员函数，因此不需要修饰符::
void printf(Line line){
	//友元函数可以直接访问该类的任何成员
	cout<<"line's length is "<<line.length<<endl;
	cout<<"called by printLine"<<endl;
}
```
> 对比友元函数、内联函数、成员函数的定义。成员函数和友元函数可以访问类的内部成员。但是友元函数必须基于类的对象访问类的内部成员。友元函数和内联函数不需要范围解析运算符，因为他们不属于类的成员函数。

# this指针

每一个对象都能通过 this 指针来访问自己的地址。this 指针是所有成员函数的隐含参数。因此，在成员函数内部，它可以用来指向调用对象。

**友元函数没有 this 指针，因为友元不是类的成员。只有成员函数才有 this 指针。**

```C++
Line Line::changeLine(double length){
	this->length = length;//第一个length是类的成员变量，第二个length是形参
	cout<<"line's length is "<<this->length<<endl;
	cout<<"called by changeLine"<<endl;
	return *this;//返回自己的地址
}

int main(int argc, char *argv[]) {
	
	Line line1(12) ;//调用有参数的构造函数
	Line* line2 = new Line;//调用无参数的构造函数
	
	line1.setLength(10.0);
	line2->setLength(11.1);

	printLine(line1);
	
	cout<<"line1 "<<line1.getLength()<<endl;
	cout<<"line2 "<<line2->getLength()<<endl;
	
	Line line3 = line2->changeLine(23);
	cout<<"line3 "<<line3.getLength()<<endl;
		
	delete line2;//调用析构函数。程序结束时编译器自动释放line1,line3的资源，再次调用析构函数两次
}
```
	object is created 12
	object is created 0
	copy Line
	line's length is 10
	called by printLine
	object is deleted
	line1 10
	line2 11.1
	line's length is 23
	called by changeLine
	copy Line
	line3 23
	object is deleted
	object is deleted
	object is deleted

> 分析第9~13行的输出，`return *this;`会再次生成一个line对象。因此后续会依次释放line1、line2、line3 的资源。

# 静态成员
在类的定义中，用static 关键字把类的成员定义为静态的。无论创建多少个对象，静态成员都只有一个副本。访问静态成员的方式：classname :: staticmember。静态成员可以是成员变量也可以是成员函数。

```C++
//完整版Line类

#include <iostream>

using namespace std;

class Line{
	private:
		double length;
		static int objcount;//声明静态成员变量
	public:
		void setLength(double len);
		double getLength();
		void print(){
			cout<<"line's length is "<<length<<endl;
			cout<<"called by print"<<endl;
		}
		Line();//没有参数的构造函数
		Line(double len);//带有参数的构造函数
		~Line();//析构函数
		Line(const Line &obj);//拷贝构造函数
		
		friend void print(Line line);//定义为line类的友元函数
		
		Line changeLine(double length);
		
		static int getCount();
};

int Line::objcount = 0;//定义并初始化静态成员变量

Line::Line(){
	length=0;
	cout<<"object is created "<<length<<endl;
	objcount++;
	cout<<objcount<<" objects left"<<endl;
}
Line::Line(double len){
	length = len;
	cout<<"object is created "<<length<<endl;
	objcount++;
	cout<<objcount<<" objects left"<<endl;
}

Line::~Line(){
	cout<<"object is deleted"<<endl;
	objcount--;
	cout<<objcount<<" objects left"<<endl;
}

int Line::getCount(){
	return objcount;
}

Line::Line(const Line &obj){
	cout<<"copy Line"<<endl;
	length = obj.length;
	objcount++;
	cout<<objcount<<" objects left"<<endl;
}

void Line::setLength(double len){
	length = len;
}

double Line::getLength(){
	return length;
}

inline void printLine(Line line){
	cout<<"line's length is "<<line.getLength()<<endl;
	cout<<"called by printLine"<<endl;
}

//printf不是任何类的成员函数，因此不需要修饰符::
void print(Line line){
	//友元函数可以直接访问该类的任何成员
	cout<<"line's length is "<<line.length<<endl;
	cout<<"called by printLine"<<endl;
}

Line Line::changeLine(double length){
	this->length = length;
	cout<<"line's length is "<<this->length<<endl;
	cout<<"called by changeLine"<<endl;
	return *this;
}

int main(int argc, char *argv[]) {
	
	Line line1(12) ;//调用有参数的构造函数
	Line* line2 = new Line;//调用无参数的构造函数
	
	line1.setLength(10.0);
	line2->setLength(11.1);

	printLine(line1);
	
	cout<<"line1 "<<line1.getLength()<<endl;
	cout<<"line2 "<<line2->getLength()<<endl;
	
	Line line3 = line2->changeLine(23);
	cout<<"line3 "<<line3.getLength()<<endl;
	cout<<"obj count is "<<Line::getCount()<<endl;
	delete line2;//调用析构函数。程序结束时编译器自动释放line1 的资源，再次调用析构函数一次
	
}
```

	object is created 12
	1 objects left
	object is created 0
	2 objects left
	copy Line
	3 objects left
	line's length is 10
	called by printLine
	object is deleted
	2 objects left
	line1 10
	line2 11.1
	line's length is 23
	called by changeLine
	copy Line
	3 objects left
	line3 23
	obj count is 3
	object is deleted
	2 objects left
	object is deleted
	1 objects left
	object is deleted
	0 objects left

最后，自行分析程序运行结果。