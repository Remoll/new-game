import { Direction, GameObjectAttributes } from '@/gameObject/types.ts';
import Entity from '@/gameObject/entity/Entity.ts';
import Reanimate from '@/effect/reanimate/Reanimate.ts';
import Touchable from '../Touchable.ts';

class ReanimatePotion extends Touchable {
  constructor(attributes: GameObjectAttributes) {
    super(attributes);
    this.isConsumables = true;
  }

  executeEffect(direction: Direction, userEntity: Entity): void {
    const { x: newX, y: newY } =
      userEntity.findNewCoordinatesFromDirection(direction);
    const field = this.getFieldFromCoordinates(newX, newY);
    const gameObjectsFromField = field.getGameObjectsFromField();
    const targetEntity = gameObjectsFromField.find(
      (gameObject) => gameObject instanceof Entity && !gameObject.isAlive()
    );

    if (targetEntity instanceof Entity) {
      Reanimate.execute(userEntity, targetEntity);
    }
  }
}

export default ReanimatePotion;
