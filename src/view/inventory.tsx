import * as React from 'react';
import {observer} from 'mobx-react';

import { Inventory } from "model/inventory";

import { InteractionState } from "view-model/interaction-state";

import { ItemView } from "view/item";

interface InventoryViewProps {
    interaction: InteractionState;
    inventory: Inventory;
}

@observer
export class InventoryView extends React.Component<InventoryViewProps, {}> {
    constructor(props: InventoryViewProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        //this.props.interaction.getSelectTarget()
    }

    render() {
        var props = this.props;
        return (
            <div className="inventory">
                {
                    props.inventory.getStacks().map(stack =>
                        <ItemView itemStack={stack} 
                                  interaction={this.props.interaction}
                                  inventory={this.props.inventory}
                                  key={stack.getItemDefinition().id} />
                    )
                }
            </div>
        );
    }
}