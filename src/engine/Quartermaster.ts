import { ActivityDefinition, ItemSpecification } from "./dataLibraries/ActivityLibrary";
import { Inventory } from "./Inventory";
import { Item } from "./Item";
import { isSuperSetOf } from "./SetUtilities";

export function requisition(job: ActivityDefinition, inventory: Inventory){
    const { toolNeeds, materialNeeds } = job;

    let success = true;
    const temporaryInventory = new Inventory();
    toolNeeds.forEach((itemSpecification: ItemSpecification) => {
        const itemMeetingSpecification = findItemMeetingSpecification(itemSpecification, inventory);
        if(itemMeetingSpecification === null){
            success = false;
        } else {
            inventory.removeItem(itemMeetingSpecification);
            temporaryInventory.addItem(itemMeetingSpecification);
        }
    });
    materialNeeds.forEach((itemSpecification: ItemSpecification) => {
        const itemMeetingSpecification = findItemMeetingSpecification(itemSpecification, inventory);
        if(itemMeetingSpecification === null){
            success = false;
        } else {
            inventory.removeItem(itemMeetingSpecification);
            temporaryInventory.addItem(itemMeetingSpecification);
        }
    })
    if (success) {
        return temporaryInventory;
    } else {
        inventory.absorbInventory(temporaryInventory)
        return null;
    }
}

export function findItemMeetingSpecification(itemSpecification: ItemSpecification, inventory: Inventory){
    for(const item of inventory.items.values()){
        if(doesItemMeetSpecification(item, itemSpecification)) return item;
    }
    return null;
}

export function doesItemMeetSpecification(item: Item, itemSpecification: ItemSpecification){
    let doesIt = true;
    if (item.claims.length > 0) {
        return false;
    }
    if (!isSuperSetOf(item.types, itemSpecification.types)) {
        doesIt = false;
    }
    if (!isSuperSetOf([...item.tags.values()], itemSpecification.tags)) {
        doesIt = false;
    }
    return doesIt;
}