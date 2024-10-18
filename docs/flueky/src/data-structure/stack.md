---
title: 数据结构（三）——栈
date: 2016-10-15 17:18:22 +0800
categories: 
 - 数据结构
 - C/C++
tag: 
 - 栈
---

# 定义

在线性表中，根据存储结构可分为：[顺序表](list) 和 [链表](link)。顺序表和链表可以访问任意位置结点，在任意位置插入和删除结点。倘若对上述操作加以限制，如：

1.	在线性表的一端插入、删除、访问结点。
2.	在线性表的一端插入结点、另一端删除、访问结点。

*注：对线性表操作的限制有很多，上述只介绍两种主流的限制，在数据结构中叫做**栈**和**队列**。

栈的概念比较抽象，举个栗子（**对，就是板栗的栗子**）。

一群人依次走进一个死胡同，宽度只够通行一个人。如果他们要出来，只能依次退出来。最后进去的人最先出来，在外面的人也只看的见最后进去的人是谁。这里，进去一个人叫做插入结点，出来一个人叫做删除结点。看的见最后进去的人，叫访问结点。

总结：栈有先进后出的特性，简称FILO（First in Last Out）。只能在线性表的一端插入和删除结点。

# 实现

栈是操作受限制的线性表，根据不同的存储结构可分成顺序栈和链式栈。
在顺序栈中，可以将顺序表的有效长度作为栈顶指针，在顺序表的末尾删除和插入节点。
在链式栈中，可以将链表的头结点作为栈顶指针，入栈采用头插法。

## 定义结构

```C++
#define LIST_INIT_SIZE 10
#define LISTINCREMENT 2

typedef int StackType; //存储单元类型

typedef struct stackNode {
	StackType *elem; //存储空间基地址
	int length; //当前长度
	int listsize; //当前分配的存储容量（以sizeof(ElemType)为单位）
}Stack;
```

> 这里定义的实际上是顺序表的结构，所以实现的也就是顺序栈。只是操作方法比顺序表的操作少很多。

## 定义操作
### 初始化栈

```C++
int initStack(Stack& stack) {
	stack.elem = (StackType *) malloc(sizeof(StackType) * LIST_INIT_SIZE);
	if (!stack.elem)
		return 0; //内存分配失败，存储空间不够
	stack.length = 0;
	stack.listsize = LIST_INIT_SIZE;
	return 1;
}
```
> 给栈的基地址分配一段连续的存储单元，并标记栈的长度为0。初始化成功返回1，初始化失败返回0。

### 判断栈是否为空

```C++
int isEmptyStack(Stack stack) {
	return stack.length;
}
```

> 栈为空，返回0，不为空返回非0。

### 访问栈顶元素

```C++
int top(Stack stack, StackType& elem) {
	if (stack.length == 0)
		return 0;
	elem = stack.elem[stack.length - 1];
	return 1;
}
```

> 取出栈顶元素，传值给形参elem，但不删除栈顶元素。由于采用的是引用的方式，因此形参值的改变可以传给实参。如果栈为空，返回0，栈非空，返回1。

### 出栈

```C++
int pop(Stack& stack, StackType& elem) {

	if (stack.length > 0) {
		elem = stack.elem[--stack.length];
		return 1;
	}
	return 0;
}
```

> 取出并删除栈顶元素，传值给形参elem。由于采用的是引用的方式，因此形参值的改变可以传给实参。如果栈为空，返回0，栈非空，返回1。

### 入栈

```C++
int push(Stack& stack, StackType data) {
	if (stack.length == stack.listsize) { //顺序表的存储单元已经存满
		printf("顺序表的存储单元已满，继续分配新的存储单元。");
		StackType* newBase = (StackType*) realloc(stack.elem,
				(stack.listsize + LISTINCREMENT) * sizeof(StackType)); //继续分配存储单元
		if (!newBase) {
			printf("分配内存单元失败");
			return 0;
		}
		stack.elem = newBase;
		stack.listsize += LISTINCREMENT;
	}
	stack.elem[stack.length] = data;
	stack.length++;
	return 1;
}
```

> 在栈顶插入元素。若，当前栈已满，继续分配内存单元再插入。返回1表示入栈成功，返回0表示入栈失败。

最后附上头文件的定义

```C++
/*
 * stack.h
 *
 *  Created on: 2016年9月26日
 *      Author: flueky
 */


#ifndef STACK_H_
#define STACK_H_

#define LIST_INIT_SIZE 10
#define LISTINCREMENT 2

typedef int StackType; //存储单元类型

typedef struct stackNode {
	StackType *elem; //存储空间基地址
	int length; //当前长度
	int listsize; //当前分配的存储容量（以sizeof(ElemType)为单位）
}Stack;

int initStack(Stack&);

int isEmptyStack(Stack);

int top(Stack,StackType&);

int push(Stack&,StackType);

int pop(Stack&,StackType&);



#endif /* STACK_H_ */
```
