import { GameObjectAttributes } from '@/gameObject/types.ts';
import Item from '@/gameObject/item/Item.ts';
import Entity from '@/gameObject/entity/Entity.ts';
import { EquipmentSlot } from './types.ts';

class Equipment extends Item {
  private slot: EquipmentSlot;

  constructor(attributes: GameObjectAttributes, slot: EquipmentSlot) {
    super(attributes);
    this.isConsumables = true;
    this.slot = slot;
  }

  getSlot(): EquipmentSlot {
    return this.slot;
  }

  executeEffect(user: Entity): void {
    user.equipItem(this);
  }
}

export default Equipment;
