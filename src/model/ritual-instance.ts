import { Ritual } from "model/ritual";
import { TilePatternInstance } from "model/tile-pattern-instance";

export class RitualInstance {
    constructor(
        public readonly ritual: Ritual,
        public readonly patternInstance: TilePatternInstance
    ) {

    }
}