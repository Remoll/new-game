import Equipment from '../Equipment.ts';
import { EquipmentSlot, WeaponProps } from '../types.ts';
import { DamageType } from '@/types.ts';

class Weapon extends Equipment {
  private damageValue: number;
  private damageType: DamageType;
  private speedMultiplier: number;
  private strengthMultiplier: number;

  constructor(props: WeaponProps) {
    const {
      damageValue,
      damageType,
      speedMultiplier,
      strengthMultiplier,
      ...gameObjectProps
    } = props;
    super(gameObjectProps, EquipmentSlot.MAIN_HAND);
    this.damageValue = damageValue;
    this.damageType = damageType;
    this.speedMultiplier = speedMultiplier;
    this.strengthMultiplier = strengthMultiplier;
  }

  getDamageValue(): number {
    return this.damageValue;
  }

  getDamageType(): DamageType {
    return this.damageType;
  }

  getSpeedMultiplier(): number {
    return this.speedMultiplier;
  }

  getStrengthMultiplier(): number {
    return this.strengthMultiplier;
  }
}

export default Weapon;
