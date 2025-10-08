// TODO: unified items creation, and propobly others gameObjects
import Item from '@/gameObject/item/Item.ts';
import ReanimatePotion from './touchable/reanimatePotion/ReanimatePotion.ts';
import FireWand from './projectile/fireWand/FireWand.ts';
import Sword from './equipment/sword/Sword.ts';
import { ImageKey } from '@/imageManager/types.ts';

const itemFromType = (itemType: string): Item => {
  const itemAttributes = {
    type: itemType,
    x: null,
    y: null,
    imagesKeys: null,
    canOccupiedFields: false,
    isInteractive: true,
  };

  switch (itemType) {
    case 'reanimatePotion':
      itemAttributes.imagesKeys = {
        default: ImageKey.POTION,
        dead: ImageKey.POTION,
      };
      return new ReanimatePotion(itemAttributes);
    case 'fireWand':
      itemAttributes.imagesKeys = {
        default: ImageKey.WAND,
        dead: ImageKey.WAND,
      };
      return new FireWand(itemAttributes);
    case 'sword':
      itemAttributes.imagesKeys = {
        default: ImageKey.SWORD,
        dead: ImageKey.SWORD_EQUIPED,
      };
      return new Sword(itemAttributes);
    default:
      return new Item(itemAttributes);
  }
};

export default itemFromType;
