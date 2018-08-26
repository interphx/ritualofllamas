import {observable, intercept} from 'mobx';

import {Llama} from 'model/llama';
import { Activatable } from "model/activatable";

export class Tile {
    @observable
    public revealed: boolean;
    @observable
    public llama: Llama;
    @observable
    public activatable?: Activatable | null;

    constructor(llama: Llama, revealed: boolean) {
        this.llama = llama;
        this.revealed = revealed;
    }
}