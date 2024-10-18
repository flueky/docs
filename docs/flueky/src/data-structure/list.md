---
title: 数据结构（一）——顺序表
date: 2016-09-30 18:00:37 +0800
categories: 
 - 数据结构
 - C/C++
tag: 
 - 顺序表
---

# 定义

数据结构是相互之间存在一种或多种特定关系的数据元素的集合。根据数据元素之间关系的不同特性，通常有如下4类基本结构:

-	集合：结构中的数据元素之间除了“同属于一个集合”的关系外，别无其他的关系。如：**广义表**。
-	线性结构：结构中的数据元素之间存在一个对一个的关系。如：**链表**。
-	树形结构：结构中的数据元素之间存在一个对多个的关系。如：**二叉树**。
-	图（网）状结构：结构中的数据元素之间存在多个对多个的关系。如：**图**。

在线性结构中，根据存储方式分为**顺序表**、**链表**，根据对表的操作限制，分为**栈**和**队列**。

顺序表的特征是，在内存中占用连续的存储单元，可以简单的理解为顺序表就是数组。只是根据需要，在实际应用中动态分配顺序表占用的内存单元。而数组是在编译的时候，预分配了指定大小的内存单元，因此如下代码段会在编译的时候报错。

```C
int len = 10;
char arr[len];
```

但是顺序表又会有数据全部的特点：可以根据下标直接访问、不方便插入和删除元素（因为需要移动后续的元素）。

# 实现

## 定义结构

```C
typedef int SeqType; //存储单元类型

typedef struct{
	SeqType *elem; //存储空间基地址
	int length; //当前长度
	int listsize; //当前分配的存储容量（以sizeof(ElemType)为单位）
} SqList;
```

> 结构体内，有三个元素：存储空间基地址，类似于数组首地址；当前长度，记录顺序表中有效存储单元个数；当前分配的存储容量，顺序表中，最多容纳的存储单元个数。**当顺序表中所有存储单元已经被使用，在下次插入元素之前，需要新增存储单元**。这点是数组所不具有的特性。

***注：定义一个存储单元类型`SeqType`是为了使顺序表适和更多数据类型，使用的时候修改`SeqType`类型即可**。

## 定义操作

### 创建顺序表

```C
/**
 * 创建顺序表
 */
SqList createList_sq() {
	//SqList list;
	//return list;

	SqList* list = (SqList*)malloc(sizeof(SqList));
	return *list;
}
```

> 这里提供两种创建顺序表的代码，一种是由系统分配list占用的内存，一种是自己动态分配的内存，需要在程序运行之前手动释放占用的内存空间。


### 初始化顺序表

```C
/**
 * 初始化顺序表
 * 返回1 表示初始化成功
 * 返回0 表示初始化失败
 */
int initList_sq(SqList &L) { //只有在C++中才会有引用的存在
	L.elem = (SeqType *) malloc(sizeof(SeqType) * LIST_INIT_SIZE);
	if (!L.elem)
		return 0; //内存分配失败，存储空间不够
	L.length = 0; //表示顺序表为空
	L.listsize = LIST_INIT_SIZE; //表示顺序表里，最大存储单元个数
	return 1;
}
```

> 分配顺序表的存储单元，初始化顺序表属性的值。

### 插入元素

```c
/**
 * 插入顺序表
 * 下标是负数就插入到结尾
 */
int insertList_sq(SqList &L, int index, SeqType val) {
	if (index > L.length) { //存储的下表超出顺序表实际的长度
		printf("插入的下标超出顺序表的实际长度");
		return 0;
	}
	if (index < 0) //下标是负数，插入到结尾
		index = L.length;
	if (L.length == L.listsize) { //顺序表的存储单元已经存满
		printf("顺序表的存储单元已满，继续分配新的存储单元。");
		SeqType* newBase = (SeqType*) realloc(L.elem,
				(L.listsize + LISTINCREMENT) * sizeof(SeqType)); //继续分配存储单元
		if (!newBase) {
			printf("分配内存单元失败");
			return 0;
		}
		L.elem = newBase;
		L.listsize += LISTINCREMENT;
	}
	//寻找合适的插入位置，index后面的元素向后移动
	for (int i = L.length; i > index; i--) {
		L.elem[i] = L.elem[i - 1]; //向后移动
	}
	L.elem[index] = val; //插入元素
	L.length++;
	return 1;
}
```

