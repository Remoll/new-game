import { DialogueKey } from '@/dialogueManager/types.ts';
import {
  Disposition,
  Faction,
  GameObjectProps,
  GameObjectImagesKeys,
  EntityAttributes,
} from '@/gameObject/types.ts';
import { ImageKey } from '@/imageManager/types.ts';
import { DamageType } from '@/types.ts';

enum SpriteType {
  FIELD = 'field',
  GAME_OBJECT = 'gameObject',
  ITEMS = 'items',
  ENTITY = 'entity',
  BLOCK = 'block',
}

interface GameSprite {
  type: string;
  spriteType: SpriteType;
}

interface FieldSprite extends GameSprite {
  spriteType: SpriteType.FIELD;
  imageKey: ImageKey;
  crossable?: boolean;
}

interface GameObjectSprite extends GameSprite {
  spriteType: SpriteType.GAME_OBJECT;
  imagesKeys: GameObjectImagesKeys;
  canOccupiedFields: boolean;
  isInteractive: boolean;
  itemsProps?: GameObjectProps[];
  dialogueKey?: DialogueKey | null;
  sizeX?: number;
  sizeY?: number;
}

interface ItemsSprite extends Omit<GameObjectSprite, 'spriteType'> {
  spriteType: SpriteType.ITEMS;
}

interface EntitySprite extends Omit<GameObjectSprite, 'spriteType'> {
  spriteType: SpriteType.ENTITY;
  speed: number;
  faction: Faction;
  hp: number;
  defaultDamageValue: number;
  defaultDamageType: DamageType;
  defaultArmorValue: number;
  attributes: EntityAttributes;
  dispositionToFactions: {
    [Disposition.HOSTILE]: Faction[];
    [Disposition.FRIENDLY]: Faction[];
    [Disposition.NEUTRAL]: Faction[];
  };
}

interface BlockSprite extends Omit<GameObjectSprite, 'spriteType'> {
  spriteType: SpriteType.BLOCK;
}

export {
  SpriteType,
  FieldSprite,
  GameObjectSprite,
  ItemsSprite,
  EntitySprite,
  BlockSprite,
};
