import { IEntity } from "./types";
import Field from "../gameMap/field/Field";
import GameEventEmitter from "../events/emiter/GameEventEmitter";

class Entity implements IEntity {
  fields: Field[];
  type: string;
  id: string;
  x: number;
  y: number;
  hp: number;
  isPasive: boolean;

  constructor(fields, type = "entity", x = 0, y = 0, isPasive = false) {
    this.fields = fields;
    this.type = type;
    this.id = this.generateId(type);
    this.x = x;
    this.y = y;
    this.hp = 100;
    this.isPasive = isPasive;
  }

  generateId(type) {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000);
    return `${type}-${timestamp}-${randomPart}`;
  }

  takeDamage(value) {
    if (this.isPasive) {
      console.log("Entity is immune to damage")
      return;
    }
    this.hp -= value;
    if (this.hp <= 0) {
      this.die();
      return;
    }
  }

  die() {
    this.hp = 0;
    this.setIsOccupied(this.x, this.y, false);
    GameEventEmitter.emit("died", this, { type: this.type });
  }

  isAlive() {
    return this.hp > 0;
  }

  addToCanvas(ctx) {
    ctx.fillStyle = "#ff0000ff";
    ctx.fillRect(this.x * 50, this.y * 50, 50, 50);  // x, y, width, height

    if (!this.isPasive) {
      ctx.fillStyle = "#c3ff00ff";
      ctx.fillText(this.hp, this.x * 50, this.y * 50);
    }

    this.setIsOccupied(this.x, this.y, true);
  }

  checkIsFieldAvailable(x, y) {
    return this.fields.some((field) => {
      const fieldPosition = field.getPosition();
      return fieldPosition.x === x && fieldPosition.y === y && !field.occupied;
    });
  }

  setIsOccupied(x, y, value) {
    const field = this.fields.find((field) => field.x === x && field.y === y);
    if (field) {
      field.toggleOccupied(value, this);
    }
  }

  getPlayerPosition() {
    const fieldWithPlayer = this.fields.find((field) => field.occupiedBy?.type === "player")

    if (!fieldWithPlayer) {
      console.log("fieldWithPlayer not found")
      return null;
    }

    return {
      x: fieldWithPlayer.x,
      y: fieldWithPlayer.y,
    };
  }

  attackElement(element) {
    GameEventEmitter.emit("attack", this, { id: element.id }, 10);
  }

  getElementOccupiedField(x, y) {
    const field = this.fields.find((field) => field.x === x && field.y === y);
    return field && field.occupiedBy;
  }

  move(axis, direction) {
    const initialX = this.x;
    const initialY = this.y;
    const newX = axis === "x" ? this.x + direction : this.x;
    const newY = axis === "y" ? this.y + direction : this.y;

    const elementOccupiedField = this.getElementOccupiedField(newX, newY);
    if (elementOccupiedField) {
      this.attackElement(elementOccupiedField);
      return;
    }

    if (!this.checkIsFieldAvailable(newX, newY)) {
      return;
    }

    this[axis] += direction;
    this.setIsOccupied(initialX, initialY, false);
    this.setIsOccupied(newX, newY, true);

    GameEventEmitter.emit(
      "moved",
      this,
      { type: "enemy" },
      {
        x: this.x,
        y: this.y,
      }
    );
  }

  moveLeft() {
    this.move("x", -1);
  }
  moveRight() {
    this.move("x", 1);
  }
  moveUp() {
    this.move("y", -1);
  }
  moveDown() {
    this.move("y", 1);
  }

  wait() {
    GameEventEmitter.emit(
      "wait",
      this,
      { type: "enemy" },
      {}
    );
  }

  findShortestPath(targetX, targetY) {
    // quick checks
    const startKey = `${this.x},${this.y}`;
    const targetKey = `${targetX},${targetY}`;

    // build a lookup for fields by "x,y"
    const fieldMap = new Map();
    this.fields.forEach((f) => fieldMap.set(`${f.x},${f.y}`, f));

    if (!fieldMap.has(targetKey)) {
      // target is off-map
      return null;
    }

    if (startKey === targetKey) {
      return []; // already at player
    }

    const queue = [startKey];
    const visited = new Set([startKey]);
    const parent = new Map();

    const directions = [
      [1, 0], // right
      [-1, 0], // left
      [0, 1], // down
      [0, -1], // up
    ];

    while (queue.length > 0) {
      const key = queue.shift();
      const [cx, cy] = key.split(",").map(Number);

      for (const [dx, dy] of directions) {
        const nx = cx + dx;
        const ny = cy + dy;
        const nKey = `${nx},${ny}`;

        if (visited.has(nKey)) continue;
        if (!fieldMap.has(nKey)) continue; // out of map

        const field = fieldMap.get(nKey);

        // If the neighbor is occupied and it's NOT the player's cell, skip it.
        // (We allow stepping into the player's cell even if it's occupied by the player.)
        if (field.occupied && !(nx === targetX && ny === targetY)) {
          continue;
        }

        visited.add(nKey);
        parent.set(nKey, key);

        // Found player — reconstruct path
        if (nKey === targetKey) {
          const path = [];
          let cur = nKey;
          while (cur && cur !== startKey) {
            const [px, py] = cur.split(",").map(Number);
            path.push([px, py]);
            cur = parent.get(cur);
          }
          path.reverse();
          return path; // array of [x,y] steps (first step is the next move)
        }

        queue.push(nKey);
      }
    }

    // no path
    return null;
  }

  moveToDirectionFromCoordinates(nextX, nextY) {
    if (nextX > this.x) {
      this.moveRight();
    } else if (nextX < this.x) {
      this.moveLeft();
    } else if (nextY > this.y) {
      this.moveDown();
    } else if (nextY < this.y) {
      this.moveUp();
    }
  }
}

export default Entity;
