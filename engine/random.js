const random = {};
random.int = function(min, max){
    return min + Math.floor((max - min) * Math.random());
}

random.float = function(min, max){
    return min + (max - min) * Math.random();
}

if (typeof window === "undefined"){
    module.exports = random;
}
else _engine.random = random;