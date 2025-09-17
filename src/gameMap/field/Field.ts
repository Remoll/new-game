import GameObject from "@/gameObject/GameObject";

class Field {
  private x: number;
  private y: number;
  private gameObjectsOnField: GameObject[] = [];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  getIsOccupied() {
    return this.gameObjectsOnField.some((gameObject) => gameObject.getCanOccupiedFields());
  }

  addGameObjectToField(gameObjectToAdd: GameObject) {
    const doesGameObjectExistInOccupiedBy = this.gameObjectsOnField.some((gameObject) => gameObject.getId() === gameObjectToAdd.getId())
    if (doesGameObjectExistInOccupiedBy) {
      return;
    }

    this.gameObjectsOnField.push(gameObjectToAdd);
  }

  removeGameObjectFromField(gameObjectToRemove: GameObject) {
    this.gameObjectsOnField = this.gameObjectsOnField.filter((gameObject) => gameObject.getId() !== gameObjectToRemove.getId())
  }

  getGameObjectsFromField(): GameObject[] {
    return this.gameObjectsOnField;
  }

  getGameObjectThatOccupiedField(): GameObject | null {
    if (this.gameObjectsOnField.length < 1) {
      return null;
    }

    const gameObjectsThatCanOccupiedFields = this.gameObjectsOnField.filter((gameObject) => gameObject.getCanOccupiedFields())

    if (gameObjectsThatCanOccupiedFields.length < 1) {
      return null;
    }

    if (gameObjectsThatCanOccupiedFields.length > 1) {
      console.error("more than one game object from gameObjectsThatCanOccupiedFields, need exact one")
      return null;
    }

    return gameObjectsThatCanOccupiedFields[0];
  }
}

export default Field;
