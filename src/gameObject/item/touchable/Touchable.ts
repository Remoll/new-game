import { Direction, GameObjectAttributes } from "@/gameObject/types";
import Item from "@/gameObject/item/Item";
import Entity from "@/gameObject/entity/Entity";

class Touchable extends Item {
    constructor(attributes: GameObjectAttributes) {
        super(attributes);
    }

    executeEffect(direction: Direction, userEntity: Entity): void {
        
    }
}

export default Touchable;
