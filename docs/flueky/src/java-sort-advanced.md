---
title: "Java中的排序——高级用法"
date: 2017-10-29 11:02:33 +0800
category: 
 - Java
tag:
---

上一篇文章中提到，怎样造一个轮子既适用于文件的排序又适用于商品的排序。Java给我们提供了两个很强大的功能：反射、注解。

<!-- more -->

思路：用注解声明对象属性的排序要求，再用反射获取到对象属性的值，进行排序比较。

## 1 定义排序注解类

```Java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Sort {

    /**
     * 排序类型，默认升序
     *
     * @return
     */
    int sortType() default CommonComparator.SORT_TYPE_ASC;

    /**
     * 排序优先级，值越大，优先级越高
     *
     * @return
     */
    int priority() default 0;
}
```

> `Sort`类有两个属性：`sortType`定义字段的排序类型，默认升序， `priority`自定字段的排序优先级。多个字段进行关联排序时，未定义优先级或者优先级相同的两个字段按照该字段在类中定义的顺序进行优先级排序。

单从注解的定义上看，有可能觉得想的太简单的。在介绍`CommonComparator`之前（这里的`CommonComparator`是重新定义的），先看下怎么用在File类中，以及对File进行排序：

```Java
private static final class File {
    String name;
    @Sort(sortType = CommonComparator.SORT_TYPE_DES)
    String type; //类型降序
    long size;
    @Sort(sortType = CommonComparator.SORT_TYPE_ASC)
    long createTime; //创建时间升序

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

排序结果：

```Java
qq exe 10000 242434235
wxin exe 10000 24243424
picture png 100 111111
qqExter txt 1000 24243455

对文件类型降序、创建时间升序排序:
qqExter txt 1000 24243455
picture png 100 111111
wxin exe 10000 24243424
qq exe 10000 242434235
```

由此可见，不仅是想的太简单了，用起来也很简单。

## 2 定义通用排序器

通用排序器用来排序被`Sort`定义过的对象属性。因此，需要通过对象类型解析对象的属性字段，获取定义的排序信息和对象的属性值。

```Java
public final class CommonComparator<T> implements Comparator<T> {

    public static final int SORT_TYPE_ASC = 0;//升序
    public static final int SORT_TYPE_DES = 1;//降序
    public static final int SORT_TYPE_INV = -1;//不合法类型
    
    //需要排序的字段，已按照优先级保存
    private List<SortField> sortFileds = new ArrayList<SortField>();

    /**
     * 通用排序器的构造函数
     *
     * @param clazz
     */
    public CommonComparator(Class<T> clazz) {
        initSortClass(clazz);
    }

