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

export { Coordinates, DamageType };
