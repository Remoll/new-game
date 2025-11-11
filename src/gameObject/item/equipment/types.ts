import { GameObjectProps } from '@/gameObject/types.ts';
import { DamageType } from '@/types.ts';

enum EquipmentSlot {
  MAIN_HAND = 'mainHand',
}

interface WeaponProps extends GameObjectProps {
  damageValue: number;
  damageType: DamageType;
  attackSpeedMultiplier: number;
  strengthMultiplier: number;
}

export { EquipmentSlot, WeaponProps };
