const socket = new io();
let clientRenderRate = 120;
let loaded = false;


function vectorize(data){
    data.pos = engine.Vector.new(data.pos);
    data.size = engine.Vector.new(data.size);
}

function multiplayerRender(){
    setTimeout(multiplayerRender, 100 / clientRenderRate);
    rendering.renderObjects();
}

socket.on("sync", function(renderData){
    if (!loaded) return;
    //turn serialized values back to vectors
    for (const id in renderData){
        vectorize(renderData[id]);
    }
    //update renderers
    rendering.updateRenderers(renderData);
    input.update();
    //send input to the server
    socket.emit("input", input.data());
})

window.addEventListener("load", function(){
    multiplayerRender();
    loaded = true;
});