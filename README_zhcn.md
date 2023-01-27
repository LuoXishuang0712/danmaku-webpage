# danmaku webpage

***

[English](./README.md)

**后端项目：**[damnaku-webpage](https://github.com/LuoXishuang0712/danmaku-server)

## 什么是弹幕

这里只对视频网站中出现的弹幕做讨论，如果您想知道关于弹幕的全部，不妨看看[Wiki](https://zh.wikipedia.org/wiki/%E8%A7%86%E9%A2%91%E5%BC%B9%E5%B9%95)

弹幕是视频评论的一种，与传统的评论区的形式不同，弹幕可以随着视频的播放被发送，而其他观众在看到视频的这个时间点的时候，也可以看到这条弹幕的出现。

而在直播中，弹幕会更偏向与网络聊天室，就和QQ群一样，所有观众都可以参与到实时的聊天中。

弹幕最重要的特点则是文字会通过视频上方的透明图层，通常是从右边出现，到左边消失。

典型的弹幕视频网站有中国的[bilibili](https://www.bilibili.com/)与日本的[niconico](https://www.nicovideo.jp/)

## 这是什么项目

这是一个关于直播实时弹幕的前端实现。

## 怎么运行这个项目

1. 通过 [后端项目](https://github.com/LuoXishuang0712/danmaku-webpage) 中的指引，启动后端服务器。
2. 如果您已经完成了后端的运行，您应该已经安装了NodeJS，如果没有的话，您可以从这里下载安装： [NodeJS](https://nodejs.org/en/)。
3. 打开终端，并切换到当前项目所在目录。
4. 安装依赖： `npm i -s`
5. 运行项目 `npm run dev`

## 这个项目会用到哪些端口

* 开发环境请求：TCP的`5173`端口
* 生产环境请求：TCP的`4173`端口

> 在开发环境中，为了实现页面的热重载，Vue会开启额外的WebSocket端口，因此如果您想在真实环境中使用的话，请使用`npm run preview`

* HTTP后端服务器连接 `localhost:8000` (可在[main.js](./src/main.js)中修改)
* WebSocket后端服务器连接 `localhost:8001` (可在[video.js](./src/pages/video.vue)的`conn_ws`函数中修改)

## TODO

*详见[英文版](./README.md)*
