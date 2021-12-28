export interface Container {
    contents: Array<Item>;
    addToContents(this: Container, item: Item): Container;
}

export class Item {
    location: Container;

    constructor(location: Container){
        this.location = location;
    }

    asData() {
        return {
            location: this.location
        }
    }
}
