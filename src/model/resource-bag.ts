import { observable } from 'mobx';

export class ResourceBag<TKey extends string> {
    @observable 
    protected values:  { [key in TKey]?: number } = {};

    constructor(values: { [key in TKey]?: number } = {}) {
        this.values = values;
    }

    getEntries(): [TKey, number][] {
        var result: [TKey, number][] = [];
        for (var key in this.values) {
            if (this.values.hasOwnProperty(key)) {
                result.push([ key, this.values[key]! ]);
            }
        }
        return result;
    }

    getResource(name: TKey): number {
        return this.values[name] || 0;
    }

    addResource(name: TKey, amount: number) {
        if (typeof amount !== 'number') {
            throw new Error(`Attempted to add ${amount} to resource ${name}!`);
        }
        if (!this.values.hasOwnProperty(name)) {
            this.values[name] = 0;
        }
        var oldAmount = this.values[name] as number;
        this.values[name] = oldAmount + amount;
    }

    subtractResource(name: TKey, amount: number) {
        this.addResource(name, -amount);
    }

    addResources(other: ResourceBag<TKey>) {
        for (var name in other.values) {
            if (!this.values.hasOwnProperty(name)) {
                this.values[name] = 0;
            }
            this.addResource(name, other.values[name] as number);
        }
    }

    multiplyAllBy(multiplier: number) {
        for (var key in this.values) {
            var newValue = this.values[key]! * multiplier;
            this.values[key] = newValue;
        }
    }

    static sum<TKey extends string>(resources: ResourceBag<TKey>[]): ResourceBag<TKey> {
        var sum: {[key in TKey]?: number} = {};

        for (var resourceBag of resources) {
            for (var name in resourceBag.values) {
                if (typeof sum[name] === 'number') {
                    var newValue = sum[name]! + resourceBag.values[name]!;
                    sum[name] = newValue;
                } else {
                    sum[name] = resourceBag.values[name];
                }
            }
        }

        return new ResourceBag<TKey>(sum);
    }
}