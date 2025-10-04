import GameObject from '@/gameObject/GameObject.ts';
import { GameObjectAttributes } from '@/gameObject/types.ts';
import ImageManager from '@/imageManager/ImageManager.ts';
import { Coordinates } from '@/types.ts';
import itemFactory from '../item/itemFactory.ts';

class Door extends GameObject {
  constructor(attributes: GameObjectAttributes, isClosed = true) {
    super({ ...attributes, canOccupiedFields: isClosed }, itemFactory);
  }

  handleInteract() {
    const currentField = this.getCurrentField();
    const gameObjectThatOccupiedField =
      currentField.getGameObjectThatOccupiedField();
    const isDoorOpen = !this.getCanOccupiedFields();
    if (isDoorOpen && gameObjectThatOccupiedField) {
      return;
    }
    this.setCanOccupiedFields(!this.getCanOccupiedFields());
  }

  addToCanvas(
    ctx: CanvasRenderingContext2D,
    fieldShift: Coordinates,
    fieldSize: number
  ) {
    const { x, y } = this.getPosition();
    ctx.drawImage(
      ImageManager.getSingleton().getImage(
        this.getCanOccupiedFields()
          ? this.getImagesKeys().default
          : this.getImagesKeys().dead
      ),
      (x - fieldShift.x) * fieldSize,
      (y - fieldShift.y) * fieldSize,
      fieldSize,
      fieldSize
    );
  }
}

export default Door;
