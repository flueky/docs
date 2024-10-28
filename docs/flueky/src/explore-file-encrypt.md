---
title: "探索文件加解密"
date: 2019-05-09 21:05:40 +0800
category: 
 - 加密
---

这篇文章主要介绍加密算法的另一使用场景——文件加解密。事实上，已于 16 年实现过加密文件的功能并用于公司的项目中。确保安全的前提下，此次分享只介绍些简单的加密方法和实现过程。更高级深入的研究还请自行解决。

<!-- more -->

前面介绍了常见的加解密算法和 Java 语言的实现，使用场景一般是在数据通信领域的报文加密。还记的 **Alice** 与 **Bob** 这对 CP 组合么？

`DES` 、`AES` 算法将待加密的数据进行分块，以 8 字节、16 字节等其他划分方式进行分块加密操作最后合并成需要的明文。 `RSA` 算法建议只针对少量数据进行加密。当加密遇上文件时，只有对称加密算法更加适合。


##  1. 分析

文件加解密有三种使用场景，实现加密文件的难度递增。

1. 将文件一次解密读入内存或一次加密写入硬盘。
2. 边读文件边解密或边写文件边加密。
3. 对文件进行随机读写操作。

有三种加密方式可用：

1. **线性变换**，适用所有场景。
2. **奇偶置换**，适用于 1 和 2 ，勉强适用于 3 。
3. **分块加密**，适用月 1，勉强适用于 2，很难适用于 3 。

后面 分别介绍三种方式及应用到不同场景中的代码实现。

## 2. 线性变换

**线性变换**用于单字节处理，所以满足全部三种场景，可以简单地表示为 `y=f(x)` ，`x` 表示加密前的字节，`y` 表示加密后的字节。加密算法取决于 `f(x)` 的实现方式。最简单的如：`f(x)=(x+1)%256` ，破解的难度取决于函数 `f(x)` 的复杂度。

```Java
/**
 * 线性变换加密方式
 */
public class LinearChage {

    /**
     * 逐个字节处理
     *
     * @param b
     * @return
     */
    public byte encrypt(byte b) {
        return (byte) (b + 100);
    }

    /**
     * 逐个字节处理
     *
     * @param b
     * @return
     */
    public byte decrypt(byte b) {
        return (byte) (b - 100);
    }
}
```

重写相关的读文件流中 *read* 方法。

```Java
    @Override
    public int read() throws IOException {
        // 字节线性变换加密方式
        int b = super.read();
        if (b < 0) // 读到结尾，不处理
            return b;
        b = linearChage.decrypt((byte) b);
        return b;
    }

    @Override
    public int read(byte[] b) throws IOException {
        return this.read(b, 0, b.length);
    }

    @Override
    public int read(byte[] b, int off, int len) throws IOException {

        // 字节线性变换加密方式
        int length = super.read(b, off, len);
        if (length <=0) // 读到结尾或读完，不处理。
            return length;
        for (int i = off; i < off + length; i++) {
            b[i] = linearChage.decrypt(b[i]);
        }
        return length;
    }
```

重写相关的读文件流中 *write* 方法。

```Java
    @Override
    public void write(int b) throws IOException {
        // 字节线性变换加密方式
        b = linearChage.encrypt((byte) b);
        super.write(b);
    }

    @Override
    public void write(byte[] b) throws IOException {
        // 同带 off 的方法一起处理
        this.write(b, 0, b.length);
    }

    @Override
    public void write(byte[] b, int off, int len) throws IOException {
        // 字节线性变换加密方式
        for (int i = off; i < off + len; i++) {
            b[i] = linearChage.encrypt(b[i]);
        }
        super.write(b, off, len);
    }
```

## 3. 奇偶置换

**奇偶置换**用于交换相邻两个字节，比如，置换前是 “ab”，置换后是 “ba”，这种方式最大的弱点就是很容易被破解。因此建议同**线性变换**方式结合使用。勉强适用于 3 主要是因为，每次随机读写的位置不一定是奇数位。

```Java
/**
 * 奇偶位置换加密方式。
 * 加密、解密代码一致。
 */
public class OddExchange {

    /**
     * 记录遗留字节内容
     */
    private byte left;
    /**
     * 记录是否有遗留字节
     */
    private boolean hasLeft;

    .... getter setter方法

    /**
     * 加密交换
     *
     * @param data
     */
    public void encrypt(byte[] data, int off, int len) {
        for (int i = off; i < off + len; i += 2) {
            byte t = data[i];
            data[i] = data[i + 1];
            data[i + 1] = t;
        }
    }

    /**
     * 解密交换
     * @param data
     * @param off
     * @param len
     */
    public void decrypt(byte[] data, int off, int len) {
        for (int i = off; i < off + len; i += 2) {
            byte t = data[i];
            data[i] = data[i + 1];
            data[i + 1] = t;
        }
    }
}
```

重写相关的读文件流中 *read* 方法。

