const game = new engine.Game(60, true);
window.addEventListener("load", () => game.start.call(game));


class Ball extends engine.GameObject {
    constructor(pos, size){
        super(pos, size, 0);
        this.setPhysics(
            new engine.physics.DynamicElastic(
                1,
                new engine.physics.colliders.Circle((size.x + size.y) / 4)
            )
        );
        this.renderer = "ball";
    }

    update(){
        const limitX = (rendering.camera.width - SIZE.x) / 2;
        const limitY = (rendering.camera.height - SIZE.y) / 2;
        if (this.pos.x > limitX || this.pos.x < -limitX){
            this.physics.velocity.x *= -1;
        }
        if (this.pos.y > limitY || this.pos.y < -limitY){
            this.physics.velocity.y *= -1;
        }
    }
}

const N = 20;
const SIZE = new engine.Vector(1, 1);
const SPEED = 1.5;

for (let i = 0; i < N; i++){
    const pos = new engine.Vector(
        engine.random.float(-4, 4),
        engine.random.float(-4, 4)
    );
    const velocityAngle = engine.random.float(-180, 180);
    const velocity = engine.Vector.atAngle(velocityAngle).mult(SPEED);
    const ball = new Ball(pos, SIZE);
    ball.physics.velocity = velocity;
}
