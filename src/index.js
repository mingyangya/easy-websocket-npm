(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(); // common.js
    } else if (typeof define === 'function') {
        define(() => factory()); //amd规范 ,require.js
    } else {
        global.EasyWebSocket = factory(); //浏览器环境
    }
})(typeof window !== "undefined" ? window : global, function () {
    'use strict';

    class EasyWebSocket {
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
        constructor(opt) {
            const defaultOpt = {
                msgCb: ((evet) => {
                    console.log('接收服务器消息的回调：', evet);
                }),
                name: 'default',
                debug: false,
                failNum: 3,
                delayConnectTime: 3000
            };
            this.opt = Object.assign({}, defaultOpt, opt);
            this.ws = null; // websocket对象
            this.connectNum = 0;
        }

        connect(data) {
            this.ws = new WebSocket(this.opt.url);
            this.ws.onopen = (e) => {
                // 连接 websocket 成功
                if (this.opt.debug) {
                    console.log(`${this.opt.name}连接成功`, e);
                }
                if (data !== undefined) {
                    this.sendMessage(data);
                }
            };
            this.ws.onmessage = (evet) => {
                return this.opt.msgCb(evet);
            };
            this.ws.onerror = (e) => {
                this.errorHandle(e);
            };
            this.ws.onclose = (err) => {
                this.closeHandle(err);
            }
        };

        sendMessage(data) {
            if (this.opt.debug) {
                console.log(`${this.opt.name}发送消息给服务器:`, data);
            }
            const _data = typeof data === "object" ? JSON.stringify(data) : data;
            if(this.ws.readyState===1){ // 当为OPEN时
                this.ws.send(_data);
            }
        };
        closeHandle(e = 'err') {
            this.connectNum++;
            if (this.opt.debug) {
                console.log(`${this.opt.name}断开，${this.opt.delayConnectTime}ms后重连websocket,尝试连接第${this.connectNum}次。`, e);
            }
            if (this.connectNum < this.opt.failNum) {
                setTimeout(() => {
                    this.connect(); // 重连
                }, this.opt.delayConnectTime)
            } else {
                if (this.opt.debug) {
                    console.log(`${this.opt.name}断开，重连websocket失败！`, e);
                }
            }
        };

        errorHandle(e = 'err') {
            // 错误处理
            if (this.opt.debug) {
                console.log(`${this.opt.name}连接错误:`, e);
            }
        };
    }

    return EasyWebSocket;

});