//app.use(express.static(path.join(__dirname, 'node_modules')));

var WebsockerServer = require("ws").Server;
var wss = new WebsockerServer({port: 8888});

function sendData(str, ws){
    ws.send(JSON.stringify(str));
};
console.log("server started");
wss.on('connection', (ws, req) => {
    console.log(req);
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip + "아이피의 클라이언트에서 접속 요청이 발생했습니다.");
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

    setInterval(sendData.bind(this, "check", ws), 100);

    ws.on('close', () => {
        console.log(ip + "아이피의 클라이언트에서 접속이 종료되었습니다.");
    });
});