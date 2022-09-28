import { Activity } from './Activity';
import ActivityZone from './ActivityZone';
import AStar from './AStar';
import { StandingBodyState, WalkingBodyState } from './BodyState';
import Boi from './Boi';
import { ActivityDefinition } from './dataLibraries/ActivityLibrary';
import GridCell from './GridCell';
import Pulse from './Pulse';
import { requisition } from './Quartermaster';

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
    do(){}
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
        const activityOptions = this.boi.getPossibleLocalActivities();
        // already filtered to include zoning in the local area, and things this boi can do
        const validForMe = activityOptions.filter(activity => activity.evaluateParticipantNeeds(this.boi));

        if(validForMe.length > 0){
            const prioritisedActivities = this.prioritiseValidActivities(validForMe);
            while(this.foundActivity === null){
                const randomSelector = Math.floor(Math.random() * prioritisedActivities[0].activities.length);
                const randomSelection = prioritisedActivities[0].activities[randomSelector];

                const requisitionItems = requisition(randomSelection, this.boi.gridCell.grid.localGridItems);
                if(requisitionItems){
                    const foundActivity = this.boi.gridCell.grid.createActivity(randomSelection, this.boi);
                    // console.log(requisitionItems)
                    this.foundActivity = foundActivity;
                    requisitionItems.items.forEach(requisition => {
                        foundActivity.tools.push(requisition.claim(foundActivity));
                    })
                    this.boi.gridCell.grid.localGridItems.absorbInventory(requisitionItems);
                }
            }
            // console.log(this.foundActivity);
            this.onDone.send(this);
        }
    }

    prioritiseValidActivities(filteredActivities: Array<ActivityDefinition>)
        : Array<{priorityLevel: number, activities: Array<ActivityDefinition>}>
    {
        const prioritisedActivities: Map<number, Array<ActivityDefinition>> = new Map();
        filteredActivities.forEach((activity: ActivityDefinition) => {
            const activityPriority = 1;
            prioritisedActivities.set(activityPriority, [
                ...(prioritisedActivities.get(activityPriority) || []),
                activity
            ]);
        });

        const entries = [...prioritisedActivities.entries()];
        const entriesObjects = entries.map(([priorityLevel, activities]) => ({priorityLevel: priorityLevel, activities: activities}))

        return entriesObjects;
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
        // console.log('MindStateType.goingToActivityMindState');
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

    finishActivity(){
        this.activity.tools.map(claim => claim.release())
    }

    whenTimeoutHasElapsed = () => {
        this.finishActivity();
        this.onDone.send(this);
    }

    do(){}
}
