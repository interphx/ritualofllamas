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
import { getWorkingAreaSize } from 'util/dom';

interface WorldAreaViewProps {
    worldArea: WorldArea;
    shop: Shop;
    inventory: Inventory;
    itemDefs: ItemDefinitions;
    interaction: InteractionState;
}

@observer
export class WorldAreaView extends React.Component<WorldAreaViewProps, {}> {
    onResize = () => {
        this.forceUpdate();
    }

    componentDidMount() {
        document.body.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        document.body.removeEventListener('resize', this.onResize);
    }

    render() {
        var props = this.props;

        const cellWidth = 64;
        const cellHeight = 64;

        const screenSize   = getWorkingAreaSize(),
              screenWidth  = screenSize.x,
              screenHeight = screenSize.y;

        const offsetX = 0;
        const offsetY = 0;
        
        const offsetXMod = offsetX % cellWidth;
        const offsetYMod = offsetY % cellHeight;
        
        const columnsCount = screenWidth / cellWidth + 2;
        const rowsCount = screenHeight / cellHeight + 2;
        
        const rows = Array.from({ length: rowsCount }, (el, y) => {
            return Array.from({ length: columnsCount }, (el, x) => props.worldArea.get(offsetX + x, offsetY + y));
        }); 

        return (
            <div className="world-area-container">
                <div className="world-area__controls">
                    <button className="world-area__expand-button"
                            onClick={()=>props.shop.expandLocation(props.worldArea, 'north')}>Expand north</button>
                    <button className="world-area__expand-button" 
                            onClick={()=>props.shop.expandLocation(props.worldArea, 'east')}>Expand east</button>
                    <button className="world-area__expand-button" 
                            onClick={()=>props.shop.expandLocation(props.worldArea, 'south')}>Expand south</button>
                    <button className="world-area__expand-button" 
                            onClick={()=>props.shop.expandLocation(props.worldArea, 'west')}>Expand west</button>
                </div>
                <table
                    className="world-area"
                    style={{
                        transform: `translate(${offsetXMod}px, ${offsetYMod}px)`
                    }}
                >
                    <tbody>
                    {
                        rows.map((row, rowIndex) => 
                            <tr className="world-area__row" key={rowIndex}>
                                { row.map((tile, tileIndex) => 
                                    <td className="world-area__tile" key={rowIndex + '-' + tileIndex}>
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