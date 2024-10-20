---
title: "指针与引用"
date: 2016-05-27 14:27:59 +0800
categories: 
 - C/C++
---


初学者分析指针和引用最常用的方式是写一个swap函数，分析传值还是传址的交换。

# 普通变量交换

```C
int main(int argc, const char * argv[]) {
    
    int a = 1;
    int b = 2;
    
	printf("交换前:%d %d\n",a,b);
	
    int temp = a;
    a = b;
    b = temp;
    
    printf("交换后:%d %d\n",a,b);
}
```

程序输出

> 交换前:1 2 <br/>
> 交换后:2 1 <br/>

这里没什么好分析的。

# 指针交换

正确交换：

```C
int main(int argc, const char * argv[]) {
    
    int a = 1;
    int b = 2;
    
    int* p = &a;
    int* q = &b;
    
    printf("交换前:%d %d\n",a,b);
    printf("交换前:%d %d\n\n",*p,*q);
    
    int* temp = p;
    p = q;
    q = temp;
    
    printf("交换后:%d %d\n",a,b);
    printf("交换前:%d %d\n",*p,*q);
}
```

> 交换前:1 2 <br/>
> 交换前:1 2 <br/>
>
> 交换后:1 2 <br/>
> 交换后:2 1 <br/>

现在就变得有意思了。最初p、q分别指向a和b的地址。表示p->a,q->b。经过交换之后，p->b,q->a。

错误交换：

```C
int main(int argc, const char * argv[]) {
    
    int a = 1;
    int b = 2;
    
    int* p = &a;
    int* q = &b;
    
    printf("交换前:%d %d\n",a,b);
    printf("交换前:%d %d\n\n",*p,*q);
    
    int* temp = p;
    *p = *q;//注意这里的不同
    q = temp;
    
    printf("交换后:%d %d\n",a,b);
    printf("交换后:%d %d\n",*p,*q);
}
```
> 交换前:1 2 <br/>
> 交换前:1 2 <br/>

> 交换后:2 2 <br/>
> 交换后:2 2 <br/>

代码`*p = *q`等价于`a=b`。所以第一个会输出2 2。需要注意的是，此时p 和 q 依然指向不同的地址。执行完代码`q = temp` q 和p 指向相同的地址了。因为最初`temp = p`。

也有的人写成这样的交换方式：

```C++
	//案例1
	int temp = *p;
    *p = *q;
    *q = temp;
	//案例2
    int temp = *p;
    p = q;
    *q = temp;
```
> 案例1 <br/>
> 交换后:2 1 <br/>
> 交换后:2 1 <br/>

>案例2 有`*q = temp` <br/>
> 交换后:1 1 <br/>
> 交换后:1 1 <br/>

>案例2 没有`*q = temp` <br/>
> 交换后:1 2 <br/>
> 交换后:2 2 <br/>

关于案例1，等价于普通变量的交换。最终交换的是a 和 b的值。p和q的指针不变。案例2中，先给temp赋a 的值，再将p的指针指向q，最后修改q指向的值。得出最终结果p = q->b = a = 1。如果没有	`*q = temp`最终结果p = q->b = 2，a = 1

# 二重指针交换

正常交换

```C
int main(int argc, const char * argv[]) {
    
    int a = 1;
    int b = 2;
    
    int* p = &a;
    int* q = &b;
    
    int** pp = &p;
    int** qq = &q;
    
    printf("交换前:%d %d\n",a,b);
    printf("交换前:%d %d\n",*p,*q);
    printf("交换前:%d %d\n\n",**pp,**qq);
    
    int** temp = pp;
    pp = qq;
    qq = temp;
    
    printf("交换后:%d %d\n",a,b);
    printf("交换后:%d %d\n",*p,*q);
    printf("交换后:%d %d\n",**pp,**qq);
}
```

> 交换前:1 2 <br/>
> 交换前:1 2 <br/>
> 交换前:1 2 <br/>

> 交换后:1 2 <br/>
> 交换后:1 2 <br/>
> 交换后:2 1 <br/>

简单分析：最初时，pp->p->a,qq->q->b。交换后：qq->p->a,pp->q->b。弄懂了二重指针的道理，之后遇到三重、四重指针时，可以递归分析。

错误交换

```C
int main(int argc, const char * argv[]) {
    
    int a = 1;
    int b = 2;
    
    int* p = &a;
    int* q = &b;
    
    int** pp = &p;
    int** qq = &q;
    
    printf("交换前:%d %d\n",a,b);
    printf("交换前:%d %d\n",*p,*q);
    printf("交换前:%d %d\n\n",**pp,**qq);
    
    int** temp = pp;
    **pp = **qq;//注意此处的不同
    qq = temp;
    
    printf("交换后:%d %d\n",a,b);
    printf("交换后:%d %d\n",*p,*q);
    printf("交换后:%d %d\n",**pp,**qq);
}
```
> 交换后:2 2 <br/>
> 交换后:2 2 <br/>
> 交换后:2 2 <br/>