> 将元素插入到指定的位置。插入之前，需要先判断顺序表中是否已经存满，再根据需要新增存储单元，最后插入元素。

```C
/**
 * 插入顺序表（结尾的位置）
 * 与上面的函数是重名函数，这叫函数重载，在C++里面支持
 */
int insertList_sq(SqList &L, SeqType val) {
	return insertList_sq(L, L.length, val);
}
```

***引用和重载，是C++中才支持，因此需要在cpp文件中编译。**

### 删除元素

```c
/**
 * 删除指定的元素
 * 返回0 找不到指定的元素，删除失败。
 * 返回1 找到待删除的元素，删除成功。
 */
int removeList_sq(SqList &L, SeqType val) {
	int index = -1; //记录匹配到的下标
	for (int i = 0; i < L.length; i++) {
		if (L.elem[i] == val) {
			//找到匹配的val，结束循环
			index = i;
			break;
		}
	}
	if (index < 0)
		return 0;
	for (; index < L.length - 1; index++) {
		L.elem[index] = L.elem[index + 1];
	}
	L.length--;
	return 1;
}
```

> 删除指定元素，需要先找到下标。依次移动下标后面的结点，修改length值。

```c
/**
 * 根据下标删除是指定的结点，并返回元素的值
 * 返回0 下标超出顺序表长度，删除失败。
 * 返回1 下标正确，删除元素，并且将已删除元素值转给elem
 */
int removeList_sq(SqList &L, int index, SeqType &elem) {
	if (index >= L.length) //下标超出顺序表的长度
		return 0;
	index = index < 0 ? L.length : index; //下标负数表示删除最后一个节点
	elem = L.elem[index];
	for (int i = index; i < L.length - 1; i++) {
		L.elem[i] = L.elem[i + 1];
	}
	L.length--;
	return 1;
}
```
> 先取到指定下标的元素，赋值给elem，然后依次移动下标后面的结点。最后修改length值。

### 销毁顺序表

```c
/**
 * 销毁顺序表
 */
void destoryList_sq(SqList &L) {
	free(L.elem); //释放存储空间
	L.length = 0;
	L.listsize = 0;
//	free(&L);
}
```

> 重点释放顺序表的存储单元。如果顺序表自身的内存也是动态分配的，需要手动释放。

最后附上，头文件的定义。

```C
/*
 * sqlist.h
 *
 * 线性表的顺序存储
 *  Created on: 2016年8月30日
 *      Author: flueky
 */

#ifndef SQLIST_H_
#define SQLIST_H_

#define LIST_INIT_SIZE 50
#define LISTINCREMENT 10

typedef int SeqType; //存储单元类型

typedef struct{
	SeqType *elem; //存储空间基地址
	int length; //当前长度
	int listsize; //当前分配的存储容量（以sizeof(ElemType)为单位）
} SqList;

/**
 * 创建顺序表
 */
SqList createList_sq();

/**
 * 初始化顺序表
 */
int initList_sq(SqList &);

/**
 * 插入顺序表
 */
int insertList_sq(SqList &,int index,SeqType);

/**
 * 插入顺序表（结尾的位置）
 */
int insertList_sq(SqList &,SeqType);

/**
 * 在顺序表中移除指定位置元素，下标从0开始
 */
int removeList_sq(SqList &,int,SeqType &);

/**
 * 在顺序表中删除指定元素
 */
int removeList_sq(SqList &,SeqType);
/**
 * 销毁顺序表
 */
void destoryList_sq(SqList &);

#endif /* SQLIST_H_ */
```