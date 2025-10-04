import { GameObjectAttributes } from '@/gameObject/types.ts';
import Item from '@/gameObject/item/Item.ts';
import { Coordinates } from '@/types.ts';

class Projectile extends Item {
  constructor(attributes: GameObjectAttributes) {
    super(attributes);
  }

  executeEffect(
    userCoordinates: Coordinates,
    targetCoordinates: Coordinates
  ): void {
    console.log('userCoordinates: ', userCoordinates);
    console.log('targetCoordinates: ', targetCoordinates);
  }
}

export default Projectile;
