const timer = new Time();
//used both for multiplayer and singleplayer

const rendering = {
    camera : new Camera(Vector.zero(), "white"),
    renderers: {}
}

rendering.camera.setHeight(10);

rendering.updateRenderers = function(renderData){
    timer.update();
    const time = timer.time();
    //remove renderers of destroyed gameobjects
    for (const id in this.renderers){
        if (!renderData.hasOwnProperty(id)){
            if (this.renderers[id].ended) delete this.renderers[id];
            else this.renderers[id].destroyed = true;
        }
    }
    //check for new renderers and update existing ones
    for (const id in renderData){
        objData = renderData[id];
        if (!this.renderers.hasOwnProperty(id)){
            this.renderers[id] = render.renderers[objData.renderer]();
        }
        this.renderers[id].update(objData, time);
    }
}


rendering.renderObjects = function(){
    this.camera.reset();
    const time = timer.time();
    for (let renderer of Object.values(this.renderers)){
        if (renderer.ended) continue;
        renderer.render(this.camera, time);
    }
}