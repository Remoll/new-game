import { GameInstanceKey } from '@/gameInstance/types.ts';
import { ImageKey } from '@/imageManager/types.ts';
import { Coordinates, DamageType } from '@/types.ts';
import type Item from './item/Item.ts';
import { DialogueKey } from '@/dialogueManager/types.ts';

enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

enum Disposition {
  HOSTILE = 'hostile',
  NEUTRAL = 'neutral',
  FRIENDLY = 'friendly',
}

enum Faction {
  PLAYER = 'player_faction',
  ENEMY = 'enemy_faction',
  NEUTRAL = 'neutral_faction',
}

type DispositionToFactions = {
  [key in Disposition]?: Faction[];
};

interface GameObjectImagesKeys {
  default: ImageKey;
  dead: ImageKey;
}

interface GameObjectProps {
  type: string;
  x: number;
  y: number;
  imagesKeys: GameObjectImagesKeys;
  canOccupiedFields: boolean;
  isInteractive: boolean;
  itemsProps?: GameObjectProps[];
  dialogueKey?: DialogueKey | null;
  sizeX?: number;
  sizeY?: number;
}

interface EntityAttributes {
  strength: number;
  dexterity: number; //wpływa głównie na attack speed i accuracy.
  agility: number; //wpływa głównie na movement speed, evasion, inicjatywę.
  intelligence: number;
  endurance: number;
}

interface EntityDerivedStats {
  maxHp: number;
  speed: number;
}

interface EntityProps extends GameObjectProps {
  faction: Faction;
  dispositionToFactions: DispositionToFactions;
  defaultDamageValue: number;
  defaultDamageType: DamageType;
  defaultArmorValue: number;
  attributes: EntityAttributes;
}

interface GatewayProps extends GameObjectProps {
  targetGameInstanceKey: GameInstanceKey;
  targetPlayerCoordinates: Coordinates;
}

type ItemFactory = (itemProps: GameObjectProps) => Item;

export {
  GameObjectProps,
  EntityProps,
  GatewayProps,
  Direction,
  Disposition,
  Faction,
  DispositionToFactions,
  GameObjectImagesKeys,
  ItemFactory,
  EntityAttributes,
  EntityDerivedStats,
};
