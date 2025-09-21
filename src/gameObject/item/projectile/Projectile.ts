import { GameObjectAttributes } from "@/gameObject/types";
import Item from "@/gameObject/item/Item";
import { Coordinates } from "@/types";

class Projectile extends Item {
    constructor(attributes: GameObjectAttributes) {
        super(attributes);
    }

    executeEffect(targetCoordinates: Coordinates): void {
        
    }
}

export default Projectile;
