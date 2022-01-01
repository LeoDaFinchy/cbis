import { ActivityDefinitionJson, ActivityLibrary } from './ActivityLibrary';

export class LibraryContainer{
    activities: ActivityLibrary
    constructor(){
        this.activities = new ActivityLibrary();
    }

    loadFromJson(jsonData: { activities: Array<ActivityDefinitionJson> }){
        this.activities.loadFromJson(jsonData.activities);
    }
}
