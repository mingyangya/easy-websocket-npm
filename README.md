# easy-websocket-npm
## 介绍
简单、常用的方法

- 文档：[Document](https://github.com/haochn/easy-websocket-npm/README.md)
- 源码：[https://github.com/haochn/easy-websocket-npm](https://github.com/haochn/easy-websocket-npm) （欢迎 star）

## 下载

- 直接下载：[https://github.com/haochn/easy-websocket-npm/releases](https://github.com/haochn/easy-websocket-npm/releases)
- 使用`npm`下载：`npm install easy-websocket-npm`
- 使用CDN：[https://unpkg.com/easy-websocket-npm/release/easy-websocket-npm.js](https://unpkg.com/easy-websocket-npm/release/easy-websocket-npm.js)

## 初始化

> 引用方式

## AMD

以require.js为例演示

```javascript
require(['easy-websocket-npm.js'],function(EasyWebSocket){
  // todo something...
})
```

## CommonJS

使用`npm install easy-websocket-npm`安装
```javascript
var EasyWebSocket=require("easy-websocket-npm");

// todo something... 
```

## 浏览器

使用`<script>`标签引入

```html
<script src="easy-websocket-npm.js"></script>
```

## 使用

```javascript
var easyWebSocket=new EasyWebSocket({url:"ws://121.40.165.18:8800"});

//连接websocket
easyWebSocket.connect();

// 发送消息
easyWebSocket.sendMessage("发送消息！");
```

### 提问

- 直接在 [github issues](https://github.com/haochn/easy-websocket-npm/issues) 提交问题

每次升级版本修复的问题记录在[这里](https://github.com/haochn/easy-websocket-npm/ISSUE.md)



