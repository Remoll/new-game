import Entity from "entity/Entity";
import GameEventEmitter from "events/emiter/GameEventEmitter";

class Player extends Entity {
  constructor(mapElement, fields, x, y) {
    super(mapElement, fields, "player", x, y);
    this.hp = 200;
    this.resetPosition();
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
          GameEventEmitter.emit("playermoved", this, null, { entityType: this.type, entityId: this.id, action: () => this.moveUp() })
          break;
        case "ArrowDown":
          GameEventEmitter.emit("playermoved", this, null, { entityType: this.type, entityId: this.id, action: () => this.moveDown() })

          break;
        case "ArrowLeft":
          GameEventEmitter.emit("playermoved", this, null, { entityType: this.type, entityId: this.id, action: () => this.moveLeft() })

          break;
        case "ArrowRight":
          GameEventEmitter.emit("playermoved", this, null, { entityType: this.type, entityId: this.id, action: () => this.moveRight() })

          break;
        case " ":
          return;
        default:
          return; // Exit if not an arrow key
      }
    });
  }
}

export default Player;
