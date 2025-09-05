import { GameEvent, GameEventType } from "events/types";
import Entity from "entity/Entity";
import GameLoop from "gameLoop/GameLoop";

class GameEventListener {
  entities: Entity[];
  gameLoop: GameLoop;

  constructor(entities: Entity[], gameLoop: GameLoop) {
    this.entities = entities;
    this.gameLoop = gameLoop;
    this.listenToEvents();
  }

  playerMakeTurn(value) {
    this.gameLoop.addEntityAction(value)
    this.gameLoop.collectActions()
    this.gameLoop.executeTurn()
    this.gameLoop.resetEntitiesActions()
  }

  handleAttack(targetEntity: Entity, value: number) {
    targetEntity.takeDamage(value);
  }

  handleMove() { }

  handleWait() { }

  handleDied() { }

  affectTarget(eventDetail: GameEvent) {
    const { type, sender, target, value } = eventDetail;

    if (!target) {
      switch (type) {
        case GameEventType.PLAYER_MAKE_TURN:
          if (!sender.isAlive()) {
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
    const affectedEntities = this.entities
      .filter((entity) => entity.type === targetType || entity.id === targetId)
      .filter((entity) => entity.isAlive());

    affectedEntities.forEach((entity) => {
      switch (type) {
        case GameEventType.ATTACK:
          if ( typeof value !== 'number') {
            console.error('Attack event value must be a number');
            return;
          }
          this.handleAttack(entity, value);
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

  listenToEvents() {
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
