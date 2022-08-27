document.addEventListener("keydown", function(event){
    input._keys[event.key] = true;
});

document.addEventListener("keyup", function(event){
    input._keys[event.key] = false;
});

window.addEventListener("mousemove", function(event){
    input.mousePos = new Vector(event.clientX, event.clientY);
});

window.addEventListener("mousedown", function(event){
    input._mouse[event.button] = true;
    input._mouseDown[event.button] = true;
    
});

window.addEventListener("mouseup", function(event){
    input._mouse[event.button] = false;
});

const input = {mousePos: new Vector(0, 0)};
input._keys = {}; //current key state (true if pressed, false if not)
input._prevKeys = {}; //key state before the last update
input._mouse = {};
input._mouseDown = {};
input._events = {};
input.events = {};


input.update = function(){
    this.events = {};
    if (this.mouseDown()) console.log("clicked");
    for (let key in this._events){
        const event = this._events[key];
        if (key.substring(0, 5) === "mouse"){
            const button = key[5];
            if (this.mouseDown(button) || (event.continuous && this.mouse(button))){
                this.events[event.name] = true;
            }
        }
        if (this.keyDown(key) || (event.continuous && this.key(key))){
            this.events[event.name] = true;
        }
    }
    this._prevKeys = this._keys;
    this._keys = {};
    for (let key in this._prevKeys){
        if (this._prevKeys[key]){
            this._keys[key] = true;
        }
    }
    this._mouseDown = {};
}

input.key = function(key){ //returns true if the key is being pressed or was pressed down and released
    return Boolean(this._keys[key]);
}

input.keyDown = function(key){ //returns true if the key was pressed down after the last update
    return this.key(key) && !this._prevKeys[key];
}

input.mouse = function(button = 0){ //0 for main button, 1 for wheel button, 2 for secondary button
    return Boolean(this._mouse[button]);
}

input.mouseDown = function(button = 0){
    return Boolean(this._mouseDown[button]);
}

input.addEvent = function(name, key, continuous = true){
    this._events[key] = {name : name, continuous : continuous};
}

input.data = function(){
    return {
        events : this.events,
        mousePos : rendering.camera.screenToWorldPoint(this.mousePos),
        clicked : this.mouseDown()
    };
}