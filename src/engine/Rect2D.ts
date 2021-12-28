import Point2D from './Point2D';
import RelativeLocation from './RelativeLocation';

class Rect2D implements RelativeLocation{
    leftTop: Point2D
    rightBottom: Point2D
    constructor(leftTop: Point2D, rightBottom: Point2D){
        this.leftTop = leftTop;
        this.rightBottom = rightBottom;
        this.rearrange();
    }

    nearestToPoint(point: Point2D): Point2D{
        const x = this.pointIsWest(point) ? this.leftTop.x
            : this.pointIsEast(point) ? this.rightBottom.x
            : point.x;
        const y = this.pointIsNorth(point) ? this.leftTop.y
            : this.pointIsSouth(point) ? this.rightBottom.y
            : point.y;
        return new Point2D(x, y);
    }

    contains(point: Point2D): boolean {
        return !this.pointIsWest(point) && !this.pointIsNorth(point) && !this.pointIsEast(point) && !this.pointIsSouth(point);
    }

    pointIsWest(point: Point2D): boolean {
        return point.x < this.leftTop.x;
    }

    pointIsNorth(point: Point2D): boolean {
        return point.y < this.leftTop.y;
    }

    pointIsEast(point: Point2D): boolean {
        return point.x > this.rightBottom.x;
    }

    pointIsSouth(point: Point2D): boolean {
        return point.y > this.rightBottom.y;
    }

    rearrange(){
        [this.leftTop, this.rightBottom] = this.leftTop.rearrangedToRectangleLTRB(this.rightBottom);
    }
}

export default Rect2D;
