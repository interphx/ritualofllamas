import {observable, intercept} from 'mobx';

import {Llama} from 'model/llama';

export class Tile {
    @observable
    public llama: Llama;

    constructor(llama: Llama) {
        this.llama = llama;
    }
}