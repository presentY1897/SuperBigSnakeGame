//app.use(express.static(path.join(__dirname, 'node_modules')));

var WebsockerServer = require("ws").Server;
var wss = new WebsockerServer({port: 8888});
var time = 0;

var sender = {
    ws_list: [],
    sendText:function(text){
        var ws_list = this.ws_list;
        ws_list.forEach(ws => {
            ws.send(JSON.stringify(text));
        });
    }
};

function sendData(){
    sender.sendText(time);
    time++;
};

setInterval(sendData, 100);

console.log("server started");
wss.on('connection', (ws, req) => {
    console.log(req);
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip + "아이피의 클라이언트에서 접속 요청이 발생했습니다.");
    if(typeof sender.ws_list.find(element => element == ws) === "undefined"){
        sender.ws_list.push(ws);
        console.log("ws was added!!");
    }
    ws.on('message', (message) => {
        let sendData = {event: 'res', data: null};
        message = JSON.parse(message);
        switch (message.event) {
            case 'open':
                console.log("Received: %s", message.event);
                break;
            case "req":
                sendData.data = message.data;
                ws.send(JSON.stringify(sendData));
                break;
            default:
        }
    });


    ws.on('close', () => {
        console.log(ip + "아이피의 클라이언트에서 접속이 종료되었습니다.");
    });
});