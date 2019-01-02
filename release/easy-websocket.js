"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
    if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
        module.exports = factory(); // common.js
    } else if (typeof define === 'function') {
        define(function () {
            return factory();
        }); //amd规范 ,require.js
    } else {
        global.EasyWebSocket = factory(); //浏览器环境
    }
})(typeof window !== "undefined" ? window : global, function () {
    'use strict';

    var EasyWebSocket = function () {
        /**
         * @description: 初始化实例属性，保存参数
         * @param {Object} opt 参数配置
         * @param {String} opt.url ws的接口
         * @param {Function} opt.msgCb 服务器信息的回调传数据给函数
         * @param {String} [opt.name=default] 可选值 用于区分ws
         * @param {Boolean} [opt.debug=false] 可选值 是否开启调试模式
         * @param {Boolean} [opt.failNum=3] 可选值 连接失败后重连的次数
         * @param {Number} [opt.delayConnectTime=3000] 可选值 重连的延时时间
         */
        function EasyWebSocket(opt) {
            _classCallCheck(this, EasyWebSocket);

            var defaultOpt = {
                msgCb: function msgCb(evet) {
                    console.log('接收服务器消息的回调：', evet);
                },
                name: 'default',
                debug: false,
                failNum: 3,
                delayConnectTime: 3000
            };
            this.opt = Object.assign({}, defaultOpt, opt);
            this.ws = null; // websocket对象
            this.connectNum = 0;
        }

        _createClass(EasyWebSocket, [{
            key: "connect",
            value: function connect(data) {
                var _this = this;

                this.ws = new WebSocket(this.opt.url);
                this.ws.onopen = function (e) {
                    // 连接 websocket 成功
                    if (_this.opt.debug) {
                        console.log(_this.opt.name + "\u8FDE\u63A5\u6210\u529F", e);
                    }
                    if (data !== undefined) {
                        _this.sendMessage(data);
                    }
                };
                this.ws.onmessage = function (evet) {
                    return _this.opt.msgCb(evet);
                };
                this.ws.onerror = function (e) {
                    _this.errorHandle(e);
                };
                this.ws.onclose = function (err) {
                    _this.closeHandle(err);
                };
            }
        }, {
            key: "sendMessage",
            value: function sendMessage(data) {
                if (this.opt.debug) {
                    console.log(this.opt.name + "\u53D1\u9001\u6D88\u606F\u7ED9\u670D\u52A1\u5668:", data);
                }
                var _data = (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object" ? JSON.stringify(data) : data;
                if (this.ws.readyState === 1) {
                    // 当为OPEN时
                    console.log('fa');
                    this.ws.send(_data);
                }
            }
        }, {
            key: "closeHandle",
            value: function closeHandle() {
                var _this2 = this;

                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'err';

                this.connectNum++;
                if (this.opt.debug) {
                    console.log(this.opt.name + "\u65AD\u5F00\uFF0C" + this.opt.delayConnectTime + "ms\u540E\u91CD\u8FDEwebsocket,\u5C1D\u8BD5\u8FDE\u63A5\u7B2C" + this.connectNum + "\u6B21\u3002", e);
                }
                if (this.connectNum < this.opt.failNum) {
                    setTimeout(function () {
                        _this2.connect(); // 重连
                    }, this.opt.delayConnectTime);
                } else {
                    if (this.opt.debug) {
                        console.log(this.opt.name + "\u65AD\u5F00\uFF0C\u91CD\u8FDEwebsocket\u5931\u8D25\uFF01", e);
                    }
                }
            }
        }, {
            key: "errorHandle",
            value: function errorHandle() {
                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'err';

                // 错误处理
                if (this.opt.debug) {
                    console.log(this.opt.name + "\u8FDE\u63A5\u9519\u8BEF:", e);
                }
            }
        }]);

        return EasyWebSocket;
    }();

    return EasyWebSocket;
});
