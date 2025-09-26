import Player from "@/gameObject/entity/player/Player";
import { Disposition, Faction } from "@/gameObject/types";
import { ImageKey } from "@/imageManager/types";
import GameInstance from "./GameInstance";
import GameLoop from "@/gameLoop/GameLoop";
import GameEventListener from "@/gameEvents/listener/GameEventListener";
import instance01 from "@/game/gameInstanceData/instance01";
import instance02 from "@/game/gameInstanceData/instance02";
import instance03 from "@/game/gameInstanceData/instance03";
import { InstanceData, InstanceKey } from "./gameInstanceData/types";

class Game {
  private static instance: Game | null = null;
  private ctx: CanvasRenderingContext2D;
  private gameLoop: GameLoop;
  private gameEventListener: GameEventListener;
  private player: Player;

  private constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.initGame();
  }

  static getInstance(ctx?: CanvasRenderingContext2D): Game {
    if (!Game.instance && ctx) {
      Game.instance = new Game(ctx);
    }
    return Game.instance;
  }

  private getInstanceDataByKey(key: InstanceKey): InstanceData {
    switch (key) {
      case InstanceKey.INSTANCE_01:
        return instance01;
      case InstanceKey.INSTANCE_02:
        return instance02;
      case InstanceKey.INSTANCE_03:
        return instance03;
      default:
        return instance01;
    }
  }

  private initGame() {
    if (this.ctx) {
      this.player = new Player({ fields: [], type: "player", x: null, y: null, imagesKeys: { default: ImageKey.PLAYER, dead: ImageKey.PLAYER_DEAD }, faction: Faction.PLAYER, hp: 200, dispositionToFactions: { [Disposition.HOSTILE]: [Faction.ENEMY], [Disposition.FRIENDLY]: [Faction.PLAYER], [Disposition.NEUTRAL]: [Faction.NEUTRAL] }, canOccupiedFields: true, isInteractive: false });

      const gameInstance = new GameInstance(instance03);
      const gameMap = gameInstance.getGameMap();

      this.player.setX(instance01.playerStart.x);
      this.player.setY(instance01.playerStart.y);

      this.player.setFields(gameMap.getFields());

      const gameObjects = [this.player, ...gameInstance.getGameObjects()];

      this.gameLoop = GameLoop.getInstance(gameObjects, gameMap, this.ctx);

      this.gameEventListener = GameEventListener.getInstance(gameObjects, this.gameLoop);
    } else {
      console.error("Root element not found");
    }
  }

  startNewInstance(instanceKey: InstanceKey) {
    const instanceData = this.getInstanceDataByKey(instanceKey);
    const gameInstance = new GameInstance(instanceData);
    const gameMap = gameInstance.getGameMap();

    this.player.setX(instanceData.playerStart.x);
    this.player.setY(instanceData.playerStart.y);

    this.player.setFields(gameMap.getFields());

    this.player.getItems().forEach((item) => {
      item.setFields(gameMap.getFields());
    })

    const gameObjects = [this.player, ...gameInstance.getGameObjects()];
    this.gameLoop.setGameMap(gameMap)
    this.gameLoop.setGameObjects(gameObjects)
    this.gameEventListener.setGameObjects(gameObjects)
  }
}

export default Game;
