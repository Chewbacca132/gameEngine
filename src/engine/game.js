var engine;
if (typeof window === "undefined"){
    engine = require("./engine");
}
else engine = _engine;

class Game{
    //if singlePlayer is true
    //the game will render the gameobjects
    constructor(fps, singlePlayer = false){
        this.setFps(fps);
        engine.physics.deltaTime = 1 / fps;
        this.gameObjects = [];
        this.physicsObjects = [];
        engine.GameObject.prototype.game = this;
        this.singlePlayer = singlePlayer;
        if (singlePlayer){
            window.addEventListener("load", this.start.bind(this));
        }
    }

    start(){
        this.update();
    }

    setFps(fps){
        this.fps = fps;
        this.deltaTime = 1 / fps;
    }

    addObject(gameObject){
        this.gameObjects.push(gameObject);
        if (gameObject.physics){
            this.physicsObjects.push(gameObject);
        }
    }

    onPhysicsChange(gameObject){
        if (!this.physicsObjects.includes(gameObject)){
            this.physicsObjects.push(gameObject);
        }
    }

    destroy(gameObject){
        this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1);
        if (gameObject.physics){
            this.physicsObjects.splice(this.physicsObjects.indexOf(gameObject), 1)
        }
    }

    update(){
        //checkCollisions
        setTimeout(() => this.update.call(this), 1000 / this.fps);
        for (let i = 0; i < this.physicsObjects.length; i += 1){
            const obj1 = this.physicsObjects[i];
            for (let j = i + 1; j < this.physicsObjects.length; j += 1){
                const obj2 = this.physicsObjects[j];
                if (engine.physics.collisions.circleToCircle(obj1.physics, obj2.physics)){
                    if (!obj1.physics.isTrigger && !obj2.physics.isTrigger){
                        const vel1 = obj1.physics.velocity.copy();
                        const vel2 = obj2.physics.velocity.copy();
                        obj1.physics.onCollision({
                            other: obj2.physics,
                            thisVel: vel1,
                            otherVel: vel2,
                        });
                        obj2.physics.onCollision({
                            other: obj1.physics,
                            thisVel: vel2,
                            otherVel: vel1
                        });
                    }
                    obj1.onCollision(obj2);
                    obj2.onCollision(obj1);
                }
            }
            if (typeof this.renderFunction === "function"){
                renderFuction
            }
        }
        //update gameobjects
        for (let gameObject of this.gameObjects){
            gameObject._update();
        }

        if (this.singlePlayer){
            //render gameobjects
            rendering.updateRenderers(this.getRenderData());
            rendering.renderObjects();
        }
    }

    //returns an object that maps renderData of each object to its id
    getRenderData(){
        const data = {};
        for (const gameObject of this.gameObjects){
            data[gameObject.id] = gameObject.renderData();
        }
        return data;
    }
}
if (typeof window === "undefined"){
    module.exports = Game;
}
else _engine.Game = Game;