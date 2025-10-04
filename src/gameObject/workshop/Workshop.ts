import GameObject from '../GameObject.ts';
import itemFactory from '../item/itemFactory.ts';
import { GameObjectAttributes } from '../types.ts';

class Workshop extends GameObject {
  constructor(attributes: GameObjectAttributes) {
    super(attributes, itemFactory);
  }
}

export default Workshop;
