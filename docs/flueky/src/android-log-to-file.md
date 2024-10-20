---
title: "优化Android Log类，并保存日志内容至文件"
date: 2017-08-14 17:22:59 +0800
categories: 
 - Android
tag:
---

## 1 目的何在

为什么要优化log？举两个例子。

开发中遇到问题时，我们喜欢用log帮助自己分析问题，通常没有在解决问题之后删除日志输出代码的习惯，那么问题来了。别人也可以根据你开发时的日志信息来分析你程序的漏洞，所以安全公司一般建议在release包中删除日志输入代码。这时候不可能逐行删除（**工作量太大**）。

安卓系统更新快，机型多且杂。考虑到兼容性问题，那么至少在主流的几个OS版本和品牌手机上测试。即使是专业的IT公司有足够的设备供你测试，也相信你是希望将这份测试工作交给专业的测试人员负责。这时候出现问题，总不能叫别人把手机拿过来给你连上电脑调试。因此有必要将日志输出内存保存至文件，然后直接分析日志文件即可。

所以，接下来看如何进行封装。

## 2 枚举日志级别

分析原生log类，常用日志级别有6个，从依次是VERBOSE、DEBUG、INFO、WARN、ERROR、ASSERT，6个值依次对应6个整型常量。

依此生成7个枚举变量（**新增CLOSE**，用来生成release包时，不输出日志）。

```Java
/**
    * 日志级别
    */
public enum Level {

    VERBOSE(Log.VERBOSE),

    DEBUG(Log.DEBUG),

    INFO(Log.INFO),

    WARN(Log.WARN),

    ERROR(Log.ERROR),

    ASSERT(Log.ASSERT),

    CLOSE(Log.ASSERT + 1);

    int value;

    Level(int value) {
        this.value = value;
    }
}
```

## 3 封装原生方法

封装有三个目的：

1.  关于TAG，每次都需要申明一个静态常量或者每次写一个参数。重载函数，将参数String改成Object，这样可以直接用this关键字传递类对象并通过`target.getClass().getSimpleName()`获取类名称做TAG。
2.  之前申明7个枚举变量，用作日志筛选和关闭日志输出，因此在调用原生6个日志输出函数之前添加筛选逻辑代码。
3.  保存日志至问价有两个方式：用logcat命令（AS和eclipse的日志窗口使用）、在日志函数调用前手动保存。这里重点介绍该方式。

```Java
public static final void i(String tag, String msg) {
    if (currentLevel.value > Level.INFO.value)
        return;
    if (isWriter) {
        write(tag, msg, "I");
    }
    Log.i(tag, msg);
}

public static final void i(String tag, String msg, Throwable throwable) {
    if (currentLevel.value > Level.INFO.value)
        return;
    if (isWriter) {
        write(tag, msg, "I", throwable);
    }
    Log.i(tag, msg, throwable);
}

public static final void v(String tag, String msg) {
    if (currentLevel.value > Level.VERBOSE.value)
        return;
    if (isWriter) {
        write(tag, msg, "V");
    }
    Log.v(tag, msg);
}

public static final void v(String tag, String msg, Throwable throwable) {
    if (currentLevel.value > Level.VERBOSE.value)
        return;
    if (isWriter) {
        write(tag, msg, "V", throwable);
    }
    Log.v(tag, msg, throwable);
}

public static final void d(String tag, String msg) {
    if (currentLevel.value > Level.DEBUG.value)
        return;
    if (isWriter) {
        write(tag, msg, "D");
    }
    Log.d(tag, msg);
}

public static final void d(String tag, String msg, Throwable throwable) {
    if (currentLevel.value > Level.DEBUG.value)
        return;
    if (isWriter) {
        write(tag, msg, "D", throwable);
    }
    Log.d(tag, msg, throwable);
}

public static final void e(String tag, String msg) {
    if (currentLevel.value > Level.ERROR.value)
        return;
    if (isWriter) {
        write(tag, msg, "E");
    }
    Log.e(tag, msg);
}

public static final void e(String tag, String msg, Throwable throwable) {
    if (currentLevel.value > Level.ERROR.value)
        return;
    if (isWriter) {
        write(tag, msg, "E", throwable);
    }
    Log.e(tag, msg, throwable);
}

public static final void w(String tag, String msg) {
    if (currentLevel.value > Level.WARN.value)
        return;
    if (isWriter) {
        write(tag, msg, "W");
    }
    Log.w(tag, msg);
}

public static final void w(String tag, String msg, Throwable throwable) {
    if (currentLevel.value > Level.WARN.value)
        return;
    if (isWriter) {
        write(tag, msg, "W", throwable);
    }
    Log.w(tag, msg, throwable);
}

public static final void i(Object target, String msg) {
    i(target.getClass().getSimpleName(), msg);
}

public static final void i(Object target, String msg, Throwable throwable) {
    i(target.getClass().getSimpleName(), msg, throwable);
}

public static final void v(Object target, String msg) {
    v(target.getClass().getSimpleName(), msg);
}

public static final void v(Object target, String msg, Throwable throwable) {
    v(target.getClass().getSimpleName(), msg, throwable);
}

public static final void d(Object target, String msg) {
    d(target.getClass().getSimpleName(), msg);
}

public static final void d(Object target, String msg, Throwable throwable) {
    d(target.getClass().getSimpleName(), msg, throwable);
}

public static final void e(Object target, String msg) {
    e(target.getClass().getSimpleName(), msg);
}

public static final void e(Object target, String msg, Throwable throwable) {
    e(target.getClass().getSimpleName(), msg, throwable);
}

public static final void w(Object target, String msg) {
    w(target.getClass().getSimpleName(), msg);
}

public static final void w(Object target, String msg, Throwable throwable) {

    w(target.getClass().getSimpleName(), msg, throwable);
}
```

