---
title: "浅谈 Java 中的排序"
date: 2017-10-28 11:01:28 +0800
category: 
 - Java
tag:
---

进来不要失望，这不是一篇讲排序算法的文章。而是简要介绍 Java 中排序相关的类`Comparator`、`Comparable`以及`Collections.sort`的使用。

<!-- more -->

写程序分为10个阶段：使用轮子、造轮子。程序猿也分10种：懂二进制的和不懂二进制的。调侃结束，着重介绍怎么造排序这个轮子。

## 1 认识`Comparable`和`Comparator`

`Collections.sort`可以给集合排序，前提是你需要制定一个排序规则。这就有了如下两种实现方式。

- 使用`Comparator`给集合的item制定排序规则。
- 使集合的item类型实现`Comparable`接口，自己实现排序规则。

### 1.1 认识`Comparable`

给类 T 实现`Comparable`接口，需要重写`compareTo`方法。return 正数表示不交换，return 负数时，交换`this`和 `o`两个对象。

```Java
@Override
public int compareTo(@NonNull Object o) {
    ……
}
```

然后就可以给 T 的集合进行排序：

```Java
Collections.sort(List<T> items);
```

### 1.2 认识`Comparator`

`Comparable` 只能给类 T 制定一种排序规则，文件管理器中，通常可以按照文件名称、类型、大小、创建（修改）时间给文件列表进行排序。只使用`Comparable`显然不能满足上述需求。此时需要使用`Comparator`给类 T 定义特定规则的排序器。

同样需要重写 `compareTo`方法,return 正数表示不交换，return 负数时，交换`T1`和 `T2`两个对象。

```Java
@Override
public int compare(T o1, T o2) {
}
```

给集合 T 进行排序：

```Java
Collections.sort(List<T> items,Comparator<T>);
```

### 1.3 例子

声明一个文件类：

```Java
private static final class File {
    String name; //文件名称
    String type; //文件类型
    long size; //文件大小
    long createTime; //创建时间

    public File(String name, String type, long size, long createTime) {
        this.name = name;
        this.type = type;
        this.size = size;
        this.createTime = createTime;
    }

    @Override
    public String toString() {
        return name + " " + type + " " + size + " " + createTime;
    }
}
```

#### 1.3.1 使用`Comparable`

File 实现 `Comparable` 接口：

```Java
/**
    * 定义升序排序规则
    * @param o
    * @return
    */
@Override
public int compareTo(@NonNull Object o) {
    if (!(o instanceof File))
        return 0;
    File f = (File) o;
    /**
     * 字符串，只能逐个比较字符，不使用 hashCode
     * 是因为 "b".hashCode()<"aa".hashCode()。升序排序时，"b"在"aa"前
     */
    char[] chars1 = this.name.toString().toCharArray();
    char[] chars2 = f.name.toString().toCharArray();
    for (int i = 0; i < chars1.length && i < chars2.length; i++) {
        if (chars1[i] == chars2[i])
            continue;
        return chars1[i] - chars2[i];
    }
    //如果执行到这里，表示前面比对的都相等，直到一方先结束或同时结束
    return chars1.length - chars2.length;
}
```

#### 1.3.2 使用`Comparator`

给文件名定义排序器：

```Java
public static final class FileNameComparator implements Comparator<File> {
    /**
        * 定义降序序排序规则
        * @param o1
        * @param o2
        * @return
        */
    @Override
    public int compare(File o1, File o2) {
        char[] chars1 = o1.name.toString().toCharArray();
        char[] chars2 = o2.name.toString().toCharArray();
        for (int i = 0; i < chars1.length && i < chars2.length; i++) {
            if (chars1[i] == chars2[i])
                continue;
            return chars2[i] - chars1[i];//注意这里同上面的不一样
        }
        //如果执行到这里，表示前面比对的都相等，直到一方先结束或同时结束
        return chars1.length - chars2.length;
    }
}
```

#### 1.3.3 运行测试

```Java
public static final void main(String[] args) {
    List<File> files = new ArrayList<>();

    files.add(new File("qq", "exe", 10000, 242434234));
    files.add(new File("wxin", "exe", 10000, 24243424));
    files.add(new File("picture", "png", 100, 111111));
    files.add(new File("qqExter", "txt", 1000, 24243455));
    
    System.out.println("原始数据:");
    
    for (File f : files)
        System.out.println(f);

    System.out.println();
    System.out.println();

    System.out.println("使用Comparable给文件名升序排序:");
    Collections.sort(files);
    
    for (File f : files)
        System.out.println(f);

    System.out.println();
    System.out.println();

    System.out.println("使用Comparatore给文件名降序排序:");
    Collections.sort(files,new FileNameComparator());
    
    for (File f : files)
        System.out.println(f);
}
```

