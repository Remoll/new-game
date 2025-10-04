import { GameObjectAttributes } from '@/gameObject/types.ts';
import Equipment from '../Equipment.ts';
import { EquipmentSlot } from '../types.ts';

class Sword extends Equipment {
  constructor(attributes: GameObjectAttributes) {
    super(attributes, EquipmentSlot.MAIN_HAND);
  }
}

export default Sword;
