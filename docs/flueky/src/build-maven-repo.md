---
title: "自建 Maven 仓库"
date: 2019-10-20 09:56:10 +0800
categoriy: 
 - 开发工具
tag: 
 - Maven
---

自从公司使用 Maven 仓库管理代码后，一直想着有一个自己的代码仓库。虽然写的代码不多，但是不影响 Get 一项新技能。

<!-- more -->

## 1. 集成 Maven

由于本人是做 Android 开发，于是通过集成 Maven 的 Gradle 插件，生成对应的 `aar` 和 `jar` 库。

在 Module 的 build.gradle 中，集成配置如下：
、
```Gradle
// 使用 Maven 插件
apply plugin: 'maven'

// 远程库名称通常由三部分构成 ，groupId:artifactId:version
// 定义 group
group = 'com.flueky'
// 定义 version
version = '1.0.0' // 指定版本
// artifactId 默认使用 module name

// 以上两个配置也可以在下面的 deployer 中定义

// 下面定义三种不同的 maven 仓库地址
// 1. 计算机中，用户目录下
def localMavenRepo = 'file://' + new File(System.getProperty('user.home'), '.m2/repository').absolutePath
// 2. 工程目录下 等同 uri('../repository')
def projectMavenRepo = 'file://' + rootDir.getAbsolutePath() + '/repository' 
// 3. 自建的 Maven 私服上
def nexusMavenRepo = 'http://127.0.0.1:9000/repository/android/'
// 下面是 Maven 私服的用户名和密码，上传时需要
def nexusUserName = 'admin'
def nexusPassword = 'admin123'

uploadArchives {
    repositories.mavenDeployer {
        // 指定导出到的仓库地址，三个任选一个
        repository(url: localMavenRepo)
        repository(url: projectMavenRepo)
        repository(url: nexusMavenRepo) {
            // 需要授权用户名和密码
            authentication(userName: nexusUserName, password: nexusPassword)
        }
        // 下面三个定义的常量可以复写上面已定义的值
        pom.groupId = "com.flueky"// 唯一标识（通常为模块包名，也可以任意）
        pom.artifactId = "maven-test" // 项目名称（通常为类库模块名称，也可以任意）
        pom.version = "1.0.0" // 版本号
    }
}
```

配置好上述代码后，生成 `aar` 或 `jar` 是由 Module 类型决定。

```Gradle
// 生成 aar
apply plugin: 'com.android.library'
// 生成 jar
apply plugin: 'java'
```

已本地私服为例，最终导出的远程库结构如下：

<img src="/assets/image/025/2.png" width="300"/>

## 2. 导出到 Maven

配置完成后，即可在 Gradle 任务中查看。

<img src="/assets/image/025/1.png" width="250"/>

点击 `uploadArchives` 即可完成导出。之后在对应的目录下查看。

## 3. 使用 Maven 仓库

针对前面配置的三种仓库地址，使用时需要分别作配置。

```Gradle
allprojects {
    repositories {
        // 本地仓库
        mavenLocal()
        // 本地服务器
        maven {
            // 如果 nexus 私服具备匿名访问权限，无须配置用户名密码，
            // 具备上传权限的用户名和密码通常不开放使用。
            credentials {
                username "flueky"
                password "123456"
            }
            url 'http://127.0.0.1:9000/repository/android/'
        }
        // 工程目录仓库
        maven { url 'file://' + rootDir.getAbsolutePath() + '/repository/' }
    }
}
```

最后添加依赖。

```Gradle
dependencies {
    implementation 'com.flueky:maven-test:1.0.0'
    implementation 'com.flueky:lib-test:1.0.0'
}
```

**最后，如何搭建 Maven 私服，没做介绍，主要是我也才上手，搭建私服，推荐使用 nexus 。**

[源码地址](https://github.com/flueky/Flueky-Sample/tree/master/maven-sample)
