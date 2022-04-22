import { Item } from './Item';
import { Activity } from './Activity';

export class UsageClaim {
    item: Item
    activity: Activity
    constructor(item: Item, activity: Activity){
        this.item = item;
        this.activity = activity;
    }

    release(){
        this.item.releaseClaim(this);
    }
}
