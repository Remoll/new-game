import GameObject from '../GameObject.ts';
import itemFactory from '../item/itemFactory.ts';
import { GameObjectProps } from '../types.ts';

class Workshop extends GameObject {
  constructor(props: GameObjectProps) {
    super(props, itemFactory);
  }
}

export default Workshop;
