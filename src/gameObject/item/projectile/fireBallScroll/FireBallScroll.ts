import { GameObjectAttributes } from "@/gameObject/types";
import Projectile from "../Projectile";
import { Coordinates } from "@/types";
import Entity from "@/gameObject/entity/Entity";

class FireBallScroll extends Projectile {
    constructor(attributes: GameObjectAttributes) {
        super(attributes);
        this.isConsumables = true;
    }

    executeEffect(targetCoordinates: Coordinates): void {
        const { x, y } = targetCoordinates;
        const field = this.getFieldFromCoordinates(x, y);
        const gameObjectThatOccupiedField = field.getGameObjectThatOccupiedField();
        if (gameObjectThatOccupiedField instanceof Entity) {
            gameObjectThatOccupiedField.takeDamage(50);
        }
    }
}

export default FireBallScroll
