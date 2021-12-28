import Grid from './Grid';
import GridCell from './GridCell';
import Point2D from './Point2D';
import Rect2D from './Rect2D';

class ActivityZone {
    id: number;
    location: Rect2D;
    grid: Grid;

    constructor(start: Point2D, end: Point2D, grid: Grid){
        this.location = new Rect2D(start, end);
        this.grid = grid;
        this.id = ActivityZone.nextId++;
    }

    static nextId = 0;

    contains(gridCell: GridCell): boolean{
        return this.location.contains(gridCell.location);
    }
}

export default ActivityZone;
