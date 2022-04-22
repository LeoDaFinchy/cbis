import Pulse from './Pulse';
import Grid from './Grid';
import UIManager from './UIManager';
import Point2D from './Point2D';
import { LibraryContainer } from './dataLibraries/LibraryContainer'

class Game {
    grids: Set<Grid>;
    data: LibraryContainer;
    uiManager: UIManager;

    onGameUpdated: Pulse;
    constructor(){
        this.grids = new Set();
        this.uiManager = new UIManager();
        this.uiManager.onCreateZone.add(this.createZone);
        this.uiManager.onPreviewZone.add(this.previewZone);
        this.uiManager.onPreviewZoneEnd.add(this.clearPreviewZone);

        this.onGameUpdated = new Pulse();
        this.data = new LibraryContainer();

        this.loadData();

        window.setInterval(() => this.FPS1(), 1000);
        window.setInterval(() => this.FPS5(), 1000/5);
        window.setInterval(() => this.FPS10(), 1000/10);
        window.setInterval(() => this.FPS60(), 1000/60);

        Object.assign(window, {game: this});
    }

    async loadData(){
        const activityData = await fetch('./data/activities.json');
        const activityJson = await activityData.json();

        this.data.loadFromJson(activityJson);
    }

    createGrid(width: number, height: number){
        const newGrid = new Grid(
            width,
            height,
            this.uiManager
        );
        this.grids.add(newGrid);

        this.onGameUpdated.send(this.asData());

        return newGrid;
    }

    createZone = (startZone: Point2D, endZone: Point2D, grid: Grid) => {
        console.log('Game creating zone');
        grid.createZone(startZone, endZone);
    }

    previewZone = (startZone: Point2D, endZone: Point2D, grid: Grid) => {
        grid.setPreviewZone(startZone, endZone);
    }
    clearPreviewZone = (grid: Grid) => {
        grid.clearPreviewZone();
    }

    FPS1(){
        this.grids.forEach(grid => {
            grid.FPS1();
        })
    }
    FPS5(){
        this.grids.forEach(grid => {
            grid.FPS5();
        })
    }
    FPS10(){
        this.grids.forEach(grid => {
            grid.FPS10();
        })
    }
    FPS60(){
        this.grids.forEach(grid => {
            grid.FPS60();
        })
    }

    asData(){
        return {
            gameData: this.data,
            grids: this.grids
        }
    }
}

class GlobalGameReference {
    game: Game | undefined;
}

export const globalGame = new GlobalGameReference();

export default Game;
