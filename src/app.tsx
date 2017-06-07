import * as React from 'react';
import * as ReactDOM from 'react-dom';
import  HTML5Backend from 'react-dnd-html5-backend';
import  { DragDropContext } from 'react-dnd';

import { game } from 'model/game';

import { ResourcesView } from "view/resources";
import { WorldAreaView } from "view/world-area";
import { ShopView } from "view/shop";
import { InventoryView } from "view/inventory";

import { InteractionState } from "view-model/interaction-state";

@DragDropContext(HTML5Backend)
class App extends React.Component<{}, {}> {
  render(): JSX.Element | null {
    return (
      <div className="app">
        <ResourcesView resources={game.player.resources} />
        <WorldAreaView worldArea={game.locations['startingZone']} 
                       shop={game.shop} 
                       inventory={game.player.inventory} 
                       itemDefs={game.itemDefs}
                       interaction={interactionState} />
        <ShopView itemDefs={game.itemDefs} shop={game.shop} />
        <InventoryView inventory={game.player.inventory} interaction={interactionState} />
        ===end===
      </div>
    );
  }
}

game.player.resources.addResource('wool', 123);
game.player.inventory.addItem(game.itemDefs['llama'], 7);

var interactionState = new InteractionState();

var lastTime = Date.now();
var accumulator = 0;
var fixedDtSeconds = 1;
setInterval(function() {
  var currentTime = Date.now();
  var dtSeconds = (currentTime - lastTime) / 1000;
  accumulator += dtSeconds;
  lastTime = currentTime;

  // Small updates are precise, large updates are rounded down
  if (accumulator < 10) {
    while (accumulator >= fixedDtSeconds) {
      game.tick(fixedDtSeconds);
      accumulator -= fixedDtSeconds;
    }
  } else {
    game.tick(Math.floor(dtSeconds));
    accumulator = 0;
  }

}, 1000);

ReactDOM.render(<App />, document.getElementById('mount'));