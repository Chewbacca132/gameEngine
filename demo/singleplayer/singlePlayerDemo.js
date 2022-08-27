console.log(engine);
const game = new engine.Game(60);
const player = new engine.Soldier(new engine.Vector(0, 0), new engine.Vector(1, 1));
window.addEventListener("load", game.start.call(game));
