var engine;
if (typeof window === "undefined"){
    engine = require("./engine");
}
else engine = _engine;

const assetLoader = {};
assetLoader.sprites = {};
assetLoader.sounds = {};

assetLoader.loadSprite = function(name, path, angleOffset = 0){
    this.sprites[name] = new Sprite(path, angleOffset);
}

assetLoader.loadSound = function(name, path){
    let sound = new Audio();
    sound.src = path;
    this.sounds[name] = sound;
}


assetLoader.loadSpriteSheet = function(name, path, rows, columns){
    this.sprites[name] = new SpriteSheet(path, rows, columns);
}


class Sprite {
    constructor(src, angleOffset){
        this.img = new Image();
        this.img.src = src;
        this.angleOffset = angleOffset
    }
}

class SpriteSheet extends Sprite {
    constructor(src, rows, columns, count){
        super(src, 0);
        this.rows = rows;
        this.columns = columns;
        this.count = count || rows * columns;
    }
    //returns [top left corner x, top left corner y, width, height] of the indexth subimage
    get(index_){
        const index = Math.round(index_);
        if (index > this.count){
            throw new SpriteSheetIndexError();
        }
        const column = (index % this.columns) || this.columns;
        const row = (index - column) / this.columns + 1;
        const width = Math.round(this.img.width / this.columns);
        const height = Math.round(this.img.height / this.rows);
        return [
            (column - 1) * width,
            (row - 1) * height,
            width,
            height
        ];
    }
}

class SpriteSheetIndexError extends Error{
}

if (typeof window === "undefined"){
    module.exports = GameObject;
}
else _engine.render = render;