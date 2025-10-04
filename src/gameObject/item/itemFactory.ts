import Item from '@/gameObject/item/Item.ts';
import ReanimatePotion from './touchable/reanimatePotion/ReanimatePotion.ts';
import FireWand from './projectile/fireWand/FireWand.ts';
import { GameObjectAttributes } from '../types.ts';
import Sword from './equipment/sword/Sword.ts';

const itemFactory = (itemAttributes: GameObjectAttributes): Item => {
  switch (itemAttributes.type) {
    case 'reanimatePotion':
      return new ReanimatePotion(itemAttributes);
    case 'fireWand':
      return new FireWand(itemAttributes);
    case 'sword':
      return new Sword(itemAttributes);
    default:
      return new Item(itemAttributes);
  }
};

export default itemFactory;
