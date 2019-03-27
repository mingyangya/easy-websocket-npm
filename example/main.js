require.config({
    baseUrl: "./",
    paths : {
        "easy-websocket-npm":"../release/easy-websocket-npm"
    }
});

require(['easy-websocket-npm'],function(EasyWebSocket){
    // todo something...

    var msgCb=function(evet){
        console.log(evet);
        document.write(`服务端返回的消息：${event.data}</br>`);
    };


    var easyWebSocket=new EasyWebSocket({url:"ws://123.207.167.163:9010/ajaxchattest",debug:true,msgCb});

    //连接websocket 并发送消息555
    easyWebSocket.connect("555");

    // 发送消息
    setTimeout(()=>{
        easyWebSocket.sendMessage("发送消息！");
    },3000)

});