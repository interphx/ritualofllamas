import { observable, action } from 'mobx';

import { Pattern } from "model/pattern";
import { Tile } from "model/tile";

import { clamp } from "util/math";

export class Activatable {
    @observable
    protected activationProgress: number = 0;
    @observable
    protected activated: boolean = false;

    constructor(
        public readonly pattern: Pattern<Tile | null>,
        public readonly onActivated: Function,
        public readonly activationCapacity: number = 100,
        public readonly posInPatternX: number = Math.floor(pattern.width / 2),
        public readonly posInPatternY: number = Math.floor(pattern.height / 2)
    ) {
        if (posInPatternX < 0 || posInPatternX >= pattern.width || posInPatternY < 0 || posInPatternY >= pattern.height) {
            throw new Error(`Invalid pos in pattern of size (${pattern.width}, ${pattern.height}): ${posInPatternX}, ${posInPatternY}`);
        }
    }

    isActivated(): boolean {
        return this.activated;
    }

    getActivationProgress(): number {
        return this.activationProgress;
    }

    getActivationProgressFraction(): number {
        return this.getActivationProgress() / this.activationCapacity;
    }

    @action
    progress(amount: number) {
        if (this.activated) {
            return;
        }
        this.activationProgress = clamp(this.activationProgress + amount, 0, this.activationCapacity);
        if (this.activationProgress >= this.activationCapacity) {
            this.activated = true;
            this.onActivated();
        }
    }
}