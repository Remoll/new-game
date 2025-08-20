import Entity from "../Entity";

class Wall extends Entity {
  constructor(mapElement, fields, x, y) {
    super(mapElement, fields, "wall", x, y, true);
  }
}

export default Wall;
