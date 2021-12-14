import GridCell from './GridCell';

class Boi {
    id: number;
    gridCell: GridCell
    constructor(gridCell: GridCell){
        this.id = Boi.nextId++;
        this.gridCell = gridCell;
    }

    static nextId = 0;

    asData(){
        return {
            id: this.id
        }
    }
}


export default Boi;
