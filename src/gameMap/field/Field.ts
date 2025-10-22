import GameObject from '@/gameObject/GameObject.ts';
import ImageManager from '@/imageManager/ImageManager.ts';
import { ImageKey } from '@/imageManager/types.ts';
import { Coordinates } from '@/types.ts';
import { FieldAttributes } from '../types.ts';

class Field {
  private x: number;
  private y: number;
  private imageKey: ImageKey;
  private gameObjectsOnField: GameObject[] = [];

  constructor(fieldAttributes: FieldAttributes) {
    const { x, y, imageKey } = fieldAttributes;
    this.x = x;
    this.y = y;
    this.imageKey = imageKey;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  getIsOccupied() {
    return this.gameObjectsOnField.some((gameObject) =>
      gameObject.getCanOccupiedFields()
    );
  }

  addGameObjectToField(gameObjectToAdd: GameObject) {
    const doesGameObjectExistInOccupiedBy = this.gameObjectsOnField.some(
      (gameObject) => gameObject.getId() === gameObjectToAdd.getId()
    );
    if (doesGameObjectExistInOccupiedBy) {
      return;
    }

    this.gameObjectsOnField.push(gameObjectToAdd);
  }

  removeGameObjectFromField(gameObjectToRemove: GameObject) {
    this.gameObjectsOnField = this.gameObjectsOnField.filter(
      (gameObject) => gameObject.getId() !== gameObjectToRemove.getId()
    );
  }

  getGameObjectsFromField(): GameObject[] {
    return this.gameObjectsOnField;
  }

  getGameObjectThatOccupiedField(): GameObject | null {
    if (this.gameObjectsOnField.length < 1) {
      return null;
    }

    const gameObjectsThatCanOccupiedFields = this.gameObjectsOnField.filter(
      (gameObject) => gameObject.getCanOccupiedFields()
    );

    if (gameObjectsThatCanOccupiedFields.length < 1) {
      return null;
    }

    if (gameObjectsThatCanOccupiedFields.length > 1) {
      console.log(
        'gameObjectsThatCanOccupiedFields: ',
        gameObjectsThatCanOccupiedFields
      );
      // console.error(
      //   'more than one game object from gameObjectsThatCanOccupiedFields, need exact one'
      // );
      return null;
    }

    return gameObjectsThatCanOccupiedFields[0];
  }

  addToCanvas(
    ctx: CanvasRenderingContext2D,
    fieldShift: Coordinates,
    fieldSize: number
  ) {
    ctx.drawImage(
      ImageManager.getSingleton().getImage(this.imageKey),
      (this.x - fieldShift.x) * fieldSize,
      (this.y - fieldShift.y) * fieldSize,
      fieldSize,
      fieldSize
    );
  }
}

export default Field;
