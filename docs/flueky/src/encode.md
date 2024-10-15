---
title: "编码、摘要和加密（一）—— 字节编码"
date: 2019-04-28 21:57:06 +0800
category: 
 - 字节处理
tag:
 - 16进制
 - base64
---

之所以取这个题目，是因为在面试的过程中，许多求职者对问题“请列举常用的加密算法”给出了比较普遍的回答：“用过 `MD5` 和 `Base64` ”，更有甚者说，“ `Base64` 是对称加密， `MD5` 是非对称加密”。

<!-- more -->

那么，通过接下来的三篇文章科普下，在编程过程中常见的三个术语：**字节编码** 、**信息摘要**、 **数据加密**。

## 1. 编码介绍

在计算机领域，数据存储单位叫字节——byte，最小的存储单元的容量是1位-1bit。一个bit有两个状态 0 和 1。1byte = 8bit。通常，一个英文字母占1字节，汉字采用GBK编码时，占用2字节。**UTF-8是可变长度编码，一般用 0-4 字节表示。**

以上介绍，仅局限于计算机可以显示在屏幕上的字符。但是 1byte 通常可表示 256 个不同的数据。二进制表示：00000000-11111111，即 2^8 。根据 ASCII 中显示，可见字符不足 100 个。若想完整的显示 1byte 表示的全部内容，需要对其进行编码。通常使用16进制的方式，0x00-0xFF。0x31 表示字符 '1' ，0x01 表示字母 1，0x41 表示 'A' ,0x61 表示 'a' 。不再一一列举，有兴趣的小伙伴可以查阅 ASCII 码表。

## 2. 十六进制编码

### 2.1 概念

16进制编码，是基于2进制转换的过程。下表列举些常见的数值编码及其意义。

|十进制|2进制|16进制|意义|
|:--:|:--:|:--:|:--:|
|0|00000000|0x00|null|
|1|00000001|0x01|1|
|49|00110001|0x31|'1'|
|65|01000001|0x41|'A'|
|97|01100001|0x61|'a'|

此处，需要引入一个概念——基数。2 进制基数：0、1。10进制基数：0-9。16进制基数0-9，A-F。**通过观察表示一串内容的基数，可以快速判断它使用的编码方式哦！**

下表表示16进制基数与10进制、2进制的关系。均用 1byte 表示。

|16进制|10进制|2进制|
|:--:|:--:|:--:|
|0x00|0|00000000|
|0x01|1|00000001|
|0x02|2|00000010|
|0x03|3|00000011|
|0x04|4|00000100|
|0x05|5|00000101|
|0x06|6|00000110|
|0x07|7|00000111|
|0x08|8|00001000|
|0x09|9|00001001
|0x0A|10|00001010|
|0x0B|11|00001011|
|0x0C|12|00001100|
|0x0D|13|00001101|
|0x0E|14|00001110|
|0x0F|15|00001111|

不难发现，16进制用 4bit 表示一个基数（16 = 2^4）。

### 2.2 换算

将数字 100 转成 16进制表示：

计算方式比较简单，对 100 用 16 进行取整取余。发现 100 = 6 * 16 + 4。即，100 = 0x64。再转成2进制，分别对 6 和 4 转成 4bit 0和1 表示。0110 0100。

所以 100 = 0x64 = 01100100

### 2.3 代码实现

根据上一节的换算规则：

1. 将字节数组转16进制字符串，需要对每个字节进行独立运算。分别取高四位和第四位，然后转成两个10进制数作为基数索引，最后组合成16进制表示。
2. 将16进制字符串转成字节数组，需要每两个16进制基数一组。分别找出其表示的10进制数，然后做高四位和第四位相加。

