---
layout: post
title:  "搭建前端开发 Ubuntu 服务器"
date: 2017-03-15
tags: [Ubuntu]
---

## 下载ISO镜像，刻录U盘

访问 [Ubuntu 官方镜像列表](http://releases.ubuntu.com/16.04/)，目前最新的 LTS Server 版本是16.04，选择 [64位 ISO 镜像](http://releases.ubuntu.com/16.04/ubuntu-16.04.2-server-amd64.iso)。

Windows 下可以用 [UltraISO](https://cn.ultraiso.net/) 刻录U盘，Mac 用户直接命令行搞起：

```bash
# 列出当前已挂载的硬盘，找到U盘对应的设备名，以 /dev/disk1 为例
diskutil list
# 使用 dd 命令刻录 ISO 至U盘，等待刻录完成
dd if=~/Downloads/ubuntu-16.04.2-server-amd64.iso of=/dev/disk1 bs=8192
```

<!-- more -->

如果提示resource busy，则先卸载U盘（插入时已经挂载了），但不要推出，在终端下：

```bash
diskutil umountDisk /dev/disk1
```

也可以通过“磁盘工具”进行卸载。

## 安装 Ubuntu Server，预装 OpenSSH Server

主机插上U盘，启动时按 **F12** 修改启动顺序为USB，重启即进入系统安装界面（命令行），查看说明一路下一步，中间会提示预装一些环境，根据需要选择就行。这里选择了 OpenSSH Server 和 LAMP（**L**inux **A**pache **M**ySQL **P**HP），前者方便以后远程 ssh 登录管理主机，后者是 Linux 下的后端 PHP 开发套件。

## 安装 zsh

`zsh` 全名 Z Shell，是 Bash Shell 的超集，是 Linux 下必备的利器，很好用：

```bash
# 安装之前更新下源列表，保证下载到最新的软件包
sudo apt update
# 安装 zsh
sudo apt install zsh
# 安装 oh-my-zsh，因为 16.04 版本的 Ubuntu 已经预装了 git，所以可以直接安装
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
# 设置 zsh 为默认 shell 环境
chsh -s /bin/zsh
# 重启系统
sudo reboot
```

## 安装配置 Node 环境

前端开发必备 Node 环境，由于 Node 发版实在太快，现在最新版本已经是 7.7.3 了，而 LTS 也发布了 v6.10.0 LTS，所以 Node 环境的升级比较麻烦，不过 Linux 下可以通过 [nvm](https://github.com/creationix/nvm) 管理 Node，同时 nvm 将 Node 安装在当前用户主目录下，不会有权限问题：

```bash
# shell 脚本安装
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
# 更新环境变量或者重新登录
source ~/.zshrc
# 列出当前所有 Node LTS 版本
nvm ls-remote --lts
# 安装最新版本
nvm install 6.10.0
```

## 配置 Ruby 环境

同上，Ruby 也有版本管理器 [rvm](https://rvm.io/)：

```bash
# 安装 rvm
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
curl -sSL https://get.rvm.io | bash -s stable
# 载入 RVM 环境
source ~/.rvm/scripts/rvm
# 修改 RVM 下载 Ruby 的源，到 Ruby China 的镜像，国内，你懂的
echo "ruby_url=https://cache.ruby-china.org/pub/ruby" > ~/.rvm/user/db
# 检查一下是否安装正确
rvm -v
# 用 RVM 安装 Ruby 环境
# 检查并安装 rvm 安装环境
rvm requirements
# 查询 Ruby 版本
rvm list known
# 安装 Ruby
rvm install 2.4.0
# 指定 2.4.0 版本的 Ruby 为系统默认版本
rvm use 2.4.0 --default
# 安装 Bundler
gem install bundler
```

## 搭建 npm 私服 sinopia

[sinopia](https://github.com/rlidwka/sinopia) 是一个零配置的私有的带缓存（镜像）功能的 npm 包管理服务。

### 安装 sinopia

```bash
npm i -g sinopia
```

### 安装 pm2

[pm2](http://pm2.keymetrics.io/) 是 Node 的进程管理器，能够为 Node 程序提供 Daemon 守护，方便的监控 Node 进程（CPU、内存、log、uptime）。用来托管 sinopia 非常好用。

```bash
# 安装
npm install -g pm2
# 启动 sinopia
pm2 start $(which sinopia)
# 开机自启动
pm2 startup
```

sinopia 默认端口为 4873

### 客户端安装 nrm 方便查看及切换 npm registry

```bash
# 安装 nrm
npm install -g nrm
# 添加 npm 镜像地址
nrm add <registry> <url>
# 设置镜像地址
nrm use <registry>
```

参考

- [Ubuntu 官方镜像列表](http://releases.ubuntu.com/16.04/)

- [UltraISO](https://cn.ultraiso.net/)

- [在MAC下使用ISO制作Linux的安装USB盘](https://linux.cn/article-1471-1.html)

- [Ubuntu Server 16.04 LTS 上安装 LAMP图解教程](http://www.jb51.net/article/91841.htm)

- [Install ZSH shell on Ubuntu](http://www.cnblogs.com/lexus/archive/2012/03/26/2418809.html)

- [oh-my-zsh](http://ohmyz.sh/)

- [nvm](https://github.com/creationix/nvm)

- [rvm](https://rvm.io/)

- [用sinopia搭建npm私服](http://www.cnblogs.com/LittleSix/p/6053549.html)

- [如何快速正确的安装 Ruby, Rails 运行环境](https://ruby-china.org/wiki/install_ruby_guide)
