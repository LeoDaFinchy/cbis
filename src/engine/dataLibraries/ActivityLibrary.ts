import Boi from '../Boi';

export interface ActivityDefinitionJson {
    name: string,
    label: string,
    timePeriodMS: number,
    participantNeeds: Array<Object>,
    materialNeeds: Array<Object>,
    toolNeeds: Array<Object>,
    zoneNeeds: Array<Object>;
}

export class ActivityDefinition implements ActivityDefinitionJson{
    name: string
    label: string
    timePeriodMS: number
    participantNeeds: Array<Object>
    materialNeeds: Array<Object>
    toolNeeds: Array<Object>
    zoneNeeds: Array<Object>
    constructor({
        name,
        label = "",
        timePeriodMS = 1000,
        participantNeeds = [],
        materialNeeds = [],
        toolNeeds = [],
        zoneNeeds = []
    }: ActivityDefinitionJson){
        this.name = name;
        this.label = label;
        this.timePeriodMS = timePeriodMS;
        this.participantNeeds = participantNeeds;
        this.materialNeeds = materialNeeds;
        this.toolNeeds = toolNeeds;
        this.zoneNeeds = zoneNeeds;
    }

    evaluateParticipantNeeds(boi: Boi){
        let successful: Array<number> = [];
        this.participantNeeds.forEach((need, i) => {
            // if(need.ismet)
            successful.push(i);
        })
        return successful;
    }
}

export class ActivityLibrary{
    list: Array<ActivityDefinition>
    constructor(){
        this.list = [];
    }
    loadFromJson(activities: Array<ActivityDefinitionJson>){
        for(const activity of activities){
            this.list.push(new ActivityDefinition(activity));
        }
        console.log(`successfully loaded ${this.list.length} activities`);
    }
}
