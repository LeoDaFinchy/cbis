import Pulse from './Pulse';
import Grid from './Grid';

class Game {
    grids: Set<Grid>;

    onGameUpdated: Pulse;
    // onFPS1: Pulse;
    // onFPS10: Pulse;
    // onFPS60: Pulse;
    constructor(){
        this.grids = new Set();
        
        this.onGameUpdated = new Pulse();
        // this.onFPS1 = new Pulse();
        // this.onFPS10 = new Pulse();
        // this.onFPS60 = new Pulse();

        window.setInterval(() => this.FPS1(), 1000);
        window.setInterval(() => this.FPS5(), 1000/5);
        window.setInterval(() => this.FPS10(), 1000/10);
        window.setInterval(() => this.FPS60(), 1000/60);
    }

    createGrid(width: number, height: number){
        const newGrid = new Grid(
            width,
            height
        );
        this.grids.add(newGrid);
        this.grids = new Set(this.grids);

        this.onGameUpdated.send(this.asData());

        return newGrid;
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
            grids: this.grids
        }
    }
}

export default Game;
