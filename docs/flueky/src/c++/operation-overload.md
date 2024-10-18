---
title: C++高级编程（一）——运算符重载
date: 2016-05-02 21:48:00 +0800
categories: 
 - C/C++
tag:
---

C++ 允许在同一作用域中的某个函数和运算符指定多个定义，分别称为**函数重载**和**运算符重载**。

重载声明是指一个与之前已经在该作用域内声明过的函数或方法具有相同名称的声明，但是它们的参数列表和定义（实现）不相同。

当您调用一个重载函数或重载运算符时，编译器通过把您所使用的参数类型与定义中的参数类型进行比较，决定选用最合适的定义。选择最合适的重载函数或重载运算符的过程，称为**重载决策**。

<!-- more -->

# 函数重载

同众多面向对象编程语言一样，C++也支持函数重载。

函数重载是指：定义函数时，函数名相同，形参个数和类型不同。返回类型可以不同，函数实现可以不同。

```C++
#include <iostream>

using namespace std;

void print(int a,int b){
	cout<<a<<" "<<b<<endl; 
}

void print(int a,char b,float c){
		cout<<a<<" "<<b<<" "<<c<<endl; 
}

int main(int argc, char *argv[]) {
	print(1, 2);
	print(1, 'z', 1.2);
}
```

> 上述代码中，两个`print`函数就是重载的函数。注意，形参个数和类型相同返回类型不同的不算函数重载，而是会报错。

# 运算符重载

准确说，运算符重载是C++的特性。我承认C# 也支持运算符重载，只是个人觉得他更像C++和Java混合的产物，因此它支持运算符重载也就不足为奇了。

C++中的绝大多数运算符都可以被重载。重载的运算符是带有特殊名称的函数，函数名是由关键字**operator**和其后要重载的运算符符号构成的。与其他函数一样，重载运算符有一个返回类型和一个参数列表。

可重载运算符和不可重载运算符如图：

<img src="/assets/image/216/1.png" width="500"/>

# 运算符重载示例

## 一元运算符重载

一元运算符，指对一个操作数进行操作。

C++中，一元运算符有：-，~，!，++，--。

```C++
#include <iostream>

using namespace std;

class Point{
	private:
		int x;
		int y;
	public:
		Point(int x,int y);
		void print();
		Point operator-();//重载运算符-
		Point operator~();//重载运算符~
		Point operator!();//重载运算符！
		Point& operator++();//重载运算符++前缀
		Point operator++(int);//重载运算符++后缀
		Point& operator--();//重载运算符--前缀
		Point operator--(int);//重载运算符--后缀
};

Point::Point(int x,int y){
	this->x = x;
	this->y = y;
}

void Point::print(){
	cout<<this<<"--->"<<x<<" "<<y<<endl;
}

Point Point::operator-(){
	x = -x;
	y = -y;
	return Point(x,y);
}

Point Point::operator~(){
	x = -x;
	return Point(x,y);
}

Point Point::operator!(){
	y = -y;
	return Point(x,y);
}


Point& Point::operator++(){
	//用两种方式取到Point的成员，不是有病，是想指明this指针的用法。
	(*this).x++;
	(this->y)++;
	return (*this);
}

Point Point::operator++(int){
	Point temp = *(this);
	++*(this);
	return temp;
}


Point& Point::operator--(){
	(*this).x--;
	(this->y)--;
	return (*this);
}

Point Point::operator--(int){
	Point temp = *(this);
	--*(this);
	return temp;
}

int main(int argc, char *argv[]) {
	Point p1(1,2);
	p1.print();
	-p1;
	p1.print();
	~p1;
	p1.print();
	!p1;
	p1.print();
	Point p2 = p1++;
	p1.print();
	p2.print();

}
```

	0x7fff553819f8--->1 2
	0x7fff553819f8--->-1 -2
	0x7fff553819f8--->1 -2
	0x7fff553819f8--->1 2
	0x7fff553819f8--->2 3
	0x7fff553819d8--->1 2

