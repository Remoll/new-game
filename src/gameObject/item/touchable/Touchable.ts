import { Direction, GameObjectAttributes } from '@/gameObject/types.ts';
import Item from '@/gameObject/item/Item.ts';
import Entity from '@/gameObject/entity/Entity.ts';

class Touchable extends Item {
  constructor(attributes: GameObjectAttributes) {
    super(attributes);
  }

  executeEffect(direction: Direction, userEntity: Entity): void {
    console.log('direction: ', direction);
    console.log('userEntity: ', userEntity);
  }
}

export default Touchable;
