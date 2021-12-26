import GridCell from './GridCell';
import Point2D from './Point2D';
import AStar from './AStar';
import Pulse from './Pulse';
import Boi from './Boi';
import UIManager from './UIManager';
import ActivityZone from './ActivityZone';

class Grid{
    id: number;
    width: number;
    height: number;
    cells: Array<Array<GridCell>>
    routes: Array<AStar>
    bois: Array<Boi>;
    uiManager: UIManager;
    zones: Array<ActivityZone>;
    previewZone: ActivityZone | null;

    onGridUpdated: Pulse;
    constructor(width: number, height: number, uiManager: UIManager){
        this.id = Grid.nextId++;
        this.width = width;
        this.height = height;
        this.uiManager = uiManager;
        this.zones = [];
        this.previewZone = null;
        this.cells = new Array(width).fill(null).map(
            (v, i) => new Array(height).fill(null).map(
                (w, j) => {
                    const newGridCell = new GridCell(this, i, j, this.uiManager);
                    newGridCell.onGridCellSpawnedBoi.add(this.whenGridCellSpawnedBoi);
                    return newGridCell;
                }
            )
        );
        this.routes = [];
        this.bois = [];

        this.onGridUpdated = new Pulse();
    }

    getLocalCell(point: Point2D): GridCell | undefined{
        if(point.x < 0) return;
        if(point.y < 0) return;
        if(point.x >= this.width) return;
        if(point.y >= this.height) return;
        return this.cells[point.x][point.y];
    }

    getRandomCell(): GridCell {
        const x = Math.floor(Math.random() * this.width);
        const y = Math.floor(Math.random() * this.height);
        return this.cells[x][y];
    }

    getRandomAccessibleCell(): GridCell {
        let cell = this.getRandomCell();
        while (cell.TEMP_terrain_type === 1) {
            cell = this.getRandomCell();
        }
        return cell;
    }

    findPath(from: GridCell, to: GridCell){
        const pathfinder = new AStar(from, to);
        this.routes.push(pathfinder);
        this.onGridUpdated.send(this.asData());
        return pathfinder;
    }

    whenGridCellSpawnedBoi = (boi: Boi) => {
        this.bois.push(boi);
        boi.onBoiUpdated.add(this.whenBoiUpdated);
    }

    whenBoiUpdated = (boiData: {}) => {
        this.onGridUpdated.send(this.asData());
    }

    createZone(zoneStart: Point2D, zoneEnd: Point2D){
        const newZone = new ActivityZone(zoneStart, zoneEnd, this);
        this.zones.push(newZone);
        this.onGridUpdated.send(this.asData());
    }

    setPreviewZone(zoneStart: Point2D, zoneEnd: Point2D){
        // console.log(zoneStart, zoneEnd);
        if(this.previewZone) {
            console.log('updating preview zone', this.previewZone.id);
            this.previewZone.start = zoneStart;
            this.previewZone.end = zoneEnd;
        } else {
            console.log('creating new preview zone');
            this.previewZone = new ActivityZone(zoneStart, zoneEnd, this);
        }
        this.onGridUpdated.send(this.asData());
    }

    clearPreviewZone() {
        this.previewZone = null;
        this.onGridUpdated.send(this.asData());
    }

    FPS1(){
        this.bois.forEach(boi => {
            boi.FPS1();
        })
    }
    FPS5(){
        this.bois.forEach(boi => {
            boi.FPS5();
        })
    }
    FPS10(){
        this.bois.forEach(boi => {
            boi.FPS10();
        })
    }
    FPS60(){
        this.bois.forEach(boi => {
            boi.FPS60();
        })
    }

    asData(){
        return {
            id: this.id,
            width: this.width,
            height: this.height,
            cells: this.cells,
            routes: this.routes,
            zones: this.zones,
            previewZone: this.previewZone
        }
    }

    static nextId = 0;
}

export default Grid;
