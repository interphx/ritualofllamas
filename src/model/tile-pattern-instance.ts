import { Pattern } from "model/pattern";
import { Tile } from "model/tile";

export class TilePatternInstance {
    constructor(
        public readonly pattern: Pattern<Tile | null>,
        public readonly topLeftX: number,
        public readonly topLeftY: number
    ) {
        
    }
}