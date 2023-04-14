import { Activity } from './Activity';
import { UsageClaim } from './UsageClaim';
import Pulse from './Pulse';

export interface Container {
    contents: Array<Item>;
    addToContents(this: Container, item: Item): Container;
}

export class Item {
    location: Container;
    types: Array<string>;
    tags: Set<string>;
    claims: Array<UsageClaim>;

    onChanged: Pulse;

    constructor(location: Container, types: Array<string> = []){
        this.location = location;
        this.types = types;
        this.tags = new Set();
        this.claims = [];

        this.onChanged = new Pulse();
    }

    claim(activity: Activity){
        const newClaim = new UsageClaim(this, activity);
        this.claims.push(newClaim);
        this.onChanged.send(this.asData());

        return newClaim
    }

    releaseClaim(oldClaim: UsageClaim){
        const index = this.claims.findIndex(claim => claim === oldClaim);
        this.claims.splice(index, 1);

        this.onChanged.send(this.asData());
    }

    addTag(newTag: string) {
        this.tags.add(newTag);
    }

    removeTag(oldTag: string) {
        this.tags.delete(oldTag);
    }

    asData() {
        return {
            location: this.location,
            types: this.types,
            claims: this.claims
        }
    }
}
