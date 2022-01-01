import AStar from './AStar';
import GridCell from './GridCell';
import { BodyState, StandingBodyState } from './BodyState';
import {
    MindState,
    LookingForActivityMindState,
    RoutingMindState,
    TravellingMindState,
    GoingToActivityMindState,
    DoingActivityMindState,
} from './MindState';
import Pulse from './Pulse';
import ActivityZone from './ActivityZone';
import { ActivityDefinition } from './dataLibraries/ActivityLibrary';
import { Activity } from './Activity';

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

    getPossibleLocalActivities(){
        return this.gridCell.grid.possibleActivities.filter((activity: ActivityDefinition) => {
            return activity.participantNeeds.length <= 1;
        });
    }

    doMindStates(){
        this.mindStates.forEach((mindState: MindState) => {
            mindState.do();
        })
    }

    startRouting(destination: GridCell | ActivityZone): RoutingMindState{
        const newState = new RoutingMindState(this, destination);
        this.mindStates.push(newState);
        newState.onDone.add(this.whenRoutingFinished);
        return newState;
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
    }

    startLookingForActivity(){
        const newJobSearch = new LookingForActivityMindState(this);
        this.mindStates.push(newJobSearch);
        newJobSearch.onDone.add(this.whenLookingForActivityFinished);
    }

    whenLookingForActivityFinished = (finishedMindState: LookingForActivityMindState) => {
        const { foundActivity } = finishedMindState;

        if(foundActivity) {
            this.mindStates.splice(this.mindStates.findIndex(mindState => mindState === finishedMindState), 1);
            this.startGoingToActivity(foundActivity);
        }
    }

    startGoingToActivity(activity: Activity){
        const goingState = new GoingToActivityMindState(this, activity);
        activity.location = this.gridCell.grid.getRandomAccessibleCell();
        this.startRouting(activity.location);
        this.mindStates.push(goingState);
        goingState.onDone.add(this.whenGoingToActivityFinished);
    }

    whenGoingToActivityFinished = (finishedMindState: GoingToActivityMindState) => {
        this.mindStates.splice(this.mindStates.findIndex(mindState => mindState === finishedMindState), 1);
        this.startDoingActivity(finishedMindState.activity);
    }

    startDoingActivity(activity: Activity){
        const doingState = new DoingActivityMindState(this, activity);
        doingState.onDone.add(this.whenDoingActivityFinished);
        this.mindStates.push(doingState);
    }

    whenDoingActivityFinished = (finishedMindState: DoingActivityMindState) => {
        this.mindStates.splice(this.mindStates.findIndex(mindState => mindState === finishedMindState))
        this.startLookingForActivity();
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
