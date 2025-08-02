import Entity from "entity/Entity";
import { IGameEventListener } from "./types";

class GameEventListener implements IGameEventListener {
  entities: Entity[];

  constructor(entities) {
    this.entities = entities;
    this.listenToEvents();
  }

  handleAttack(targetEntity, sender, value) {
    targetEntity.takeDamage(value);
    if (sender.type === "player" && targetEntity.type === "enemy") {
      targetEntity.chargePlayer();
    }
  }

  handleMove(enemy, sender) {
    if (sender.type === "player") {
      enemy.chargePlayer();
    }
  }

  affectTarget(eventDetail) {
    const { type, sender, target, value } = eventDetail;
    const targetType = target.type;
    const targetId = target.id;
    const affectedEntities = this.entities
      .filter((entity) => entity.type === targetType || entity.id === targetId)
      .filter((entity) => entity.isAlive());

    affectedEntities.forEach((entity) => {
      switch (type) {
        case "attack":
          this.handleAttack(entity, sender, value);
          break;

        case "moved":
          this.handleMove(entity, sender);
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
  }
}

export default GameEventListener;
