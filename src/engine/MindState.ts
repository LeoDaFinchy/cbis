import ActivityZone from './ActivityZone';
import AStar from './AStar';
import { StandingBodyState, WalkingBodyState } from './BodyState';
import Boi from './Boi';
import GridCell from './GridCell';
import Pulse from './Pulse';

export enum MindStateType {
    routingMindState,
    travellingMindState
}

export interface MindState {
    do(): any,
    onDone: Pulse,
    type: MindStateType
}

export class RoutingMindState implements MindState {
    route: AStar;
    boi: Boi;
    type: MindStateType;

    onDone: Pulse;
    constructor(boi: Boi, destination: GridCell | ActivityZone){
        this.boi = boi;
        this.route = this.boi.gridCell.grid.findPath(boi.gridCell, destination);
        this.type = MindStateType.routingMindState;

        this.onDone = new Pulse();
    }
    do(){
        const result = this.route.router.next();
        if(result.done){
            this.onDone.send(this);
        }
    }
}

export class TravellingMindState implements MindState {
    route: AStar;
    boi: Boi;
    type: MindStateType;

    onDone: Pulse;
    constructor(boi: Boi, route: AStar){
        this.boi = boi;
        this.route = route;
        this.type = MindStateType.travellingMindState;

        this.onDone = new Pulse();

        boi.bodyState = new WalkingBodyState(this.route.finalRoute as Array<GridCell>);
        boi.bodyState.onDone.add(this.whenWalkingBodyDone);
    }
    do(){

    }
    whenWalkingBodyDone = (finishedBodyState: WalkingBodyState) => {
        this.boi.bodyState = new StandingBodyState();
        this.onDone.send(this);
    }
}
