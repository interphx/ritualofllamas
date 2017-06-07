import { observable, action } from 'mobx';

import { ItemDefinition, ItemStack } from "model/item";
import { EffectTarget } from "model/effect";

export class Inventory {
    @observable
    protected readonly stacks: ItemStack[] = [];

    constructor(stacks: ItemStack[] = []) {
        this.stacks = stacks;
    }

    getStacks(): ItemStack[] {
        return this.stacks;
    }

    @action addItem(itemDef: ItemDefinition, count: number = 1) {
        var stack = this.stacks.find(stack => stack.getItemDefinition() === itemDef);
        if (stack) {
            stack.add(count);
        } else {
            this.stacks.push(new ItemStack(itemDef, count));
        }
    }

    @action removeItem(itemDef: ItemDefinition, count: number = 1) {
        var stack = this.stacks.find(stack => stack.getItemDefinition() === itemDef);
        if (!stack) {
            throw new Error(`Attempt to remove non-posessed item ${itemDef.name} (${count})`);
        }
        if (stack.getCount() < count) {
            throw new Error(`Attempt to remove item ${itemDef.name} (${count}), but only ${stack.getCount()} posessed`);
        }
        stack.remove(count);

        if (stack.getCount() < 1) {
            this.stacks.splice(this.stacks.indexOf(stack), 1);
        }
    }

    @action addStack(newStack: ItemStack) {
        var stack = this.stacks.find(stack => stack.getItemDefinition() === newStack.getItemDefinition());
        if (stack) {
            stack.add(newStack.getCount());
        } else {
            this.stacks.push(newStack);
        }
    }

    @action useItem(itemDef: ItemDefinition, target: EffectTarget) {
        var stack = this.stacks.find(stack => stack.getItemDefinition() === itemDef);
        if (!stack || stack.getCount() < 1) {
            throw new Error(`Attempt to use non-posessed item ${itemDef.name}`);
        }
        for (var effect of itemDef.effects) {
            effect.execute(target);
        }
        this.removeItem(itemDef);
    }


}