---
title: 数据结构（二）——链表
date: 2016-09-30 22:08:32 +0800
categories: 
 - 数据结构
 - C/C++
tag: 
 - 链表
---

# 定义

相对于顺序表而言，“勤拿少取”这是对链表最形象的描述。意指，它需要一个结点，就在内存中分配一块内存单元。比顺序表不足的是，链表的每个结点中，需要一个存储单元保存指向下一个结点的地址。

链表的访问需要从第一个结点（或称头结点）开始寻找，（顺序表可以根据下标直接访问）。链表的插入和删除只需对指定位置的结点操作即可。

常见的链表，根据指向下个链表的指针可分为**单向链表**，**双向链表**。根据第一个结点是否存储元素可分为**带头结点的链表**和**不带头结点的链表**。再根据末尾结点next指针的指向可分为**循环链表**和**非循环链表**。

***下面程序以单向带头结点的非循环链表为例**。

# 实现

## 定义结构

```C
typedef int LinkType; //存储单元类型

typedef struct linkNode {
	LinkType key; //结点的key值
	struct linkNode *next; //指向下一个结点
} LNode, *LinkList;//LNode 是普通类型，LinkList是指针类型
```

> 定义LinkType类型，使该链表结构适合更多数据类型。每个链表的结点，包含一个值域key和一个指针域next。这里声明两种类型`LNode`和`LinkList`。以下两行代码是等价的。

```C
LNode* node = (LNode*)malloc(sizeof(LNode));
LinkList node = (LinkList)malloc(sizeof(LNode));
```

## 定义操作
### 创建头结点

```C
/**
 * 创建头结点
 */
LinkList createHead_link() {
	LinkList head = (LinkList) malloc(sizeof(LNode));
	head->next = NULL;
	return head;
}
```

> 这里是动态分配一个内存单元存储头结点，也可以参照[顺序表](list)中，使用`LNode head`，由系统分配内存。

### 插入结点

```C
/**
 * 头插法
 */
void insertFirst_link(LinkList head, LinkType val) {
	LinkList node = (LinkList) malloc(sizeof(LNode));
	node->key = val;
	node->next = head->next;
	head->next = node;
}
```

> 在带头结点的链表中，头插法表示每次将结点插入到头结点的后面。在不带头结点的链表中，将待插入的结点放在链表中第一个结点的前面，代替之成为第一个结点。

```C
/**
 * 尾插法
 */
void insertLast_link(LinkList head, LinkType val) {
	LinkList temp = head;
	while (temp->next != NULL) //找到末尾结点
		temp = temp->next;
	LinkList node = (LinkList) malloc(sizeof(LNode));
	node->key = val;
	temp->next = node;
	node->next = NULL;
}
```

> 对于尾插法而言，不区分带头结点和不带头结点的链表。只将待插入的结点插到链表的最后一个位置。因此需要先循环到链表的末尾。

```C
/**
 * 指定位置插入，position表示插入后的位置，0表示头结点后的第一个结点
 */
void insert_link(LinkList head, int position, LinkType val) {
	if (position < 0) //-1 从末尾添加，采用尾插法
		insertLast_link(head, val);
	else if (position == 0) //从第一个结点插入，采用头插法
		insertFirst_link(head, val);
	else { //
		LinkList temp = head->next;
		while (temp != NULL && --position > 0) { //找到合适的位置结点
			temp = temp->next;
		}
		LinkList node = (LinkList) malloc(sizeof(LNode));
		node->key = val;
		node->next = temp->next;
		temp->next = node;
	}
}
```

> 先根据下标找到待插入的位置，然后插入结点。对比顺序表，先移动指定位置的后续结点，再插入新的结点。

### 删除结点

```C
/**
 * 删除节点（指定位置）,下标从0开始
 */
void removeNode_link(LinkList head, int index, LinkType &key) {
	if (index < 0) {
		printf("指定下标值不正确\n");
		return;
	}
	LinkList node = head;
	int i = 0;
	while (!node->next || i < index) { //寻找指定下标的节点，结束循环时，i==index
		node = node->next;
		i++;
	}
	if (i == index) { //找到指定节点
		LinkList temp = node->next; //temp 是要被删除的节点
		node->next = temp->next;
		temp->next = NULL;
		key = temp->key;
		free(temp);
	} else { //没找到
		printf("没找到指定下标的值");
	}
}
```

> 下标从0开始，表示头结点后的第一个结点。先找到待删除的结点，取出key值，再删除该结点。

```C
/**
 * 删除节点（指定节点）
 */
void removeNode_link(LinkList head, LinkType val) {
	LinkList node = head;
	while (!node->next) {
		if (node->next->key == val)
			break;
		node = node->next;
	}
	if (node->next != NULL) { //找到要删除的节点
		LinkList temp = node->next; //temp 是要被删除的节点
		node->next = temp->next;
		temp->next = NULL;
		free(temp);
	} else {
		printf("没找到要删除的节点\n");
	}
}
```

> 首先根据val值，找到待删除的结点，最后删除之。

### 销毁链表

```C
/**
 * 销毁链表
 */
void destory_link(LinkList head) {
	while (head->next != NULL) {
		LinkList node = head->next;
		head->next = node->next;
		free(node);
	}
}
```

> 释放掉除头结点之外的所有结点占用的内存。

最后附上，头文件的定义

```C
/*
 * linklist.h
 * 顺序表的链式存储结构
 *  Created on: 2016年8月30日
 *      Author: flueky
 */

#ifndef LINKLIST_H_
#define LINKLIST_H_

typedef int LinkType; //存储单元类型

typedef struct linkNode {
	LinkType key; //节点的key值
	struct linkNode *next; //指向下一个节点
} LNode, *LinkList;//LNode 是普通类型，LinkList是指针类型

/**
 * 创建头结点
 */
LinkList createHead_link();
/**
 * 头插法
 */
void insertFirst_link(LinkList, LinkType);

/**
 * 尾插法
 */
void insertLast_link(LinkList, LinkType);

/**
 * 在指定位置插入
 */
void insert_link(LinkList,int, LinkType);

/**
 * 删除节点（指定位置）
 */
void removeNode_link(LinkList,int,LinkType&);

/**
 * 删除节点（指定节点）
 */
void removeNode_link(LinkList,LinkType);

/**
 * 销毁链表
 */
void destory_link(LinkList);

#endif /* LINKLIST_H_ */

```