```
原始数据:
qq exe 10000 242434234
wxin exe 10000 24243424
picture png 100 111111
qqExter txt 1000 24243455


使用Comparable给文件名升序排序:
picture png 100 111111
qq exe 10000 242434234
qqExter txt 1000 24243455
wxin exe 10000 24243424


使用Comparatore给文件名降序排序:
wxin exe 10000 24243424
qq exe 10000 242434234
qqExter txt 1000 24243455
picture png 100 111111
```

## 2 高级用法

这节的名字取得很响亮，是否高级请在最后给出合理评价。

### 2.1 对单个字段排序

之前提到过，要对文件名、文件类型、文件大小、创建（修改）时间进行排序。就是说要写四个排序器，每个排序器使用升序、降序再定义不同的排序规则。想想都很累。贴上代码，具体排序规则不一一实现了。

```Java
/**
    * 专用比较名称
    */
public static final class FileNameComparator implements Comparator<File> {

    /**
        * 定义降序排序规则
        * @param o1
        * @param o2
        * @return
        */
    @Override
    public int compare(File o1, File o2) {
        char[] chars1 = o1.name.toString().toCharArray();
        char[] chars2 = o2.name.toString().toCharArray();
        for (int i = 0; i < chars1.length && i < chars2.length; i++) {
            if (chars1[i] == chars2[i])
                continue;
            return chars2[i] - chars1[i];
        }
        //如果执行到这里，表示前面比对的都相等，直到一方先结束或同时结束
        return chars1.length - chars2.length;
    }
}

/**
    * 专用比较类型
    */
public static final class FileTypeComparator implements Comparator<File> {

    @Override
    public int compare(File o1, File o2) {

        return 0;
    }
}

/**
    * 专用比较创建时间
    */
public static final class FileCreateTimeComparator implements Comparator<File> {

    @Override
    public int compare(File o1, File o2) {
        return 0;
    }
}

/**
    * 专用比较文件大小
    */
public static final class FileSizeComparator implements Comparator<File> {

    @Override
    public int compare(File o1, File o2) {
        return 0;
    }
}
```

> 有兴趣的可以自己实现排序规则，但我相信见识了后面的高级用法，你也懒得写了。想说，复制代码是很低能的行为，复用代码才算入门的程序猿，否则就是从事体力劳作的码农。

**对象比较，本质上是比较对象的各个属性，这些属性都应当是Java的基本数据类型。如果有基本数据类型之外的，如String，需要特殊处理。因此，我封装一个方法，专用比较基本数据类型和String。**

#### 2.1.1 介绍 hashCode

> 补充个基本常识，Java基本数据类型有：boolean、char、byte、short、int、long、double、float。好多人以为String也算，表示不理解。

下表列举出，基本数据类型的值和hash值之间的关系：

| 类型 | 值 | hash值 |
| :---: | :---: | :---: |
| byte | 0xFF | -1 |
| short | 128 | 128 |
| int | 65536 | 65536 |
| long | 1000000 | 1000000 |
| boolean | true | 1231 |
| char | a | 97 |
| float | 12.34f | 1095069860 |
| double | 3.141592654 | 341533867 |

String值和hash值的关系：

| 值 | hash值 |
| :---: | :---: |
| "a" | 97 |
| "aa" | 3104 |
| "b" | 98 |

基于上面的关系，封装下面的函数供使用：

```Java
/**
    * 对象比较，string对象比较字符，其余对象比较hash值
    *
    * @param value1
    * @param value2
    * @return
    */
private int compareValue(Object value1, Object value2) {
    if (value1 instanceof String) {
        /**
            * 字符串，只能逐个比较字符，不使用 hashCode
            * 是因为 "b".hashCode()<"aa".hashCode()。升序排序时，"b"在"aa"前
            */
        char[] chars1 = value1.toString().toCharArray();
        char[] chars2 = value2.toString().toCharArray();
        for (int i = 0; i < chars1.length && i < chars2.length; i++) {
            if (chars1[i] == chars2[i])
                continue;
            return chars1[i] - chars2[i];
        }
        //如果执行到这里，表示前面比对的都相等，直到一方先结束或同时结束
        return chars1.length - chars2.length;
    } else {
        return value1.hashCode() - value2.hashCode();
    }
}
```

