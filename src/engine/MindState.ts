import { Activity } from './Activity';
import ActivityZone from './ActivityZone';
import AStar from './AStar';
import { StandingBodyState, WalkingBodyState } from './BodyState';
import Boi from './Boi';
import GridCell from './GridCell';
import Pulse from './Pulse';

export enum MindStateType {
    routingMindState,
    travellingMindState,
    lookingForActivityMindState,
    goingToActivityMindState,
    doingActivityMindState
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
        // console.log('MindStateType.routingMindState');

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
        // console.log('MindStateType.travellingMindState');

    }
    whenWalkingBodyDone = (finishedBodyState: WalkingBodyState) => {
        this.boi.bodyState = new StandingBodyState();
        this.onDone.send(this);
    }
}

export class LookingForActivityMindState implements MindState {
    boi: Boi;
    type: MindStateType;
    foundActivity: Activity | null;

    onDone: Pulse;
    constructor(boi: Boi){
        this.boi = boi;
        this.type = MindStateType.lookingForActivityMindState;
        this.foundActivity = null;

        this.onDone = new Pulse();
    }

    do(){
        // console.log('MindStateType.lookingForActivityMindState');

        const activityOptions = this.boi.getPossibleLocalActivities();
        const validForMe = activityOptions.filter(activity => activity.evaluateParticipantNeeds(this.boi));

        if(validForMe.length > 0){
            this.foundActivity = new Activity(validForMe[0]);
            this.onDone.send(this);
        }
    }
}

export class GoingToActivityMindState implements MindState {
    boi: Boi;
    type: MindStateType;
    activity: Activity;

    onDone: Pulse;

    constructor(boi: Boi, activity: Activity){
        this.boi = boi;
        this.type = MindStateType.goingToActivityMindState;
        this.activity = activity;

        this.onDone = new Pulse();
    }

    do(){
        console.log('MindStateType.goingToActivityMindState');
        if(this.boi.gridCell === this.activity.location) {
            this.onDone.send(this);
        }
    }
}

export class DoingActivityMindState implements MindState {
    boi: Boi;
    type: MindStateType;
    activity: Activity;
    timeoutId: number;

    onDone: Pulse;

    constructor(boi: Boi, activity: Activity){
        this.boi = boi;
        this.type = MindStateType.doingActivityMindState;
        this.activity = activity;

        this.onDone = new Pulse();
        this.timeoutId = window.setTimeout(this.whenTimeoutHasElapsed, activity.definition.timePeriodMS)
    }

    whenTimeoutHasElapsed = () => {
        console.log('timeoutover')
        this.onDone.send(this);
    }

    do(){
        console.log('MindStateType.doingActivityMindState');
    }
}
