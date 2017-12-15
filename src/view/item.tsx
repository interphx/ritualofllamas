import * as React from 'react';
import {observer} from 'mobx-react';
import { DragSource, DragSourceConnector, DragSourceMonitor, ConnectDragSource } from 'react-dnd';

import { ItemStack } from "model/item";
import { Inventory } from "model/inventory";

import { InteractionState } from "view-model/interaction-state";
import { DnDDraggableProps, Draggable } from "view-model/dnd-helpers";

interface ItemViewProps {
    itemStack: ItemStack;
    interaction: InteractionState;
    inventory: Inventory;

    // React-DnD
   dndDraggableProps?: DnDDraggableProps;
}

@observer
class ItemViewBase extends React.Component<ItemViewProps, {}> {
    constructor(props: ItemViewProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        var itemDef = this.props.itemStack.getItemDefinition();
        var effects = itemDef.effects;
        if (!effects || effects.length <= 0) {
            return;
        }
        var targetType = effects[0].targetType;

        this.props.interaction.getSelectTarget(targetType)
            .then(target => {
                this.props.inventory.useItem(itemDef, target);
            })
            .catch(() => {
                console.log(`Cancelled item use for ${itemDef.id}`);
            });
    }

    render() {
        console.log(`Item.render`);
        var props = this.props,
            connectDragSource = this.props.dndDraggableProps!.connectDragSource;
        return connectDragSource(
            <div className="item-stack" onClick={this.handleClick}>
                {this.props.itemStack.getItemDefinition().name} ({this.props.itemStack.count})
            </div>
        );
    }
}

export var ItemView = Draggable( 'item', (props: ItemViewProps) => ({ itemStack: props.itemStack, inventory: props.inventory }) )(ItemViewBase);