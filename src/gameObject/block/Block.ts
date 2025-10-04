import GameObject from '@/gameObject/GameObject.ts';
import { GameObjectAttributes } from '@/gameObject/types.ts';
import itemFactory from '../item/itemFactory.ts';

class Block extends GameObject {
  constructor(attributes: GameObjectAttributes) {
    super(attributes, itemFactory);
  }
}

export default Block;
