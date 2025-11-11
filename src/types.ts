interface Coordinates {
  x: number;
  y: number;
}

enum DamageType {
  SLASHING = 'slashing',
  PIERCING = 'piercing',
  BLUNT = 'blunt',
  FIRE = 'fire',
}

enum ArmorType {
  NONE = 'none',
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
}

enum ResistanceType {
  PHYSICAL = 'physical',
  FIRE = 'fire',
}

export { Coordinates, DamageType, ArmorType, ResistanceType };
