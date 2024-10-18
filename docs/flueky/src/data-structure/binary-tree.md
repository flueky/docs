---
title: 数据结构（五）——二叉树
date: 2016-10-18 22:49:19 +0800
categories: 
 - 数据结构
 - C/C++
tag: 
 - 二叉树
---

# 定义

之前四篇博客分别介绍了线性结构中的[顺序表](list)、[链表](link)、[栈](stack)、[队列](queue)。从难度来讲，顺序表到链表是递增的。从实现来讲，栈和队列基于顺序表和链表（**之前栈采用了顺序表的存储结构，队列采用了链表的存储结构**）。此次介绍的二叉树虽是非线性结构的树形结构分支，但在其各个结点遍历的实现上，使用到了栈和队列的特性。

**二叉树**是一种特殊的线性结构，每个结点最多只有两个分支，称左孩子结点和右孩子结点。更多关于二叉树的特性，自行查阅资料。接下来只详细的介绍创建二叉树以及二叉树的遍历。

# 实现

## 定义结构

```C++
typedef char TreeType;

typedef struct BitNode {
	TreeType key;
	struct BitNode *left;
	struct BitNode *right;
} BitTree;
```

> 二叉树的结构和双向链表的结构一致，只是双向链表的两个指针构成线性结构，二叉树的两个指针构成非线性结构。

## 定义操作

### 构造空二叉树

```C++
/**
 * 构造空二叉树
 */
void initBitTree(BitTree& root) {
	root.left = NULL;
	root.right = NULL;
}
```

> 将根结点的左右两个指针置空。

### 创建二叉树

```C++
/**
 * 创建二叉树(按照前序遍历方式构建二叉树)
 */
void createBitTree(BitTree** parent) {
	char key = getchar();
	getchar();
	if (key == '#') { //输入#表示该节点是叶子节点
		*parent = NULL;
		return;
	} else {
		*parent = (BitTree*) malloc(sizeof(BitTree));
		if (*parent == NULL)
			exit(9);
		(*parent)->key = key;
		createBitTree(&((*parent)->left));
		createBitTree(&((*parent)->right));
	}
}
```

> 先序遍历的方式构建二叉树，输入#号表示当前结点的左孩子结点或右孩子结点为空。

### 递归先序遍历

```C++
/**
 * 递归先序遍历
 */
void preOrderTraverse(BitTree* parent) {
	if (parent != NULL) {
		visit(*parent);
		preOrderTraverse(parent->left);//遍历左子树
		preOrderTraverse(parent->right);//遍历右子树
	}
}
```

> 先访问根结点，再依次递归访问左子树和右子树

### 递归中序遍历

```C++
/**
 * 递归中序遍历
 */
void inOrderTraverse(BitTree* parent) {
	if (parent != NULL) {
		inOrderTraverse(parent->left);//遍历左子树
		visit(*parent);
		inOrderTraverse(parent->right);//遍历右子树
	}
}
```

> 先递归遍历左子树，再访问根节点，最后递归访问右子树。

### 递归后序遍历

```C++
/**
 * 递归后序遍历
 */
void postOrderTraverse(BitTree* parent) {
	if (parent != NULL) {
		postOrderTraverse(parent->left);//遍历左子树
		postOrderTraverse(parent->right);//遍历右子树
		visit(*parent);
	}
}
```

> 先依次递归访问左子树和右子树，最后访问根结点。

***三序遍历的递归方式简单的介绍到这里，三序遍历的非递归方式一个比一个难，这是本人自行思考写出的算法，若说阅读了参考资料那也是很久之前的事情。因此觉得，这三段代码还是很有阅读价值。**

### 非递归先序遍历

```C++
/**
 * 非递归先序遍历
 */
void preOrderTraverseNormal(BitTree* parent) {
	Stack stack;
	if (initStack(stack) == 0)
		return;
	if (parent == NULL)
		return;
	push(stack, *parent);
	BitTree topNode;
	while (pop(stack, topNode)) { //取栈顶元素，访问并出栈
		visit (node); //访问栈顶元素
		if (topNode.right != NULL) { //存在右结点，则先将右结点入栈。因为左结点先遍历
			push(stack, *(topNode.right));
		}
		if (topNode.left != NULL) { //存在左结点，左结点入栈
			push(stack, *(topNode.left));
		}
	}
}
```

