const math = {}
math.fracPI2 = Math.PI / 2;
math.sqrt2 = Math.sqrt(2);

math.simplifyAngle = function(angle){
    angle = angle % (2 * Math.PI);
    if (angle > Math.PI){
        return angle - 2 * Math.PI;
    }
    if (angle < -Math.PI){
        return angle + 2 * Math.PI;
    }
    return angle;
}

//returns the difference of two angles in radians as atan2 function returns
//if dir is not specified, returns the smaller one
math.angleDiff = function(angle1, angle2, dir){
    let angle = (math.simplifyAngle(angle1 - angle2));
    return Math.abs(angle);
}

if (typeof window === "undefined"){
    module.exports = math;
}
else _engine.math = math;