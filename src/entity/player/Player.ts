import Entity from "entity/Entity";

class Player extends Entity {
  constructor(mapElement, fields, x, y) {
    super(mapElement, fields, "player", x, y);
    this.hp = 200;
    this.resetPosition();
    this.addMoveListener();
  }

  addMoveListener() {
    document.addEventListener("keydown", (event) => {
      const key = event.key;
      switch (key) {
        case "ArrowUp":
          this.moveUp();
          break;
        case "ArrowDown":
          this.moveDown();
          break;
        case "ArrowLeft":
          this.moveLeft();
          break;
        case "ArrowRight":
          this.moveRight();
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
