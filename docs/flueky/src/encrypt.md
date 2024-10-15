---
title: "编码、摘要和加密（三）—— 数据加密"
date: 2019-04-30 14:09:40 +0800
category: 
 - 加密
 - 字节处理
tag:
 - aes
 - des
 - 3des
 - rsa
---

关于加密，此处没有更加通俗易懂的解释。与同是对于字节类型数据处理的编码和摘要对比：

1. 编码是可逆的，任何人只要知道编码规则，就能够进行解码。
2. 摘要是不可逆的，即使知道只要算法的实现原理，也很难还原出原数据。

<!-- more -->

加密是可逆的，但只知道加密算法并不能解密，还需要知道加密密钥。

接下来，将针对几个常见的加密算法：`DES`、`3DES`、`AES`、`RSA` 的 Java 实现及其相关进行介绍，由于之前实现过 `DES` 和 `AES` 算法，因此具体算法说明，后续有空会写到。

## 1. 相关概念

### 1.1 密钥

在代码实现的过程中，密钥即是 key 。使用对称加密算法时，加密和解密是同一个密钥。使用非对称加密算法时，加密和解密密钥不相同，区分为公钥（**public key**）和私钥（**private key**）。

见过把 `base64` 当做对称加密， `md5` 当做非对称加密，因此下面划重点：

1. 判别加密算法最直接的方式，是否需要密钥。
2. 对称加密和非对称加密区别在于，加解密是否是同一个key。
3. 对称加密算法效率优于非对称加密算法，建议用对称加密算法加密长数据，非对称加密算法加密端数据。

### 1.2 加密模式

加密模式主要体现在对称加密算法中。之前提到过，对称加密算法效率优，适合加密长数据。实际加密过程中，是将长数据划分成固定长度的若干块短数据进行加密操作。为防止暴力破解得出明文，因此衍生了四种加密模式。

#### 1.2.1 电子密码本模式

英译 **Electronic Code Book** ，简称 `ECB` 模式，最简单的加密模式。

1. 将长数据分割成固定长度的若干块。
2. 分别对每块数据用同一个密钥进行加密。
3. 将每块加密出来的密文合并拼接成最终的完整密文。

上述步骤存在一个严重的问题，如果有重复的明文块，那么加密出来的密文也重复。

#### 1.2.2 加密块链模式

英译 **Cipher Block Chaining** ，简称 `CBC`,基于 `ECB` 模式的改进版。
此处引入一个概念：初始化向量 **Initialization Vector** 简称 `IV` 。

1. 将长数据分割成固定长度的若干块。
2. 将前一块的密文与后一块明文进行异或，再用密钥进行加密。
3. 将每块加密出来的密文合并拼接成最终的完整密文。
4. **第一块明文没有密文与其异或，因此需要 IV 对其异或再用密钥加密。**

#### 1.2.3  加密反馈模式

英译 **Cipher Feedback Mode** ，简称 `CFB` 。

1. 将长数据分割成固定长度的若干块。
2. 将前一块密文使用密钥进行加密，再与后一块明文进行异或。
3. 将每块异或后的密文合并拼接成最终的完整密文。
4. **第一块明文需要与用密钥加密后的 IV 进行异或。**

#### 1.2.4 输出反馈模式

英译 **Output Feedback Mode** , 简称 `OFB` ，与 `CFB` 模式有些细小的区别。

1. 将长数据分割成固定长度的若干块。
2. 将前一块中间密文使用密钥进行加密得中间密文。中间密文与明文进行异或得密文。
3. 将每个中间密文与明文块异或后的密文进行合并拼接成最终的完整密文。
4. **第一块明文需要的中间密文是用密钥加密后的 IV 。**

**`CFB` 与 `OFB` 的区别在于中间密文和密文块的用法 。**

1. `CFB` 使用前一块的密文进行加密。
2. `OFB` 使用前一块的中间密文进行加密。

### 1.3 填充模式

分块加密的过程中，遇到不够整分的块。如，将 16 字节作为一个明文块。当加密 17 字节时，不够分成两块。此时需要对第二块明文进行填充。填充后的两个明文块各 16 字节共 32 字节后再进行加密操作。

后 15 字节的填充内容，需要取决于具体的填充模式。见后续 Java 代码实现中介绍。

## 2. 代码实现

Java 对加密部分做了比较完整的封装—— `Cipher`  类。

以下列举几个主要方法：
1. `getInstance` 获取 `Cipher` 对象，主要接收转换类型参数对象。转换类型参数分为 **算法** 和 **算法/模式/填充** 。
2.  `init` 初始化加密参数。包括指定加解密模式、密钥和初始化向量-`IV`。
3. `doFinal` 结束加密和解密操作，有多个重载方法，主要接收需要加密或解密的数据。

关于填充，之前简要介绍过。在 Java 代码中常见的填充模式是 `PKCS5Padding` 。还有一种模式 `NoPadding` 由于对明文长度有要求，不建议使用。其他填充模式未深入了解，暂不误导。

`PKCS5Padding` 指，需要填充多少字节，就填充多少个字节的数字。如 `DES` 算法要求每个明文块 8 字节，那么，加密 1 字节数据，需要填充 7 个字节，此时填充 7 个 7
。加密 7 字节数据，需要填充 1 个 1 。加密 8 字节数据时，为方便校验解密后的明文正确性，需要扩展成 16 字节数据，此时第二个明文块填充 8 个 8 。

### 2.1 DES

DES 全称 **Data Encryption Standard** ，数据加密标准算法。固定密钥 8 字节，64 位。每个明文块长度 8 字节。

