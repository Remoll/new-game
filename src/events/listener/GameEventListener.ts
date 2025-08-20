import Entity from "entity/Entity";
import { IGameEventListener } from "./types";
import GameLoop from "gameLoop/GameLoop";

class GameEventListener implements IGameEventListener {
  entities: Entity[];
  gameLoop: GameLoop;

  constructor(entities, gameLoop) {
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

  handleAttack(targetEntity, value) {
    targetEntity.takeDamage(value);
  }

  handleMove() { }

  handleWait() { }

  affectTarget(eventDetail) {
    const { type, sender, target, value } = eventDetail;

    if (!target) {
      switch (type) {
        case "playermaketurn":
          this.playerMakeTurn(value);
          break;

        default:
          break;
      }
      return
    }

    const targetType = target.type;
    const targetId = target.id;
    const affectedEntities = this.entities
      .filter((entity) => entity.type === targetType || entity.id === targetId)
      .filter((entity) => entity.isAlive());

    affectedEntities.forEach((entity) => {
      switch (type) {
        case "attack":
          this.handleAttack(entity, value);
          break;

        case "moved":
          this.handleWait();
          break;
        case "wait":
          this.handleMove();
          break;

        default:
          break;
      }
    });
  }

  listenToEvents() {
    document.addEventListener("attack", (event) => {
      this.affectTarget(event.detail);
    });

    document.addEventListener("moved", (event) => {
      this.affectTarget(event.detail);
    });

    document.addEventListener("wait", (event) => {
      this.affectTarget(event.detail);
    });

    document.addEventListener("playermaketurn", (event) => {
      this.affectTarget(event.detail);
    });
  }
}

export default GameEventListener;
