class Point2D {
    x: number;
    y: number;
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
    get 0(){return this.x}
    get 1(){return this.y}

    *[Symbol.iterator](){
        yield this.x;
        yield this.y;
    }

    vectorTo(point: Point2D){
        return new Point2D(point.x - this.x, point.y - this.y);
    }

    scaledBy([x, y = x]: [number, number]){
        return new Point2D(this.x * x, this.y * y);
    }

    length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    floored(){
        return new Point2D(Math.floor(this.x), Math.floor(this.y));
    }

    plus(point: Point2D){
        return new Point2D(this.x + point.x, this.y + point.y)
    }

    asArray() {
        return [this.x, this.y]
    }

    asData() {
        return {
            x: this.x,
            y: this.y
        }
    }

    static unitRandom(){
        return new Point2D(Math.random(), Math.random());
    }
}

export default Point2D;