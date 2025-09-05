import { emitAttack, emitDead, emitMove, emitWait } from "events/emiter/emittedActions";
import { IEntity } from "./types";
import Field from "../gameMap/field/Field";

class Entity implements IEntity {
  fields: Field[];
  type: string;
  id: string;
  x: number;
  y: number;
  hp: number;
  isPasive: boolean;
  canOccupiedFields: boolean;

  constructor(fields, type = "entity", x = 0, y = 0, isPasive = false, canOccupiedFields = true) {
    this.fields = fields;
    this.type = type;
    this.id = this.generateId(type);
    this.x = x;
    this.y = y;
    this.hp = 100;
    this.isPasive = isPasive;
    this.canOccupiedFields = canOccupiedFields;
  }

  setCanOccupiedFields(value) {
    this.canOccupiedFields = value;

    const field = this.getOccupiedField(this.x, this.y);

    if (!field.isOccupied && value) {
      field.setOccupied(value)
    }
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
    emitDead(this, { type: this.type });
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
      return fieldPosition.x === x && fieldPosition.y === y && !field.isOccupied;
    });
  }

  getOccupiedField(x, y) {
    return this.fields.find((field) => field.x === x && field.y === y);
  }

  setIsOccupied(x, y, value) {
    const field = this.getOccupiedField(x, y);
    if (field) {
      field.setOccupied(this.canOccupiedFields && value);

      if (value) {
        field.addEntityToOccupiedBy(this);
      } else {
        field.removeEntityFromOccupiedBy(this);
      }
    }
  }

  getPlayerPosition() {
    const fieldWithPlayer = this.fields.find((field) => {
      if (!field.entitiesOnField || field.entitiesOnField.length < 1) {
        return null;
      }
      return field.entitiesOnField?.some((entity) => {
        return entity.type === "player"
      })
    })

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
    emitAttack(this, { id: element.id }, 10)
  }

  getElementsOccupiedField(x, y) {
    const field = this.fields.find((field) => field.x === x && field.y === y);
    return field && field.entitiesOnField;
  }

  getElementToAttackFromCoordinates(x, y): Entity | null {
    const elementsOccupiedField = this.getElementsOccupiedField(x, y);

    if (!elementsOccupiedField) {
      return null;
    }

    const elementsThatCanOccupiedFields = elementsOccupiedField.filter((entity) => entity.canOccupiedFields)

    if (!elementsThatCanOccupiedFields) {
      return null;
    }

    if (elementsThatCanOccupiedFields.length === 0) {
      return null;
    }

    if (elementsThatCanOccupiedFields.length > 1) {
      console.error("more than one element from elementsThatCanOccupiedFields, need exact one")
      return null;
    }

    const elementToAttack = elementsThatCanOccupiedFields[0];

    return elementToAttack || null;
  }

  move(newX, newY) {
    const initialX = this.x;
    const initialY = this.y;

    this.x = newX;
    this.y = newY;

    this.setIsOccupied(initialX, initialY, false);
    this.setIsOccupied(newX, newY, true);

    emitMove(this, { type: "enemy" })
  }

  takeAction(axis, direction) {
    const newX = axis === "x" ? this.x + direction : this.x;
    const newY = axis === "y" ? this.y + direction : this.y;

    const elementToAttack = this.getElementToAttackFromCoordinates(newX, newY);

    if (elementToAttack) {
      this.attackElement(elementToAttack);
      return;
    }

    if (!this.checkIsFieldAvailable(newX, newY)) {
      console.log("fieldOccupied, can't move")
      return;
    }

    this.move(newX, newY);
  }

  takeActionLeft() {
    this.takeAction("x", -1);
  }
  takeActionRight() {
    this.takeAction("x", 1);
  }
  takeActionUp() {
    this.takeAction("y", -1);
  }
  takeActionDown() {
    this.takeAction("y", 1);
  }

  wait() {
    emitWait(this, { type: "enemy" })
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
        if (field.isOccupied && !(nx === targetX && ny === targetY)) {
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

  takeActionToDirectionFromCoordinates(nextX, nextY) {
    if (nextX > this.x) {
      this.takeActionRight();
    } else if (nextX < this.x) {
      this.takeActionLeft();
    } else if (nextY > this.y) {
      this.takeActionDown();
    } else if (nextY < this.y) {
      this.takeActionUp();
    }
  }
}

export default Entity;
