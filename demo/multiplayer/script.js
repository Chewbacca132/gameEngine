var engine;
if (typeof window === "undefined"){
    engine = require("../../engine/engine");
}
else engine = _engine;

class Soldier extends engine.GameObject {
    constructor(pos, size){
        const physics = new engine.physics.DynamicInelastic(
            pos,
            10,
            new engine.physics.colliders.Circle(size.magnitude() * 0.3)
        );
        super(pos, size, 0, physics, "soldier");
        this.physics.drag = 0.1;
        this.speed = 300;
        this.hp = 100;
        this.time2fire = 0;
        Soldier.soldiers.push(this);
    }
    update(){
        this.updateFireTime();
    }

    fire(){
        if (this.time2fire <= 0){
            const firePos = this.pos.add(engine.Vector.atAngle(this.gunOffset.angle() + this.angle).mult(this.gunOffset.magnitude()));
            new Bullet(firePos, new engine.Vector(1, 0.5), this.angle, 30).self = this;
            this.time2fire = 1 / this.fireRate;
            new MuzzleFlash(firePos, new engine.Vector(0.5, 0.5));
        }
    }
    updateFireTime(){
        if (this.time2fire > 0) this.time2fire -= this.game.deltaTime;
    }
    
    onHit(damage){
        this.hp -= damage;
        if (this.hp < 0){
            new Explosion(this.pos, this.size);
            this.destroy();
            this.onDeath();
        }
    }

    move(direction){
        this.physics.applyForce(direction.mult(this.speed));
    }

    onDeath(){

    }
}
Soldier.soldiers = [];
Soldier.prototype.fireRate = 10;
Soldier.prototype.gunOffset = new engine.Vector(0.6, -0.15);

class Bullet extends engine.GameObject{
    constructor(pos, size, angle, speed){
        const physics = new engine.physics.Trigger(
            pos,
            1,
            new engine.physics.colliders.Circle(size.magnitude() / 10)
        );
        super(pos, size, angle, physics, "bullet");
        this.speed = speed;
        this.physics.velocity = engine.Vector.atAngle(angle).mult(speed);
        this.distance = 0;
        this.damage = 10;
    }
    update(){
        if (this.distance > this.maxDistance) this.destroy();
        this.distance += this.speed * this.game.deltaTime;
    }

    onCollision(other){
        if (other != this.self && !(other instanceof Bullet)){
            if (typeof other.onHit === "function"){
                other.onHit(this.damage);
            }
            this.destroy();
        }
    }

}
Bullet.prototype.maxDistance = 30;

class Explosion extends engine.GameObject{
    constructor(pos, size){
        super(pos, size, 0, undefined, "explosion");
        this.lifeTime = 10;
    }
    update(){
        if (this.lifeTime <= 0) this.destroy();
        this.lifeTime--;
    }
}

class MuzzleFlash extends engine.GameObject{
    constructor(pos, size){
        super(pos, size, engine.random.float(-Math.PI, Math.PI), undefined, "muzzleFlash");
        this.lifeTime = 10;
    }
    update(){
        if (this.lifeTime <= 0) this.destroy();
        this.lifeTime--;
    }
}

class PlayerSoldier extends Soldier {
    constructor(pos, size, player){
        super(pos, size);
        this.player = player;
    }
    update(){
        this.updateFireTime();
        if (this.player.input.events.up){
            this.move(engine.Vector.up());
        }
        if (this.player.input.events.down){
            this.move(engine.Vector.down());
        }
        if (this.player.input.events.left){
            this.move(engine.Vector.left());
        }
        if (this.player.input.events.right){
            this.move(engine.Vector.right());
        }
        this.angle = this.player.input.mousePos.sub(this.pos).angle();
        if (this.player.input.events.fire){
            this.fire();
        }
    }
}

class AISoldier extends Soldier {
    update(){
        this.updateFireTime();
        if (!this.target || this.target.destroyed){
            for (const soldier of Soldier.soldiers){
                if (!soldier.destroyed && soldier instanceof PlayerSoldier){
                    this.target = soldier;
                   break;
                }
            }
            return;
        }
        const deltaPos = this.target.pos.sub(this.pos)
        const targetAngle = deltaPos.angle();
        const deltaAngle = engine.math.simplifyAngle(targetAngle - this.angle);
        const dir = deltaAngle > 0 ? 1 : -1;
        const rotAngle = dir * this.rotateSpeed * this.game.deltaTime;
        if (dir * rotAngle > dir * deltaAngle){
            this.angle = targetAngle;
        }
        else{
            this.angle = engine.math.simplifyAngle(this.angle + rotAngle);
        }
        if (Math.abs(deltaAngle) < this.maxFireAngle){
            this.fire();
        }
        if (deltaPos.sqrMagnitude() > this.approachDistance * this.approachDistance){
            this.move(deltaPos.normalized());
        }
    }
    onDeath(){
        new AISoldier(new engine.Vector(1, 1), new engine.Vector(1, 1)).hp = 1;
    }
}
AISoldier.prototype.fireRate = 1;
AISoldier.prototype.rotateSpeed = 6;
AISoldier.prototype.maxFireAngle = 0.4;
AISoldier.prototype.approachDistance = 5;

if (typeof window === "undefined"){
    module.exports = {Soldier, PlayerSoldier, AISoldier};
}
else {
    engine.Soldier = Soldier;
    engine.PlayerSoldier = PlayerSoldier;
    engine.AISoldier = AISoldier;
}