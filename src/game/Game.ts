import GameEventListener from "gameEvents/listener/GameEventListener";
import GameMap from "../gameMap/GameMap";
import GameLoop from "gameLoop/GameLoop";
import Building from "gameMap/building/Building";
import Player from "gameObject/entity/player/Player";
import { Disposition, Faction } from "gameObject/types";
import Npc from "gameObject/entity/npc/Npc";

class Game {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.initGame();
  }

  private initGame() {
    if (this.ctx) {
      const gameMap = new GameMap();

      const buildingCoordinates = { topLeft: { x: 3, y: 3 }, bottomRight: { x: 16, y: 16 }, door: { x: 15, y: 16, isClosed: true } }

      const building = new Building(gameMap.getFields(), buildingCoordinates);

      const blocks = building.getBlocks();

      const player = new Player({ fields: gameMap.getFields(), type: "player", x: 1, y: 1, faction: Faction.PLAYER, hp: 200, dispositionToFactions: {}, canOccupiedFields: true, isInteractive: false });

      if (!player) {
        console.error("Player not created");
        return;
      }

      const enemiesCoordinates = [{ x: 5, y: 5 }, { x: 10, y: 5 }, { x: 18, y: 18 }]

      const npcs = enemiesCoordinates.map((coordinates) => {
        const { x, y } = coordinates;
        return new Npc({ fields: gameMap.getFields(), type: "enemy", x, y, faction: Faction.ENEMY, hp: 100, dispositionToFactions: { [Disposition.HOSTILE]: [Faction.PLAYER] }, canOccupiedFields: true, isInteractive: false })
      })

      if (npcs.some((npc) => !npc)) {
        console.error("Enemies not created");
        return;
      }

      const gameObjects = [player, ...npcs, ...blocks];

      const gameLoop = new GameLoop(gameObjects, gameMap, this.ctx)

      const gameEventListener = new GameEventListener(gameObjects, gameLoop);

      console.log("Event listener initialized:", gameEventListener);

      console.log("Game initialized !!!");
    } else {
      console.error("Root element not found");
    }
  }
}

export default Game;
