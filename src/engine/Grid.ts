import GridCell from './GridCell';
class Grid{
    id: number;
    width: number;
    height: number;
    cells: Array<Array<GridCell>>;
    constructor(width: number, height: number){
        this.id = Grid.nextId++;
        this.width = width;
        this.height = height;
        this.cells = new Array(width).fill(null).map(
            (v, i) => new Array(height).fill(null).map(
                (w, j) => new GridCell(this, i, j)
            )
        );
    }

    getLocalCell(x: number, y: number): GridCell | undefined{
        if(x < 0) return;
        if(y < 0) return;
        if(x >= this.width) return;
        if(y >= this.height) return;
        return this.cells[x][y];
    }

    static nextId = 0;
}

export default Grid;
