// TODO: unified items creation, and propobly others gameObjects
import Item from '@/gameObject/item/Item.ts';
import ReanimatePotion from './touchable/reanimatePotion/ReanimatePotion.ts';
import FireWand from './projectile/fireWand/FireWand.ts';
import { ImageKey } from '@/imageManager/types.ts';
import Weapon from './equipment/weapon/Weapon.ts';
import { DamageType } from '@/types.ts';

const itemFromType = (itemType: string): Item => {
  const itemProps = {
    type: itemType,
    x: null,
    y: null,
    imagesKeys: null,
    canOccupiedFields: false,
    isInteractive: true,
  };

  switch (itemType) {
    case 'reanimatePotion':
      itemProps.imagesKeys = {
        default: ImageKey.POTION,
        dead: ImageKey.POTION,
      };
      return new ReanimatePotion(itemProps);
    case 'fireWand':
      itemProps.imagesKeys = {
        default: ImageKey.WAND,
        dead: ImageKey.WAND,
      };
      return new FireWand(itemProps);
    case 'weapon':
      itemProps.imagesKeys = {
        default: ImageKey.SWORD,
        dead: ImageKey.SWORD_EQUIPED,
      };
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

export default itemFromType;