之前也说过了，此处`**pp = **qq`相当于`a = b`所以pp->p->a = 2；qq->q->b = 2;因此输出全是2。执行`qq = temp`使得qq=pp->p->a = 2，并没有改变q->b = 2。

看到这里有没有晕？接下来举几个一定能让你晕的案例：

```C++
	//案例1
    int** temp = pp;
    *pp = *qq;
    qq = temp;
	//案例2
    int* temp = *pp;
    **pp = **qq;
    *qq = temp;
	//案例3
	int* temp = *pp;
    *pp = *qq;
    *qq = temp;
	//案例4
	int* temp = *pp;
    pp = qq;
    *qq = temp;
	//案例5
    int temp = **pp;
    pp = qq;
    **qq = temp;
 	//案例6   
    int temp = **pp;
    *pp = *qq;
    **qq = temp;
	//案例7
    int temp = **pp;
    **pp = **qq;
    **qq = temp;
```

加上之前的两个，这里包含了二重指针置换的所有的可能的写法。

> 案例1 <br/>
> 交换后:1 2 <br/>
> 交换后:2 2 <br/>
> 交换后:2 2 <br/>

执行`*pp = *qq`，pp->p=q->b=2,qq->q->b=2。执行`qq = temp`，qq=pp->p=q->b=2。而此时a=1，b=2不变。

> 案例2 <br/>
> 交换后:2 2 <br/>
> 交换后:2 2 <br/>
> 交换后:2 2 <br/>

执行`**pp = **qq`，pp->p->a=b=2,qq->q->b=2。执行	`*qq = temp`，pp->p->a=b=2,qq->q=p->a=2。**分析这里时，可将`**pp = **qq`等价成`a = b`而`*qq = temp`等价成q = temp = p**。

> 案例3 <br/>
> 交换后:1 2 <br/>
> 交换后:2 1 <br/>
> 交换后:2 1 <br/>

用通俗的话讲，这里交换的是p和q 两个指针（等价于一重指针的正确案例）。pp->p->b = 2,qq->q->a = 1;

> 案例4 <br/>
> 交换后:1 2 <br/>
> 交换后:1 1 <br/>
> 交换后:1 1 <br/>

执行`pp = qq`，pp=qq->q->b=2,p->a=1。执行` *qq = temp`,等价于`q = p`,所以pp=qq->q=p->a=1，b=2。

> 案例5 <br/>
> 交换后:1 1 <br/>
> 交换后:1 1 <br/>
> 交换后:1 1 <br/>

执行`pp = qq`,pp=qq->q->b=2,p->a=1。执行`**qq = temp`等价于`**qq = **pp，b = a`，因此pp=qq->q->b=a = 1,p->a=1

> 案例6 <br/>
> 交换后:1 1 <br/>
> 交换后:1 1 <br/>
> 交换后:1 1 <br/>

执行`*pp = *qq`，等价于`p = q`，pp->p=q->b=2,qq->q->b=2,a=1。执行`**qq = temp`，pp->p=q->b=a=1,qq->q->b=a=1。

> 案例7 <br/>
> 交换后:2 1 <br/>
> 交换后:2 1 <br/>
> 交换后:2 1 <br/>

一句话的总结就是：交换了a和b。pp->p->a = 2,qq->q->b = 1。

# 引用交换

引用是C++中才有的概念，因此在c文件中测试如下代码，会在编译时候产生语法错误。需要创建cpp文件测试。

```C++
int main(int argc, const char * argv[]) {
    
    int a = 1;
    int b = 2;
    
    int& r = a;
    int& s = b;
    
    printf("交换前:%d %d\n",a,b);
    printf("交换前:%d %d\n\n",r,s);
    
    int& temp = r;
    r = s;
    s = temp;
    
    printf("交换后:%d %d\n",a,b);
    printf("交换后:%d %d\n",r,s);
}
```

> 交换前:1 2 <br/>
> 交换前:1 2 <br/>
>
> 交换后:2 2 <br/>
> 交换后:2 2 <br/>

运行后发现，这里并没有起到交换的作用。究其原因，定义temp 引用时，temp 和 r指向内存中同一块，也就是a所在的内存。引用之间只能够传值（指针之间可以传止，如p = q使 p=q->b=2，a=1），r = s = b = 2，于是temp = 2，a = 2。s = temp = 2。

正确的交换应当是

```C++
    int temp = r;//注意这里的不同
    r = s;
    s = temp;
```

这样就得到了预期的运行结果。啊哦……

> 交换前:1 2 <br/>
> 交换前:1 2 <br/>
>
> 交换后:2 1 <br/>
> 交换后:2 1 <br/>

# 函数交换

