import { DialogueKey } from '@/dialogueManager/types.ts';
import {
  Disposition,
  Faction,
  GameObjectAttributes,
  GameObjectImagesKeys,
} from '@/gameObject/types.ts';
import { ImageKey } from '@/imageManager/types.ts';

enum SpriteType {
  FIELD = 'field',
  ENTITY = 'entity',
  BLOCK = 'block',
  GAME_OBJECT = 'gameObject',
}

interface GameSprite {
  type: string;
  spriteType: SpriteType;
}

interface FieldSprite extends GameSprite {
  spriteType: SpriteType.FIELD;
  imageKey: ImageKey;
}

interface GameObjectSprite extends GameSprite {
  imagesKeys: GameObjectImagesKeys;
  canOccupiedFields: boolean;
  isInteractive: boolean;
  itemsAttributes?: GameObjectAttributes[];
  dialogueKey?: DialogueKey | null;
}

interface EntitySprite extends GameObjectSprite {
  spriteType: SpriteType.ENTITY;
  speed: number;
  faction: Faction;
  hp: number;
  dispositionToFactions: {
    [Disposition.HOSTILE]: Faction[];
    [Disposition.FRIENDLY]: Faction[];
    [Disposition.NEUTRAL]: Faction[];
  };
}

interface BlockSprite extends GameObjectSprite {
  spriteType: SpriteType.BLOCK;
}

export { SpriteType, FieldSprite, EntitySprite, BlockSprite };
