import Equipment from '../Equipment.ts';
import { EquipmentSlot, WeaponProps } from '../types.ts';
import { DamageType } from '@/types.ts';

class Weapon extends Equipment {
  private damageValue: number;
  private damageType: DamageType;
  private attackSpeedMultiplier: number;
  private strengthMultiplier: number;

  constructor(props: WeaponProps) {
    const {
      damageValue,
      damageType,
      attackSpeedMultiplier,
      strengthMultiplier,
      ...gameObjectProps
    } = props;
    super(gameObjectProps, EquipmentSlot.MAIN_HAND);
    this.damageValue = damageValue;
    this.damageType = damageType;
    // TODO: minus this from speed on turn
    this.attackSpeedMultiplier = attackSpeedMultiplier;
    this.strengthMultiplier = strengthMultiplier;
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

  getStrengthMultiplier(): number {
    return this.strengthMultiplier;
  }
}

export default Weapon;
