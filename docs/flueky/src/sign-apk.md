---
title:  "签名apk文件"
date:   2019-05-27 22:27:39 +0800
categories: 
    - Android
---

## 1. apksigner

google 官方提供的 apk 文件签名工具。支持 V1 和 V2 签名规则。

1. V1是对 apk 中每个文件进行签名校验。使用 V1 规则的 apk  在解压之后二次打包压缩后可以安装。
2. V2是在 V1 的基础上，对 apk 文件进行校验。因此，使用 V2 规则的 apk  在解压之后二次打包压缩后无法安装。

**因此，在签名时，只能选择 V1 或 V1+V2,不能只选择 V2 。**

### 1.1. 签名

使用命令 `apksigner sign` 对 apk 文件进行签名。

常用参数有：

**--in** 指定待签名 apk 文件的路径。<br/>
**--out** 指定签名后的 apk 文件路径。**可以同 --in 一样，可以不用。**

**可以在全部命令的最后指定待签名的 apk 路径。--in --out 即都指向该路径。**

**--v1-signing-enabled** 使用 true false 指定是否使用 v1 规则签名。<br/>
**--v2-signing-enabled** 使用 true false 指定是否使用 v2 规则签名。

**--debuggable-apk-permitted** 使用 true false 指定是否允许对测试 apk 文件进行签名，默认是允许。但是官方不建议使用生产签名文件对测试 apk 文件进行签名。

**--ks** 指定 keystore 的路径。<br/>
**--ks-pass** 指定 keystore 的密码。如： pass:password。 password 是签名文件密码。<br/>
**--ks-key-alias** 指定使用的签名文件别名，通常一个签名文件可以包含多个别名。签名文件中只包含一个别名时，可以不使用。<br/>
**--key-pass** 指定别名 key 的密码。如： pass:password。 password 是签名文件密码。

以上是使用 keystore 对 apk 签名。apksigner 还支持更多种方式，如：私钥文件、JCA Providers 对 apk 签名。

```shell
apksigner sign --ks debug.keystore 
```

### 1.2. 校验

使用 `apksigner verify` 校验已签名的 apk 文件。包括查看签名方式和使用的证书信息。

常用参数有：

**-v** 显示签名详情，是否使用 v1 、v2 签名。

**--in** 指定待校验的 apk 文件路径。当 apk 路径放在命令末尾时，此参数可以省略。

**--print-certs** 显示 apk 文件中包含的签名文件证书信息。

```shell
# 示例 1
apksigner verify --in app-release.apk -v -print-certs
# 示例 2
apksigner verify -v -print-certs app-release.apk
```


## 2. jarsigner

是 jdk 提供的对 jar 文件的签名工具。

### 2.1. 签名

使用命令 `jarsigner [options] jar-file alias` 对 apk 文件 签名 。其中 jar-file 对应 apk 文件路径，alias 对应 签名文件中的别名。 options 常用参数如下：

**-keystore** 指定使用的签名文件的路径。

**-storepass** 指定使用签名文件的密码。

**-keypass** 指定使用 alias 对应的密码。可以不使用，执行时手动输入。

**-signedjar** 指定签名后的 apk 的路径。

**-verbose** 输出详细的签名过程日志。

由于没有指定被签名 apk 文件的路径和使用的签名文件别名的参数，因此需要将这两个参数放在命令的最后。

```Shell
# 示例，如需添加  -verbose，请放在test.apk之前
jarsigner -keystore keystore -storepass password -signedjar signed.apk test.apk keyalias.
```

### 2.2. 校验

使用命令  `jarsigner -verify [options] jar-file [alias...]`

**-verbose** 输出详细的签名信息。
**-certs** 输出每个文件使用的签名证书。

```Shell
# 示例
jarsigner -verify -verbose -certs signed.apk
```

用上述命令只能检查 apk 中每个文件的签名情况，并不能获知使用的签名文件具体信息。建议使用 `apksigner` 命令或 `keytool` 命令。

```Shell
keytool -printcert -jarfile test.apk 
```

## 3. zipalign

是 zip 压缩包的一个对齐工具。对齐之后可以减少 app 运行时的内存消耗。

```Shell
# 对齐 apk 文件，并输出信息
zipalign -v 4 in.apk out.apk
# 检查 apk 文件的对齐信息
zipalign -c -v 4 out.apk
```

**由于 zipalign 命令是对 apk 文件进行修改，因此不适用于使用 V2 签名机制签名过的 apk 文件。因此建议先对齐，再签名。**
