import Boi from './Boi';
import GridCell from './GridCell';
import Pulse from './Pulse';

export enum BodyStateType {
    standingBodyState,
    walkingBodyState
}

export interface BodyState {
    do(boi: Boi): any
    onDone: Pulse,
    type: BodyStateType
}

export class StandingBodyState implements BodyState {
    type: BodyStateType;
    onDone: Pulse;
    constructor(){
        this.type = BodyStateType.standingBodyState

        this.onDone = new Pulse();
    }
    do(boi: Boi){

    }
}

export class WalkingBodyState implements BodyState {
    route: Array<GridCell>;
    type: BodyStateType;
    onDone: Pulse;
    constructor(route: Array<GridCell>){
        this.route = route;
        this.type = BodyStateType.walkingBodyState

        this.onDone = new Pulse();
    }
    do(boi: Boi){
        const currentCell = boi.gridCell;
        if(this.route[this.route.length - 1]?? null === currentCell){
            this.route.pop();
            if(this.route.length <= 0){
                this.onDone.send(this);
                return
            }
        }
        this.route[this.route.length - 1].claimBoi(boi);
    }
}
