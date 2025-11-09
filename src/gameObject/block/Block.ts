import GameObject from '@/gameObject/GameObject.ts';
import { GameObjectProps } from '@/gameObject/types.ts';
import itemFactory from '../item/itemFactory.ts';

class Block extends GameObject {
  constructor(props: GameObjectProps) {
    super(props, itemFactory);
  }
}

export default Block;
