//maybe should be changed to json
input.addEvent("up", "w", true);
input.addEvent("down", "s", true);
input.addEvent("left", "a", true);
input.addEvent("right", "d", true);
input.addEvent("fire", "mouse0", true);

assetLoader.loadSprite("soldier", "https://opengameart.org/sites/default/files/styles/medium/public/survivor-idle_rifle_0.png");
assetLoader.loadSprite("bullet", "https://img.itch.zone/aW1hZ2UvNTQyMjE4LzI4ODUzNjUucG5n/347x500/Ohb8MN.png");
assetLoader.loadSpriteSheet("explosion", "https://jloog.com/images/drawn-explosion-sprite-1.png", 6, 8);

render.addRenderer("soldier", render.renderMode.InterpolationRenderer, "soldier");
render.addRenderer("bullet", render.renderMode.InterpolationRenderer, "bullet");
render.addRenderer("explosion", render.renderMode.AnimationRenderer, "explosion", 40);
render.addRenderer("muzzleFlash", render.renderMode.AnimationRenderer, "explosion", 120);