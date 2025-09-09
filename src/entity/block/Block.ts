import Field from "gameMap/field/Field";
import Entity from "../Entity";

class Block extends Entity {
  constructor(fields: Field[], x: number, y: number) {
    super(fields, "block", x, y, { isPasive: true });
  }
}

export default Block;
