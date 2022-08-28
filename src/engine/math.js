const math = {}
math.fracPI2 = Math.PI / 2;
math.sqrt2 = Math.sqrt(2);
math.rad2deg = 180 / Math.PI;
math.deg2rad = Math.PI / 180;

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

//returns the difference of two angles in radians
math.angleDiff = function(angle1, angle2){
    let angle = (math.simplifyAngle(angle1 - angle2));
    return Math.abs(angle);
}

if (typeof window === "undefined"){
    module.exports = math;
}
else _engine.math = math;