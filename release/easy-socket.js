"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
	if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
		module.exports = factory(); // common.js
	} else if (typeof define === 'function') {
		define(factory()); //amd规范 ,require.js
	} else {
		global.EasySocket = factory(); //浏览器环境
	}
})(typeof window !== "undefined" ? window : global, function () {
	'use strict';

	var EasySocket = function () {
		/**
   * @description: 初始化实例属性，保存参数
   * @param {String} url ws的接口
   * @param {Function} msgCallback 服务器信息的回调传数据给函数
   * @param {String} name 可选值 用于区分ws，用于debugger
   */
		function EasySocket(url, msgCallback) {
			var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'default';

			_classCallCheck(this, EasySocket);

			this.url = url;
			this.msgCb = msgCallback || function (evet) {
				console.log('接收服务器消息的回调：', evet);
			};
			this.name = name;
			this.ws = null; // websocket对象
		}

		_createClass(EasySocket, [{
			key: "connect",
			value: function connect() {
				var _this = this;

				this.ws = new WebSocket(this.url);
				this.ws.onopen = function (e) {
					// 连接 websocket 成功
					console.log(_this.name + "\u8FDE\u63A5\u6210\u529F", e);
				};
				this.ws.onmessage = function (evet) {
					return _this.msgCb(evet);
				};
				this.ws.onerror = function (e) {
					_this.errorHandle();
				};
				this.ws.onclose = function (err) {
					_this.closeHandle();
				};
			}
		}, {
			key: "sendMessage",
			value: function sendMessage(data) {
				console.log(this.name + "\u53D1\u9001\u6D88\u606F\u7ED9\u670D\u52A1\u5668:", data);
				this.ws.send(JSON.stringify(data));
			}
		}, {
			key: "closeHandle",
			value: function closeHandle() {
				var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'err';

				console.log(this.name + "\u65AD\u5F00\uFF0C\u91CD\u8FDEwebsocket", e);
				this.connect(); // 重连
			}
		}, {
			key: "errorHandle",
			value: function errorHandle() {
				var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'err';

				// 错误处理
				console.log(this.name + "\u8FDE\u63A5\u9519\u8BEF:" + e);
			}
		}]);

		return EasySocket;
	}();

	console.log('EasySocket-----------------');
	console.log(EasySocket);
	console.log('EasySocket------------');

	return EasySocket;
});
