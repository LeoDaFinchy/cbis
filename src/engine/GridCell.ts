import Boi from './Boi';
import Grid from './Grid';
import Pulse from './Pulse';
import Point2D from './Point2D';
import UIManager from './UIManager';
import { Container, Item } from './Item';

class GridCell implements Container {
    grid: Grid;
    location: Point2D;
    TEMP_terrain_type: number;
    entities: Set<Boi>;
    uiManager: UIManager;

    onGridCellUpdated: Pulse;
    onGridCellAcquiredItem: Pulse;
    onGridCellSpawnedBoi: Pulse;
    contents: Array<Item>;

    constructor(grid: Grid, x: number, y: number, uiManager: UIManager) {
        this.grid = grid;
        this.location = new Point2D(x, y);
        this.TEMP_terrain_type = 0;
        this.entities = new Set();
        this.uiManager = uiManager;
        this.contents = [];

        this.onGridCellUpdated = new Pulse();
        this.onGridCellAcquiredItem = new Pulse();
        this.onGridCellSpawnedBoi = new Pulse();
    }

    get passable(){
        return true;
    }

    addToContents(item: Item){
        this.contents.push(item);
        this.onGridCellAcquiredItem.send(item);
        this.onGridCellUpdated.send(this.asData());
        return this;
    }

    spawnBoi(){
        const newBoi = new Boi(this);
        this.entities.add(newBoi);
        this.onGridCellUpdated.send(this.asData());

        this.onGridCellSpawnedBoi.send(newBoi);

        return newBoi;
    }

    gridCellPressed(){
        this.uiManager.receiveGridCellPress(this);
    }

    gridCellEntered(){
        this.uiManager.receiveGridCellEnter(this);
    }

    gridCellReleased(){
        this.uiManager.receiveGridCellRelease(this);
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
        return this.grid.getLocalCell(this.location.plus(new Point2D(0, -1)));
    }

    get south(): GridCell | undefined{
        return this.grid.getLocalCell(this.location.plus(new Point2D(0, 1)));
    }

    get east(): GridCell | undefined{
        return this.grid.getLocalCell(this.location.plus(new Point2D(1, 0)));
    }

    get west(): GridCell | undefined{
        return this.grid.getLocalCell(this.location.plus(new Point2D(-1, 0)));
    }

    asData(){
        return {
            grid: this.grid,
            position: this.location.asData(),
            TEMP_terrain_type: this.TEMP_terrain_type,
            bois: this.entities,
            contents: this.contents,
            cycleTEMP_terrain_type: this.cycleTEMP_terrain_type.bind(this),
            gridCellPressed: this.gridCellPressed.bind(this),
            gridCellReleased: this.gridCellReleased.bind(this),
            gridCellEntered: this.gridCellEntered.bind(this)
        }
    }
}

export default GridCell;
