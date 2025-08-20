import Enemy from "entity/enemy/Enemy";
import Player from "entity/player/Player";
import Wall from "entity/wall/Wall";
import GameEventListener from "events/listener/GameEventListener";
import IGame from "./types";
import GameMap from "../gameMap/GameMap";
import GameLoop from "gameLoop/GameLoop";

class Game implements IGame {
  root: HTMLElement | null;
  constructor(root) {
    this.root = root || document.getElementById("root");
    this.initGame();
  }

  initGame() {
    if (this.root) {
      const map = new GameMap();

      const htmlMap = map.generateHTMLMap();

      const container = `<h1>Welcome to the Tactical Marines Naval Game</h1><div id="map" class="map">${htmlMap}</div>`;

      this.root.innerHTML = container;

      const mapElement = document.getElementById("map");

      if (!mapElement) {
        console.error("GameMap element not found");
        return;
      }

      let walls = [];

      const initialX = 2;
      const length = 6;

      for (let i = initialX; i < initialX + length; i++) {
        const yTop = 3;
        const yBottom = 8;
        walls.push(new Wall(mapElement, map.getFields(), i, yTop));
        walls.push(new Wall(mapElement, map.getFields(), i, yBottom));
      }

      const player = new Player(mapElement, map.getFields(), 1, 1);

      if (!player) {
        console.error("Player not created");
        return;
      }

      const enemy = new Enemy(mapElement, map.getFields(), 5, 5);
      const enemy1 = new Enemy(mapElement, map.getFields(), 20, 2);
      const enemy2 = new Enemy(mapElement, map.getFields(), 25, 15);

      if (!enemy || !enemy1 || !enemy2) {
        console.error("Enemy not created");
        return;
      }


      const entities = [player, enemy, enemy1, enemy2, ...walls];

      const gameLoop = new GameLoop(entities)

      const gameEventListener = new GameEventListener(entities, gameLoop);

      console.log("Event listener initialized:", gameEventListener);

      console.log("Game initialized !!!");
    } else {
      console.error("Root element not found");
    }
  }
}

export default Game;
