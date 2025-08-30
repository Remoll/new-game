import Entity from "entity/Entity";
import GameEventEmitter from "events/emiter/GameEventEmitter";

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
          GameEventEmitter.emit("playermaketurn", this, null, { entityType: this.type, entityId: this.id, action: () => this.takeActionUp() })
          break;
        case "ArrowDown":
          GameEventEmitter.emit("playermaketurn", this, null, { entityType: this.type, entityId: this.id, action: () => this.takeActionDown() })

          break;
        case "ArrowLeft":
          GameEventEmitter.emit("playermaketurn", this, null, { entityType: this.type, entityId: this.id, action: () => this.takeActionLeft() })

          break;
        case "ArrowRight":
          GameEventEmitter.emit("playermaketurn", this, null, { entityType: this.type, entityId: this.id, action: () => this.takeActionRight() })

          break;
        case " ":
          GameEventEmitter.emit("playermaketurn", this, null, { entityType: this.type, entityId: this.id, action: () => this.wait() })
          return;
        default:
          return;
      }
    });
  }
}

export default Player;
