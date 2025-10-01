import Player from "../entity/player/Player";
import GameObject from "../GameObject";
import itemFactory from "../item/itemFactory";
import { GameObjectAttributes } from "../types";

class Chest extends GameObject {
    constructor(attributes: GameObjectAttributes) {
        super(attributes, itemFactory);
    }

    handleInteract(gameObject: GameObject): void {
        if (gameObject instanceof Player) {
            console.log("open chest: ", this.getItems())
        }
    }
}

export default Chest;
