---
title: Mac 下搭建 nginx + mysql + php + fpm
sticky: 0
tags:
  - Mac
  - nginx
  - mysql
  - php
  - php-fpm
  - homebrew
date: 2017-03-31 20:17:22
---


### homebrew

#### 安装 homebrew

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

homebrew 帮助文档 `man brew`

### nginx

#### 安装 nginx

```bash
brew install nginx
```

#### 配置 nginx

安装完成后通过 `brew info nginx` 查看安装信息，nginx 配置文件目录在 `/usr/local/etc/nginx/` 下，通过 `nginx.conf` 主配置文件可以知道，nginx 会加载当前目录 `servers` 下所有的配置文件。现在我们新增配置文件 `localhost-700.conf` 来监听本地 700 端口的所有请求：

```nginx
server {
  listen  700;
  server_name localhost;
  root    /Users/your/home/dir/www;
  index   index.html index.htm index.php;

  location / {
    autoindex on; # 开启目录浏览功能  
    autoindex_exact_size off; # 关闭详细文件大小统计，让文件大小显示MB，GB单位，默认为b
    autoindex_localtime on; # 开启以服务器本地时区显示文件修改日期
  }

  location ~ \.php$ {
    fastcgi_pass  127.0.0.1:9000;
    fastcgi_index index.php;
    include       fastcgi.conf;
  }
}
```

#### 启动并测试 nginx

```nginx
# 测试配置是否有语法错误
nginx -t

# 启动 nginx
sudo nginx

# 重新加载配置|重启|停止|退出 nginx
sudo nginx -s reload|reopen|stop|quit
```

#### 自启动 nginx

Nginx 监听 `1000` 以下的端口需要 `root` 权限执行，所以应当使用 `sudo` 执行相关操作：

```bash
sudo launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.nginx.plist
```

取消开机自动启动服务：

```bash
sudo launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.nginx.plist
```

### mysql

#### 安装及配置 mysql

```bash
# 安装
brew install mysql

# 启动 mysql
mysql.server start

# 初始化 mysql 配置
mysql_secure_installation

# 登录 mysql
mysql -uroot -p

# 添加新用户并配置密码及权限
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON * . * TO 'newuser'@'localhost';
FLUSH PRIVILEGES;
```

#### mysql 自启动

```bash
sudo launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist
```

#### 安装 mysql 图形化工具

[Sequel Pro](http://sequelpro.com/)

![Sequel Pro](/assets/images/mac-sequelpro.png)

### php 及 php-fpm

#### 配置 php

Mac 自带 php 及 php-fpm，只需要配置一下就行：

```bash
# 查看默认的 php 的编译参数
php -i | grep config

# 根据上面输出，需要在 /etc 目录下创建 php.ini
sudo cp /etc/php.ini.default  /etc/php.ini

# 变更 owner:
chown <你的用户名> /etc/php.ini
chmod u+w /etc/php.ini
```

#### 配置 fpm

```bash
# 创建配置文件 php-fpm.conf
sudo cp /private/etc/php-fpm.conf.default /private/etc/php-fpm.conf

# 修改默认的日志和 pid 配置
vi /usr/local/etc/php-fpm.conf

pid = /usr/local/var/run/php-fpm.pid
error_log = /usr/local/var/log/php-fpm.log

# 启动 fpm，默认监听 9000 端口
php-fpm

# 停止 fpm
sudo pkill php-fpm
```

#### fpm 自启动

在 `~/Library/LaunchAgents/` 下新建 fpm 自启动配置文件 `org.php.php-fpm.plist`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>KeepAlive</key>
  <true/>
  <key>Label</key>
  <string>php-fpm</string>
  <key>Program</key>
  <string>/usr/sbin/php-fpm</string>
</dict>
</plist>
```

自启动：`launchctl load -w ~/Library/LaunchAgents/org.php.php-fpm.plist`

参考

- [homebrew](https://brew.sh/)

- [Mac OS X 系统自带的 php-fpm 配置和 nginx、mysql 的安装](https://lzw.me/a/mac-osx-php-fpm-nginx-mysql.html)
