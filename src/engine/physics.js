var engine;
if (typeof window === "undefined"){
    engine = require("./engine");
}
else engine = _engine;

const physics = {collisions : {}, colliders : {}};

//this value is important for velocity scaling
//and applying continuous forces
physics.deltaTime = 1 / 60;

//base class for all physics modes
physics.Physics = class Physics{
    constructor(mass, collider){
        this.pos = Vector.zero();
        this.mass = mass;
        this.collider = collider;
        this.velocity = engine.Vector.zero();
    }

    update(){
        this.pos = this.pos.add(this.velocity.mult(physics.deltaTime));
        if (this.drag){
            this.velocity = this.velocity.mult(1 - this.drag);
        }
    }

    onCollision(other){
    }

    //adds continuous force to this object
    //the force will be scaled by delta time
    applyForce(force){
        this.velocity = this.velocity.add(force.div(this.mass).mult(physics.deltaTime));
    }

    //adds an impulse force to this object
    applyImpulse(force){
        this.velocity = this.velocity.add(force.div(this.mass));
    }

    speed(){
        return this.velocity.magnitude();
    }
}

physics.collisions.circleToCircle = function(obj1, obj2){
    return (obj1.pos.sub(obj2.pos).sqrMagnitude() < (obj1.collider.radius + obj2.collider.radius) ** 2);
}

physics.colliders.Circle = function Circle(radius){
    this.type = "circle";
    this.radius = radius;
}

//for objects that don't move
physics.Static = class Static extends physics.Physics{
    constructor(pos, collider){
        super(pos, 1, collider);
        this.mass = Infinity;
    }
    update(){};
}

//for dynamic objects with perfectly elastic collisions
physics.DynamicElastic = class extends physics.Physics{
    onCollision(collision){
        if (this.mass === Infinity){
            return;
        }
        const deltaPos = collision.other.pos.sub(this.pos);
        let collisionAxis;
        let angle;
        if (deltaPos.equals(engine.Vector.zero())){
            //if the objects are at the exactly same position
            //the collisionAxis must will be determined randomly
            angle = engine.random.float(-Math.PI, Math.PI);
            collisionAxis = engine.Vector.atAngle(angle);
        }
        else {
            collisionAxis = deltaPos.normalized();
            angle = collisionAxis.angle();
        }
        const speed = Math.cos(
            engine.math.angleDiff(angle, collision.thisVel.angle())
        ) * collision.thisVel.magnitude();

        if (collision.other.mass === Infinity){
            this.velocity = this.velocity.add(collisionAxis.mult((-2 * speed)));
            return;
        }
        const otherSpeed = Math.cos(
            engine.math.angleDiff(engine.math.simplifyAngle(angle + Math.PI), collision.otherVel.angle())
        ) * collision.otherVel.magnitude();
        const finalSpeed = ((this.mass - collision.other.mass) * speed + 2 * collision.other.mass * otherSpeed) / (this.mass + collision.other.mass);
        this.velocity = this.velocity.add(collisionAxis.mult(-speed - Math.abs(finalSpeed)));
    }
}

//for objects that can enter other physics objects but detect collisions
physics.Trigger = class Trigger extends physics.Physics{
}
physics.Trigger.prototype.isTrigger = true;

//for dynamic objects with perfectly inelastic collisions
physics.DynamicInelastic = class extends physics.Physics{
    onCollision(collision){
        const deltaPos = collision.other.pos.sub(this.pos);
        let collisionAxis;
        let angle;
        if (deltaPos.equals(engine.Vector.zero())){
            angle = engine.random.float(-Math.PI, Math.PI);
            collisionAxis = engine.Vector.atAngle(angle);
        }
        else {
            collisionAxis = deltaPos.normalized();
            angle = collisionAxis.angle();
        }
        const speed = Math.cos(
            engine.math.angleDiff(angle, collision.thisVel.angle())
        ) * collision.thisVel.magnitude();
        if (collision.other.mass === Infinity){
            this.velocity = this.velocity.add(collisionAxis.mult((-speed)));
            return;
        }
        const otherSpeed = Math.cos(
            engine.math.angleDiff(engine.math.simplifyAngle(angle + Math.PI), collision.otherVel.angle())
        ) * collision.otherVel.magnitude();
        const finalSpeed = (this.mass * speed - collision.other.mass * otherSpeed) /
        (this.mass + collision.other.mass);
        this.velocity = this.velocity.add(collisionAxis.mult(-speed + finalSpeed));
        this.pos = this.pos.add(collisionAxis.mult(-0.01))
    }
}

if (typeof window === "undefined"){
    module.exports = physics;
}
else _engine.physics = physics;