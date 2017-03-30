---
title: 移动端H5视频播放的那些事儿
date: 2017-03-05 12:17:22
music: "436514312"
tags:
  - HTML5
  - Video
  - HTTP Live Streaming
---

移动端使用H5`video`标签能在网页中直接播放视频而无需安装flash插件，结合js与css能创造出比帧动画表现力更丰富的交互（想想炫酷的WebGL加上video），同时，GIF 相比视频，以 H.264 编码的 MP4 为例，带宽占用为十二倍，电池消耗为两倍。没有声音的`video`元素很适合用作网页背景，取代 GIF。2010年，乔布斯预言了HTML5的未来，相比flash，H5在移动端有着友好的支持：

![HTML5 Video 浏览器兼容表，数据来自于http://caniuse.com/#feat=video](/assets/images/html5-video-browser-support.png)

<!-- more -->

尽管如此，在实际开发中还是有不少的坑，在此做个记录。

### 各平台支持不同的视频格式

详见[HTML5的视频格式之争 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2010/05/html5_codec_fight.html)，即并不是所有的浏览器都支持同一种格式：

![HTML5 Video 视频格式浏览器支持](/assets/images/html5-video-format-browser-support.png)

制作多种格式的视频
- 桌面工具：
  - [FFmpeg - 大师级](https://ffmpeg.org/)
- GUI应用:
  - [Miro](https://www.mirovideoconverter.com/)
  - [HandBrake - 入门级](https://handbrake.fr/)
  - [VLC - 玩家级](https://www.videolan.org/)
- 在线编码/转码服务：
  - [Zencoder](https://en.wikipedia.org/wiki/Zencoder)
  - [Amazon Elastic Encoder](https://aws.amazon.com/elastictranscoder)

### 移动端视频无法自动播放/预加载(webview除外)

```obj-c
// iOS, UIWebView设置允许视频自动播放
uiWebView.allowsInlineMediaPlayback = YES;
uiWebView.mediaPlaybackRequiresUserAction = NO;
```

```java
// Android
int SDK_INT = android.os.Build.VERSION.SDK_INT;
if (SDK_INT > 16) {
  engine.getSettings().setMediaPlaybackRequiresUserGesture(false);
}
```

### UC、小米等安卓浏览器劫持video标签，用其“自己”的播放器来播放视频，“破坏”了产品本身的播放体验

无解

### 安卓版微信、QQ、iOS 播放视频自动全屏/全屏浮层

安卓版微信、QQ使用的是腾讯的X5 TBS内核，目前无解，如果你看过一些腾讯的视频类 HTML5，会发现它们在微信里是可以内联播放的，而这个功能是需要申请加入白名单的（目前已关闭该通道），不过新版的 TBS 内核（>=036849）支持一个叫 同层播放器 的视频播放器，这个不需要申请白名单，只需给 video 设置两个属性 x5-video-player-type="h5" 和 x5-video-player-fullscreen="true"。退出播放时，我们需要做相应的处理。TBS 有提供相应的事件，不过不同的版本有一点差异：

![TBS Video Fullscreen API](/assets/images/tbs-video-fullscreen-api.png)

好消息是 iOS 10+ 新增了`playsinline`属性（ iOS 4+的 webview 可以使用`webkit-playsinline` 详见[iOS 10 Safari 视频播放新政策](https://webkit.org/blog/6784/new-video-policies-for-ios/)）使视频内联播放。至于iOS 8 和 9可以试一下这个库[iphone-inline-video](https://github.com/bfred-it/iphone-inline-video)

另附：[微信6.3.15打开网页video标签webkit-playsinline失效](http://bbs.mb.qq.com/thread-1128196-1-1.html)

未完待续。。。

参考：
- [Steve Job's bet on HTML5](http://www.apple.com/hotnews/thoughts-on-flash/)
- [HTML5的视频格式之争 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2010/05/html5_codec_fight.html)
- [HTML5 Video - wiki](https://en.wikipedia.org/wiki/HTML5_video)
- [Supported_media_formats - MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats)
- [iOS 10 Safari 视频播放新政策](https://webkit.org/blog/6784/new-video-policies-for-ios/)
- [HTML5 Video Events and API检测工具](https://www.w3.org/2010/05/video/mediaevents.html)
- [video.js](http://videojs.com/)
- [hls.js](https://github.com/dailymotion/hls.js)
- [视频内容保护 HTML5 DRM(Digital Rights Management)](http://stackoverflow.com/questions/2983555/is-there-a-way-to-use-drm-on-html5-video)
