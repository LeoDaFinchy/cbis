import AStar from './AStar';
import GridCell from './GridCell';
import { BodyState, StandingBodyState } from './BodyState';
import { MindState, RoutingMindState, TravellingMindState } from './MindState';
import Pulse from './Pulse';

class Boi {
    id: number;
    gridCell: GridCell;

    bodyState: BodyState;
    mindStates: Array<MindState>;

    onBoiUpdated: Pulse;

    constructor(gridCell: GridCell){
        this.id = Boi.nextId++;
        this.gridCell = gridCell;
        this.bodyState = new StandingBodyState();
        this.mindStates = [];

        this.onBoiUpdated = new Pulse();
    }

    static nextId = 0;

    doBodyStateAction(){
        this.bodyState.do(this);
    }

    finishedBodyState(){
        this.bodyState = new StandingBodyState();
    }

    doMindStates(){
        this.mindStates.forEach((mindState: MindState) => {
            mindState.do();
        })
    }

    startRouting(destination: GridCell){
        const newState = new RoutingMindState(this, destination);
        this.mindStates.push(newState);
        newState.onDone.add(this.whenRoutingFinished);
    }

    whenRoutingFinished = (finishedMindState: RoutingMindState) => {
        this.mindStates.splice(this.mindStates.findIndex(mindState => mindState === finishedMindState), 1);
        this.startTravelling(finishedMindState.route);
        
        // console.log('finished Routing', finishedMindState);
    }

    startTravelling(route: AStar) {
        const newState = new TravellingMindState(this, route);
        this.mindStates.push(newState);
        newState.onDone.add(this.whenTravellingFinished);
    }

    whenTravellingFinished = (finishedMindState: TravellingMindState) => {
        this.mindStates.splice(this.mindStates.findIndex(mindState => mindState === finishedMindState), 1)
        this.startRouting(this.gridCell.grid.getRandomAccessibleCell());

        // console.log('finished Travelling', finishedMindState);
    }

    FPS1() {}
    FPS5() {
        this.doBodyStateAction();
        this.onBoiUpdated.send(this);
    }
    FPS10() {
        this.doMindStates();
        this.onBoiUpdated.send(this);
    }
    FPS60() {}

    asData(){
        return {
            id: this.id,
            gridCell: this.gridCell.asData(),
            bodyState: this.bodyState,
            mindStates: this.mindStates
        }
    }
}


export default Boi;
