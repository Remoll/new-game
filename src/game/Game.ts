import Player from '@/gameObject/entity/player/Player.ts';
import { Disposition, Faction } from '@/gameObject/types.ts';
import { ImageKey } from '@/imageManager/types.ts';
import GameInstance from '../gameInstance/GameInstance.ts';
import GameLoop from '@/gameLoop/GameLoop.ts';
import GameEventListener from '@/gameEvents/listener/GameEventListener.ts';
import instance01 from '@/gameInstance/gameInstancesData/instance01.ts';
import instance02 from '@/gameInstance/gameInstancesData/instance02.ts';
import instance03 from '@/gameInstance/gameInstancesData/instance03.ts';
import inn from '@/gameInstance/gameInstancesData/inn.ts';
import forestEdge from '@/gameInstance/gameInstancesData/forestEdge.ts';
import arena from '@/gameInstance/gameInstancesData/arena.ts';
import GameState from '../gameState/GameState.ts';
import { Coordinates, DamageType } from '@/types.ts';
import { GameInstanceData, GameInstanceKey } from '@/gameInstance/types.ts';
import { QuestManager } from '@/questManager/QuestManager.ts';
import { QuestKey } from '@/questManager/types.ts';
import roadToTheForest from '@/gameInstance/gameInstancesData/roadToTheForest.ts';

class Game {
  private static singleton: Game | null = null;
  private ctx: CanvasRenderingContext2D;
  private gameLoop: GameLoop;
  private gameEventListener: GameEventListener;
  private gameInstances: { [key in GameInstanceKey]?: GameInstance } = {};

  private constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.initGame();
  }

  static getSingleton(ctx?: CanvasRenderingContext2D): Game {
    if (!Game.singleton && ctx) {
      Game.singleton = new Game(ctx);
    }
    return Game.singleton;
  }

  private getInstanceDataByKey(key: GameInstanceKey): GameInstanceData {
    switch (key) {
      case GameInstanceKey.INSTANCE_01:
        return instance01;
      case GameInstanceKey.INSTANCE_02:
        return instance02;
      case GameInstanceKey.INSTANCE_03:
        return instance03;
      case GameInstanceKey.INN:
        return inn;
      case GameInstanceKey.FOREST_EDGE:
        return forestEdge;
      case GameInstanceKey.ROAD_TO_THE_FOREST:
        return roadToTheForest;
      case GameInstanceKey.ARENA:
        return arena;
      default:
        return instance01;
    }
  }

  private initGame() {
    if (this.ctx) {
      const player = new Player({
        itemsProps: [],
        type: 'player',
        x: 1,
        y: 2,
        imagesKeys: { default: ImageKey.PLAYER, dead: ImageKey.PLAYER_DEAD },
        faction: Faction.PLAYER,
        defaultDamageValue: 10,
        defaultDamageType: DamageType.BLUNT,
        defaultArmorValue: 10,
        attributes: {
          strength: 20,
          dexterity: 20,
          agility: 20,
          intelligence: 20,
          endurance: 20,
        },
        dispositionToFactions: {
          [Disposition.HOSTILE]: [Faction.ENEMY],
          [Disposition.FRIENDLY]: [Faction.PLAYER],
          [Disposition.NEUTRAL]: [Faction.NEUTRAL],
        },
        canOccupiedFields: true,
        isInteractive: false,
      });

      GameState.setPlayer(player);

      this.gameInstances[GameInstanceKey.INN] = new GameInstance(inn);

      player.addGameObjectToFields();

      const gameMap = this.gameInstances[GameInstanceKey.INN].getGameMap();

      const gameObjects = [
        player,
        ...this.gameInstances[GameInstanceKey.INN].getGameObjects(),
      ];

      this.gameLoop = GameLoop.getSingleton(gameObjects, gameMap, this.ctx);

      QuestManager.getSingleton().startQuest(QuestKey.FIND_WAY_TO_HOME);

      this.gameEventListener = GameEventListener.getSingleton(
        gameObjects,
        this.gameLoop
      );
    } else {
      console.error('Root element not found');
    }
  }

  startNewGameInstance(
    gameInstanceKey: GameInstanceKey,
    targetPlayerCoordinates: Coordinates
  ) {
    const player = GameState.getPlayer();

    const playerPrevField = player.getCurrentField();
    playerPrevField.removeGameObjectFromField(player);

    const gameInstanceData = this.getInstanceDataByKey(gameInstanceKey);

    if (!this.gameInstances[gameInstanceKey]) {
      this.gameInstances[gameInstanceKey] = new GameInstance(gameInstanceData);
    }

    const gameMap = this.gameInstances[gameInstanceKey].getGameMap();

    const fields = gameMap.getFields();

    GameState.setFields(fields);
    player.setX(targetPlayerCoordinates.x);
    player.setY(targetPlayerCoordinates.y);
    player.addGameObjectToFields();

    const gameObjects = [
      player,
      ...this.gameInstances[gameInstanceKey].getGameObjects(),
    ];
    this.gameLoop.setGameMap(gameMap);
    this.gameLoop.setGameObjects(gameObjects);
    this.gameEventListener.setGameObjects(gameObjects);
  }
}

export default Game;
