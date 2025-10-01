import GameObject from "../GameObject";
import itemFactory from "../item/itemFactory";
import { GameObjectAttributes } from "../types";

class Workshop extends GameObject {
    constructor(attributes: GameObjectAttributes) {
        super(attributes, itemFactory);
    }
}

export default Workshop;
