import Pulse from './Pulse';
import Grid from './Grid';

class Game {
    grids: Set<Grid>;
    onGameUpdated: Pulse;
    constructor(){
        this.grids = new Set();
        
        this.onGameUpdated = new Pulse();
    }

    createGrid(width: number, height: number){
        const newGrid = new Grid(width, height);
        this.grids.add(newGrid);
        this.grids = new Set(this.grids);

        this.onGameUpdated.send(this.asData());

        return newGrid;
    }

    asData(){
        return {
            grids: this.grids
        }
    }
}

export default Game;