`getInstance` 接收参数：*DES/ECB/PKCS5Padding* ，其中 `ECB` 表示加密模式，可以用上述的其他三个模式替换以及更多 JDK 支持的模式。`PKCS5Padding` 表示一种填充模式。

在使用 `CBC` 、 `CFB` 、 `OFB` 时，需要在 `init` 方法中指定 **IV** 。

```Java
private static final String KEY_ALGORITHM = "DES";
private static final String DEFAULT_CIPHER_ALGORITHM = "DES/ECB/PKCS5Padding";

public static final byte[] encrypt(byte[] data, byte[] key) {
    try {
        Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
        // 加密模式
        cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(key, KEY_ALGORITHM));
        return cipher.doFinal(data);
    } catch (Exception e) {
        e.printStackTrace();
    }
    return null;
}

public static final byte[] decrypt(byte[] data, byte[] key) {
    try {
        Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
        // 解密模式
        cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key, KEY_ALGORITHM));
        return cipher.doFinal(data);
    } catch (Exception e) {
        e.printStackTrace();
    }
    return null;
}
```

### 2.2 3DES

`3DES` 即使用 3 次 `DES` 算法。由于每个 `DES` 算法处理需要 8 字节密钥，因此 `3DES` 算法需要 24 字节密钥。

**需要注意，`3DES` 算法名称使用 `DESede` 或 `TripleDES`**。**e** 表示做 `DES` 加密操作，**d** 表示做 `DES` 解密操作。前者表示用 DES 连续做加密 、解密、加密操作，后者表示连续做三次加密操作。每次使用的密钥，分别是 24 字节密钥中不同的三段（前、中、后各8字节）。

>若使用 `DESede` 算法时 24 字节密钥中的前两段一样，该算法等同于 `DES` 算法使用第三段的 8 字节密钥。

填充相关同 `DES` 算法一样。

```Java
private static final String KEY_ALGORITHM = "DESede";
private static final String DEFAULT_CIPHER_ALGORITHM = "DESede/CBC/PKCS5Padding";
// 初始化向量
private static final String IV = "12345678";

public static final byte[] encrypt(byte[] data, byte[] key) {
    try {
        Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(key, KEY_ALGORITHM),new IvParameterSpec(IV.getBytes()));
        return cipher.doFinal(data);
    } catch (Exception e) {
        e.printStackTrace();
    }
    return null;
}

public static final byte[] decrypt(byte[] data, byte[] key) {
    try {
        Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key, KEY_ALGORITHM));
        return cipher.doFinal(data);
    } catch (Exception e) {
        e.printStackTrace();
    }
    return null;
}
```

### 2.3 AES

AES 全称 **Advanced Encryption Standard** ，高级加密标准算法，用于替代  `DES` 。

`DES` 只支持 8 字节密钥，`AES` 可以支持 16  字节、24 字节和 32 字节密钥。明文块长度也可以划分成 16 字节 、24 字节和  32 字节进行填充。

```Java
    private static final String KEY_ALGORITHM = "AES";
    private static final String DEFAULT_CIPHER_ALGORITHM = "AES/ECB/PKCS5Padding";

    public static final byte[] encrypt(byte[] data, byte[] key) {
        try {
            Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(key, KEY_ALGORITHM));
            return cipher.doFinal(data);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static final byte[] decrypt(byte[] data, byte[] key) {
        try {
            Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key, KEY_ALGORITHM));
            return cipher.doFinal(data);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
```

以上三种对称加密算法的 Java 代码实现基本一致。

### 2.4 RSA

RSA是1977年由罗纳德·李维斯特（Ron Rivest）、阿迪·萨莫尔（Adi Shamir）和伦纳德·阿德曼（Leonard Adleman）一起提出的非对称加密算法，因此使用他们 3 人姓氏首字母命名。

示例代码中的公钥和私钥是随机生成的密钥对，密钥对模长建议是 1024 或 2048，对应密文长度是 128 字节和 256 字节。**模长可以大于 2048 ， 越长越难破解，但是效率越低。** 实际应用中，建议将密钥对模长设置为 2048 并以文件的形式存储在终端。

```Java
private static PrivateKey privateKey;
private static PublicKey publicKey;
private static final String DEFAULT_CIPHER_ALGORITHM = "RSA";

static {

    KeyPairGenerator keyGener = null;
    try {
        keyGener = KeyPairGenerator.getInstance(DEFAULT_CIPHER_ALGORITHM);
        keyGener.initialize(1024);
        KeyPair keyPair = keyGener.generateKeyPair();
        privateKey = keyPair.getPrivate();
        publicKey = keyPair.getPublic();
    } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
    }
}

public static final byte[] encrypt(byte[] data) {
    try {
        Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        return cipher.doFinal(data);

    } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
    } catch (NoSuchPaddingException e) {
        e.printStackTrace();
    } catch (InvalidKeyException e) {
        e.printStackTrace();
    } catch (BadPaddingException e) {
        e.printStackTrace();
    } catch (IllegalBlockSizeException e) {
        e.printStackTrace();
    }

    return null;
}

public static final byte[] decrypt(byte[] data) {
    try {
        Cipher cipher = Cipher.getInstance(DEFAULT_CIPHER_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        return cipher.doFinal(data);

    } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
    } catch (NoSuchPaddingException e) {
        e.printStackTrace();
    } catch (InvalidKeyException e) {
        e.printStackTrace();
    } catch (BadPaddingException e) {
        e.printStackTrace();
    } catch (IllegalBlockSizeException e) {
        e.printStackTrace();
    }

    return null;
}
```
