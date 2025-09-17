import Field from "@/gameMap/field/Field";
import Item from "@/gameObject/item/Item";
import { Direction, GameObjectAttributes } from "./types";

class GameObject {
  protected fields: Field[];
  protected type: string;
  protected id: string;
  protected x: number;
  protected y: number;
  protected canOccupiedFields: boolean;
  protected isInteractive: boolean;
  protected items: Item[] = [];

  constructor(attributes: GameObjectAttributes) {
    const { fields, type, x, y, canOccupiedFields, isInteractive } = attributes;

    this.fields = fields;
    this.type = type;
    this.x = x;
    this.y = y;
    this.canOccupiedFields = canOccupiedFields;
    this.isInteractive = isInteractive;

    this.id = this.generateId(type);
  }

  getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
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
      console.error("Field not found for coordinates:", this.x, this.y);
      return null;
    }
    return field;
  }

  addToCanvas(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#ff0000ff";
    ctx.fillRect(this.x * 50, this.y * 50, 50, 50);  // x, y, width, height

    const field = this.getCurrentField();
    field.addGameObjectToField(this);
  }

  protected getFieldFromCoordinates(x: number, y: number): Field | undefined {
    return this.fields.find((field) => {
      const { x: fieldX, y: fieldY } = field.getPosition();
      return fieldX === x && fieldY === y
    });
  }

  handleInteract(gameObject?: GameObject) {
    return;
  }

  getIsInteractive() {
    return this.isInteractive;
  }

  findNewCoordinatesFromDirection(direction: Direction) {
    const newX = direction === Direction.LEFT ? this.x - 1 : direction === Direction.RIGHT ? this.x + 1 : this.x;
    const newY = direction === Direction.UP ? this.y - 1 : direction === Direction.DOWN ? this.y + 1 : this.y;

    return { newX, newY };
  }
}

export default GameObject;
