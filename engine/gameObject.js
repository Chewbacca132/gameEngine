var engine;
if (typeof window === "undefined"){
    engine = require("./engine");
}
else engine = _engine;

class GameObject {
    constructor(pos, size, angle, physics, renderer){
        this.pos = pos;
        this.size = size;
        this.angle = angle;
        if (physics){
            this.physics = physics;
            physics.pos = pos;
        }
        this.renderer = renderer
        this.render = true;
        this.game.addObject(this);
        this.id = GameObject.getId();
    }

    setPos(pos){
        this.pos = pos;
        if (this.physics){
            this.physics.pos = pos;
        }
    }

    _update(){
        if (this.parent){
            this.pos = this.parent.pos.add(engine.Vector.atAngle(
                math.simplifyAngle(this.parent.angle + this.parentData.offsetAngle))
                .mult(this.parentDistance)  
            );
            this.angle = this.parent.angle + this.parentData.angleOffset;
        }
        this.update();
        if (this.physics){
            this.physics.update();
            //if the object has a physics object it is controlled by it
            this.pos = this.physics.pos;
        }
    }

    update(){
    }

    onCollision(other){
    }

    setParent(parent, offset){
        if (!(parent instanceof GameObject)){
            parent = null;
            parentData = null;
        }
        this.parent = parent;
        this.parentData = new ParentData(this, parent, offset);
    }

    destroy(){
        this.game.destroy(this);
        this.destroyed = true;
    }

    renderData(){
        return {
            pos : this.pos,
            size : this.size,
            angle : this.angle,
            renderer : this.renderer,
            id : this.id
        };
    }

    static getId(){
        return this.prototype.id++;
    }
}
GameObject.prototype.id = 0;

class ParentData {
    constructor(child, parent, offset){
        if (!(offset instanceof engine.Vector)){
            offset = parent.pos - child.pos;
        }
        this.offsetAngle = offset.angle();
        this.parentDistance = offset.magnitude();
        this.angleOffset = engine.math.simplifyAngle(parent.angle - this.angle);
    }
}

if (typeof window === "undefined"){
    module.exports = GameObject;
}
else _engine.GameObject = GameObject;