const engine = require("../engine/engine");

const defaultInput = {
    events : {},
    mousePos : engine.Vector.zero(),
    clicked : false
}

class Player {
    constructor(socket, id){
        this.id = id;
        this.input = defaultInput;
        this.socket = socket;
        this.socket.on("input", function(input){
            this.input = input;
            input.mousePos = engine.Vector.new(input.mousePos);
        }.bind(this));
    }
}
module.exports = Player;