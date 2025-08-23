import Entity from "../Entity";

class Wall extends Entity {
  constructor(fields, x, y) {
    super(fields, "wall", x, y, true);
  }
}

export default Wall;