    /**
     * 解析被排序的类型字段，并按照优先级顺序保留在List中
     * @param clazz
     */
    private void initSortClass(Class<T> clazz) {

        /**
         * 获取类中所有的字段
         */
        Field[] fields = clazz.getDeclaredFields();

        for (int i = 0; fields != null && i < fields.length; i++) {
            Field field = fields[i];
            if (!field.isAnnotationPresent(Sort.class))
                continue;
            //用排序注解申明过的字段解析出排序信息
            Sort sort = (Sort) field.getAnnotation(Sort.class);
            int sortType = sort.sortType();
            int priority = sort.priority();
            
            //分装待排序字段，用于后面按照优先级进行排序
            SortField sortField = new SortField(field, priority, sortType);
            sortFileds.add(sortField);
        }

        //根据字段优先级属性排序待排序字段
        Collections.sort(sortFileds);
    }
    @Override
    public int compare(T o1, T o2) {
        for (SortField sortField : sortFileds) {
        //根据字段优先级顺序，逐个字段排序
            Field field = sortField.getField();
            int sortType = sortField.getSortType();
            try {
                Object value1 = field.get(o1);
                Object value2 = field.get(o2);
                //属性值相等，排序下个字段
                if (compareValue(value1, value2) == 0)
                    continue;
                
                if (sortType == SORT_TYPE_ASC) {//升序排序    
                    return compareValue(value1, value2);
                } else { //降序排序
                    return compareValue(value2, value1);
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }

        return 0;
    }

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
}
```

> `compareValue`方法在前一篇文章中用到，`compare`方法逐个对比要排序的属性，`initSortClass`解析被排序类型中，用`Sort`注解定义的字段。

这里用到一个`SortField`类，是对待排序字段的分装，该类实现`Comparable`接口，按照优先级进行排序。

```Java
/**
 * 排序字段信息保存，并定义排序方法
 */
class SortField implements Comparable<SortField> {

    private Field field;
    private int priority;
    private int sortType;

    public SortField(Field field, int priority, int sortType) {
        this.field = field;
        this.priority = priority;
        this.sortType = sortType;
    }

    public Field getField() {
        return field;
    }

    public int getSortType() {
        return sortType;
    }

    @Override
    public int compareTo(@NonNull SortField o) {
        return o.priority - this.priority;
    }
}
```

### 2.1 测试代码

```Java
public static final void main(String[] args) {
    List<File> files = new ArrayList<>();

    files.add(new File("qq", "exe", 10000, 242434235));
    files.add(new File("wxin", "exe", 10000, 24243424));
    files.add(new File("picture", "png", 100, 111111));
    files.add(new File("qqExter", "txt", 1000, 24243455));
    System.out.println("原始数据:");
    for (File f : files)
        System.out.println(f);

    Collections.sort(files,new CommonComparator<File>(File.class));

    System.out.println();
    System.out.println();
    System.out.println("对文件类型降序、创建时间升序排序:");
    for (File f : files)
        System.out.println(f);
}
```

### 2.2 扩展

还是之前的问题，要对文件名称、类型、大小、创建（修改）时间进行排序，上一篇文章中使用的方法是定义四个排序器。那么在这里怎样对四个属性分别进行排序呢？

解决方法也很简单，在`Sort`注解中定义`id`属性。

```Java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Sort {

    /**
     * 定义字段id，大于零。排序时，可以根据id动态选择排序字段和排序类型。
     * @return
     */
    int id();

    /**
     * 排序类型，默认升序
     *
     * @return
     */
    int sortType() default CommonComparator.SORT_TYPE_ASC;

    /**
     * 排序优先级，值越大，优先级越高
     *
     * @return
     */
    int priority() default 0;
}
```

给File类的每个字段定义一个`id`值，**不能重复**。

```Java
private static final class File {
    @Sort(id = 1)
    String name;
    @Sort(id=2,sortType = CommonComparator.SORT_TYPE_DES)
    String type;
    @Sort(id = 3)
    long size;
    @Sort(id=4,sortType = CommonComparator.SORT_TYPE_ASC)
    long createTime;

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

最后在通用排序其中，添加根据 `id` 解析 待排序字段。

```Java
/**
    * 通用排序器的构造函数
    *
    * @param clazz
    * @param ids   根据字段id动态指定排序字段。默认升序，降序需将 id 乘 -1。根据id先后顺序定义优先级
    */
public CommonComparator(Class<T> clazz, int[] ids) {

    initSortClass(clazz, ids);
}

/**
    * 初始化待排序的类
    *
    * @param clazz
    * @param ids   指定排序id
    */
private void initSortClass(Class<T> clazz, int[] ids) {

    if (ids == null) {
        initSortClass(clazz);
        return;
    }

    Field[] fields = clazz.getDeclaredFields();

    for (int i = 0; fields != null && i < fields.length; i++) {
        Field field = fields[i];
        if (!field.isAnnotationPresent(Sort.class))
            continue;

        Sort sort = (Sort) field.getAnnotation(Sort.class);
        int id = sort.id();
        int sortType = SORT_TYPE_INV;
        int priority = -1;
        for (int j = 0; j < ids.length; j++) {
            if (id == Math.abs(ids[j])) {
                sortType = ids[j] > 0 ? SORT_TYPE_ASC : SORT_TYPE_DES;
                priority = ids.length - j;
                break;
            }
        }
        if (sortType == SORT_TYPE_INV || priority == -1)
            continue;
        SortField sortField = new SortField(field, priority, sortType);
        sortFileds.add(sortField);
    }

    //根据字段优先级属性排序待排序字段
    Collections.sort(sortFileds);
}
```

测试代码：

```Java
Collections.sort(files,new CommonComparator<File>(File.class),new Int[]{1});
```
