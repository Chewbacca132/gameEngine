const render = {
    renderers : {},
    renderMode : {}
};

//a simple renderer which should be used for singleplayer games
render.renderMode.Renderer = class {
    constructor(spriteName, offsetX, offsetY, width, height){
        this.spriteName = spriteName;
        if (offsetX !== undefined){
            this.custom = true;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.width = width;
            this.height = height;
        }
        this.ended = false;
    }

    update(data, time, deltaTime){
        ["pos", "size", "angle", "id"].forEach((field) => {
            this[field] = data[field];
        });
    }
    
    render(camera, time){
        if (this.custom){
            camera.render(
                this.spriteName, this.pos, this.size, this.angle,
                this.offsetX, this.offsetY, this.width, this.height
            );
        }
        else{
            camera.render(this.spriteName, this.pos, this.size, this.angle);
        }
    }
}

//an interpolation renderer used for smoother movement in multiplayer games
render.renderMode.InterpolationRenderer = class extends render.renderMode.Renderer{    
    update(data, time){
        const state = new State(time, data);
        if (!this.currentState){
            this.currentState = state;
        }
        else if (!this.lastState){
            this.currentState.next = this.lastState = state;
        }
        else {
            this.lastState.next = state;
            this.lastState = this.lastState.next;
        }
    }

    render(camera, time){
        if (!this.lastState) return;
        const renderTime = time - this.delay;
        this.updateStates(renderTime);
        if (this.destroyed && renderTime > this.lastState.time) this.ended = true;
        const data = this.interpolate(renderTime);
        camera.render(this.spriteName, data.pos, this.currentState.data.size, data.angle);
    }

    updateStates(renderTime){
        while (this.currentState.next && this.currentState.next.next && renderTime > this.currentState.next.time){
            this.currentState = this.currentState.next;
        }
    }

    interpolate(renderTime){
        const current = this.currentState.data;
        const next = (this.currentState.next || this.currentState).data;
        const deltaTime = this.currentState.next.time - this.currentState.time;
        const timePassed = renderTime - this.currentState.time;
        const velocity = next.pos.sub(current.pos).div(deltaTime);
        const pos = current.pos.add(velocity.mult(timePassed));
        const angle = current.angle + engine.math.simplifyAngle(next.angle - current.angle) / deltaTime * timePassed;
        return {pos : pos, angle : angle}
    }
}
render.renderMode.InterpolationRenderer.prototype.delay = 100; //ms

//a renderer used for animations
render.renderMode.AnimationRenderer = class extends render.renderMode.Renderer{
    constructor(spriteName, playSpeed){
        super(spriteName);
        this.playSpeed = playSpeed;
    }
    update(data, time){
        this.data = data;
        if (!this.startTime) this.startTime = time;
    }

    render(camera, time){
        const index = this.playSpeed / 1000 * (time - this.startTime);
        let spriteSheetData;
        try {
            spriteSheetData = assetLoader.sprites[this.spriteName].get(index);
        }
        catch(error){
            if (error instanceof SpriteSheetIndexError){
                this.ended = true;
                return;
            }
            else throw error;
        }
        camera.render(
            this.spriteName,
            this.data.pos,
            this.data.size,
            this.data.angle,
            ...spriteSheetData
        );
    }
}


render.renderMode.InterpolatedAnimation = class extends render.renderMode.InterpolationRenderer{
    constructor(spriteName, playSpeed){
        super(spriteName);
        this.playSpeed = playSpeed;
        this.delay = 100;
    }

    update(data, time){
        if (!this.currentState){
            this.startTime = time;
        }
        super.update(data, time);
    }

    render(camera, time){
        const renderTime = time - this.delay;
        this.updateStates(renderTime);
        const data = this.interpolate(renderTime);
        const index = this.playSpeed / 1000 * (renderTime - this.startTime)
        let spriteSheetData;
        try {
            spriteSheetData = assetLoader.sprites[this.spriteName].get(index);
        }
        catch(error){
            this.ended = true;
            return;
        }
        console.log(spriteSheetData);
        camera.render(
            this.spriteName,
            data.pos,
            this.currentState.data.size,
            data.angle,
            ...spriteSheetData
        );
    }
}

//creates a new renderer
render.addRenderer = function(name, renderMode, ...params){
    this.renderers[name] = function(){
        return new renderMode(...params);  
    }
}
//every game object (which should be renderer) needs a specified renderer
//example:
//render.addRenderer("soldierRenderer", render.renderMode.Renderer, "soldierSprite")
  
class State{
    constructor(time, data){
        this.time = time;
        this.data = data;
    }
}
