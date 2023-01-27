# danmaku webpage

***

[简体中文(Simplified Chinese)](./README_zhcn.md)

**The backend server project:**[damnaku-webpage](https://github.com/LuoXishuang0712/danmaku-server)

## What is Danmaku

In this place, Danmaku indicates some different features in some video websites. More about Danmaku please view [Danmaku - Wikipedia](https://en.wikipedia.org/wiki/Danmaku)

It is a type of comments for a video. Different from traditional comment area, Danmaku can send when video is playing and recode the playing time, so other viewers can see the comment show when the video playing to this time.

And in living, Danmaku is more like a chat room. All viewers online can chat realtime, like real-time chatting in Discord or YouTube living.

The most important characteristic of Danmaku is the text will show on the overlay of the video and rolling(typically) from right to left.

The most typical video websites with Danmaku is [niconico](https://www.nicovideo.jp/) in Japan and [bilibili](https://www.bilibili.com/) in China.

## Whis is this project

This is an implements about real-time Danmaku in living.

## How to run this project

1. Run Backend Server in [damnaku-webpage](https://github.com/LuoXishuang0712/danmaku-webpage)
2. So you will have the NodeJS installation already, if not, please install from [NodeJS](https://nodejs.org/en/).
3. Open terminal and switch to the folder of this project.
4. Run `npm i -s` to install dependencies.
5. Run `npm run dev`

## Which port dose this project use

* `TCP5173` for frontend(development environment)
* `TCP4173` for frontend(production environment)

> In development environment, Vue will use other ports for WebSocket to hot reload. So if you want to use it in application, run `npm run preview`.

* `localhost:8000` to connect backend HTTP api (can be change in [main.js](./src/main.js))
* `localhost:8001` to connect backend WebSocket (can be change in [video.js](./src/pages/video.vue), in the function `conn_ws`)

## TODO

* Video player
* Video overlay for danmaku