## 4 保存日志内容至文件

封装原生方法的目的在于，我们可以插入write方法，保存日志内容至文件。`LOG_FORMAT` 是仿造AS的日志输出格式，后面会附上结果：

```Java
/**
    * 写文件操作
    *
    * @param tag       日志标签
    * @param msg       日志内容
    * @param level     日志级别
    * @param throwable 异常捕获
    */
private static final void write(String tag, String msg, String level, Throwable throwable) {
    String timeStamp = LOG_TIME_FORMAT.format(Calendar.getInstance().getTime());

    try {
        writer.write(String.format(LOG_FORMAT, timeStamp, Process.myPid(), Process.myTid(), pkgName, level, tag));
        writer.write(msg);
        writer.newLine();
        writer.flush();
        osWriter.flush();
        fos.flush();
        if (throwable != null)
            saveCrash(throwable);
    } catch (IOException e) {
        e.printStackTrace();
    }
}

/**
    * 保存异常
    *
    * @param throwable
    * @throws IOException
    */
private static void saveCrash(Throwable throwable) throws IOException {
    StringWriter sWriter = new StringWriter();
    PrintWriter pWriter = new PrintWriter(sWriter);
    throwable.printStackTrace(pWriter);
    Throwable cause = throwable.getCause();
    while (cause != null) {
        cause.printStackTrace(pWriter);
        cause = cause.getCause();
    }
    pWriter.flush();
    pWriter.close();
    sWriter.flush();
    String crashInfo = writer.toString();
    sWriter.close();
    writer.write(crashInfo);
    writer.newLine();
    writer.flush();
    osWriter.flush();
    fos.flush();
}
```

保存的日志内容如下：

```
08-14 17:15:03.665 24152-24152/com.flueky.app D/TAG:838E512687D20F6B40409A2E3A7B24156774F47C
```

## 5 组件初始化

1.  传入上下文是为了获取程序包名和程序的外部缓存目录：`/sdcard/Android/data/包名/`。这里的日志文件保存目录是：`/sdcard/Android/data/包名/log/日志文件`。
2.  isWriter 标记是否需要保存日志内容至文件。
3.  level设置日志输出级别。当level 等于CLOSE时，不输出日志也不保存至文件。

```Java
/**
    * 日志组件初始化
    *
    * @param appCtx   application 上下文
    * @param isWriter 是否保存文件
    * @param level    日志级别
    */
public static final void initialize(Context appCtx, boolean isWriter, Level level) {
    currentLevel = level;
    if (level == Level.CLOSE) {
        isWriter = false;
        return;
    }
    Logger.isWriter = isWriter;
    if (!Logger.isWriter) {//不保存日志到文件
        return;
    }
    String logFoldPath = appCtx.getExternalCacheDir().getAbsolutePath() + "/../log/";
    pkgName = appCtx.getPackageName();
    File logFold = new File(logFoldPath);
    boolean flag = false;
    if (!(flag = logFold.exists()))
        flag = logFold.mkdirs();
    if (!flag) {
        Logger.isWriter = false;
        return;
    }
    logFilePath = logFoldPath + FILE_NAME_FORMAT.format(Calendar.getInstance().getTime()) + ".log";
    try {
        File logFile = new File(logFilePath);
        if (!(flag = logFile.exists()))
            flag = logFile.createNewFile();
        Logger.isWriter = isWriter & flag;
        if (Logger.isWriter) {
            fos = new FileOutputStream(logFile);
            osWriter = new OutputStreamWriter(fos);
            writer = new BufferedWriter(osWriter);
        }
    } catch (IOException e) {
        e.printStackTrace();
        Logger.isWriter = false;
    }
}
```
