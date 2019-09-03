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
         * @param {String} [opt.cmd="ping"] 可选值 ping值(心跳命令)
         * @param {String} [opt.serverType="deamon"] 可选值 websocket服务类型
         * @param {Function} [opt.fail=null] 可选值 websocket连接失败的回调
         * @param {Function} [opt.success=null] 可选值 websocket连接成功的回调
         */
        constructor(opt) {
            const defaultOpt = {
                msgCb: ((evet) => {
                    if (this.opt.debug) {
                        console.log('接收服务器消息的回调：', evet);
                    }
                }),
                name: 'default',
                debug: false,
                failNum: 3,
                delayConnectTime: 3000,
                pingTime: 2000,
                pongTime: 3000,
                cmd: false,
                serverType: "deamon",
                fail: null,
                success: null
            };
            this.opt = Object.assign({}, defaultOpt, opt);
            this.ws = null; // websocket对象
            this.connectNum = 0;
            this.status = null;
        }

        connect(data) {
            this.ws = new WebSocket(this.opt.url);
            this.ws.onopen = (e) => {
                // 连接 websocket 成功
                this.status = 'open';
                if (this.opt.cmd) { //是否开启心跳检测
                    this.heartCheck(this.opt.cmd);
                }
                if (this.opt.debug) {
                    console.log(`${this.opt.name}连接成功`, e);
                }
                //连接成功
                this.opt.success && this.opt.success(this.opt.index);

                if (data !== undefined) {
                    this.sendMessage(data);
                }
            };
            this.ws.onmessage = (evet) => {
                if (this.opt.cmd) {
                    //开启心跳
                    let pingData;
                    switch (this.opt.serverType) {
                        case "deamon":
                            pingData = JSON.parse(evet.data).message;
                            break;
                        case "normal":
                            pingData = evet.data;
                            break;
                        default:
                            pingData = evet.data;
                            break;
                    }
                    if (pingData === "pong") {
                        this.pingPong = 'pong'; // 服务器端返回pong,修改pingPong的状态
                    }
                }
                return this.opt.msgCb(evet);
            };
            this.ws.onerror = (e) => {
                this.errorHandle(e);
            };
            this.ws.onclose = (err) => {
                this.closeHandle(err);
            }
        };

        onMessage(callback) {
            // 自定义 接受消息函数
            this.opt.msgCb = callback;
        }

        sendMessage(data) {
            if (this.opt.debug) {
                console.log(`${this.opt.name}发送消息给服务器:`, data);
            }
            const _data = typeof data === "object" ? JSON.stringify(data) : data;
            if (this.ws.readyState === 1) { // 当为OPEN时
                this.ws.send(_data);
            }
        };

        closeHandle(e = 'err') {
            this.connectNum++;
            if (this.opt.debug) {
                console.log(`${this.opt.name}断开，${this.opt.delayConnectTime}ms后重连websocket,尝试连接第${this.connectNum}次。`, e);
            }
            if (this.status !== 'close') {
                if (this.connectNum < this.opt.failNum) {
                    setTimeout(() => {
                        if (this.opt.cmd) {
                            if (this.pingInterval !== undefined && this.pongInterval !== undefined) {
                                // 清除定时器
                                clearInterval(this.pingInterval);
                                clearInterval(this.pongInterval);
                            }
                        }
                        this.connect(); // 重连
                    }, this.opt.delayConnectTime)
                } else {
                    if (this.opt.debug) {
                        console.log(`${this.opt.name}断开，重连websocket失败！`, e);
                    }
                    if (this.opt.cmd) {
                        if (this.pingInterval !== undefined && this.pongInterval !== undefined) {
                            // 清除定时器
                            clearInterval(this.pingInterval);
                            clearInterval(this.pongInterval);
                        }
                    }
                    this.opt.fail && this.opt.fail(this.opt.index);
                }
            } else {
                if (this.opt.debug) {
                    console.log(`${this.name}websocket手动关闭`);
                }
                if (this.opt.cmd) {
                    if (this.pingInterval !== undefined && this.pongInterval !== undefined) {
                        // 清除定时器
                        clearInterval(this.pingInterval);
                        clearInterval(this.pongInterval);
                    }
                }

            }
        };

        errorHandle(e = 'err') {
            // 错误处理
            if (this.opt.debug) {
                console.log(`${this.opt.name}连接错误:`, e);
            }
        };

        // 手动关闭WebSocket
        closeMyself() {
            if (this.opt.debug) {
                console.log(`关闭${this.name}`);
            }

            this.status = 'close';
            return this.ws.close();
        }

        heartCheck(cmd) {
            // 心跳机制的时间可以自己与后端约定
            this.pingPong = 'ping'; // ws的心跳机制状态值
            this.pingInterval = setInterval(() => {
                if (this.ws.readyState === 1) {
                    // 检查ws为链接状态 才可发送
                    if (typeof cmd !== "string") {
                        cmd = JSON.stringify(cmd);
                    }
                    this.ws.send(cmd); // 客户端发送ping
                }
            }, this.opt.pingTime);

            this.pongInterval = setInterval(() => {
                if (this.pingPong === 'ping') {
                    this.closeHandle('pingPong没有改变为pong'); // 没有返回pong 重启webSocket
                } else {
                    if (this.opt.debug) {
                        console.log('返回pong');
                    }
                    this.pingPong = 'ping';  // 重置为ping 若下一次 ping 发送失败 或者pong返回失败(pingPong不会改成pong)，将重启.
                }
            }, this.opt.pongTime)
        }
    }

    return EasyWebSocket;
});
