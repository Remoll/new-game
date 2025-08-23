import Enemy from "entity/enemy/Enemy";
import Player from "entity/player/Player";
import Wall from "entity/wall/Wall";
import GameEventListener from "events/listener/GameEventListener";
import IGame from "./types";
import GameMap from "../gameMap/GameMap";
import GameLoop from "gameLoop/GameLoop";

class Game implements IGame {
  ctx: HTMLElement | null;
  constructor(ctx) {
    this.ctx = ctx || document.getElementById("canvas");
    this.initGame();
  }

  initGame() {
    if (this.ctx) {
      const gameMap = new GameMap();

      let walls = [];

      const initialX = 2;
      const length = 6;

      for (let i = initialX; i < initialX + length; i++) {
        const yTop = 3;
        const yBottom = 8;
        walls.push(new Wall(gameMap.getFields(), i, yTop));
        walls.push(new Wall(gameMap.getFields(), i, yBottom));
      }

      const player = new Player(gameMap.getFields(), 1, 1);

      if (!player) {
        console.error("Player not created");
        return;
      }

      const enemy = new Enemy(gameMap.getFields(), 5, 5);
      const enemy1 = new Enemy(gameMap.getFields(), 20, 2);
      const enemy2 = new Enemy(gameMap.getFields(), 20, 15);

      if (!enemy || !enemy1 || !enemy2) {
        console.error("Enemy not created");
        return;
      }


      const entities = [player, enemy, enemy1, enemy2, ...walls];

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
