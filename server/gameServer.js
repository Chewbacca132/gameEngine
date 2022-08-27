const http = require("http");
const express = require("express");
const Server = require("socket.io").Server;
const Player = require("./player");
const engine = require("../engine/engine");

//encapsulates a http server
class GameServer {
    constructor(pathToHtml, syncRate, fps, staticPath = ""){
        this.currentId = 0; //unique id for each player
        this.syncRate = syncRate;
        this.players = {};
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);
        this.io.on("connection", (socket) => {
            const player = new Player(socket, this.currentId);
            this.players[this.curretId++] = player;
            if (typeof this.onConnection == 'function')
            {
                this.onConnection(player);
            }
        })
        this.app.use(express.static(staticPath));
        this.app.get("/", (req, res) => {
            res.sendFile(pathToHtml);
        });
        this.game = new engine.Game(fps);
    }

    startGame(){
        this.game.start();
        this.sync();
    }

    sync(){
        setTimeout(() => this.sync.call(this), 1000 / this.syncRate);
        const data = this.game.getRenderData();
        this.io.emit("sync", data);
    }
    run(port, ip){
        this.server.listen(port, ip, () => console.log(`running on http://${ip}:${port}`));
    }
}

module.exports = GameServer;