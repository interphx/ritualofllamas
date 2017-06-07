import {observable, action} from 'mobx';

import { Effect, EffectTargetType, EffectTarget } from 'model/effect';

export class InteractionState {
    @observable selection?: Readonly<EffectTargetType<EffectTarget>>;
    selectionPromise?: Promise<EffectTarget>;

    onSelected?: (target: EffectTarget) => void;
    onSelectionCancelled?: () => void;

    constructor() {

    }

    isSelecting(): boolean {
        return !!this.selection;
    }

    @action
    select(target: EffectTarget) {
        if (!this.selection) {
            throw new Error(`Attempt to select ${target.type}, but no selection is initialized`);
        }
        if (this.selection.type !== target.type) {
            throw new Error(`Attempt to select ${target.type}, but expected ${this.selection.type}`);
        }
        if (this.selection.filter && !this.selection.filter(target)) {
            throw new Error(`Attempt to select ${target.type}, but it does not pass the filter`);
        }
        
        if (this.onSelected) {
            this.onSelected(target);

            this.selection = undefined;
            this.selectionPromise = undefined;
            this.onSelected = undefined;
            this.onSelectionCancelled = undefined;    
        }
        
    }

    @action
    cancelSelection() {
        if (this.onSelectionCancelled) {
            this.onSelectionCancelled();

            this.selection = undefined;
            this.selectionPromise = undefined;
            this.onSelected = undefined;
            this.onSelectionCancelled = undefined;
        }
    }

    isValidSelectionTarget(target: EffectTarget): boolean {
        if (!this.selection) {
            throw new Error(`Attempt to validate a target ${target.type}, but no selection is in progress`);
        }
        if (target.type !== this.selection.type) {
            return false;
        }
        if (this.selection.filter && !this.selection.filter(target)) {
            return false;
        }
        return true;
    }

    @action
    getSelectTarget(targetType: EffectTargetType<EffectTarget>): Promise<EffectTarget> {
        if (this.selectionPromise || this.selection) {
            throw new Error(`Attempt to initialize a selection with ${targetType.type}, but previous selection (${this.selection ? this.selection.type : 'WTF? SELECTION IS UNDEFINED'}) has not yet ended!`);
        }
        this.selection = targetType;
        this.selectionPromise = new Promise((resolve, reject) => {
            this.onSelected = resolve;
            this.onSelectionCancelled = reject;
        });
        return this.selectionPromise;
    }
}
