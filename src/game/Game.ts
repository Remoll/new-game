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
import GameState from "./GameState";
import { Coordinates } from "@/types";

class Game {
  private static instance: Game | null = null;
  private ctx: CanvasRenderingContext2D;
  private gameLoop: GameLoop;
  private gameEventListener: GameEventListener;
  private instances: { [key in InstanceKey]?: GameInstance } = {};

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
      const player = new Player({ itemsAttributes: [{ type: "fireWand", x: null, y: null, imagesKeys: { default: ImageKey.WAND, dead: ImageKey.WAND }, canOccupiedFields: false, isInteractive: true }, { type: "sword", x: null, y: null, imagesKeys: { default: ImageKey.SWORD, dead: ImageKey.SWORD_EQUIPED }, canOccupiedFields: false, isInteractive: true }], speed: 2, type: "player", x: 1, y: 1, imagesKeys: { default: ImageKey.PLAYER, dead: ImageKey.PLAYER_DEAD }, faction: Faction.PLAYER, hp: 200, dispositionToFactions: { [Disposition.HOSTILE]: [Faction.ENEMY], [Disposition.FRIENDLY]: [Faction.PLAYER], [Disposition.NEUTRAL]: [Faction.NEUTRAL] }, canOccupiedFields: true, isInteractive: false });

      GameState.setPlayer(player);

      this.instances[InstanceKey.INSTANCE_01] = new GameInstance(instance01);

      const playerCurrentField = player.getCurrentField();
      playerCurrentField.addGameObjectToField(player);

      const gameMap = this.instances[InstanceKey.INSTANCE_01].getGameMap();

      const gameObjects = [player, ...this.instances[InstanceKey.INSTANCE_01].getGameObjects()];

      this.gameLoop = GameLoop.getInstance(gameObjects, gameMap, this.ctx);

      this.gameEventListener = GameEventListener.getInstance(gameObjects, this.gameLoop);
    } else {
      console.error("Root element not found");
    }
  }

  startNewInstance(instanceKey: InstanceKey, targetPlayerCoordinates: Coordinates) {
    const player = GameState.getPlayer();

    const playerPrevField = player.getCurrentField();
    playerPrevField.removeGameObjectFromField(player);

    const instanceData = this.getInstanceDataByKey(instanceKey);

    if (!this.instances[instanceKey]) {
      this.instances[instanceKey] = new GameInstance(instanceData);
    }

    const gameMap = this.instances[instanceKey].getGameMap();

    const fields = gameMap.getFields();

    GameState.setFields(fields);
    player.setX(targetPlayerCoordinates.x);
    player.setY(targetPlayerCoordinates.y);
    const playerCurrentField = player.getCurrentField();
    playerCurrentField.addGameObjectToField(player);

    const gameObjects = [player, ...this.instances[instanceKey].getGameObjects()];
    this.gameLoop.setGameMap(gameMap)
    this.gameLoop.setGameObjects(gameObjects)
    this.gameEventListener.setGameObjects(gameObjects)
  }
}

export default Game;
