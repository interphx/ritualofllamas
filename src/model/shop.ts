import {Player} from 'model/player';
import { CardinalDirection } from "model/cardinal-direction";
import { WorldArea } from "model/world-area";
import { ItemDefinition } from "model/item";

export class Shop {
    constructor(protected readonly player: Player) { }

    purchasedExpansionsCounts: {[key in CardinalDirection]: number} = {
        'north': 0,
        'east': 0,
        'south': 0,
        'west': 0
    };
    expandLocation(location: WorldArea, direction: CardinalDirection) {
        var addedTilesCount = CardinalDirection.getOrientation(direction) === 'vertical'
            ? location.getWidth()
            : location.getHeight(); 

        var price = 30 + Math.floor(Math.pow(addedTilesCount * 2, 2)) * (1 + this.purchasedExpansionsCounts[direction]);
        var playerMoney = this.player.resources.getResource('money');

        if (price > playerMoney) {
            throw new Error(`Attempt to expand a location for ${price}, but have only ${playerMoney}`);
        }

        location.expand(direction);
        this.player.resources.subtractResource('money', price);

        this.purchasedExpansionsCounts[direction] += 1;
    }

    purchasedLlamasCount: number = 0;
    buyLlama(item: ItemDefinition) {
        var price = 10 + Math.floor(Math.pow(this.purchasedLlamasCount, 1.5)) ;
        var playerMoney = this.player.resources.getResource('money');

        if (price > playerMoney) {
            throw new Error(`Attempt to buy a llama for ${price}, but have only ${playerMoney}`);
        }

        this.player.inventory.addItem(item);
        this.player.resources.subtractResource('money', price);

        this.purchasedLlamasCount += 1;
    }
}