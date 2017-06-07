import * as React from "react";

import { Shop } from "model/shop";
import { GameModel } from "model/game";

export class ShopView extends React.Component<{shop: Shop, itemDefs: GameModel['itemDefs']}, {}> {
    render() {
        return (
            <div className="shop">
                <div className="shop__items">
                    <button className="shop__item-buy-button" onClick={()=>this.props.shop.buyLlama(this.props.itemDefs['llama'])}>
                        Buy Llama (100)
                    </button>
                </div>
            </div>
        );
    }
}