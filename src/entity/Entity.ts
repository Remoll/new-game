import { emitAttack, emitDead, emitMove, emitWait } from "events/emiter/emittedActions";
import Field from "../gameMap/field/Field";
import { Direction, DispositionToFactions, EntityAttributes, Faction } from "./types";
import { TargetType } from "events/types";

class Entity {
  private fields: Field[];
  private type: string;
  private id: string;
  private x: number;
  private y: number;
  private hp: number;
  private isPasive: boolean;
  private canOccupiedFields: boolean;
  private isInteractive: boolean;
  private dispositionToFactions: DispositionToFactions | null;
  private faction: Faction | null;

  constructor(fields, type = "entity", x = 0, y = 0, attributes: EntityAttributes = { hp: 100, isPasive: false, canOccupiedFields: true, isInteractive: false, dispositionToFactions: {}, faction: null }) {
    this.fields = fields;
    this.type = type;
    this.id = this.generateId(type);
    this.x = x;
    this.y = y;

    const { hp, isPasive, canOccupiedFields, isInteractive, dispositionToFactions, faction } = attributes;

    this.hp = hp === undefined ? 100 : hp;
    this.isPasive = isPasive === undefined ? false : isPasive;
    this.canOccupiedFields = canOccupiedFields === undefined ? true : canOccupiedFields;
    this.isInteractive = isInteractive === undefined ? false : isInteractive;
    this.dispositionToFactions = dispositionToFactions === null ? {} : dispositionToFactions;
    this.faction = faction === undefined ? null : faction;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  getCanOccupiedFields() {
    return this.canOccupiedFields;
  }

  getDispositionToFactions() {
    return this.dispositionToFactions;
  }

  getFaction() {
    return this.faction;
  }

  protected setCanOccupiedFields(value) {
    this.canOccupiedFields = value;
  }

  private generateId(type) {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000);
    return `${type}-${timestamp}-${randomPart}`;
  }

  protected getCurrentField(): Field | null {
    const field = this.getFieldFromCoordinates(this.x, this.y);
    if (!field) {
      console.error("Field not found for entity at coordinates:", this.x, this.y);
      return null;
    }
    return field;
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

  private die() {
    this.hp = 0;
    const field = this.getCurrentField();

    if (field) {
      field.removeEntityFromField(this);
    } else {
      console.log("No field found for entity on die");
    }

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

    const field = this.getCurrentField();
    field.addEntityToField(this);
  }

  private checkIsFieldAvailable(x: number, y: number): boolean {
    const field = this.getFieldFromCoordinates(x, y);
    if (!field) {
      console.log("No field from coordinates");
      return false;
    }

    return !field.getIsOccupied();
  }

  protected getFieldFromCoordinates(x: number, y: number): Field | undefined {
    return this.fields.find((field) => {
      const { x: fieldX, y: fieldY } = field.getPosition();
      return fieldX === x && fieldY === y
    });
  }

  protected getPlayerPosition() {
    const fieldWithPlayer = this.fields.find((field) => {
      const entitieFromField = field.getEntitiesFromField();
      return entitieFromField.some((entity) => {
        return entity.type === "player"
      })
    })

    if (!fieldWithPlayer) {
      console.log("fieldWithPlayer not found")
      return null;
    }

    return fieldWithPlayer.getPosition()
  }

  private attackEntity(entity: Entity) {
    emitAttack(this, { id: entity.id }, 10)
  }

  protected move(newX: number, newY: number) {
    const initialX = this.x;
    const initialY = this.y;

    this.x = newX;
    this.y = newY;

    const oldField = this.getFieldFromCoordinates(initialX, initialY);
    oldField.removeEntityFromField(this);

    const newField = this.getCurrentField();
    newField.addEntityToField(this);

    emitMove(this, { type: "enemy" })
  }

  protected findNewCoorinatedFromDirection(direction: Direction) {
    const newX = direction === Direction.LEFT ? this.x - 1 : direction === Direction.RIGHT ? this.x + 1 : this.x;
    const newY = direction === Direction.UP ? this.y - 1 : direction === Direction.DOWN ? this.y + 1 : this.y;

    return { newX, newY };
  }

  protected takeAction(direction: Direction) {
    const { newX, newY } = this.findNewCoorinatedFromDirection(direction);

    let entityToAttack: Entity | undefined = undefined;

    const field = this.getFieldFromCoordinates(newX, newY);

    if (field) {
      entityToAttack = field.getEntityThatOccupiedField();
    }

    if (entityToAttack) {
      this.attackEntity(entityToAttack);
      return;
    }

    if (!this.checkIsFieldAvailable(newX, newY)) {
      console.log("fieldOccupied, can't move")
      return;
    }

    this.move(newX, newY);
  }

  protected wait() {
    emitWait(this, { type: "enemy" })
  }

  protected findShortestPath(targetX, targetY) {
    // quick checks
    const startKey = `${this.x},${this.y}`;
    const targetKey = `${targetX},${targetY}`;

    // build a lookup for fields by "x,y"
    const fieldMap = new Map();
    this.fields.forEach((field) => {
      const { x: fieldX, y: fieldY } = field.getPosition()
      return fieldMap.set(`${fieldX},${fieldY}`, field)
    });

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
        if (field.getIsOccupied() && !(nx === targetX && ny === targetY)) {
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

  protected takeActionToDirectionFromCoordinates(nextX, nextY) {
    let direction: Direction;

    if (nextX > this.x) {
      direction = Direction.RIGHT;
    } else if (nextX < this.x) {
      direction = Direction.LEFT;
    } else if (nextY > this.y) {
      direction = Direction.DOWN;
    } else if (nextY < this.y) {
      direction = Direction.UP;
    }

    this.takeAction(direction);
  }

  handleInteract() {
    return;
  }

  getIsInteractive() {
    return this.isInteractive;
  }

  findNearestEntity(target: TargetType | Faction[]): Entity | null {
    let nearestEntity: Entity | null = null;
    let minDistance = Infinity;

    this.fields.forEach((field) => {
      const entities = field.getEntitiesFromField();

      entities.forEach((entity) => {
        if (entity.getId() === this.getId()) return;

        const isEntityInSelectedFaction = Array.isArray(target) && target.some((faction) => entity.getFaction() === faction);
        const isEntityTypeInTarget = "type" in target && target.type && entity.getType() === target.type;
        const isEntityIdInTarget = "id" in target && target.id && entity.getId() === target.id;

        if (isEntityInSelectedFaction || isEntityTypeInTarget || isEntityIdInTarget) {
          const { x: entityX, y: entityY } = entity.getPosition();
          const distance = Math.abs(this.x - entityX) + Math.abs(this.y - entityY); // Manhattan distance

          if (distance < minDistance) {
            minDistance = distance;
            nearestEntity = entity;
          }
        }
      });
    });

    return nearestEntity;
  }
}

export default Entity;
