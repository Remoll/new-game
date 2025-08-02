import { IField } from "./types";
import Entity from "../../entity/Entity";

class Field implements IField {
  x: number;
  y: number;
  occupied: boolean;
  occupiedBy: Entity | null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.occupied = false;
    this.occupiedBy = null;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  toggleOccupied(value: boolean, occupiedBy: Entity | null = null) {
    this.occupied = value;
    this.occupiedBy = value ? occupiedBy : null;
  }

  getHtml(): string {
    return `<div class="game_object field ${
      this.occupied ? "field--occupied" : ""
    }" style="top: ${this.y * 25}px; left: ${this.x * 25}px" data-x="${
      this.x
    }" data-y="${this.y}"></div>`;
  }
}

export default Field;