```Java
/**
 * 16 进制基数
 */
static char[] hex = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};

/**
 * 编码：字节数组转 16 进制字符串
 *
 * @param data
 * @return
 */
public static final String encode(byte[] data) {
    if (data == null)
        return null;

    StringBuffer hexSrtBuff = new StringBuffer();
    for (byte b : data) {
        int height = b >> 4 & 0x0f; // 取高四位
        int low = b & 0x0f;// 取低四位
        hexSrtBuff.append(hex[height]);
        hexSrtBuff.append(hex[low]);
    }
    return hexSrtBuff.toString();
}

/**
 * 解码：16 进制字符串转字节数组
 *
 * @param hexStr
 * @return
 */
public static final byte[] decode(String hexStr) {
    if (hexStr == null)
        return null;
    if (hexStr.length() % 2 != 0) { // 不合法的十六进制字符串参数
        throw new IllegalArgumentException("The hex string was illegal");
    }
    byte[] data = new byte[hexStr.length() / 2];
    for (int i = 0; i < hexStr.length(); i += 2) {
        char h = hexStr.charAt(i);
        char l = hexStr.charAt(i + 1);
        int height = (h >= hex[10] && h <= hex[15]) ? (h - hex[10] + 10) : (h - hex[0]);
        int low = (l >= hex[10] && l <= hex[15]) ? (l - hex[10] + 10) : (l - hex[0]);
        data[i / 2] = (byte) ((height << 4) + (low & 0x0f));
    }
    return data;
}
```

## 3. Base64 编码

上一节介绍了16进制的编码规则和代码实现。不难发现，做一次16进制编码时候，所需的存储空间翻一倍。这虽然方便计算机显示，可以用于网络通信，但耗费的存储空间和传输效率都将减半。因此，base64编码诞生。（楼主瞎编，base64编码是否因此诞生，没做考究）。

### 3.1 概念

base64 一共有 64 个基数。每个基数占 6bit（64 = 2^6）。

|索引|基数|索引|基数|索引|基数|索引|基数|
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
|0|A|16|Q|32|g|48|w|
|1|B|17|R|33|h|49|x|
|2|C|18|S|34|i|50|y|
|3|D|19|T|35|j|51|z|
|4|E|20|U|36|k|52|0|
|5|F|21|V|37|l|53|1|
|6|G|22|W|38|m|54|2|
|7|H|23|X|39|n|55|3|
|8|I|24|Y|40|o|56|4|
|9|J|25|Z|41|p|57|5|
|10|K|26|a|42|q|58|6|
|11|L|27|b|43|r|59|7|
|12|M|28|c|44|s|60|8|
|13|N|29|d|45|t|61|9|
|14|O|30|e|46|u|62|+|
|15|P|31|f|47|v|63|/|

### 3.2 换算

根据上表的索引关系，试换算几个案例。

1. 字符 1

    10进制表示 49 。<br/>
    16进制表示 0x31。<br/>
    2进制表示 00110001。<br/>

    一共8位 ，不能被6位整除，因此不足位补 0。<br/>
    补充后12位  001100 010000。<br/>
    对应 base64 索引 12 16。<br/>
    base64  MQ==<br/>

    **对补位的00，需要用 = 标记。**<br/>

2. 字符串 1A

    10进制表示 49 65。<br/>
    16进制表示 0x31 0x41。<br/>
    2进制表示  00110001 01000001。<br/>
    
    一共16位，不能被6位整除，因此不足位补 0。<br/>
    补充后18位 001100 010100 000100。<br/>
    对应 base64 索引 12 20 4。<br/>
    base64 MUE=<br/>

3. 字符串 1Aa

    10进制表示 49 65 97。<br/>
    16进制表示 0x31 0x41 0x61。<br/>
    2进制表示 00110001 01000001 01100001。<br/>

    一共24位，可以被6位整除，因此不需补位。<br/>
    划分后24位 001100 010100 000101 100001。<br/>
    对应 base64 索引 12 20 5 33。<br/>
    base64 MUFh<br/>


根据上面的换算得出，base64 编码后的字符串长度一定是4的整数倍。也许1 2 字节的数据使用 base64 编码后并不能体现出它的优势。但是对100字节的数据编码：

1. 16进制编码
    
    编码后长度：100 * 2 = 200。

2. base64 编码 

    编码后长度 ⌈100 / 3⌉ * 4  =  34 *4 = 136。

### 3.3 代码实现

考虑到补位场景，因此实现较为复杂。可供编程语言入门时，练手使用。

