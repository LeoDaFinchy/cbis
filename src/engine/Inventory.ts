import { Item } from "./Item";

export class Inventory {
    items: Set<Item>;

    constructor(){
        this.items = new Set();
    }

    addItem(item: Item){
        return this.items.add(item);
    }

    removeItem(item: Item){
        return this.items.delete(item);
    }

    absorbInventory(inventory: Inventory){
        this.items = new Set([...this.items, ...inventory.items]);
    }
}
