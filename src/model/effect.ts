import {Tile} from 'model/tile';
import {Player} from 'model/player';
import { Llama } from "model/llama";

export interface TileEffectTarget {
    type: 'tile';
    tile: Tile;
}

export interface EmptyEffectTarget {
    type: 'empty';
}

export interface PlayerEffectTarget {
    type: 'player';
    player: Player;
}

export interface LlamaEffectTarget {
    type: 'llama';
    llama: Llama;
}

export type EffectTarget = TileEffectTarget | EmptyEffectTarget | PlayerEffectTarget | LlamaEffectTarget;
export interface EffectTargetType<TTarget extends EffectTarget> {
    type: TTarget['type'];
    filter?: (target: TTarget) => boolean;
};

export class Effect<TTarget extends EffectTarget> {
    constructor(
        public readonly targetType: EffectTargetType<TTarget>,
        public readonly execute: (target: TTarget) => void
    ) {

    }
}