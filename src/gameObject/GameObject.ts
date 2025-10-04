import Field from '@/gameMap/field/Field.ts';
import Item from '@/gameObject/item/Item.ts';
import {
  Direction,
  GameObjectAttributes,
  GameObjectImagesKeys,
  ItemFactory,
} from './types.ts';
import { Coordinates } from '@/types.ts';
import ImageManager from '@/imageManager/ImageManager.ts';
import GameState from '@/game/GameState.ts';

class GameObject {
  protected type: string;
  protected id: string;
  protected x: number;
  protected y: number;
  protected canOccupiedFields: boolean;
  protected isInteractive: boolean;
  protected items: Item[] = [];
  private imagesKeys: GameObjectImagesKeys;

  // use itemFactory to avoid circular dependency issues for GameObject and Items
  constructor(attributes: GameObjectAttributes, itemFactory: ItemFactory) {
    const {
      type,
      x,
      y,
      canOccupiedFields,
      isInteractive,
      imagesKeys,
      itemsAttributes,
    } = attributes;

    this.type = type;
    this.x = x;
    this.y = y;
    this.imagesKeys = imagesKeys;
    this.canOccupiedFields = canOccupiedFields;
    this.isInteractive = isInteractive;

    this.items = itemsAttributes?.map(itemFactory) || [];
    this.items.forEach((item) => {
      item.setEquippedBy(this);
    });

    this.id = this.generateId(type);

    const initialField = this.getCurrentField();

    if (initialField) {
      initialField.addGameObjectToField(this);
    }
  }

  getImagesKeys(): GameObjectImagesKeys {
    return this.imagesKeys;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  setX(x: number) {
    this.x = x;
  }

  setY(y: number) {
    this.y = y;
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

  getItems(): Item[] {
    return this.items;
  }

  addItem(item: Item): void {
    this.items.push(item);
    item.setEquippedBy(this);
  }

  removeItemFromInventory(item: Item): void {
    this.items = this.items.filter(
      (itemInInventory) => itemInInventory.getId() !== item.getId()
    );
  }

  setCanOccupiedFields(value: boolean) {
    this.canOccupiedFields = value;
  }

  private generateId(type: string) {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000);
    return `${type}-${timestamp}-${randomPart}`;
  }

  getCurrentField(): Field | null {
    const field = this.getFieldFromCoordinates(this.x, this.y);
    if (!field) {
      return null;
    }
    return field;
  }

  addToCanvas(
    ctx: CanvasRenderingContext2D,
    fieldShift: Coordinates,
    fieldSize: number
  ) {
    const { x, y } = this.getPosition();
    ctx.drawImage(
      ImageManager.getSingleton().getImage(this.getImagesKeys().default),
      (x - fieldShift.x) * fieldSize,
      (y - fieldShift.y) * fieldSize,
      fieldSize,
      fieldSize
    );
  }

  protected getFieldFromCoordinates(x: number, y: number): Field | undefined {
    const fields = GameState.getFields();
    return fields.find((field) => {
      const { x: fieldX, y: fieldY } = field.getPosition();
      return fieldX === x && fieldY === y;
    });
  }

  handleInteract(gameObject?: GameObject) {
    // implement in subclasses
    console.log('gameObject: ', gameObject);
    return;
  }

  getIsInteractive() {
    return this.isInteractive;
  }

  findNewCoordinatesFromDirection(direction: Direction): Coordinates {
    const newX =
      direction === Direction.LEFT
        ? this.x - 1
        : direction === Direction.RIGHT
          ? this.x + 1
          : this.x;
    const newY =
      direction === Direction.UP
        ? this.y - 1
        : direction === Direction.DOWN
          ? this.y + 1
          : this.y;

    return { x: newX, y: newY };
  }
}

export default GameObject;
