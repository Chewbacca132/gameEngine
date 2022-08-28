var engine;
if (typeof window === "undefined"){
    engine = require("./engine");
}
else engine = _engine;

class NaNVectorError extends Error{
    constructor(message){
        super(message);
        this.name = "NaNVectorError";
    }
}

const checkNaN = function(n){
    if (isNaN(n)){
        throw(new NaNVectorError("the argument of a vector operation cannot be NaN"));
    }
}

const checkNaNVector = function(v){
    if (!(v instanceof Vector)) throw(new NaNVectorError("must be of type Vector"));
    if (isNaN(v.x)) throw(new NaNVectorError("x property of vector cannot be NaN"));
    if (isNaN(v.y)) throw(new NaNVectorError("y property of vector cannot be NaN"));
}
class Vector {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(v){
        checkNaNVector(v);
        return new Vector(this.x + v.x, this.y + v.y);
    }

    sub(v){
        checkNaNVector(v);
        return new Vector(this.x - v.x, this.y - v.y);
    }

    mult(n){
        checkNaN(n)
        return new Vector(this.x * n, this.y * n);
    }

    div(n){
        checkNaN(n)
        return new Vector(this.x / n, this.y / n);
    }

    opposite(n){
        checkNaN(n)
        return new Vector(-this.x, -this.y);
    }

    angle(){
        return Math.atan2(this.y, this.x);
    }

    sqrMagnitude(){
        return this.x ** 2 + this.y ** 2;
    }

    magnitude(){
        return Math.sqrt(this.sqrMagnitude());
    }

    normalized(){
        return this.div(this.magnitude());
    }
    
    round(){
        return new Vector(Math.round(this.x), Math.round(this.y));
    }

    static zero(){
        return new Vector(0, 0);
    }

    static atAngle(angle){
        const radAngle = angle * engine.math.deg2rad;
        return new Vector(Math.cos(radAngle), Math.sin(radAngle));
    }

    static up(){
        return new Vector(0, 1);
    }
    static down(){
        return new Vector(0, -1);
    }
    static left(){
        return new Vector(-1, 0);
    }
    static right(){
        return new Vector(1, 0);
    }

    copy(){
        return new Vector(this.x, this.y);
    }

    //creates a new Vector object from a serialized vector (pure object)
    static new(obj){
        const v = new Vector(obj.x, obj.y);
        checkNaNVector(v);
        return v;
    }

    equals(v){
        return (this.x === v.x && this.y === v.y);
    }
}

if (typeof window === "undefined"){
    module.exports = Vector;   
}
else engine.Vector = Vector;