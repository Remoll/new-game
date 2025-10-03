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
            const itemsInChest = this.getItems();

            if (itemsInChest) {
                itemsInChest.forEach((item) => {
                    gameObject.addItem(item);
                    this.removeItemFromInventory(item);
                })
            }
        }
    }
}

export default Chest;
