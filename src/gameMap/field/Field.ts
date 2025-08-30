import { IField } from "./types";
import Entity from "../../entity/Entity";

class Field implements IField {
  x: number;
  y: number;
  isOccupied: boolean;
  entitiesOnField: Entity[];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.isOccupied = false;
    this.entitiesOnField = [];
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  setOccupied(value: boolean) {
    this.isOccupied = value;
  }

  addEntityToOccupiedBy(entityToAdd: Entity) {
    const doesEntityExistInOccupiedBy = this.entitiesOnField.some((entity) => entity.id === entityToAdd.id)
    if (doesEntityExistInOccupiedBy) {
      return;
    }

    this.entitiesOnField.push(entityToAdd);
  }
  removeEntityFromOccupiedBy(entityToRemove: Entity) {
    this.entitiesOnField = this.entitiesOnField.filter((entity) => entity.id !== entityToRemove.id)
  }

}

export default Field;
