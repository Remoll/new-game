import Equipment from '../Equipment.ts';
import { EquipmentSlot, WeaponProps } from '../types.ts';
import { DamageType } from '@/types.ts';

class Weapon extends Equipment {
  private damageValue: number;
  private damageType: DamageType;
  private attackSpeedMultiplier: number;

  constructor(props: WeaponProps) {
    const {
      damageValue,
      damageType,
      attackSpeedMultiplier,
      ...gameObjectProps
    } = props;
    super(gameObjectProps, EquipmentSlot.MAIN_HAND);
    this.damageValue = damageValue;
    this.damageType = damageType;
    // TODO: minus this from speed on turn
    this.attackSpeedMultiplier = attackSpeedMultiplier;
  }

  getDamageValue(): number {
    return this.damageValue;
  }

  getDamageType(): DamageType {
    return this.damageType;
  }

  getAttackSpeedMultiplier(): number {
    return this.attackSpeedMultiplier;
  }
}

export default Weapon;