> 不建议这里传入进本数据类型和String类型以外的类型，因为比较出来的结果可能出乎你意料。建议9个类型之外的类型比较，实现Comparable接口。

总不能，N个排序器 copy N次这个方法吧？别忘了咱的Java语言可是高级的面向对象编程语言。因此，抽象出一个通用的排序器：

#### 2.1.2 抽象通用排序器

```Java
public abstract class CommonComparator<T> implements Comparator<T> {

    /**
     * 对象比较，string对象比较字符，其余对象比较hash值
     *
     * @param value1
     * @param value2
     * @return
     */
    protected int compareValue(Object value1, Object value2) {
        if (value1 instanceof String) {
            /**
             * 字符串，只能逐个比较字符，不使用 hashCode
             * 是因为 "b".hashCode()<"aa".hashCode()。升序排序时，"b"在"aa"前
             */
            char[] chars1 = value1.toString().toCharArray();
            char[] chars2 = value2.toString().toCharArray();
            for (int i = 0; i < chars1.length && i < chars2.length; i++) {
                if (chars1[i] == chars2[i])
                    continue;
                return chars1[i] - chars2[i];
            }
            //如果执行到这里，表示前面比对的都相等，直到一方先结束或同时结束
            return chars1.length - chars2.length;
        } else {
            return value1.hashCode() - value2.hashCode();
        }
    }
}
```

使用这个通用排序器：

```Java
/**
    * 专用比较名称
    */
public static final class FileNameComparator extends  CommonComparator<File> {

    /**
        * 定义降序排序规则
        *
        * @param o1
        * @param o2
        * @return
        */
    @Override
    public int compare(File o1, File o2) {
        return compareValue(o1.name, o2.name)*-1;//乘以-1 表示降序排序
    }
}

/**
    * 专用比较类型
    */
public static final class FileTypeComparator extends  CommonComparator<File> {

    @Override
    public int compare(File o1, File o2) {
        return compareValue(o1.type, o2.type);
    }
}

/**
    * 专用比较创建时间
    */
public static final class FileCreateTimeComparator extends  CommonComparator<File> {

    @Override
    public int compare(File o1, File o2) {
        return compareValue(o1.createTime, o2.createTime);
    }
}

/**
    * 专用比较文件大小
    */
public static final class FileSizeComparator extends  CommonComparator<File> {

    @Override
    public int compare(File o1, File o2) {
        return compareValue(o1.size, o2.size);
    }
}
```

同样这方法也能用在 `Comparable` 中：

```Java
/**
    * 根据文件名定义升序排序规则
    *
    * @param o
    * @return
    */
@Override
public int compareTo(@NonNull Object o) {
    if (!(o instanceof File))
        return 0;
    return compareValue(this.name, ((File) o).name);
}
```

如果认为封装 `compareValue` 方法，就是所谓的高级方法，那就大错特错。面向对象语言中的继承和复用是最近基本的使用方法。而且，目前只讲了对单个字段进行排序。

别忘了，程序猿最大的敌人不是设计出让你难以实现的效果的美工，也不是一直不断挑你毛病的测试，而是自己都不知道想要什么的产品经理。因此，建议对朝令夕改的产品经理要拿一把刀砍死。

### 2.2 对多个字段关联排序

有一天，产品经理突发奇想，要对文件类型进行排序的同时还要按照创建（修改）时间进行升序排序。人总不能真砍死，万一领导都认同了这个需求，那程序猿只有认命的份。

针对这个需求，在不改变之前代码的前提下，有两种实现方式：

- 再使用个排序器，对文件类型和创建时间排序。

```Java
public static final class FileTypeAndCreateTimeComparator extends  CommonComparator<File> {

    @Override
    public int compare(File o1, File o2) {
        //先比较类型，类型一样再比较创建时间
        if(compareValue(o1.type, o2.type)==0)
            return compareValue(o1.createTime, o2.createTime);
        return compareValue(o1.type, o2.type);
    }
}

```

- 先对文件类型排序，后对创建时间排序。

```Java
Collections.sort(files, new FileTypeComparator());
Collections.sort(files, new FileCreateTimeComparator());
```

如此轻快的实现这个需求，当你也忍不住想端起咖啡庆祝下时，产品经理又来了。90% 的情况下没好事。小伙子干的不错，我这还有个电商的项目。要对商品的人气、销量、价格进行排序，帮我实现下吧。既然拒绝不了，那就只能继续copy代码了。

所谓的高级用法此时体现在这里：怎样造一个轮子，既满足上面的需求，又能满足商品的排序。

未完待续。
