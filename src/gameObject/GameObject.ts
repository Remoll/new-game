import Field from "@/gameMap/field/Field";
import Item from "@/gameObject/item/Item";
import { Direction, GameObjectAttributes, GameObjectImagesKeys } from "./types";
import { Coordinates } from "@/types";
import ImageManager from "@/imageManager/ImageManager";

class GameObject {
  // TODO: check is fields is necessary here - already in GameState
  protected fields: Field[];
  protected type: string;
  protected id: string;
  protected x: number;
  protected y: number;
  protected canOccupiedFields: boolean;
  protected isInteractive: boolean;
  protected items: Item[] = [];
  private imagesKeys: GameObjectImagesKeys;

  constructor(attributes: GameObjectAttributes) {
    const { fields, type, x, y, canOccupiedFields, isInteractive, imagesKeys } = attributes;

    this.fields = fields;
    this.type = type;
    this.x = x;
    this.y = y;
    this.imagesKeys = imagesKeys;
    this.canOccupiedFields = canOccupiedFields;
    this.isInteractive = isInteractive;

    this.id = this.generateId(type);

    const initialField = this.getCurrentField();

    if (initialField) {
      initialField.addGameObjectToField(this);
    }
  }

  setFields(fields: Field[]) {
    this.fields = fields;
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
  }

  removeItemFromInventory(item: Item): void {
    this.items = this.items.filter((itemInInventory) => itemInInventory.getId() !== item.getId());
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
      console.log(this.getId(), " Field not found for coordinates:", this.x, this.y);
      return null;
    }
    return field;
  }

  addToCanvas(ctx: CanvasRenderingContext2D, fieldShift: Coordinates, fieldSize: number) {
    const { x, y } = this.getPosition();
    ctx.drawImage(ImageManager.instance.getImage(this.getImagesKeys().default), (x - fieldShift.x) * fieldSize, (y - fieldShift.y) * fieldSize, fieldSize, fieldSize)

  }

  protected getFieldFromCoordinates(x: number, y: number): Field | undefined {
    return this.fields.find((field) => {
      const { x: fieldX, y: fieldY } = field.getPosition();
      return fieldX === x && fieldY === y
    });
  }

  handleInteract(gameObject?: GameObject) {
    // implement in subclasses
    return;
  }

  getIsInteractive() {
    return this.isInteractive;
  }

  findNewCoordinatesFromDirection(direction: Direction): Coordinates {
    const newX = direction === Direction.LEFT ? this.x - 1 : direction === Direction.RIGHT ? this.x + 1 : this.x;
    const newY = direction === Direction.UP ? this.y - 1 : direction === Direction.DOWN ? this.y + 1 : this.y;

    return { x: newX, y: newY };
  }
}

export default GameObject;
