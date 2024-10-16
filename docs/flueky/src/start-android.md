---
title: 从零构建Android工程
date: 2018-11-29 09:08:04 +0800
categories: 
 - Android
 - 开发工具
tag:
 - AndroidStudio
---

## 1 新建工程目录

新建文件夹`Demo`，用`AndroidStudio`打开。

<img src="/assets/image/001/1.png" width="250"/>

新建`build.gradle`文件，添加如下内容：

```Gradle
buildscript {
    repositories{
        jcenter()
        google()
    }
    dependencies{
        // 目前最新build插件版本 3.2.1
        classpath 'com.android.tools.build:gradle:3.2.1'
    }
}
```

构建工程后如图：

<img src="/assets/image/001/2.png" width="250"/>

自动生成的`gradle`文件夹及使用的`gradle`不建议修改。如想调降`gradle`版本，建议降低`build`插件版本。

## 2 新建主module目录

新建`settings.gradle`文件和`app`文件夹，并在`settings.gradle`文件中添加`include ':app'`,再次构建工程，`app`文件夹图标改变。

构建前：<br/>
<img src="/assets/image/001/3.png" width="250"/><br/>
构建后：<br/>
<img src="/assets/image/001/4.png" width="250"/><br/>

在`app`目录下新建`build.gradle`文件，并添加如下内容：

```Gradle
apply plugin: 'com.android.application'

android{
    compileSdkVersion 28 //目前最新sdk 28
}
```

在`app`目录下新建 `src`、`src/main`文件夹,并在`main`文件夹中新建`AndroidManifest.xml`文件，添加如下内容：

```Xml
<?xml version="1.0" encoding="UTF-8" ?>
<manifest package="com.flueky.demo">

</manifest>
```

最后在工程`build.gradle`文件添加:

```Gradle
buildscript {
    repositories{
        jcenter()
        google()
    }
    dependencies{
        classpath 'com.android.tools.build:gradle:3.2.1'
    }
}
// 以下是添加部分，定义全部工程的资源库
allprojects{
    repositories{
        jcenter()
        google()
    }
}
```

出现图中标志时，表示项目已经构建完成。添加默认启动`Activity`即可去掉  <font color='red'>✘</font> 号。

<img src="/assets/image/001/5.png" width="200"><br/>

## 3 添加启动Activity

1. 在`app/src/main`目录下分别新建`java`和`res`文件夹。
2. 在`java`目录下创建包名：`com.flueky.demo`，并创建`MainActivity`类。
3. 在`res`目录加创建`layout`文件夹，并创建`activity_main.xml`布局。
4. 在`AndroidManifest.xml`文件注册`MainActivity`。
5. 给`MainActivity`添加启动`intent`。

最终目录结构如图：<br/>
<img src="/assets/image/001/6.png" width="250"/>

`MainActivity`内容：<br/>
```Java
package com.flueky.demo;

import android.app.Activity;
import android.os.Bundle;

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}
```

`activity_main.xml`内容：
```Xml
<?xml version="1.0" encoding="UTF-8" ?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Hello World" />
</LinearLayout>
```

`AndroidManifest.xml`内容：
```Xml
<?xml version="1.0" encoding="UTF-8" ?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.flueky.demo">

    <application>

        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
```

运行结果如图：<br/>
<img src="/assets/image/001/7.png" width="250"/>

## 4 新建库module目录

新建`library`文件夹，并在`settings.gradle`文件中添加`include ':library'`，构建后如下，注意`library`文件夹的标志。

<img src="/assets/image/001/8.png" width="250"/>

同主`module`一样，创建`AndroidManifest.xml`文件和`build.gradle`文件。

编辑`AndroidManifest.xml`文件：

```Xml
<?xml version="1.0" encoding="UTF-8" ?>
<manifest package="com.flueky.library">

</manifest>
```

编辑`build.gradle`文件：

```Gradle
apply plugin: 'com.android.library'

android {
    compileSdkVersion 28
}
```

在主`module`文件中，添加下面的代码进行关联。

    implementation project(':library')

## 5 结束语

`AndroidStudio`自带的创建项目功能，做的很好。能够帮助初学者最快速度的创建`Android`工程，编写此篇博客的目的在于，能够帮助初学者们更好的了解`Android`项目工程结构。最后，将此篇博客献给测试小伙伴们。你们距离程序猿，只差面向对象编程了。
