---
title: 数据结构（四）——队列
date: 2016-10-16 18:05:46 +0800
categories: 
- 数据结构
- C/C++
tag: 
- 队列
---

# 定义

在[栈](stack)中提到，队列是操作受限制的特殊的线性表。
在队列的一端只能插入元素，这一端叫做队尾。
在队列的另一端只能删除元素，这一端叫做队首。

同样举个栗子。
在食堂排队打饭，跑的快的同学排在队列的前面，最先打到饭菜。后续到的同学只能依次排列在队尾。买到饭菜的同学离开队列叫做出队，进入队列等候叫做入队。食堂阿姨给队列中第一个同学打饭叫做访问队首元素。

总结：队列有先进先出的特性，FIFO（First In First Out）。每次只能在线性表的两端操作元素。

# 实现

考虑到每次出队和入队都要移动队首和队尾指针。若采用顺序存储，将会有可能造成顺序表前段部分存储单元的浪费。虽说可以采用循环队列的方式复用存储单元，若遇到队列满的情况，将队列扩容比较麻烦。因此建议用链表的方式实现队列。

## 定义结构

```C++
typedef int QueueType;

struct LinkQueue{
	QueueType key;
	struct LinkQueue *next;
};

typedef struct queueNode{
	struct LinkQueue *head;//队列的头指针
	struct LinkQueue *end;//队列的尾指针
}Queue;
```

> 这里定义了连个结构体，链表和队列。队列中只保存两个指针——**队首**、**队尾**。后面的入队、出队的操作，只需要操作这两个指针就好。

## 定义操作

### 创建队列

```C++
/**
 * 创建队列
 */
Queue createQueue() {
	Queue queue;
	queue.head = 0;
	queue.end = 0;
	return queue;
}
```

> 采用静态方式分配队列存储单元。初始化队首和队尾指针。

### 判断队列是否为空

```C++
/**
 * 判断队列是否是空
 */
int isEmpty(Queue queue) {
	if (queue.head == 0)
		return 0;
	else
		return 1;
}
```

> 队首指针指向空结点，表示队列为空。

### 访问队首元素

```C++
/**
 * 获取队列第一个元素
 */
int getFirst(Queue queue, QueueType& elem) {
	if (queue.head == 0)
		return 0;
	elem = queue.head->key;
	return 1;
}
```

> 队首指针可作为链表的头结点。通过头结点访问链表的第一个结点。

### 出队

```C++
/**
 * 退出队列
 */
int exitQueue(Queue& queue, QueueType& val) {
	if (isEmpty(queue) == 0) //空队列
		return 0;
	struct LinkQueue* node = queue.head;
	queue.head = node->next;
	node->next = 0;
	val = node->key;
	free(node);
	if (queue.head == 0)
		queue.end = 0;
	return 1;
}
```

> 通过队首指针，删除队列第一个结点。如果删除后队列为空，将队尾指针置空，否则队尾指针仍然指向最后一个元素。队列为空，删除失败，返回0 。删除成功返回1。

### 入队

```C++
/**
 * 进入队列
 */
int enterQueue(Queue& queue, QueueType key) {
	struct LinkQueue* node = (struct LinkQueue*) malloc(
			sizeof(struct LinkQueue));
	if (node == NULL)
		return 0;
	node->key = key;
	node->next = 0;
	if (queue.end == 0) {
		queue.end = node;
	} else {//修改队尾指针
		queue.end->next = node;
		queue.end = node;
	}
	if (queue.head == 0) {
		queue.head = node;
	}
	return 1;
}
```

> 队列为空时，队首和队尾指针指向同一个结点就好。队列不为空时，修改队尾指针指向新插入的结点。入队成功返回1，入队失败返回0。

最后附上头文件的定义
```C++
/*
 * queue.h
 *
 *  Created on: 2016年9月30日
 *      Author: flueky
 */

#ifndef QUEUE_H_
#define QUEUE_H_

typedef int QueueType;

struct LinkQueue {
	QueueType key;
	struct LinkQueue *next;
};

typedef struct queueNode {
	struct LinkQueue *head; //队列的头指针
	struct LinkQueue *end; //队列的尾指针
} Queue;

/**
 * 创建队列
 */
Queue createQueue();

/**
 * 判断队列是否是空
 */
int isEmpty(Queue);

/**
 * 获取队列第一个元素
 */
int getFirst(Queue, QueueType&);

/**
 * 进入队列
 */
int enterQueue(Queue&, QueueType);
/**
 * 退出队列
 */
int exitQueue(Queue&, QueueType&);

/**
 * 清空队列
 */
void clearQueue(Queue);

#endif /* QUEUE_H_ */
```
