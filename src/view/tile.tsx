import * as React from 'react';
import {observer} from 'mobx-react';
import { DropTargetConnector, DropTargetMonitor, DropTarget, ConnectDropTarget } from "react-dnd";

import { Tile } from "model/tile";
import { Inventory } from "model/inventory";
import { game } from 'model/game';
import { ItemStack } from "model/item";

import { Dropzone, DnDDropTargetProps } from "view-model/dnd-helpers";

interface TileViewProps {
    tile: Tile;
    inventory: Inventory;
}

@observer
export class TileView extends React.Component<TileViewProps, {}> {
    constructor(props: TileViewProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.tile.llama === 'Llam') {
            this.props.tile.llama = 'None';
            this.props.inventory.addItem(game.itemDefs['llama']);
        }
    }

    render() {
        var props = this.props;
        //var llamaClass = props.tile.llama !== 'None' ? 'tile--llama' : '';
        //var activatableClass = props.tile.activatable ? 'tile--activatable' : '';

        var content = this.props.tile.activatable ? this.props.tile.activatable.getActivationProgress() : this.props.tile.llama;

        const obj = 
            (props.tile.llama !== 'None') ? (<div className="obj--llama"></div>) :
            (props.tile.activatable) ? (<div className="obj--chest"></div>) :
            null;

        return (
            <div className={`tile tile--grass`} onClick={this.handleClick}>
                {obj}
                <div className="tile__text">{content}</div>
            </div>
        )
    }
}