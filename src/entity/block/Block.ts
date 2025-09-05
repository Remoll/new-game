import Entity from "../Entity";

class Block extends Entity {
  constructor(fields, x, y) {
    super(fields, "block", x, y, { isPasive: true });
  }
}

export default Block;
