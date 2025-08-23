import Enemy from "entity/enemy/Enemy";
import Player from "entity/player/Player";
import GameEventListener from "events/listener/GameEventListener";
import IGame from "./types";
import GameMap from "../gameMap/GameMap";
import GameLoop from "gameLoop/GameLoop";
import Building from "entity/block/Building";

class Game implements IGame {
  ctx: HTMLElement | null;
  constructor(ctx) {
    this.ctx = ctx || document.getElementById("canvas");
    this.initGame();
  }

  initGame() {
    if (this.ctx) {
      const gameMap = new GameMap();

      const building = new Building(gameMap.getFields(), { topLeft: { x: 3, y: 3 }, bottomRight: { x: 15, y: 15 } });

      const blocks = building.getBlocks();

      const player = new Player(gameMap.getFields(), 1, 1);

      if (!player) {
        console.error("Player not created");
        return;
      }

      const enemy = new Enemy(gameMap.getFields(), 5, 5);
      const enemy1 = new Enemy(gameMap.getFields(), 10, 5);
      const enemy2 = new Enemy(gameMap.getFields(), 20, 15);

      if (!enemy || !enemy1 || !enemy2) {
        console.error("Enemy not created");
        return;
      }


      const entities = [player, enemy, enemy1, enemy2, ...blocks];

      const gameLoop = new GameLoop(entities, gameMap, this.ctx)

      const gameEventListener = new GameEventListener(entities, gameLoop);

      console.log("Event listener initialized:", gameEventListener);

      console.log("Game initialized !!!");
    } else {
      console.error("Root element not found");
    }
  }
}

export default Game;
