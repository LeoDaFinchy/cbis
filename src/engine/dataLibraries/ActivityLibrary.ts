import Boi from '../Boi';

export interface ItemSpecificationJson {
    types: Array<string>,
    tags: Array<string>
}

export class ItemSpecification {
    types: Array<string>
    tags: Array<string>
    constructor({
        types = [],
        tags = []
    }: ItemSpecificationJson){
        this.types = types;
        this.tags = tags;
    }
}

export interface ActivityDefinitionJson {
    name: string,
    label: string,
    timePeriodMS: number,
    participantNeeds: Array<Object>,
    materialNeeds: Array<ItemSpecificationJson>,
    toolNeeds: Array<ItemSpecificationJson>,
    zoneNeeds: Array<Object>;
}

export class ActivityDefinition implements ActivityDefinitionJson{
    name: string
    label: string
    timePeriodMS: number
    participantNeeds: Array<Object>
    materialNeeds: Array<ItemSpecification>
    toolNeeds: Array<ItemSpecification>
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
        this.materialNeeds = materialNeeds.map(json => new ItemSpecification(json));
        this.toolNeeds = toolNeeds.map(json => new ItemSpecification(json));;
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
    // fetchSatisfactoryItemsFromGrid(grid: Grid){
    //     return this.toolNeeds.map(toolNeed => {
    //         return grid.availableTools(toolNeed).filter(tool => tool.claims.length === 0);
    //     });
    // }
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
