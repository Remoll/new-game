import Item from '@/gameObject/item/Item.ts';
import ReanimatePotion from './touchable/reanimatePotion/ReanimatePotion.ts';
import FireWand from './projectile/fireWand/FireWand.ts';
import { GameObjectProps } from '../types.ts';
import Weapon from './equipment/weapon/Weapon.ts';
import { DamageType } from '@/types.ts';

const itemFactory = (itemProps: GameObjectProps): Item => {
  switch (itemProps.type) {
    case 'reanimatePotion':
      return new ReanimatePotion(itemProps);
    case 'fireWand':
      return new FireWand(itemProps);
    case 'weapon':
      return new Weapon({
        ...itemProps,
        damageType: DamageType.SLASHING,
        damageValue: 50,
        attackSpeedMultiplier: 1.2,
        strengthMultiplier: 0.02,
      });
    default:
      return new Item(itemProps);
  }
};

export default itemFactory;
