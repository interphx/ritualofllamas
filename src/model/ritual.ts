import { Pattern } from "model/pattern";
import { ResourceBag } from "model/resource-bag";
import { Tile } from "model/tile";

export class Ritual {
    constructor(
        public pattern: Pattern<Tile | null>, 
        public getOutputPerSecond: () => ResourceBag<string>
    ) {

    }
}