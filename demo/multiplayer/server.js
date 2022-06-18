const GameServer = require("../../server/gameServer");
const engine = require("../../engine/engine");
const script = require("./script");
const {PlayerSoldier, AISoldier} = script;
const IP = process.argv[2] || "localhost"//require("os").networkInterfaces()["Wi-Fi"][0].address;
const PORT = 80;
console.log(__dirname);
const server = new GameServer(__dirname + "/client.html", 20, 60, __dirname + "/../../");
server.server.listen(PORT, IP, () => console.log(`running on ${IP}:${PORT}`))
server.onConnection = function(player){
    new PlayerSoldier(new engine.Vector(0, 0), new engine.Vector(1, 1), player);
    console.log("a player connected");
}
server.startGame();