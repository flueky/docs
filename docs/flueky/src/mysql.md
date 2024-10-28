---
title: Mysql 简单入门
category:
 - MySQL
---

这篇文章简单介绍 Mysql 的安装与使用。建议通过 [Docker](https://www.docker.com/) 安装 MySQL, 并使用开源数据库管理软件 [DBeaver](https://dbeaver.io/) 。

<!-- more -->

## 安装 MySQL

[Docker Hub](https://hub.docker.com/_/mysql) 提供了各个版本的 MySQL。 直接使用 `docker run` 安装。

::: code-tabs

@tab Mac/Linux
```shell
docker run --restart=always --privileged=true \
  -v /opt/database/mysql/data:/var/lib/mysql \
  -p 3306:3306 --name mysql \
  -e MYSQL_ROOT_PASSWORD=admin123 -d mysql
```

@tab Windows
```cmd
docker run --restart=always --privileged=true \
  -v "D:\database\mysql\data":/var/lib/mysql \
  -p 3306:3306 --name mysql \
  -e MYSQL_ROOT_PASSWORD=admin123 -d mysql
```
:::

- 最后一个 `mysql` 表示 docker 镜像，等同于 `mysql:latest`, 也可指定版本，如 `mysql:5.7` 。

## 操作 MySQL

```shell
# 进入 docker
docker exec -it mysql bash
# 进入mysql，需要输入密码 admin123
mysql -u root -p 
```

MySQL 常用命令

```shell
# 创建数据库
create database flueky;
# 显示 mysql 中的数据库
show databases;
# 使用数据库
use flueky;
# 显示数据库中的表
show tables;
# 创建数据库表，包含三列(id, username, age)
create table hello(id int primary key auto_increment, name varchar(50) not null, age int);
# 插入数据
insert into hello (name, age) values('zkf',12);
# 查询数据
select * from hello;
# 删除数据
delete from hello where age=32;
# 更新数据
update hello set age=13 where name='zkf';
# 删除表
drop table hello;
```

## 使用 DBM

下载地址：[https://dbeaver.io/download/](https://dbeaver.io/download/)

### 配置 DBeaver

![](/assets/dbeaver_01.png)
![](/assets/dbeaver_02.png)