import * as React from 'react';
import {observer} from 'mobx-react';

import { WorldArea } from "model/world-area";
import { Shop } from "model/shop";
import { Inventory } from "model/inventory";
import { ItemDefinition } from "model/item";
import { Tile } from "model/tile";
import { GameModel } from "model/game";
type ItemDefinitions = GameModel['itemDefs'];

import { TileView } from "view/tile";
import { TargetProviderView } from "view/target-provider";

import { InteractionState } from "view-model/interaction-state";

interface WorldAreaViewProps {
    worldArea: WorldArea;
    shop: Shop;
    inventory: Inventory;
    itemDefs: ItemDefinitions;
    interaction: InteractionState;
}

@observer
export class WorldAreaView extends React.Component<WorldAreaViewProps, {}> {
    render() {
        var props = this.props;
        return (
            <div className="world-area">
                <button className="world-area__expand-button"
                        onClick={()=>props.shop.expandLocation(props.worldArea, 'north')}>Expand north</button>
                <button className="world-area__expand-button" 
                        onClick={()=>props.shop.expandLocation(props.worldArea, 'east')}>Expand east</button>
                <button className="world-area__expand-button" 
                        onClick={()=>props.shop.expandLocation(props.worldArea, 'south')}>Expand south</button>
                <button className="world-area__expand-button" 
                        onClick={()=>props.shop.expandLocation(props.worldArea, 'west')}>Expand west</button>
                <table className="world-area">
                    <tbody>
                    {
                        props.worldArea.getRows().map((row, rowIndex) => 
                            <tr className="world-area__row" key={rowIndex}>
                                { row.map((tile, tileIndex) => 
                                    <td className={"world-area__tile " + (tile.llama !== 'None' ? 'world-area__tile--llama' : '')}
                                        key={rowIndex + '-' + tileIndex}>
                                        <TargetProviderView interaction={this.props.interaction} providedTarget={{type: 'tile', tile}}>
                                            <TileView tile={tile} inventory={this.props.inventory} />
                                        </TargetProviderView>
                                    </td>) 
                                }
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}