> 非递归遍历的重点是手动构造递归栈。首先将根结点入栈，然后在while循环中，先将栈顶结点出栈，并依次将该结点的右孩子结点和左孩子结点入栈（如果存在），知道栈为空pop函数返回0 结束循环。

### 非递归中序遍历

```C++
/**
 * 非递归中序遍历
 */
void inOrderTraverseNormal(BitTree* parent) {
	Stack stack;
	if (initStack(stack) == 0)
		return;
	if (parent == NULL)
		return;
	push(stack, *parent);
	BitTree topNode;
	while (top(stack, topNode)) { //取栈顶结点
		/**
		 * 首先，一直遍历到最左边的结点
		 */
		while (topNode.left != NULL) { //左孩子结点不为空，入栈
			push(stack, *(topNode.left));//左孩子结点入栈
			topNode = *(topNode.left);//看下一个左孩子结点
		}
		/**
		 * 其次，判断其是否存在右孩子结点。
		 * 不存在右孩子结点，直接将该结点出栈
		 */
		int flag = 1;
		while (flag && topNode.right == NULL) {
			pop(stack, topNode);//出栈
			visit(topNode);
			flag = top(stack, topNode);//取栈顶结点，继续判断
		}
		/**
		 * 存在右孩子结点，当前结点出栈，并将右孩子结点入栈
		 */
		if (pop(stack, topNode)) {
			visit(topNode);
			push(stack, *(topNode.right));
		}
	}
}
```

> 先将根结点入栈，然后根据根结点一直寻找到该左子树的最左边结点，访问该结点。如果该结点不存在右子树，直接将该结点出栈，并一直出栈到栈顶的结点存在右子树。此时将栈顶结点出栈，并将该结点的右孩子结点入栈，并寻找到该结点右子树的最左边结点。

### 非递归后序遍历

```C++
/**
 * 非递归后序遍历
 */
void postOrderTraverseNormal(BitTree* parent) {
	/**
	 * 声明两个栈，遍历树的管理栈和备用栈
	 * 备用栈的作用：部分结点存在两次访问的，备用栈是记录第一次访问，然后入栈。
	 * 也可以在结点中添加一个标签记录访问次数，备用栈的设计是为了避免修改结点
	 */
	Stack stack, backup;
	if (initStack(stack) == 0)
		return;
	if (initStack(backup) == 0)
		return;
	if (parent == NULL)
		return;
	push(stack, *parent);
	BitTree topNode; //记录当前栈顶结点
	BitTree backupNode; //记录备用栈的栈顶结点
	BitTree lastNode; //上次访问的结点
	while (top(stack, topNode)) { //取栈顶结点
		int flag = top(backup, backupNode); //备用栈的栈顶元素,返回0表示备用栈为空。
		if (flag == 0 || compareTreeNode(topNode, backupNode) == 0) { //该结点是第一次访问
			if (topNode.left != NULL
					&& compareTreeNode(*(topNode.left), lastNode) == 0) { //左孩子结点不为空，且上次访问的不是左孩子结点
				push(stack, *(topNode.left)); //左孩子结点入栈
				continue;
			}
			push(backup, topNode);
			if (topNode.right != NULL
					&& compareTreeNode(*(topNode.right), lastNode) == 0) { //右孩子结点不为空，且上次访问的不是右孩子结点
				push(stack, *(topNode.right)); //右孩子结点入栈
				continue;
			}
		} else { //该节结点是第二次访问，直接出栈
			pop(backup, backupNode); //备用栈栈顶元素出栈
			pop(stack, topNode); //当前栈栈顶元素出栈
			visit(topNode); //访问刚出栈的结点
			lastNode = topNode; //记录刚刚访问的结点
		}
	}
}
```

> 考虑到后续遍历的特殊性质，根结点会在左孩子结点和右孩子结点出栈时访问两次。多数资料上的实现方式都是通过在每个结点中添加一个标志记录根节点的访问次数。为了维护之前定义好的结构体的完整性。用一个备用栈，完美的解决问题。

