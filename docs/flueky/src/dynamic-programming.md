---
title: "浅谈动态规划算法设计"
date: 2016-04-02 20:00:33 +0800
categories: 
    - 算法
    - C/C++
tag:
    - 动态规划
---

和分治法一样，动态规划算法是通过组合子问题的解来解决整个问题。不同的是，分治法是指将问题划分成一些独立的子问题，递归的求解个个子问题，最经典的案例就是快速排序算法的应用。而动态规划适用于处理子问题不是独立的情况，也就是各个子问题包含公共子子问题。动态规划算法对每个子子问题只求解一次，存放在一张表里。

<!-- more -->

关于更多详细的动态规划算法的设计，还请阅读课本或其他专业性资料进行了解。本文只简要介绍动态规划的两个要素：最优子结构和重叠子问题。然后用一个详细的代码用例来加深对该算法的理解。

# 引入问题

现有一种编码方式是将26个字母按照字母表的顺序依次用阿拉伯数字表示，如1表示A、2表示B、12表示L。（为降低问题的复杂度，此处只采用大写字母）。现在将一串数字组成的字符串解码成用26个英文字母表示。问题的难点在于其结果的不唯一性。如之前所说，12既可以是AB也可以是L，123可以表示成：ABC、AW、LC。现在给定一个数字串，要求计算出所有能表示的字母串的个数。若可以，再输出所有可能的字母串。

# 分析问题

假设n个数字能表示成的字母串的个数用T(n)表示，要求计算出T(n)的最大值，结合问题，只要求出T(n-1)的最大值，那么当拼接上最后一个数字时，就能得到T(n)的最大值。因此这里的最有子结构就是T(n-1)的最大值。所谓的重叠子问题就更好理解，T(n-2)是T(n-1)的子问题同时也是T(n)的子问题。搞懂了这两个概念，那么接下来就开始分析问题，即我理解成的找规律。

当n=1时，毫无疑问T(n)=1;当n=2时，需要考虑到两种情况。因为第一个数字是1，第二个数字是1~9都可能表示两种情况。同样，第一个数字是2，第二个数字是1~6也表示两种情况。所以T(2)=1或T(2)=2。推广到一般情况，T(n)=T(n-1)，若最后两个数字满足上述情况，还要对T(n)执行T(n)+=T(n-2)。在这里，有点难理解。同样用数字串123表示，T(1)=1,T(2)=2,T(3) = T(2)+T(1)=3。若是数字串129，那么T(3)=T(2)=2。说白了就是T(n-1)（前N-1个字母）再加第N个字母能组成一个字母串，若第N-1和第N个字母能组合成 一个字母，还要再加上T(n-2)。

由于页面排版问题，这里就不整理递归表达式了。下面，附上解决这个问题的代码：

```C
void* revertString(char* nums) {
	int len = strlen(nums); //整个字符串的长度
	int* var = (int*) malloc(sizeof(int) * len); //用来保存，第i个位置，解的个数
	var[0] = 1; //当字符串只有一位时，只有一个解
	if (len < 2) {
		return NULL;
	}
	if (nums[0] == '1' || (nums[0] == '2' && nums[1] <= '6' && nums[1] >= '0'))
		//当遇到12的情况，可以是AB也可以是L
		var[1] = 2;
	else
		var[1] = 1;
	for (int i = 2; i < len; i++) {
		//从第三个字符开始，var[i]=var[i-1]，若nums[i-1]num[i]可以组成一个字母，那么var[i]+=var[i-2]
		if (nums[i] < '0' || nums[i] > '9') {
			//当字符串中包含不合法的数字
			return NULL;
		}
		var[i] = var[i - 1];
		if (nums[i - 1] == '1'
				|| (nums[i - 1] == '2' && nums[i] <= '6' && nums[i] >= '0')) {
			var[i] += var[i - 2];
		}
	}
	for (int i = 0; i < len; i++) {
		printf("%d ", var[i]);
	}
	return NULL;
}
```

最后一个for循环，是输出每一个子问题最多能表示字母串的个数。数组var相当于用来保存每个子问题最优解的表。用数字串12351726测试输出结果是1 2 3 3 3 6 6 12 。表示总共有12个情况。

要想进一步输出这个12个字母串，上述代码显的有点无能为力。所以本宝宝又写了一段代码。定义了一个链表，每个结点存储一个可能表示的字母串。遍历整个数字串，依次向整个链表里添加字母。代码如下：


```C
struct strNode {
	char* strs; //存储每个节点长度的字符串
	char last;
	int len; //字符串长度
	struct strNode* next;
};

void* revertString(char* nums) {
    int len = strlen(nums); //整个字符串的长度
    if (len < 1)
        return NULL;

    //生成一个head，指向第一个节点
    struct strNode head;

    //生成第一个节点
    struct strNode first;
    first.strs = (char*) malloc(sizeof(char) * (len + 1));
    first.next = NULL;
    memset(first.strs, 0, len + 1);
    first.last = nums[0] - '1' + 'A';
    first.strs[0] = first.last;
    first.len = 1;
    head.next = &first;

    for (int i = 1; i < len; i++) {
        //从第二个字符开始
        struct strNode *temp = head.next;

        char flag = '0'; //标记上一个字符，A或B就添加一个节点
        while (temp != NULL) {

            char c = nums[i] - '1' + 'A';

            if (temp->last==temp->strs[temp->len-1]&&(temp->last == 'A' || (temp->last == 'B' && c >= 'A' && c <= 'F')))
                flag = temp->last;
            temp->last = c; //标记最后一个字符
            temp->strs[temp->len++] = temp->last;

            if (flag != '0') {
                //新增节点
                struct strNode* add = ( struct strNode*)malloc(sizeof( struct strNode));
                add->strs = (char*) malloc(sizeof(char) * (len + 1));
                memset(add->strs,0, len + 1);
                memcpy(add->strs, temp->strs, temp->len - 2);
                add->len =  temp->len - 2;
                add->last = c;
                c = (flag - 'A' + 1) * 10 + c;
                add->strs[add->len++] = c;
                //插入节点
                add->next = temp->next;
                temp->next = add;
                temp = add->next;
                flag = '0';
            }else
                temp = temp->next;
        }
    }
    head.next = &first;
    while (head.next != NULL) {
        printf("%s\n", head.next->strs);
        head.next = head.next->next;
    }
}
```

# 测试结果

共12个字母串

    ABCEAGBF
    ABCEAGZ
    ABCEQBF
    ABCEQZ
    AWEAGBF
    AWEAGZ
    AWEQBF
    AWEQZ
    LCEAGBF
    LCEAGZ
    LCEQBF
    LCEQZ

# 总结

关于动态规划的问题有好多，经典的如：装配线调度、矩阵链乘和最长公共子序列。只要分析出问题的最优子结构，再设计出一张表保存重叠子问题的解，便能顺利得到问题的解。上述两段代码中，分别采用数组和链表保存重叠子问题的解。第一个保存字母串的个数，第二个保存字母串的内容。因此导致两段算法的时间复杂度依次是O(n)和O(n^2)。

**注：上述问题仅用来表示处理动态规划类的问题的方法，在实际中，考虑到字母J表示10和字母T表示20，第一个1或者2不能单独的表示成A或者B。所以请不要用带有数字0的数字串的测试用例来验证上述两个代码片段。最后，祝小伙伴们假期愉快。**