> 分析输出，对p1做-、~、！、++、--运算，正确输出。注意++、-- 前缀和后缀的区别

## 二元运算符重载

二元运算符，指对两个操作数进行操作。

```C++
#include <iostream>

using namespace std;

class Point{
	private:
		int x;
		int y;
	public:
		Point();
		Point(int x,int y);
		void print();
		Point operator-();//重载运算符-
		Point operator~();//重载运算符~
		Point operator!();//重载运算符！
		Point& operator++();//重载运算符++前缀
		Point operator++(int);//重载运算符++后缀
		Point& operator--();//重载运算符--前缀
		Point operator--(int);//重载运算符--后缀
		Point operator+(const Point &p);//重载运算符+,-、*、/ 同理
		Point& operator+=(const Point &p);//重载运算符+=,-=、*=、/=、%=、<<=、>>=同理	
		Point operator<<(const int i);//重载运算符<<，>>同理
		bool operator>(const Point &p);//重载运算符>，<、>=、<=、==、!=同理。注意&&、||、&、|、的不同处理逻辑
};

Point::Point(){
	this->x = 0;
	this->y = 0;
}

Point::Point(int x,int y){
	this->x = x;
	this->y = y;
}

void Point::print(){
	cout<<this<<"--->"<<x<<" "<<y<<endl;
}

Point Point::operator-(){
	x = -x;
	y = -y;
	return Point(x,y);
}

Point Point::operator~(){
	x = -x;
	return Point(x,y);
}

Point Point::operator!(){
	y = -y;
	return Point(x,y);
}


Point& Point::operator++(){
	//用两种方式取到Point的成员，不是有病，是想指明this指针的用法。
	(*this).x++;
	(this->y)++;
	return (*this);
}

Point Point::operator++(int){
	Point temp = *(this);
	++*(this);
	return temp;
}


Point& Point::operator--(){
	(*this).x--;
	(this->y)--;
	return (*this);
}

Point Point::operator--(int){
	Point temp = *(this);
	--*(this);
	return temp;
}

Point Point::operator+(const Point &p){
	Point point;
	point.x = (*this).x+p.x;
	point.y = (*this).y+p.y;
	return point;
	
}
Point& Point::operator+=(const Point &p){
	this->x+=p.x;
	this->y+=p.y;
	return (*this);
}
Point Point::operator<<(const int i){
	Point point;
	point.x = this->x<<i;
	point.y = this->y<<i;
	return point;
}
bool Point::operator>(const Point &p){
	return (this->x+this->y)>(p.x+p.y);
}

int main(int argc, char *argv[]) {
	Point p1(1,2);
	p1.print();
	-p1;
	p1.print();
	~p1;
	p1.print();
	!p1;
	p1.print();
	Point p2 = p1++;
	p1.print();
	p2.print();
	Point p3 = p2+p1;
	p1.print();
	p2.print();
	p3.print();
	p3+=p2;
	p3.print();
	Point p4 =p2<<2;
	p4.print();
}
```
> 注意，+=和+ 运算符的区别

## 输入/输出运算符重载

```
#include <iostream>

using namespace std;

class Point{
	private:
		int x;
		int y;
	public:
		Point();
		Point(int x,int y);
		void print();
		friend ostream& operator<<(ostream& outstream,const Point&);
		friend istream& operator>>(istream& instream,const Point&);
};

Point::Point(){
	this->x = 0;
	this->y = 0;
}

Point::Point(int x,int y){
	this->x = x;
	this->y = y;
}

void Point::print(){
	cout<<this<<"--->"<<x<<" "<<y<<endl;
}

ostream& operator<<(ostream& outstream,const Point& p){
	outstream<<"--->"<<p.x<<" "<<p.y<<endl;
	return outstream;
}

istream& operator>>(istream& instream,const Point& p){
	instream>>p.x>>p.y;
	return instream;
}
```






