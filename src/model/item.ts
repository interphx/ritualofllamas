import {observable, action} from 'mobx';

import {Sprite} from 'model/sprite';
import {Effect, EffectTarget} from 'model/effect';

export class ItemDefinition {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly sprite: Sprite,
        public readonly effects: Effect<EffectTarget>[]
    ) {

    }

    canBeUsedOn(target: EffectTarget): boolean {
        for (var effect of this.effects) {

            var type   = effect.targetType.type,
                filter = effect.targetType.filter;

            if (type !== target.type) {
                return false;
            }

            if (filter && !filter(target)) {
                return false;
            }

        }
        return true;
    }
}

export class ItemStack {
    @observable
    public count: number;

    constructor(protected itemDef: ItemDefinition, count: number = 1) {
        this.count = count;
    }

    getItemDefinition(): ItemDefinition {
        return this.itemDef;
    }

    getCount(): number {
        return this.count;
    }

    @action remove(count: number) {
        this.count -= Math.min(count, this.count);
    }

    @action add(count: number) {
        this.count += count;
    }
}