import {observable, action} from 'mobx';

import {Grid} from 'util/grid';
import {Tile} from 'model/tile';
import {CardinalDirection} from 'model/cardinal-direction';
import {Pattern} from 'model/pattern';
import { TilePatternInstance } from "model/tile-pattern-instance";
import { RitualInstance } from "model/ritual-instance";
import { Ritual } from "model/ritual";
import { DeepReadonly } from 'util/types';

export class WorldArea {
    @observable
    protected name: string;
    @observable
    protected grid: Grid<Tile>;

    constructor(
        name: string,
        grid: Grid<Tile> = new Grid<Tile>(3, 3, (x, y) => new Tile('None', false))        
    ) {
        this.name = name;
        this.grid = grid;
    }

    get(x: number, y: number) {
        return this.grid.get(x, y);
    }

    getRows() {
        return this.grid.getRows();
    }

    getWidth() {
        return this.grid.width;
    }

    getHeight() {
        return this.grid.height;
    }

    @action tickActivatable(x: number, y: number, dt: number) {
        var activatable = this.grid.get(x, y).activatable;
        if (!activatable) {
            throw new Error(`Attempt to tick a non-existent activatable at (${x}, ${y})`);
        }
        var pattern = activatable.pattern;
        var topLeftX = x - activatable.posInPatternX;
        var topLeftY = y - activatable.posInPatternY;
        console.log(topLeftX, topLeftY);
        var slice = this.grid.getDataSlice(topLeftX, topLeftY, pattern.width, pattern.height);
        if (pattern.match(slice)) {
            activatable.progress(dt);
        }
    }

    @action tickActivatables(dt: number) {
        for (var i = 0; i < this.getWidth(); ++i) {
            for (var j = 0; j < this.getHeight(); ++j) {
                if (this.grid.get(i, j).activatable) {
                    this.tickActivatable(i, j, dt);
                }
            }
        }
    }

    @action expand(direction: CardinalDirection) {
        if (direction === 'north') {
            this.grid.insertRow(0);
            this.grid.getDataSlice(0, 0, this.grid.width, 1).forEach(tile => tile && (tile.revealed = true));
        } else if (direction === 'south') {
            this.grid.insertRow(this.grid.height);
            this.grid.getDataSlice(0, this.grid.height - 1, this.grid.width, 1).forEach(tile => tile && (tile.revealed = true));
        } else if (direction === 'east') {
            this.grid.insertColumn(this.grid.width);
            this.grid.getDataSlice(this.grid.width - 1, 0, 1, this.grid.height).forEach(tile => tile && (tile.revealed = true));
        } else if (direction === 'west') {
            this.grid.insertColumn(0);
            this.grid.getDataSlice(0, 0, 1, this.grid.height).forEach(tile => tile && (tile.revealed = true));
        }
    }

    findAllRituals(possibleRituals: Ritual[]): RitualInstance[] {
        return this
            .findAllPatterns(possibleRituals.map(ritual => ritual.pattern))
            .map(patternInstance => 
                new RitualInstance(possibleRituals.find(ritual => ritual.pattern === patternInstance.pattern)!, patternInstance
            ));
    }

    findAllPatterns(possiblePatterns: Pattern<Tile | null>[]): TilePatternInstance[] {
        var results: TilePatternInstance[] = [];

        for (var pattern of possiblePatterns) {
            if (this.grid.width < pattern.width || this.grid.height < pattern.height) {
                continue;
            }
            
            for (var i = 0; i < this.grid.width - pattern.width + 1; ++i) {
                for (var j = 0; j < this.grid.height - pattern.height + 1; ++j) {
                    var slice = this.grid.getDataSlice(i, j, pattern.width, pattern.height);
                    if (pattern.match(slice)) {
                        results.push(new TilePatternInstance(pattern, i, j));
                    }
                }
            }

        }
        return results;
    }
}