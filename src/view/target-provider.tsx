import { observer } from 'mobx-react';
import * as React from 'react';

import { InteractionState } from "view-model/interaction-state";

import { EffectTarget, EffectTargetType } from "model/effect";
import { Dropzone, DnDDropTargetProps } from "view-model/dnd-helpers";

interface TargetProviderViewProps {
    interaction: InteractionState;
    providedTarget: EffectTarget | EffectTarget[];

    dndDropTargetProps?: DnDDropTargetProps;
}

function tryGetValidTarget(target: EffectTarget | EffectTarget[], targetType: EffectTargetType<EffectTarget>): EffectTarget | null {
    var targets = Array.isArray(target) ? target : [target];
    for (var providedTarget of targets) {
        if (targetType.type === providedTarget.type && (!targetType.filter || targetType.filter(providedTarget))) {
            return providedTarget;
        }
    }
    return null;
}

function isValidTarget(target: EffectTarget | EffectTarget[], targetType: EffectTargetType<EffectTarget>) {
    return Boolean(tryGetValidTarget);
}

/*@Dropzone(
    'item', 
    (props: TargetProviderViewProps, item) => {
        var target = tryGetValidTarget(props.providedTarget, item.itemStack.getItemDefinition().effects[0].targetType);
        if (!target) {
            console.error(`Attempt to use an item on invalid target`);
            return;
        }
        item.inventory.useItem(item.itemStack.getItemDefinition(), target);
    },
    (props, item) => {
        return isValidTarget(props.providedTarget, item.itemStack.getItemDefinition().effects[0].targetType);
    }
)*/
@observer
class TargetProviderViewBase extends React.Component<TargetProviderViewProps, {}> {
    constructor(props: TargetProviderViewProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleMouseIn = this.handleMouseIn.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    getProvidedTargets(): EffectTarget[] {
        return Array.isArray(this.props.providedTarget) ? this.props.providedTarget : [this.props.providedTarget];
    }

    hasValidSelectionTarget(interaction: InteractionState): boolean {
        if (!interaction.isSelecting()) {
            return false;
        }

        for (var providedTarget of this.getProvidedTargets()) {
            if (interaction.isValidSelectionTarget(providedTarget)) {
                return true;
            }
        }

        return false;
    }

    handleMouseOut() {

    }

    handleMouseIn() {
        
    }

    handleClick() {
        var interaction = this.props.interaction;
        if (!interaction.isSelecting()) {
            return;
        }

        for (var providedTarget of this.getProvidedTargets()) {
            if (this.props.interaction.isValidSelectionTarget(providedTarget)) {
                this.props.interaction.select(providedTarget);
                break;
            }
        }

    }

    render() {
        var connectDropTarget = this.props.dndDropTargetProps!.connectDropTarget;

        var isValidTarget = this.hasValidSelectionTarget(this.props.interaction);
        return connectDropTarget(
            <div className={"target-provider " + (isValidTarget ? 'target-provider--valid-target' : '')} onClick={this.handleClick}>
                { this.props.children }
            </div>
        );
    }
}

export var TargetProviderView = Dropzone(
    'item', 
    (props: TargetProviderViewProps, item) => {
        var target = tryGetValidTarget(props.providedTarget, item.itemStack.getItemDefinition().effects[0].targetType);
        if (!target) {
            console.error(`Attempt to use an item on invalid target`);
            return;
        }
        item.inventory.useItem(item.itemStack.getItemDefinition(), target);
    },
    (props, item) => {
        return isValidTarget(props.providedTarget, item.itemStack.getItemDefinition().effects[0].targetType);
    }
)(TargetProviderViewBase);