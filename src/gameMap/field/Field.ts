import Entity from "../../entity/Entity";

class Field {
  private x: number;
  private y: number;
  private entitiesOnField: Entity[] = [];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  getIsOccupied() {
    return this.entitiesOnField.some((entity) => entity.getCanOccupiedFields());
  }

  addEntityToField(entityToAdd: Entity) {
    const doesEntityExistInOccupiedBy = this.entitiesOnField.some((entity) => entity.getId() === entityToAdd.getId())
    if (doesEntityExistInOccupiedBy) {
      return;
    }

    this.entitiesOnField.push(entityToAdd);
  }

  removeEntityFromField(entityToRemove: Entity) {
    this.entitiesOnField = this.entitiesOnField.filter((entity) => entity.getId() !== entityToRemove.getId())
  }

  getEntitiesFromField(): Entity[] {
    return this.entitiesOnField;
  }

  getEntityThatOccupiedField(): Entity | null {
    if (this.entitiesOnField.length < 1) {
      return null;
    }

    const entitiesThatCanOccupiedFields = this.entitiesOnField.filter((entity) => entity.getCanOccupiedFields())

    if (entitiesThatCanOccupiedFields.length < 1) {
      return null;
    }

    if (entitiesThatCanOccupiedFields.length > 1) {
      console.error("more than one entity from entitiesThatCanOccupiedFields, need exact one")
      return null;
    }

    return entitiesThatCanOccupiedFields[0];
  }
}

export default Field;
