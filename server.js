var WebsockerServer = require("ws").Server;
var wss = new WebsockerServer({port: 8888});
var time = 0;

var simulator = {
    snakes: [{
        head_direction: 0, // direction
        head_pos: {
            x: 5,
            y: 5
        },
        body: new Array(10) // directions or item id
    }],
    moveSnake: function(){
        this.snakes.forEach(snake => {
            switch(snake.head_direction){
                case 0: // up
                    snake.head_pos.y += 1;
                    break;
                case 1: // down
                    snake.head_pos.y -= 1;
                    break;
                case 2: // left
                    snake.head_pos.x -= 1;
                    break;
                case 3: // right
                    snake.head_pos.x += 1;
                    break;
                default:
                    throw new Error("없는 방향입니다.");
            };

            snake.body.pop();
            snake.body.unshift(snake.head_direction);
                
            });
    },
    changeHeadDirection: function(direction){
        this.snakes.forEach(snake => snake.head_direction = direction);
    }
};

var sender = {
    ws_list: [],
    sendText:function(obj){
        var ws_list = this.ws_list;
        ws_list.forEach(ws => {
            ws.send(JSON.stringify(obj));
        });
    }
};

function sendData(){
    sender.sendText(simulator.snakes);
};

function steppingTime(){
    simulator.moveSnake();
    sendData();
    time++;
}

setInterval(steppingTime, 100);

console.log("server started");
wss.on('connection', (ws, req) => {
    console.log(req);
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip + "아이피의 클라이언트에서 접속 요청이 발생했습니다.");
    if(sender.ws_list.indexOf(element => element == ws) === -1){
        sender.ws_list.push(ws);
        console.log("ws was added!!");
    }
    ws.on('message', (message) => {
        let received_message  = Number(message);
        simulator.changeHeadDirection(received_message);
    });


    ws.on('close', () => {
        console.log(ip + "아이피의 클라이언트에서 접속이 종료되었습니다.");
    });
});