import Field from "@/gameMap/field/Field";
import Item from "@/gameObject/item/Item";
import { Direction, GameObjectAttributes, GameObjectImagesKeys } from "./types";
import { Coordinates } from "@/types";
import ImageManager from "@/imageManager/ImageManager";

class GameObject {
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

  protected getCurrentField(): Field | null {
    const field = this.getFieldFromCoordinates(this.x, this.y);
    if (!field) {
      console.log(this.getId(), " Field not found for coordinates:", this.x, this.y);
      return null;
    }
    return field;
  }

  addToCanvas(ctx: CanvasRenderingContext2D, fieldShift: Coordinates, fieldSize: number) {
    const { x, y } = this.getPosition();
    ctx.drawImage(ImageManager.instance.getImage(this.getImagesKeys().default), (x - fieldShift.x) * fieldSize, (y - fieldShift.y) * fieldSize)

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

  isLineClearSupercover(
    x0: number, y0: number,
    x1: number, y1: number,
    opts: { excludeStart?: boolean; includeEnd?: boolean } = {}
  ): { clear: boolean, checked: [number, number][] } {
    const excludeStart = !!opts.excludeStart;
    const includeEnd = opts.includeEnd !== undefined ? opts.includeEnd : true;

    const checked: Array<[number, number]> = [];

    let dx = x1 - x0;
    let dy = y1 - y0;

    const stepX = dx > 0 ? 1 : -1;
    const stepY = dy > 0 ? 1 : -1;

    const tDeltaX = dx !== 0 ? Math.abs(1 / dx) : Infinity;
    const tDeltaY = dy !== 0 ? Math.abs(1 / dy) : Infinity;

    let x = x0;
    let y = y0;

    let tMaxX = tDeltaX;
    let tMaxY = tDeltaY;

    while (true) {
      if (!(excludeStart && x === x0 && y === y0) &&
        !(!includeEnd && x === x1 && y === y1)) {
        checked.push([x, y]);
        const f = this.getFieldFromCoordinates(x, y);
        if (!f || f.getIsOccupied()) {
          return { clear: false, checked };
        }
      }

      if (x === x1 && y === y1) break;

      if (tMaxX < tMaxY) {
        x += stepX;
        tMaxX += tDeltaX;
      } else if (tMaxY < tMaxX) {
        y += stepY;
        tMaxY += tDeltaY;
      } else {
        // linia przechodzi dokładnie przez narożnik → sprawdź obie komórki
        x += stepX;
        y += stepY;
        tMaxX += tDeltaX;
        tMaxY += tDeltaY;
      }
    }

    return { clear: true, checked };
  };
}

export default GameObject;
