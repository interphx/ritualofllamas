import { observable } from 'mobx';

import { ResourceBag } from "model/resource-bag";
import { Inventory } from "model/inventory";

export class Player {
    @observable resources: ResourceBag<string> = new ResourceBag({money: 10});
    @observable inventory: Inventory = new Inventory();

    constructor(protected name: string) {

    }
}