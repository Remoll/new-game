import Entity from "../Entity";

class Enemy extends Entity {
  constructor(fields, x, y) {
    super(fields, "enemy", x, y);
  }

  chargePlayer() {
    if (!this.isAlive) {
      console.log("Enemy is dead and cant move")
      return;
    }

    const playerPosition = this.getPlayerPosition();

    if (!playerPosition) {
      console.log("Player position not found")
      return;
    }

    const { x: playerX, y: playerY } = playerPosition || {};

    if (!playerX || !playerY) return;

    const path = this.findShortestPath(playerX, playerY);

    // path === null -> unreachable
    // path === [] -> already on player
    if (!path || path.length === 0) {
      // if path is empty and we are on the player, do nothing (or attack if desired)
      return;
    }

    const [nextX, nextY] = path[0];

    this.takeActionToDirectionFromCoordinates(nextX, nextY)
  }
}

export default Enemy;
