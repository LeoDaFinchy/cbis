import Boi from './Boi';
import Grid from './Grid';

class GridLocation{
    grid: Grid;
    x: number;
    y: number;
    references: Set<Boi>;
    constructor(grid: Grid, x: number, y: number){
        this.grid = grid;
        this.x = x;
        this.y = y;
        this.references = new Set();
    }
}

export default GridLocation;
