import GridCell from './GridCell';
import Point2D from './Point2D';
import AStar from './AStar';
import Pulse from './Pulse';
import Boi from './Boi';
import UIManager from './UIManager';
import ActivityZone from './ActivityZone';
import { Activity } from './Activity';
import { ActivityDefinition } from './dataLibraries/ActivityLibrary';
import { globalGame } from './Game';

class Grid{
    id: number;
    width: number;
    height: number;
    cells: Array<Array<GridCell>>
    routes: Array<AStar>
    bois: Array<Boi>;
    uiManager: UIManager;
    zones: Array<ActivityZone>;
    activities: Array<Activity>;
    possibleActivities: Array<ActivityDefinition>;
    previewZone: ActivityZone | null;

    onGridUpdated: Pulse;
    constructor(width: number, height: number, uiManager: UIManager){
        this.id = Grid.nextId++;
        this.width = width;
        this.height = height;
        this.uiManager = uiManager;
        this.zones = [];
        this.activities = [];
        this.possibleActivities = [];
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

    getLocalCell(point: Point2D): GridCell{
        // if(point.x < 0) return;
        // if(point.y < 0) return;
        // if(point.x >= this.width) return;
        // if(point.y >= this.height) return;
        const realPoint = new Point2D(
            Math.min(Math.max(point.x, 0), this.width - 1),
            Math.min(Math.max(point.y, 0), this.height - 1)
        )
        return this.cells[realPoint.x][realPoint.y];
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

    findPath(from: GridCell, to: GridCell | ActivityZone){
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
            this.previewZone.location.leftTop = zoneStart;
            this.previewZone.location.rightBottom = zoneEnd;
        } else {
            console.log('creating new preview zone');
            this.previewZone = new ActivityZone(zoneStart, zoneEnd, this);
        }
        this.onGridUpdated.send(this.asData());
    }

    refreshPossibleLocalActivities(){
        const filteredActivities = (globalGame.game?.data.activities.list ?? []).filter(activity => {
            if(activity.zoneNeeds.length === 0) return true;
            if(this.zones.length > 0) return true;
            return false;
        });
        this.possibleActivities = filteredActivities;
    }

    createActivity(definition: ActivityDefinition, firstParticipant: Boi){
        const createdActivity = new Activity(definition);
        createdActivity.participants.push(firstParticipant);
        const possibleZones = this.getPossibleZonesForActivity(definition);
        // console.log(possibleZones);
        createdActivity.location = possibleZones.length > 0
            ? possibleZones[0].getRandomAccessibleCell()
            : this.getRandomAccessibleCell();

        return createdActivity
    }

    getPossibleZonesForActivity(definition: ActivityDefinition){
        return this.zones.filter(zone => {
            if(definition.zoneNeeds.includes('explicit')){
                if(zone) return true;
                return false;
            };
            return false;
        })
    }

    clearPreviewZone() {
        this.previewZone = null;
        this.onGridUpdated.send(this.asData());
    }

    FPS1(){
        this.refreshPossibleLocalActivities();
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
