import { ItemDefinition } from "model/item";
import { Player } from "model/player";
import { Shop } from "model/shop";
import { WorldArea } from "model/world-area";
import { Pattern } from "model/pattern";
import { Sprite } from "model/sprite";
import { Effect, TileEffectTarget } from "model/effect";
import { Grid } from "util/grid";
import { Tile } from "model/tile";
import { ResourceBag } from "model/resource-bag";
import { Llama } from "model/llama";
import { Activatable } from "model/activatable";

export interface GameModel {
    player: Player;
    shop: Shop;
    itemDefs: { [key: string]: ItemDefinition };
    locations: { [key: string]: WorldArea };
    patterns: {[key: string]: Pattern<Tile>};

    tick(dt: number): void;
}

function getObjectValues<T extends {[ket: string]: any}>(obj: T) {
    var result: (T[keyof T])[] = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            result.push(obj[key]);
        }
    }
    return result;
}

function compareTileWithCharacter(tile: Tile, character: string): boolean {
    character = character.toUpperCase();

    if (character === '*') return true;
    if (character === 'L' && tile.llama === 'Llam') return true;
    if (character === ' ' && tile.llama === 'None') return true;
    return false;
}

function makePattern(width: number, height: number, shape: string[], incomeGetter: () => ResourceBag<string>) {
    if (shape.length !== (width*height)) {
        throw new Error(`Attempted to create z ${width}x${height} pattern from ${shape.length} characters`);
    }
    var checker = function(slice: Tile[]) {
        for (var i = 0; i < slice.length; ++i) {
            var tile = slice[i];
            var character = shape[i];
            if (!compareTileWithCharacter(tile, character)) {
                return false;
            }
        }
        return true;
    }
    return new Pattern(width, height, checker, incomeGetter);
}

var testPlayer = new Player('Test Player');

export var game: GameModel = {

    tick(dt: number) {
        for (var locationId in this.locations) {
            var location = this.locations[locationId];

            // Income
            var patterns = location.findAllPatterns(getObjectValues(this.patterns));
            var income = ResourceBag.sum(patterns.map(pattern => pattern.getOutputPerSecond()));
            income.multiplyAllBy(dt);

            this.player.resources.addResources(income);

            // Activatables
            location.tickActivatables(dt);
        }
    },
    
    player: testPlayer,

    shop: new Shop(testPlayer),

    itemDefs: {
        'llama': new ItemDefinition(
            'llama',
            'Llama',
            Sprite.empty(),
            [
                new Effect<TileEffectTarget>(
                    {type: 'tile', filter: target => target.tile.llama === 'None'}, 
                    target => { target.tile.llama = 'Llam'; }
                )
            ]
        )
    },

    locations: {
        'startingZone': new WorldArea(
            'Starting Zone',
            function() {
                var result = new Grid<Tile>(5, 5, (x, y) => new Tile('None'));
                var tile = result.get(4, 4);
                tile.activatable = new Activatable(
                    new Pattern<Tile | null>(3, 3, match => match.reduce((sum, tile) => tile ? (tile.llama !== 'None' ? sum + 1 : sum) : sum, 0) >= 3, () => new ResourceBag({money: 10})),
                    () => {
                        tile.llama = 'Llam';
                        tile.activatable = null;
                    },
                    1
                );
                return result;
            }()
        ),
        'testCave': new WorldArea(
            'Test Cave',
            new Grid<Tile>(3, 3, (x, y) => new Tile('None'))
        )
    },


    patterns: {
        'test0': makePattern(
            3, 3,
            [
                ' ', 'L', ' ',
                ' ', 'L', ' ',
                'L', 'L', 'L'
            ],
            () => new ResourceBag({money: 1})
        ),
        'test1': makePattern(
            3, 3,
            [
                'L', 'L', 'L',
                ' ', 'L', ' ',
                'L', 'L', 'L'
            ],
            () => new ResourceBag({money: 2})
        ),
        'test2': makePattern(
            3, 4,
            [
                'L', ' ', ' ',
                ' ', 'L', ' ',
                ' ', ' ', 'L',
                'L', 'L', 'L'
            ],
            () => new ResourceBag({money: 3})
        ),
        'test3': makePattern(
            4, 3,
            [
                'L', 'L', 'L', 'L',
                'L', ' ', ' ', 'L',
                'L', 'L', 'L', 'L'
            ],
            () => new ResourceBag({money: 4})
        ),
        'test4': makePattern(
            6, 6,
            [
                '*', '*', '*', '*', '*', 'L',
                '*', '*', '*', '*', 'L', '*',
                '*', '*', 'L', 'L', '*', '*',
                '*', '*', 'L', 'L', '*', '*',
                '*', 'L', '*', '*', '*', '*',
                'L', '*', '*', '*', '*', '*'
            ],
            () => new ResourceBag({money: 8})
        )
    }
};