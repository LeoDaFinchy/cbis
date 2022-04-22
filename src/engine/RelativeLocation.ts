import Point2D from './Point2D';

interface RelativeLocation {
    nearestToPoint(this: RelativeLocation, other: Point2D): Point2D
}

export default RelativeLocation;
