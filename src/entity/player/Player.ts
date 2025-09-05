import Entity from "entity/Entity";
import { emitPlayerMakeTurn } from "events/emiter/emittedActions";

class Player extends Entity {
  constructor(fields, x, y) {
    super(fields, "player", x, y);
    this.hp = 200;
    this.addMoveListener();
  }

  playerMovedAction(directionFunction) {
    return { entityType: this.type, entityId: this.id, action: () => directionFunction() }
  }

  addMoveListener() {
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      switch (key) {
        case "ArrowUp":
          emitPlayerMakeTurn(this, () => this.takeActionUp())
          break;
        case "ArrowDown":
          emitPlayerMakeTurn(this, () => this.takeActionDown())
          break;
        case "ArrowLeft":
          emitPlayerMakeTurn(this, () => this.takeActionLeft())
          break;
        case "ArrowRight":
          emitPlayerMakeTurn(this, () => this.takeActionRight())
          break;
        case " ":
          emitPlayerMakeTurn(this, () => this.wait())
          return;
        default:
          return;
      }
    });
  }
}

export default Player;
