import Entity from "../Entity";

class Enemy extends Entity {
  constructor(mapElement, fields, x, y) {
    super(mapElement, fields, "enemy", x, y);
  }

  chargePlayer() {
    if (this.hp <= 0) {
      return;
    }
    const playerPosition = this.getPlayerPosition();
    if (!playerPosition) return;
    const { x: playerX, y: playerY } = playerPosition || {};
    if (!playerX || !playerY) return;

    if (this.x < playerX) {
      this.moveRight();
    } else if (this.x > playerX) {
      this.moveLeft();
    } else if (this.y < playerY) {
      this.moveDown();
    } else if (this.y > playerY) {
      this.moveUp();
    }
  }
}

export default Enemy;
