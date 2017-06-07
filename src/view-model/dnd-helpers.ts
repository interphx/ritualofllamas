import { ConnectDragSource, ConnectDropTarget, DragSourceConnector, DragSourceMonitor, DropTargetConnector, DropTargetMonitor, DropTarget, DragSource } from "react-dnd";

import { ItemStack } from "model/item";
import { Llama } from "model/llama";
import { Inventory } from "model/inventory";

interface DraggableTypeMapping {
    'llama': DraggableLlama;
    'item': DraggableItem;
}

interface DraggableLlama {
    type: 'llama';
    llama: Llama;
}

interface DraggableItem {
    type: 'item';
    itemStack: ItemStack;
    inventory: Inventory;
}

type DraggableEntity = DraggableLlama | DraggableItem;
type DraggableEntityType = DraggableEntity['type'];

type TypelessDraggable = {[key in keyof DraggableEntity]?: DraggableEntity[key]};

export interface DnDDraggableProps {
    connectDragSource: ConnectDragSource;
    isDragging: boolean;
}

export interface DnDDropTargetProps {
    connectDropTarget: ConnectDropTarget;
    isDraggedOver: boolean;
}

function collectDraggable(connect: DragSourceConnector, monitor: DragSourceMonitor): {dndDraggableProps: DnDDraggableProps} {
    return {
        dndDraggableProps: {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging()
        }
    };
}

function collectDropTarget(connect: DropTargetConnector, monitor: DropTargetMonitor): {dndDropTargetProps: DnDDropTargetProps} {
    return {
        dndDropTargetProps: {
            connectDropTarget: connect.dropTarget(),
            isDraggedOver: monitor.isOver()
        }
    };
}


export function Draggable<TProps>(type: DraggableEntityType, propsToObject: (props: TProps) => object) {
    var beginDrag = function(props: TProps) { return Object.assign({type: type}, propsToObject(props)); }
    var collect = collectDraggable;
    return DragSource(type, { beginDrag }, collect);
}

function constantTrue(): boolean {
    return true;
}

export function Dropzone<TProps, TDroppedEntity, TType extends DraggableEntityType>(type: TType, onDrop: (props: TProps, entity: DraggableTypeMapping[TType]) => void, canDrop: (props: TProps, entity: DraggableTypeMapping[TType]) => boolean = constantTrue) {
    var spec = {
        drop: function(props: TProps, monitor: DropTargetMonitor) {
            var item = monitor.getItem();
            if (!item || !item.hasOwnProperty('type')) {
                return;
            }
            var entity = item as DraggableEntity;
            if (entity.type === type && canDrop(props, entity)) {
                onDrop(props, entity);
            }
        },
        canDrop: function(props:TProps, monitor: DropTargetMonitor): boolean {
            var item = monitor.getItem();
            if (!item || !item.hasOwnProperty('type')) {
                return false;
            }
            var entity = item as DraggableEntity;
            if (entity.type === type && canDrop(props, entity)) {
                return true;
            }
            return false;
        }
    };

    return DropTarget<TProps>(type, spec, collectDropTarget);
}