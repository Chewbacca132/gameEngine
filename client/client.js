const socket = new io();
const camera = new Camera(Vector.zero(), "white");
const timer = new Time();
camera.setHeight(10);
const renderers = {};
let renderRate = 120;
let ready = false;


socket.on("sync", function(data){
    timer.update();
    const time = timer.time();
    for (const id in renderers){
        if (!data.hasOwnProperty(id)){
            if (renderers[id].ended) delete renderers[id];
            else renderers[id].destroyed = true;
        }
    }
    for (const id in data){
        objData = data[id];
        vectorize(objData);
        if (!renderers.hasOwnProperty(id)){
            renderers[id] = render.renderers[objData.renderer]();
        }
        renderers[id].update(objData, time);
    }
    input.update();
    socket.emit("input", input.data());
})
window.addEventListener("load", function(){
    renderObjects();
    ready = true;
});

function vectorize(data){
    data.pos = engine.Vector.new(data.pos);
    data.size = engine.Vector.new(data.size);
}

function renderObjects(){
    setTimeout(renderObjects, 1000 / renderRate);
    camera.reset();
    const time = timer.time();
    for (let renderer of Object.values(renderers)){
        if (renderer.ended) continue;
        renderer.render(camera, time);
    }
}