> 取递归栈中的栈顶元素和备用栈中的栈顶元素（如果存在）对比，如果相同，就是第二次遍历到该结点。分别将递归栈和备用栈中的栈顶元素出栈，访问并记录当前出栈的结点。如果不相同，就是第一次访问该结点，此时需要考虑当前递归栈中栈顶结点是否存在左子树或右子树以及上次出栈的结点是否是该结点的左孩子结点或右孩子结点。
> 当该结点不存在左子树或上次出栈的结点是该结点的左孩子结点，则标记当前递归栈中的栈顶结点已经访问过一次，将该结点添加到备用栈中。

> 说了这么多，有点绕。经过长时间的思考以及两次优化之后的成果。越是难懂的算法不一定就是最高级的算法，此处 ，不对我的代码做任何评价。

### 层次遍历

```C++
/**
 * 层次遍历
 */
void levelOrderTraverse(BitTree* parent) {
	Queue queue = createQueue();//创建队列
	enterQueue(queue, *parent);//根结点入队
	BitTree node;
	while (exitQueue(queue, node)) {//队列中结点出队，队列为空，返回0，while循环结束
		visit(child);//访问队列中第一个结点
		if (node.left != 0)//判断是否存在左孩子结点，将左孩子结点入队
			enterQueue(queue, *node.left);
		if (node.right != 0)//判断是否存在右孩子结点，将右孩子结点入队
			enterQueue(queue, *node.right);
	}
}
```

> 看完前面三个非递归的遍历算法，也许都晕了。层次遍历，没有递归或非递归而言，自顶向下、从左到右访问二叉树中所有的结点。先访问的结点子树上的全部结点一定比后访问结点子树上的全部结点先访问，所以层次遍历用到了队的特性。

### 访问结点

```C++
/**
 * 访问
 */
void visit(BitTree node) {
	printf("%c", node.key);
}
```

> 这只是模拟访问结点的操作，可根据需要自定定义该函数的功能。

上述代码中用到的栈和队列中的函数，都是复用了之前博客中介绍的栈和队列的操作函数。只是修改下每个元素的结点类型。

```C++
#ifndef STACK_H_
#define STACK_H_

#include "tree.h"

#define LIST_INIT_SIZE 10
#define LISTINCREMENT 2

typedef BitTree StackType; //栈中每个元素的结点类型是二叉树

typedef struct stackNode {
	StackType *elem; //存储空间基地址
	int length; //当前长度
	int listsize; //当前分配的存储容量（以sizeof(ElemType)为单位）
}Stack;

……

#ifndef QUEUE_H_
#define QUEUE_H_

#include "tree.h"

typedef BitTree QueueType;//队列中每个元素的结点类型是二叉树

struct LinkQueue {
	QueueType key;
	struct LinkQueue *next;
};

typedef struct queueNode {
	struct LinkQueue *head; //队列的头指针
	struct LinkQueue *end; //队列的尾指针
} Queue;

……
```

最后，附上头文件的定义，部分方法未实现。

```C++
/*
 * tree.h
 *
 *  Created on: 2016年9月25日
 *      Author: flueky
 */
#include "stack.h"
#include "queue.h"

#ifndef TREE_H_
#define TREE_H_

typedef char TreeType;

typedef struct BitNode {
	TreeType key;
	struct BitNode *left;
	struct BitNode *right;
} BitTree;

/**
 * 构造空二叉树
 */
void initBitTree(BitTree&);
/**
 * 销毁二叉树
 */
void destoryBitTree(BitTree&);
/**
 * 创建二叉树
 */
void createBitTree(BitTree**);
/**
 * 将二叉树清为空树
 */
void clearBitTree(BitTree&);
/**
 * 递归先序遍历
 */
void preOrderTraverse(BitTree*);
/**
 * 非递归先序遍历
 */
void preOrderTraverseNormal(BitTree*);
/**
 * 递归中序遍历
 */
void inOrderTraverse(BitTree*);
/**
 * 非递归中序遍历
 */
void inOrderTraverseNormal(BitTree*);
/**
 * 递归后序遍历
 */
void postOrderTraverse(BitTree*);
/**
 * 非递归后序遍历
 */
void postOrderTraverseNormal(BitTree*);

/**
 * 层次遍历
 */
void levelOrderTraverse(BitTree*);
/**
 * 比较两个结点，相同返回1，不同返回0
 */
int compareTreeNode(BitTree, BitTree);
/**
 * 访问
 */
void visit(BitTree);

#endif /* TREE_H_ */
```