```Java
/**
 * base 64 基数：26个大写字母、26个小写字母、10个阿拉伯数字、'+、'/'
 */
static char[] base64 = {
        'A', 'B', 'C', 'D', 'E', 'F', 'G',
        'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g',
        'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        , '+', '/'
};

/**
 * 编码：字节数组转 base64
 * <p>
 * 字符 '1' 二进制：00110001 转base64后 001100 010000 补充 两个等号
 *
 * @param data
 * @return
 */
public static final String encode(byte[] data) {
    if (data == null)
        return null;
    StringBuffer base64StrBuff = new StringBuffer();
    int leftBit = 0; //保存剩余字节
    int index = 0;
    int num;
    for (index = 0; index < data.length; index++) {
        switch (index % 3) {
            case 0:
                num = data[index] >> 2 & 0x3f;  // 取前六位
                leftBit = data[index] & 0x03; // 保留后两位
                base64StrBuff.append(base64[num]);
                break;
            case 1:
                num = (leftBit << 4 & 0x30) + (data[index] >> 4 & 0x0f); // 取前4位 与之前的后两位相加
                leftBit = data[index] & 0x0f; // 保留后四位
                base64StrBuff.append(base64[num]);
                break;
            case 2:
                num = (leftBit << 2 & 0x3c) + (data[index] >> 6 & 0x03); // 取前两位 与之前的后四位相加
                leftBit = data[index] & 0x3f;// 保留后六位
                base64StrBuff.append(base64[num]);
                base64StrBuff.append(base64[leftBit]);
                leftBit = 0;
                break;
        }
    }
    /**
     * 对剩余位做补位处理，并用等号标记
     */
    switch (index % 3) {
        case 0:
            break;
        case 1:
            base64StrBuff.append(base64[leftBit << 4 & 0x30]);
            base64StrBuff.append('=');
            base64StrBuff.append('=');
            break;
        case 2:
            base64StrBuff.append(base64[leftBit << 2 & 0x3c]);
            base64StrBuff.append('=');
            break;
    }

    return base64StrBuff.toString();
}

/**
 * 解码： base64 转字节数组
 *
 * @param base64Str
 * @return
 */
public static final byte[] decode(String base64Str) {
    if (base64Str == null)
        return null;
    if (base64Str.length() % 4 != 0)
        throw new IllegalArgumentException("thr base64 string was illegal");
    // 检查末尾等号的个数，
    int equalSignCount = 0;
    for (int i = base64Str.length() - 1; i > 0; i--) {
        if (base64Str.charAt(i) != '=') {
            break;
        }
        equalSignCount++;
    }
    // 转成字节数组的长度
    int bytesLen = base64Str.length() / 4 * 3 - equalSignCount;
    byte[] data = new byte[bytesLen];
    int index = 0;
    for (int i = 0; i < base64Str.length(); i += 4) {
        // 四个字节一组处理，转成三个字节
        int one = getCharIndex(base64Str.charAt(i));
        int two = getCharIndex(base64Str.charAt(i + 1));
        int three = getCharIndex(base64Str.charAt(i + 2));
        int four = getCharIndex(base64Str.charAt(i + 3));
        if (one < 0)
            break;
        int first = one << 2 & 0xfc;
        if (two < 0)
            break;
        first += (two >> 4 & 0x03);
        data[index++] = (byte) first;
        if (three < 0)
            break;
        int second = (two << 4 & 0xf0);
        second += (three >> 2 & 0x0f);
        data[index++] = (byte) second;
        if (four < 0)
            break;
        int third = (three << 6 & 0xc0);
        third += four;
        data[index++] = (byte) third;
    }
    return data;
}

/**
 * 寻找字符在字符串中的索引
 *
 * @param c
 * @return
 */
private static int getCharIndex(char c) {
    if (c >= 'A' && c <= 'Z')
        return c - 'A';
    else if (c >= 'a' && c <= 'z')
        return c - 'a' + 26;
    else if (c >= '0' && c <= '9')
        return c - '0' + 52;
    else if (c == '+')
        return 62;
    else if (c == '/')
        return 63;
    else
        return -1;

}
```

## 4. 总结

虽然 16 进制和 Base64 编码是可逆的，具备对应的解码操作，但他们却不是加密算法。加密算法一般需要使用密钥，只有正确的密钥，才能解密出正确的明文。