```C++
/**
 * 普通交换
 */
void swap(int a,int b){
    int temp = a;
    a = b;
    b = temp;
}

int main(int argc, const char * argv[]) {
    
    int a = 1;
    int b = 2;
    
    swap(a, b);
    
    printf("交换前:%d %d\n\n",a,b);
    printf("交换后:%d %d\n",a,b);
}
```

> 交换前:1 2 <br/>
>
> 交换后:1 2 <br/>

swap 函数中的a、b是形参，main函数中，传入的是a、b 的值，所以在swap函数中交换的是形参a、b的值，不影响main函数中a、b的值。

```C++
/**
 * 指针交换
 */
void swapP(int *a,int *b){
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(int argc, const char * argv[]) {
    
    int a = 1;
    int b = 2;
    int* p = &a;
    int* q = &b;
    
    printf("交换前:%d %d\n",a,b);
    printf("交换前:%d %d\n\n",*p,*q);
    
    swapP(&a, &b);
//    swapP(p, q);//等价上句
    
    printf("交换后:%d %d\n",a,b);
    printf("交换后:%d %d\n\n",*p,*q);
}
```

> 交换前:1 2 <br/>
> 交换前:1 2 <br/>
>
> 交换后:2 1 <br/>
> 交换后:2 1 <br/>

swapP函数两个参数都是指针类型，接收main函数中的指针p或a的地址（**指针p 指向a的地址，同理b**），因此在swap中交换的依然是a和b的值，不改变main函数中p->a,q->b。

错误交换示例：

```C++
/**
 * 指针交换
 */
void swapP(int *a,int *b){
    int* temp = a;
    a = b;
    b = temp;
}
```

> 交换前:1 2 <br/>
> 交换前:1 2 <br/>
>
> 交换后:1 2 <br/>
> 交换后:1 2 <br/>

这里是对指针指向的地址进行交换，而这里的指针依然是形参，交换后的值不改变main函数中的p、q。

```C++
/**
 * 二重指针交换
 */
void swapPP(int** pp,int **qq){
    int* temp = *pp;
    *pp = *qq;
    *qq = temp;
    
}

int main(int argc, const char * argv[]) {
    
    int a = 1;
    int b = 2;
    int* p = &a;
    int* q = &b;
    int** pp = &p;
    int** qq = &q;
    
    printf("交换前:%d %d\n",a,b);
    printf("交换前:%d %d\n",*p,*q);
    printf("交换前:%d %d\n\n",**pp,**qq);
    
    swapPP(pp, qq);
//    swapPP(&p, &q);//等价上句
    
    printf("交换后:%d %d\n",a,b);
    printf("交换后:%d %d\n",*p,*q);
    printf("交换后:%d %d\n\n",**pp,**qq);
}
```
> 交换前:1 2 <br/>
> 交换前:1 2 <br/>
> 交换前:1 2 <br/>
>
> 交换后:1 2 <br/>
> 交换后:2 1 <br/>
> 交换后:2 1 <br/>

> 交换前：pp->p->a = 1,qq->q->b = 2;
> 交换后：pp->p->b = 2,qq->q->a = 1;换句话说，交换了p和q指向的地址。

错误交换示例：

```C++
/**
 * 二重指针交换
 */
void swapPP1(int** pp,int **qq){
    int** temp = pp;
    pp = qq;
    qq = temp;
    
}
```

> 交换前:1 2 <br/>
> 交换前:1 2 <br/>
> 交换前:1 2 <br/>
>
> 交换后:1 2 <br/>
> 交换后:1 2 <br/>
> 交换后:1 2 <br/>

原理同一重指针的错误交换示例。

```C++
/**
 * 引用交换
 */
void swapR(int& a,int& b){
    int temp = a;
    a = b;
    b = temp;
}

int main(int argc, const char * argv[]) {
    
    int a = 1;
    int b = 2;
    
    int& r = a;
    int& s = b;

    
    printf("交换前:%d %d\n",a,b);
    printf("交换前:%d %d\n\n",r,s);
    
    swapR(r,s);
//    swapR(a,b);//等价上句
    
    printf("交换后:%d %d\n",a,b);
    printf("交换后:%d %d\n",r,s);
}
```

> 交换前:1 2 <br/>
> 交换前:1 2 <br/>
>
> 交换后:2 1 <br/>
> 交换后:2 1 <br/>

原理同一重指针的正确交换。这里传入的是a、b的地址。

# 总结

正确的交换代码片段：

```C++
    int temp = a;
    a = b;
    b = temp;
```

```C++
    int* temp = p;
    p = q;
    q = temp;
```

```C++
    int** temp = pp;
    pp = qq;
    qq = temp;
```

```C++
    int* temp = *pp;
    *pp = *qq;
    *qq = temp;
```

```C++
    int temp = r;
    r = s;
    s = temp;
```

**注意二重指针的两种交换，在函数中只有一种是有效的**

**谨以此篇博文，欢迎加入我们软件实验室的新生……**