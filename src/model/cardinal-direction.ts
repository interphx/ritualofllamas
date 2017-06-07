import {Orientation} from 'model/orientation';

export type CardinalDirection = 'north' | 'east' | 'west' | 'south';

export module CardinalDirection {
    export var values: CardinalDirection[] = ['north', 'east', 'west', 'south'];

    export function getOrientation(direction: CardinalDirection): Orientation {
        if (direction === 'north' || direction === 'south') {
            return 'vertical';
        } else if (direction === 'east' || direction === 'west') {
            return 'horizontal';
        }
        throw new Error(`Unknown direction: ${direction}`);
    }
}