import GameObject from "../GameObject";
import { GameObjectAttributes } from "gameObject/types";

class Block extends GameObject {
  constructor(attributes: GameObjectAttributes) {
    super(attributes);
  }
}

export default Block;
