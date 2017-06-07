import {ResourceBag} from 'model/resource-bag';

export class Pattern<T> {
    constructor(
        public readonly width: number,
        public readonly height: number,
        public readonly match: (fieldSlice: T[]) => boolean,
        public readonly getOutputPerSecond: () => ResourceBag<string>
    ) {

    }

    static fromExactMatch<T>(
        width: number,
        height: number,
        match: T[],
        getOutputPerSecond: () => ResourceBag<string>
    ): Pattern<T> {
        var sliceLength = width * height;
        if (match.length !== sliceLength) {
            throw new Error(`Pattern for matching must have exactly ${sliceLength} (${width}x${height}) elements!`);
        }
        var matcher = function (fieldSlice: T[]): boolean {
            if (fieldSlice.length !== sliceLength) {
                throw new Error(`Invalid slice for matching, got ${fieldSlice.length} elements, expected ${sliceLength}`);
            }
            for (var i = 0; i < sliceLength; ++i) {
                if (fieldSlice[i] !== match[i]) {
                    return false;
                }
            }
            return true;
        }

        return new Pattern(width, height, matcher, getOutputPerSecond);
    }
}