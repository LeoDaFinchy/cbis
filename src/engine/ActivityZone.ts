import Grid from './Grid';
import GridCell from './GridCell';
import Point2D from './Point2D';

class ActivityZone {
    id: number;
    start: Point2D;
    end: Point2D;
    grid: Grid;

    constructor(start: Point2D, end: Point2D, grid: Grid){
        this.start = start;
        this.end = end;
        this.grid = grid;
        this.id = ActivityZone.nextId++;
    }

    static nextId = 0;

    contains(gridCell: GridCell){
        const inWest = gridCell.position.x >= this.start.x;
        const inNorth = gridCell.position.y >= this.start.y;
        const inEast = gridCell.position.x <= this.end.x;
        const inSouth = gridCell.position.y <= this.end.y;
        return inWest && inNorth && inEast && inSouth;
    }
}

export default ActivityZone;
