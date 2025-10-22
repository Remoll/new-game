import GameObject from '@/gameObject/GameObject.ts';
import { GameObjectAttributes } from '@/gameObject/types.ts';
import ImageManager from '@/imageManager/ImageManager.ts';
import { Coordinates } from '@/types.ts';
import itemFactory from './itemFactory.ts';

class Item extends GameObject {
  private equippedBy: GameObject | null = null;
  protected isConsumables: boolean = false;

  constructor(attributes: GameObjectAttributes) {
    super(attributes, itemFactory);
  }

  setEquippedBy(gameObject: GameObject): void {
    this.equippedBy = gameObject;
  }

  getEquippedBy(): GameObject {
    return this.equippedBy;
  }

  addToCanvas(
    ctx: CanvasRenderingContext2D,
    fieldShift: Coordinates,
    fieldSize: number
  ): void {
    if (this.equippedBy) {
      return;
    }

    const { x, y } = this.getPosition();

    ctx.drawImage(
      ImageManager.getSingleton().getImage(this.getImagesKeys().default),
      (x - fieldShift.x) * fieldSize,
      (y - fieldShift.y) * fieldSize,
      fieldSize,
      fieldSize
    );
  }

  handleInteract(gameObject: GameObject): void {
    gameObject.addItem(this);
    this.equippedBy = gameObject;
    this.setCanOccupiedFields(false);
    this.removeGameObjectFromFields();
    this.x = null;
    this.y = null;
  }

  protected executeEffect(...args: unknown[]) {
    // implement in subclasses
    console.log('args: ', args);
  }

  deleteItemFromWorld() {
    if (this.equippedBy) {
      this.equippedBy.removeItemFromInventory(this);
    }

    // TODO: remove item instance???
  }

  use(...args: unknown[]) {
    // TODO: check there is valid target or display info about itom lost

    this.executeEffect(...args);

    if (this.isConsumables) {
      this.deleteItemFromWorld();
    }
  }
}

export default Item;
