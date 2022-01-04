import { ActivityDefinition } from './dataLibraries/ActivityLibrary';
import Boi from './Boi';
import { Item } from './Item';
import GridCell from './GridCell';

export class Activity {
    participants: Array<Boi>
    materials: Array<Item>
    tools: Array<Item>
    location: GridCell | undefined

    definition: ActivityDefinition

    constructor(definition: ActivityDefinition){
        this.definition = definition;
        this.participants = [];
        this.materials = [];
        this.tools = [];
        this.location = undefined;
    }
}
