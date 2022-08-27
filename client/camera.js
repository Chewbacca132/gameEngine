class Camera{
    constructor(pos = engine.Vector.zero(), bg = "white"){
        this.pos = pos;
        this.bg = bg;
        window.addEventListener("load", (event) => {
            this.init.call(this);
            window.addEventListener("resize", (event) => this.resize.call(this));
        });
        this.scale = 1;
        this.screenCenter = engine.Vector.zero();
    }

    init(){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.resize();
    }

    setWidth(width){
        this.width = width;
        this.scaleBy = "width";
    }

    setHeight(height){
        this.height = height;
        this.scaleBy = "height";
    }

    resize(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.screenSize = new Vector(this.canvas.width, this.canvas.height);
        this.ctx.width = window.innerWidth;
        this.ctx.height = window.innerHeight;
        this.aspect = this.ctx.width / this.ctx.height;
        this.screenCenter = new Vector(
            Math.round(this.ctx.width / 2),
            Math.round(this.ctx.height / 2)
        );
        if (this.scaleBy === "width"){
            this.height = this.width / this.aspect;
        }
        else this.width = this.aspect * this.height;
        this.scale = this.ctx[this.scaleBy] / this[this.scaleBy];

    }

    //converts a point in the world space to a point on the screen
    worldToScreenPoint(worldPoint){
        let pos = worldPoint.sub(this.pos).mult(this.scale);
        return new Vector(pos.x, -pos.y) //-pos.y because screen y axis is inverted
        .add(this.screenCenter).round();
    }

    screenToWorldPoint(screenPoint){
        let pos = screenPoint.sub(this.screenCenter);
        return new Vector(pos.x, -pos.y).div(this.scale).add(this.pos);
    }

    render(spriteName, pos, size, angle, offsetX, offsetY, width, height){
        const screenPos = this.worldToScreenPoint(pos);
        const screenSize = size.mult(this.scale).round(); //size on screen
        const offset = size.mult(this.scale / 2).round();
        const sprite = assetLoader.sprites[spriteName];
        this.ctx.translate(screenPos.x, screenPos.y);
        this.ctx.rotate(-angle + sprite.angleOffset);
        if (offsetX !== undefined){
            this.ctx.drawImage(
                sprite.img, offsetX, offsetY, width, height,
                -offset.x,
                -offset.y,
                screenSize.x,
                screenSize.y
            );
        }
        else{
            this.ctx.drawImage(
                sprite.img,
                -offset.x,
                -offset.y,
                screenSize.x,
                screenSize.y
            );
        }
        this.ctx.rotate(angle - sprite.angleOffset);
        this.ctx.translate(-screenPos.x, -screenPos.y);
    }

    reset(){
        this.ctx.fillStyle = this.bg;
        this.ctx.fillRect(0, 0, this.ctx.width, this.ctx.height);
    }
}