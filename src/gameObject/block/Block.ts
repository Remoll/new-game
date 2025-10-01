import GameObject from "@/gameObject/GameObject";
import { GameObjectAttributes } from "@/gameObject/types";
import itemFactory from "../item/itemFactory";

class Block extends GameObject {
  constructor(attributes: GameObjectAttributes) {
    super(attributes, itemFactory);
  }
}

export default Block;
