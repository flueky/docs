---
title: Android 线程间通信
categories:
 - Android
 - Note
date: 2019-11-16 16:59:27
tags:
---


Android 系统中，应用在运行时是一个独立的进程，但是每个进程中可以包含多个线程提高运行效率。在多线程开发中，有一个很重要的原则：**不能在子线程中更新  UI 。**

<!-- more -->

>  Only the original thread that created a view hierarchy can touch its views.

为解决这个问题，目前有多重方案实现子线程和主线程（UI 线程）之间的通信。

## 1. 判断代码执行的线程

在一些简单代码逻辑中，也许能够很清晰的辨别出运行在子线程或主线程中。通常在复杂的类关系依赖、函数嵌套调用中，可能需要花费很大精力去阅读代码之后去判断。不过，巧法子也是有的，一行代码解决。

```java
Log.d("TAG","test");
```

日志内容中，`2368-2393` 表示是在子线程中输出日志。

> 11-16 01:08:31.584 2368-2393/com.flueky.demo D/TAG: test

其中 *2368* 表示 `PID` 指进程id， *2393* 表示 `TID` 指线程id 。如果 `TID` 也是 *2368* ，则表示日志输出在主线程中。

**可能也有人听过 `UID` ,应用第一次安装在设备上时，系统会分配一个序号给应用，作为其唯一标识。`UID` 在覆盖安装时不会变化，卸载安装时系统会重新分配一个。**

下面是在代码中获取三个 id 的方式。

```java
// 获取 tid
Process.myTid()
// 获取 pid
Process.myPid()
// 获取 uid
Process.myUid()
```

遇到需要在子线程中更新 **UI** 操作时，可以通过下面的这些方式解决。

## 2. 使用 View.post

子线程代码运行在 Activity 或 Fragment 中，能获取到任意 view 的引用时，可以使用此方式将需要实现的代码放在主线程中运行。

```java
// post 方法在子线程中调用
textView.post(new Runnable() {
    @Override
    public void run() {
        // 此处代码会在 UI 线程执行
    }
});
```

## 3. 使用 Activity.runOnUiThread

如果能够直接获取到 Activity 实例，使用 **runOnUiThread** 方法。

```java
// runOnUiThread 方法在子线程中调用
activity.runOnUiThread(new Runnable() {
    @Override
    public void run() {
        // 此处代码会在 UI 线程执行
    }
});
```

## 4. 使用 Handler.post

使用 Handler 比较讲究，因为需要考虑到 Handler 实例初始化的位置。

```java
// post 方法在子线程中调用
handler.post(new Runnable() {
    @Override
    public void run() {
        // handler 在主线程中初始化时，此处代码在主线程中执行
        // handler 在子线程中初始化事，此处代码在子线程中执行
    }
});
```

**以上说法其实不够严谨，存在下面的情况，初始化 handler 实例时传入 Looper.getMainLooper() ，则 handler.post 也在主线程中执行。**

```java
// 下面的代码在子线程中执行
Looper.prepare();
handler = new Handler(Looper.getMainLooper());
Looper.loop();
```

## 5. 使用 EventBus

`EventBus` 出自 **greenrobot** ,通过订阅的方式，告知函数运行在哪个线程中。为使订阅函数在主线程中执行，使用注解 **MAIN** 或 **MAIN_ORDERED** 。

```java
/**
 * eventbus 简单示例
 */
public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    /**
     * 订阅函数，
     * ThreadMode.MAIN 表示在主线程中运行，可能会阻塞子线程。
     * ThreadMode.MAIN_ORDERED 表示在主线程中运行，不会阻塞子线程。
     */
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onMessageEvent(Object event) {
        if(event instanceof Runnable)
            ((Runnable)event).run();
    }

    @Override
    protected void onStart() {
        super.onStart();
        // 注册 eventbus 监听
        EventBus.getDefault().register(this);
    }

    @Override
    protected void onStop() {
        super.onStop();
        // 注销 eventbus 监听
        EventBus.getDefault().unregister(this);
    }
}

// 在子线程中发送消息
EventBus.getDefault().post(new Runnable() {
    @Override
    public void run() {
        // 此处代码会在 UI 线程执行
    }
});
```

## 6. 传递数据

前面四种方式演示了如何在子线程中做更新 UI 操作。 `AsyncTask` 也具备相同用法，但是有点牵强，因为只有 **execute** 方法在主线程中执行，**onPostExecute** 才会在主线程中调用。由于 **onPostExecute** 可以接收到子线程传递的任意类型的对象数据，所以 `AsyncTask` 可以作为线程间的数据交互的载体。对此 **Handler** 和  **EventBus** 表示不服。

**EventBus** 如之前所示，可以将 **Runnable** 对象换成任意实例。

**Handler** 也可以通过 **sendMessage** 方法发送 **Message** 对象。其中 **Message.obj** 用作传递对象数据的载体。

**建议使用 Message.obtain() 方法复用 Message 实例。**

顺便提下，`BroadcastReceiver` 也可以作为此类用途，只不过没有 **EventBus** 和 **Handler** 方便。
