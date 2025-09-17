import { GameEvent, GameEventType } from "@/gameEvents/types";
import GameObject from "@/gameObject/GameObject";
import GameLoop from "@/gameLoop/GameLoop";
import Entity from "@/gameObject/entity/Entity";

class GameEventListener {
  private gameObjects: GameObject[];
  private gameLoop: GameLoop;

  constructor(gameObjects: GameObject[], gameLoop: GameLoop) {
    this.gameObjects = gameObjects;
    this.gameLoop = gameLoop;
    this.listenToEvents();
  }

  private playerMakeTurn(value) {
    this.gameLoop.addEntityAction(value)
    this.gameLoop.collectActions()
    this.gameLoop.executeTurn()
    this.gameLoop.resetEntitiesActions()
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

  private listenToEvents() {
    document.addEventListener(GameEventType.ATTACK, (event: CustomEvent) => {
      this.affectTarget(event.detail);
    });

    document.addEventListener(GameEventType.MOVED, (event: CustomEvent) => {
      this.affectTarget(event.detail);
    });

    document.addEventListener(GameEventType.WAIT, (event: CustomEvent) => {
      this.affectTarget(event.detail);
    });

    document.addEventListener(GameEventType.PLAYER_MAKE_TURN, (event: CustomEvent) => {
      this.affectTarget(event.detail);
    });

    document.addEventListener(GameEventType.DIED, (event: CustomEvent) => {
      this.affectTarget(event.detail);
    });
  }
}

export default GameEventListener;
