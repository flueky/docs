---
title: "C语言编程之你不知道的事——回调函数"
date: 2016-03-30 13:46:43 +0800
categories:
 - C/C++
tag:
---

说起回调函数，我们通常想到的就是Java编程里面的Callback，基于接口实现。使用的时候传入一个对象的引用然后再在需要的地方调用对象里的方法即可。众所周知，Java编程里`引用`的概念即指C语言里指针传址的实现。所以参照Java里回调函数的实现模式，在C语言里也能很轻松的实现回调的功能。

<!-- more -->

# 定义头文件

callback.h

```C++

#ifndef CALLBACK_H_
#define CALLBACK_H_

typedef void* callback(char* name);

void set_callback(callback *cb);

void test_call(char* name);

#endif /* CALLBACK_H_ */
```


# 定义源文件

callback.cpp

```C++
#include <stdio.h>
#include "callback.h"

callback *_cb;

void* default_callback(char* name) {
	printf("default callback %s\n", name);
}

void set_callback(callback *cb) {
	_cb = cb;
}

void test_call(char* name) {
	if (_cb == NULL) {
		default_callback(name);
	} else {
		_cb(name);
	}
}
```

# 使用

main.cpp

```C++
#include "callback.h"
#include <stdio.h>

void* my_callback(char* name) {
	printf("my callback %s\n", name);
}

int main(){
	test_call("flueky");
	set_callback(my_callback);
	test_call("heheda");
	return 0;
}
```

# 小结

以上三个文件，简单的实现了C语言回调函数的demo。提供一个默认的`callback`和用户自定义一个`callback`。 当没有执行`set_callback`函数，`test_call`方法将调用默认的`callback`。执行代码`set_callback(my_callback)`，会将字符串“heheda”传入`my_callback`函数，用户在`my_callback`函数里继续实现自己的逻辑，是不是和`Java`的`callback`很相似呢？

这里的关键就是用`typedef`定义的一个函数指针类型`callback`。`callback`指向的是`void*`类型的函数地址，当`_cb`未赋值时，`_cb==NULL`，执行函数`default_callback`，当`_cb`指向`my_callback`时，就通过`_cb`调用了函数`my_callback`。