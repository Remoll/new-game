import { IEntity } from "./types";
import Field from "../map/field/Field";
import GameEventEmitter from "../events/emiter/GameEventEmitter";

class Entity implements IEntity {
  mapElement: HTMLElement | null;
  fields: Field[];
  type: string;
  id: string;
  x: number;
  y: number;
  hp: number;

  constructor(mapElement, fields, type = "entity", x = 0, y = 0) {
    this.mapElement = mapElement;
    this.fields = fields;
    this.type = type;
    this.id = this.generateId(type);
    this.x = x;
    this.y = y;
    this.hp = 100;

    this.spawnOnMap();
  }

  generateId(type) {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000);
    return `${type}-${timestamp}-${randomPart}`;
  }

  takeDamage(value) {
    this.hp -= value;
    if (this.hp <= 0) {
      this.die();
      return;
    }
    this.resetPosition();
  }

  die() {
    this.hp = 0;
    this.removeFromMap();
    GameEventEmitter.emit("died", this, { type: this.type });
  }

  isAlive() {
    return this.hp > 0;
  }

  getHtml(x, y) {
    return `<div id="${this.id}" class="game_object ${this.type}" style="top: ${y * 25
      }px; left: ${x * 25}px" data-x="${x}" data-y="${y}">
    
      <span class="hp_bar">${this.hp}</span>
    </div>`;
  }

  spawnOnMap() {
    const entity = this.getHtml(this.x, this.y);

    const isFieldAvailable = this.checkIsFieldAvailable(this.x, this.y);

    if (this.mapElement && isFieldAvailable) {
      this.mapElement.innerHTML += entity;
    }

    this.setIsOccupied(this.x, this.y, true);
  }

  removeFromMap() {
    const existingEntity = document.getElementById(this.id);
    if (existingEntity) {
      existingEntity.remove();
    }
    this.setIsOccupied(this.x, this.y, false);
  }

  resetPosition() {
    this.removeFromMap();
    this.spawnOnMap();
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
    const element = document.getElementsByClassName("player")[0];
    if (element) {
      return {
        x: parseInt(element.dataset.x, 10),
        y: parseInt(element.dataset.y, 10),
      };
    }
    return null;
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
    this.resetPosition();
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
}

export default Entity;
