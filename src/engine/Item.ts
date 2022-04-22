export interface Container {
    contents: Array<Item>;
    addToContents(this: Container, item: Item): Container;
}

export class Item {
    location: Container;
    types: Array<string>;

    constructor(location: Container, types: Array<string> = []){
        this.location = location;
        this.types = types;
    }

    asData() {
        return {
            location: this.location
        }
    }
}
