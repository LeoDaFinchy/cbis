import Boi from './Boi';
import Grid from './Grid';
import Pulse from './Pulse';

class GridCell{
    grid: Grid;
    x: number;
    y: number;
    TEMP_terrain_type: number;
    entities: Set<Boi>;

    onGridCellUpdated: Pulse;

    constructor(grid: Grid, x: number, y: number) {
        this.grid = grid;
        this.x = x;
        this.y = y;
        this.TEMP_terrain_type = 0;
        this.entities = new Set();

        this.onGridCellUpdated = new Pulse();
    }

    get passable(){
        return true;
    }

    spawnBoi(){
        const newBoi = new Boi(this);
        this.entities.add(newBoi);
        this.onGridCellUpdated.send(this.asData());
        return newBoi;
    }

    cycleTEMP_terrain_type() {
        this.TEMP_terrain_type = (this.TEMP_terrain_type + 1) % 10;
        this.onGridCellUpdated.send(this.asData());
    }

    get north(): GridCell | undefined{
        return this.grid.getLocalCell(this.x, this.y - 1);
    }

    get south(): GridCell | undefined{
        return this.grid.getLocalCell(this.x, this.y + 1);
    }

    get east(): GridCell | undefined{
        return this.grid.getLocalCell(this.x + 1, this.y);
    }

    get west(): GridCell | undefined{
        return this.grid.getLocalCell(this.x - 1, this.y);
    }

    asData(){
        return {
            grid: this.grid,
            x: this.x,
            y: this.y,
            TEMP_terrain_type: this.TEMP_terrain_type,
            entities: this.entities,
            cycleTEMP_terrain_type: this.cycleTEMP_terrain_type.bind(this)
        }
    }
}

export default GridCell;
