---
title: "编码、摘要和加密（二）—— 信息摘要"
date: 2019-04-29 20:52:06 +0800
category: 
 - 字节处理
tag:
 - md5
 - sha1
 - sha256
---

信息摘要，英译 **Message Digest** 。看见首字母这么大的 `M` 、`D`有没有立即联想到 `MD5` 算法。其实 `MD5`算法只是目前比较流行的信息摘要算法，在它之前，还出现过 `MD2` `MD4`,以及目前仍然在用的安全散列算法（**Secure Hash Algorithm**） `SHA1` 和 `SHA256`都属于信息摘要算法的一种。

<!-- more -->

国家密码管理局于2010年12月也发布了一种信息摘要算法 `SM3` 。

由于对信息摘要算法研究并不透彻，因此这篇文章将重点讲 jdk 支持的三个常见摘要算法的使用：`MD5`、`SHA1`、`SHA256`。


## 1. 相关代码

Java 对信息摘要算法做了比较完整的封装——`MessageDigest`。该类是抽象类，针对具体信息摘要算法的实现使用了代理模式。主要提供了三个方法及其重载方法。

```Java
/**
 * 获取摘要算法对象。
 * 通过指定参数 algorithm 是 MD5 SHA1 SHA256 ,获取具体的实例。
 */
static MessageDigest getInstance
/**
 * 接收参与摘要计算的字节数据，可多次执行。一般用于文件的的摘要计算。
 * 也可以一次将文件的全部字节读取至内存，使用 digest 方法一次计算。
 */
void update
/**
 * 具有两种使用场景。
 * 1. 在 update 方法接收全部的字节数据之后，使用此方法生成摘要数据。
 * 2. 直接使用此方法接收较短的字节数据，生成摘要数据。
 */
byte[] digest
```

## 2. 用途

### 2.1 计算字符串

用于校验报文数据在网络传输的过程中是否被篡改过。

以 MD5 算法为例：

```Java
/**
 * 计算字符串md5
 *
 * @param data
 * @return
 */
public static final String md5(String data) {
    try {
        MessageDigest messageDigest = MessageDigest.getInstance("MD5");
        byte[] digest = messageDigest.digest(data.getBytes());
        return HexUtil.encode(digest);
    } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
    }
    return null;
}

```

### 2.2 计算文件

通过网络下载一些文件的时候，通常通过计算下载下来文件的 MD5 和 SHA1 判断下载下来的文件是否在传输过程中被篡改过。

以 MD5 算法为例：

```Java
/**
 * 计算文件md5
 *
 * @param data
 * @return
 */
public static final String fileMd5(String path) {
    try {
        MessageDigest messageDigest = MessageDigest.getInstance("MD5");
        File file = new File(path);
        if (!file.exists())
            throw new IllegalArgumentException("The file path is illegal");
        InputStream inputStream = new FileInputStream(file);
        byte[] buff = new byte[1024];
        int len;
        while ((len = inputStream.read(buff)) > 0) {
            messageDigest.update(buff, 0, len);
        }
        byte[] digest = messageDigest.digest();
        return HexUtil.encode(digest);
    } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
    return null;
}
```

如需计算 SHA1 和 SHA256 ，只需将 `getInstance` 的参数值改成 **SHA-1** 和 **SHA-256**。

## 3. 总结

千万不要认为 `MD5` 是加密算法。信息摘要算法，是一种单向散列算法，是一种不可逆的算法，即，可以根据一个字符串计算出 `MD5`，却不能根据 `MD5` 还原出生成它的字符串。
