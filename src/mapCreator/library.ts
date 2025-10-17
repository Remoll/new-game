import { ImageKey } from '@/imageManager/types.ts';
import { BlockSprite, EntitySprite, FieldSprite, SpriteType } from './types.ts';
import { Disposition, Faction } from '@/gameObject/types.ts';

const fieldsLibrary: FieldSprite[] = [
  {
    type: 'grass',
    spriteType: SpriteType.FIELD,
    imageKey: ImageKey.GRASS_BLOCK,
  },
  {
    type: 'water',
    spriteType: SpriteType.FIELD,
    imageKey: ImageKey.WATER_TEXTURE,
  },
];

const getEntitiesConstantAttributes = (): {
  itemsAttributes: [];
  spriteType: SpriteType.ENTITY;
  faction: Faction;
  dispositionToFactions: {
    [Disposition.HOSTILE]: Faction[];
    [Disposition.FRIENDLY]: Faction[];
    [Disposition.NEUTRAL]: Faction[];
  };
  canOccupiedFields: boolean;
  isInteractive: boolean;
} => ({
  itemsAttributes: [],
  spriteType: SpriteType.ENTITY,
  faction: Faction.ENEMY,
  dispositionToFactions: {
    [Disposition.HOSTILE]: [Faction.PLAYER],
    [Disposition.FRIENDLY]: [Faction.ENEMY],
    [Disposition.NEUTRAL]: [Faction.NEUTRAL],
  },
  canOccupiedFields: true,
  isInteractive: false,
});

const entitiesLibrary: EntitySprite[] = [
  {
    speed: 3,
    type: 'dog',
    imagesKeys: { default: ImageKey.DOG, dead: ImageKey.DOG_DEAD },
    hp: 150,
    ...getEntitiesConstantAttributes(),
  },
  {
    speed: 4,
    type: 'imp',
    imagesKeys: { default: ImageKey.IMP, dead: ImageKey.DEMONIC_ORB },
    hp: 100,
    ...getEntitiesConstantAttributes(),
  },
  {
    speed: 3,
    type: 'boar',
    imagesKeys: { default: ImageKey.BOAR, dead: ImageKey.BOAR_DEAD },
    hp: 200,
    ...getEntitiesConstantAttributes(),
  },
];

const getBlocksConstantAttributes = (): {
  itemsAttributes: [];
  spriteType: SpriteType.BLOCK;
  canOccupiedFields: boolean;
  isInteractive: boolean;
} => ({
  itemsAttributes: [],
  spriteType: SpriteType.BLOCK,
  canOccupiedFields: true,
  isInteractive: false,
});

const blocksLibrary: BlockSprite[] = [
  {
    type: 'stoneBlockLight',
    imagesKeys: {
      default: ImageKey.STONE_BLOCK_LIGHT,
      dead: ImageKey.STONE_BLOCK_LIGHT,
    },
    ...getBlocksConstantAttributes(),
  },
  {
    type: 'tree',
    imagesKeys: {
      default: ImageKey.TREE,
      dead: ImageKey.TREE,
    },
    ...getBlocksConstantAttributes(),
  },
];

export { fieldsLibrary, entitiesLibrary, blocksLibrary };
