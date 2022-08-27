class Time{
    constructor(){
        this.prevTime = performance.now();
        this.deltaTime = 1000;
    }

    update(){
        const time = performance.now();
        this.deltaTime = time - this.prevTime;
        this.prevTime = time;
    }
    time(){
        return performance.now();
    }
}