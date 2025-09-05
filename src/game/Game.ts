import Enemy from "entity/enemy/Enemy";
import Player from "entity/player/Player";
import GameEventListener from "events/listener/GameEventListener";
import IGame from "./types";
import GameMap from "../gameMap/GameMap";
import GameLoop from "gameLoop/GameLoop";
import Building from "gameMap/building/Building";

class Game implements IGame {
  ctx: HTMLElement | null;
  constructor(ctx) {
    this.ctx = ctx || document.getElementById("canvas");
    this.initGame();
  }

  initGame() {
    if (this.ctx) {
      const gameMap = new GameMap();

      const buildingCoordinates = { topLeft: { x: 3, y: 3 }, bottomRight: { x: 16, y: 16 }, door: { x: 15, y: 16, isClosed: true } }

      const building = new Building(gameMap.getFields(), buildingCoordinates);

      const blocks = building.getBlocks();

      const player = new Player(gameMap.getFields(), 1, 1);

      if (!player) {
        console.error("Player not created");
        return;
      }

      const enemiesCoordinates = [{ x: 5, y: 5 }, { x: 10, y: 5 }, { x: 18, y: 18 }]

      const enemies = enemiesCoordinates.map((coordinates) => {
        const { x, y } = coordinates;
        return new Enemy(gameMap.getFields(), x, y)
      })

      if (enemies.some((enemy) => !enemy)) {
        console.error("Enemies not created");
        return;
      }

      const entities = [player, ...enemies, ...blocks];

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
