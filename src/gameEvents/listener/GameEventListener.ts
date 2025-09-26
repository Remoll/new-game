import { GameEvent, GameEventType } from "@/gameEvents/types";
import GameObject from "@/gameObject/GameObject";
import GameLoop from "@/gameLoop/GameLoop";
import Entity from "@/gameObject/entity/Entity";

class GameEventListener {
  private static instance: GameEventListener | null = null;
  private gameObjects: GameObject[];
  private gameLoop: GameLoop;

  private constructor(gameObjects: GameObject[], gameLoop: GameLoop) {
    this.gameObjects = gameObjects;
    this.gameLoop = gameLoop;
    this.listenToEvents();
    this.startFirstTurn();
  }

  static getInstance(gameObjects: GameObject[], gameLoop: GameLoop): GameEventListener {
    if (!GameEventListener.instance && gameObjects && gameLoop) {
      GameEventListener.instance = new GameEventListener(gameObjects, gameLoop);
    }
    return GameEventListener.instance;
  }

  setGameObjects(gameObjects: GameObject[]) {
    this.gameObjects = gameObjects;
  }

  startFirstTurn() {
    this.gameLoop.executeTurn();
  }

  private playerMakeTurn(value) {
    this.gameLoop.playerStartTurn(value);
  }

  private handleAttack(targetEntity: Entity, value: number) {
    targetEntity.takeDamage(value);
  }

  private handleMove() { }

  private handleWait() { }

  private handleDied() { }

  private affectTarget(eventDetail: GameEvent) {
    const { type, sender, target, value } = eventDetail;

    if (!target) {
      switch (type) {
        case GameEventType.PLAYER_MAKE_TURN:
          if (sender instanceof Entity && !sender.isAlive()) {
            return;
          }
          this.playerMakeTurn(value);
          return;

        case GameEventType.ANIMATE_EFFECT:
          this.gameLoop.animateEffect(value);
          return;

        default:
          return;
      }
    }

    const targetType = target.type;
    const targetId = target.id;
    const affectedGameObjects = this.gameObjects
      .filter((gameObject) => gameObject.getType() === targetType || gameObject.getId() === targetId)
      .filter((gameObject) => gameObject instanceof Entity && gameObject.isAlive());

    affectedGameObjects.forEach((gameObject) => {
      switch (type) {
        case GameEventType.ATTACK:
          if (gameObject instanceof Entity === false) {
            console.error('Target gameObject is not an instance of Entity');
            return;
          }
          if (typeof value !== 'number') {
            console.error('Attack event value must be a number');
            return;
          }
          this.handleAttack(gameObject, value);
          return;

        case GameEventType.MOVED:
          this.handleWait();
          return;

        case GameEventType.WAIT:
          this.handleMove();
          return;

        case GameEventType.DIED:
          this.handleDied();
          return;

        default:
          return;
      }
    });
  }

  private pastEventDataToHandler = (event: CustomEvent) => {
    this.affectTarget(event.detail);
  }

  private listenToEvents() {
    document.addEventListener(GameEventType.ATTACK, this.pastEventDataToHandler);

    document.addEventListener(GameEventType.MOVED, this.pastEventDataToHandler);

    document.addEventListener(GameEventType.WAIT, this.pastEventDataToHandler);

    document.addEventListener(GameEventType.PLAYER_MAKE_TURN, this.pastEventDataToHandler);

    document.addEventListener(GameEventType.DIED, this.pastEventDataToHandler);

    document.addEventListener(GameEventType.ANIMATE_EFFECT, this.pastEventDataToHandler);
  }
}

export default GameEventListener;