```Java
    @Override
    public int read() throws IOException {
        if (oddExchange.isHasLeft()) {
            oddExchange.setHasLeft(false);
            int b = oddExchange.getLeft();
            return b > 0 ? b : b + 256;
        } else { // 没有剩余字节，需要读取两次
            int b = super.read();
            if (b < 0) // 读到结尾，不处理
                return b;
            int next = super.read();
            if (next < 0) // 已是最后一个字节
                return b;
            byte[] data = new byte[2];
            data[0] = (byte) b;
            data[1] = (byte) next;
            oddExchange.decrypt(data, 0, data.length);
            oddExchange.setHasLeft(true);
            oddExchange.setLeft(data[1]);
            return data[0] > 0 ? data[0] : (data[0] + 256);
        }

    }

    @Override
    public int read(byte[] b) throws IOException {
        return this.read(b, 0, b.length);
    }

    @Override
    public int read(byte[] b, int off, int len) throws IOException {
        if (len % 2 == 0) { // 希望读取偶数长度
            int length = super.read(b, off, len);
            oddExchange.decrypt(b, off, length);
            if (oddExchange.isHasLeft()) { // 有剩余位
                byte t = b[off + length - 1];
                for (int i = off + length - 1; i > off; i--)
                    b[i] = b[i - 1];
                b[off] = oddExchange.getLeft();
                oddExchange.setLeft(t);
            }
            return length;

        } else { // 希望读取奇数长度
            if (oddExchange.isHasLeft()) { // 有剩余位少读 1 字节
                int length = super.read(b, off, len - 1);
                oddExchange.decrypt(b, off, length);
                for (int i = length; i > off; i--) {
                    b[i] = b[i - 1];
                }
                b[off] = oddExchange.getLeft();
                oddExchange.setHasLeft(false);
                return length + 1;
            } else { // 没有剩余位，多读一字节
                byte[] buff = new byte[len + 1]; // 存在越界的可能，所以new一个
                int length = super.read(buff);
                oddExchange.decrypt(buff, 0, length);
                for (int i = 0; i < length - 1; i++) {
                    b[i + off] = buff[i];
                }
                oddExchange.setLeft(buff[length - 1]);
                oddExchange.setHasLeft(true);
                return length - 1;
            }
        }
    }
```

重写相关的读文件流中 *write* 方法。注意，关闭文件流时，需要将未写入的字节补写。

```Java
    @Override
    public void write(int b) throws IOException {
        if (oddExchange.isHasLeft()) {// 有剩余的字节
            byte[] data = new byte[2];
            data[0] = oddExchange.getLeft();
            data[1] = (byte) b;
            oddExchange.setHasLeft(false);
            oddExchange.encrypt(data, 0, 2);
            super.write(data[0]);
            super.write(data[1]);
        } else { // 没有剩余字节，留作下次一道处理
            oddExchange.setLeft((byte) b);
            oddExchange.setHasLeft(true);
        }

    }

    @Override
    public void write(byte[] b) throws IOException {
        // 同带 off 的方法一起处理
        this.write(b, 0, b.length);
    }

    @Override
    public void write(byte[] b, int off, int len) throws IOException {
        if (len % 2 == 0) { // 偶数长度
            if (oddExchange.isHasLeft()) { // 有剩余字节
                byte t = oddExchange.getLeft();
                oddExchange.setLeft(b[off + len - 1]);
                for (int i = off + len - 1; i > off ; i--) {
                    b[i] = b[i - 1];
                }
                b[off] = t;

            }
            oddExchange.encrypt(b, off, len);
            super.write(b, off, len);

        } else { // 奇数长度
            if (oddExchange.isHasLeft()) { // 有剩余字节,需要同剩余字节拼接成偶数长度
                byte[] dest = new byte[off + len + 1];
                dest[off] = oddExchange.getLeft();
                oddExchange.setHasLeft(false);
                for (int i = off; i < off + len; i++) {
                    dest[i + 1] = b[i];
                }
                oddExchange.encrypt(dest, off, len+1);
                super.write(dest, off, len+1);
            } else { // 没有剩余字节，保留一个剩余字节
                oddExchange.encrypt(b, off, len - 1);
                oddExchange.setLeft(b[off + len - 1]);
                oddExchange.setHasLeft(true);
                super.write(b, off, len - 1);
            }
        }

    }

    @Override
    public void close() throws IOException {
        // 关闭流的时候检查是否有剩余字节未写入
        if (oddExchange.isHasLeft()) {
            write(oddExchange.getLeft());
            oddExchange.setHasLeft(false);
        }

        super.close();
    }
```

## 4. 分块加密

其实**奇偶置换**也是分块加密的一种特殊场景——块长等于 2 。因此只需要考虑到当前读写到是偶数位还是奇数位。熟悉的对称加密算法中，最短的分块长度是 8 。用于场景 1 不用多做考虑，场景 2 需要考虑之前已经读写的长度，若不是 8 的整数倍，需要特殊处理。至于场景 3 ，若您的生物 CPU 很强大，建议尝试下。

而且，使用分块加密不要使用 8 的整数倍块长，（不一定是 8 ，主要取决于你加密算法的块长），在使用不恰当的填充模式时，8 的整数倍块长加密后的数据会多 8 字节，加密前文件大小是 1M ，加密后就很可能变成 2M , 一般不被接受哈。

**该方案实现起来较为复杂，暂不提供代码解释。**