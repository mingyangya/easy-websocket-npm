(function(global, factory) {
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = factory(); // common.js
	} else if (typeof define === 'function') {
		define(factory()); //amd规范 ,require.js
	} else {
        global.EasySocket = factory(); //浏览器环境
	}
})(typeof window !== "undefined" ? window : global, function() {
	'use strict';

	class EasySocket {
		/**
		 * @description: 初始化实例属性，保存参数
		 * @param {String} url ws的接口
		 * @param {Function} msgCallback 服务器信息的回调传数据给函数
		 * @param {String} name 可选值 用于区分ws，用于debugger
		 */
		constructor(url, msgCallback, name = 'default') {
			this.url = url;
			this.msgCb = msgCallback || ((evet) => {console.log('接收服务器消息的回调：', evet);});
			this.name = name;
			this.ws = null; // websocket对象
		}

		connect() {
			this.ws = new WebSocket(this.url);
			this.ws.onopen = (e) => {
				// 连接 websocket 成功
				console.log(`${this.name}连接成功`, e);
			};
			this.ws.onmessage = (evet) => {
				return this.msgCb(evet);
			};
			this.ws.onerror = (e) => {
				this.errorHandle();
			};
			this.ws.onclose = (err) => {
				this.closeHandle();
			}
		};

		sendMessage(data) {
			console.log(`${this.name}发送消息给服务器:`, data);
			this.ws.send(JSON.stringify(data));
		};

		closeHandle(e = 'err') {
			console.log(`${this.name}断开，重连websocket`, e);
			this.connect(); // 重连
		};

		errorHandle(e = 'err') {
			// 错误处理
			console.log(`${this.name}连接错误:${e}`);
		};
	}
    return EasySocket;

});