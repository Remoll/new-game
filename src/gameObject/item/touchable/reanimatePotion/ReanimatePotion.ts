import { Direction, GameObjectAttributes } from "@/gameObject/types";
import Entity from "@/gameObject/entity/Entity";
import Reanimate from "@/effect/reanimate/Reanimate";
import Touchable from "../Touchable";

class ReanimatePotion extends Touchable {
    constructor(attributes: GameObjectAttributes) {
        super(attributes);
        this.isConsumables = true;
    }

    executeEffect(direction: Direction, userEntity: Entity): void {
        const { x: newX, y: newY } = userEntity.findNewCoordinatesFromDirection(direction);
        const field = this.getFieldFromCoordinates(newX, newY);
        const gameObjectsFromField = field.getGameObjectsFromField();
        const targetEntity = gameObjectsFromField.find((gameObject) => gameObject instanceof Entity && !gameObject.isAlive())

        if (targetEntity instanceof Entity) {
            Reanimate.execute(userEntity, targetEntity);
        }
    }
}

export default ReanimatePotion;
