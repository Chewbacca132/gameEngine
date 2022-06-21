const http = require("http");
const express = require("express");
const Server = require("socket.io").Server;
const Player = require("./player");
const engine = require("../engine/engine");

class GameServer {
    constructor(pathToHtml, syncRate, fps, staticPath = ""){
        this.currentId = 0;
        this.syncRate = syncRate;
        this.players = {};
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);
        this.io.on("connection", (socket) => {
            const player = new Player(socket, this.currentId);
            this.players[this.curretId] = player;
            this.onConnection(player);
            this.currentId++;
        })
        this.app.use(express.static(staticPath));
        this.app.get("/", (req, res) => {
            res.sendFile(pathToHtml);
        });
        this.game = new engine.Game(fps);
    }
    onConnection(player){

    }
    startGame(){
        this.game.start();
        this.sync();
    }

    sync(){
        setTimeout(() => this.sync.call(this), 1000 / this.syncRate);
        const data = {};
        for (const gameObject of this.game.gameObjects){
            //console.log(gameObject.id);
            data[gameObject.id] = gameObject.data();
        }
        //data = this.game.gameObjects.map(o => o.data())
        this.io.emit("sync", data);
    }
    run(port, ip){
        this.server.listen(port, ip, () => console.log(`running on http://${ip}${port}`));
    }
}
//const gameServer = new GameServer();
//gameServer.server.listen(PORT, IP, () => console.log(`running on ${IP}:${PORT}`))

module.exports = GameServer;