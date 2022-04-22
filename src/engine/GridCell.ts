import Boi from './Boi';
import Grid from './Grid';
import Pulse from './Pulse';
import Point2D from './Point2D';

class GridCell{
    grid: Grid;
    position: Point2D;
    TEMP_terrain_type: number;
    entities: Set<Boi>;

    onGridCellUpdated: Pulse;
    onGridCellSpawnedBoi: Pulse;

    constructor(grid: Grid, x: number, y: number) {
        this.grid = grid;
        this.position = new Point2D(x, y);
        this.TEMP_terrain_type = 0;
        this.entities = new Set();

        this.onGridCellUpdated = new Pulse();
        this.onGridCellSpawnedBoi = new Pulse();
    }

    get passable(){
        return true;
    }

    spawnBoi(){
        const newBoi = new Boi(this);
        this.entities.add(newBoi);
        this.onGridCellUpdated.send(this.asData());

        this.onGridCellSpawnedBoi.send(newBoi);

        return newBoi;
    }

    claimBoi(boi: Boi){
        boi.gridCell.entities.delete(boi);
        boi.gridCell.onGridCellUpdated.send(boi.gridCell.asData())
        this.entities.add(boi);
        boi.gridCell = this;
        this.onGridCellUpdated.send(this.asData());
    }

    cycleTEMP_terrain_type() {
        this.TEMP_terrain_type = (this.TEMP_terrain_type + 1) % 2;
        this.onGridCellUpdated.send(this.asData());
    }

    get north(): GridCell | undefined{
        return this.grid.getLocalCell(this.position.plus(new Point2D(0, -1)));
    }

    get south(): GridCell | undefined{
        return this.grid.getLocalCell(this.position.plus(new Point2D(0, 1)));
    }

    get east(): GridCell | undefined{
        return this.grid.getLocalCell(this.position.plus(new Point2D(1, 0)));
    }

    get west(): GridCell | undefined{
        return this.grid.getLocalCell(this.position.plus(new Point2D(-1, 0)));
    }

    asData(){
        return {
            grid: this.grid,
            position: this.position.asData(),
            TEMP_terrain_type: this.TEMP_terrain_type,
            bois: this.entities,
            cycleTEMP_terrain_type: this.cycleTEMP_terrain_type.bind(this)
        }
    }
}

export default GridCell;
