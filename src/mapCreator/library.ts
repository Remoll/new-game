import { ImageKey } from '@/imageManager/types.ts';
import {
  BlockSprite,
  EntitySprite,
  FieldSprite,
  GameObjectSprite,
  ItemsSprite,
  SpriteType,
} from './types.ts';
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
    crossable: false,
  },
  {
    type: 'ground',
    spriteType: SpriteType.FIELD,
    imageKey: ImageKey.GROUND_TEXTURE,
  },
  {
    type: 'woodTexture',
    imageKey: ImageKey.WOOD_TEXTURE,
    spriteType: SpriteType.FIELD,
  },
  {
    type: 'sandTexture',
    imageKey: ImageKey.SAND_TEXTURE,
    spriteType: SpriteType.FIELD,
  },
  {
    type: 'swampTexture',
    imageKey: ImageKey.SWAMP_TEXTURE,
    spriteType: SpriteType.FIELD,
  },
];

const getGameObjectsAttributes = (): {
  itemsAttributes: [];
  spriteType: SpriteType.GAME_OBJECT;
  canOccupiedFields: boolean;
  isInteractive: boolean;
} => ({
  itemsAttributes: [],
  spriteType: SpriteType.GAME_OBJECT,
  canOccupiedFields: true,
  isInteractive: false,
});

const gameObjectsLibrary: GameObjectSprite[] = [
  {
    type: 'boulder',
    imagesKeys: { default: ImageKey.BOULDER, dead: ImageKey.BOULDER },
    ...getGameObjectsAttributes(),
  },
  {
    type: 'chest',
    imagesKeys: { default: ImageKey.CHEST, dead: ImageKey.CHEST },
    ...getGameObjectsAttributes(),
  },
  {
    type: 'barrel',
    imagesKeys: { default: ImageKey.BARREL, dead: ImageKey.BARREL },
    ...getGameObjectsAttributes(),
  },
  {
    type: 'laboratory',
    imagesKeys: { default: ImageKey.LABORATORY, dead: ImageKey.LABORATORY },
    ...getGameObjectsAttributes(),
  },
  {
    type: 'stool',
    imagesKeys: { default: ImageKey.STOOL, dead: ImageKey.STOOL },
    ...getGameObjectsAttributes(),
  },
  {
    type: 'wagon',
    imagesKeys: { default: ImageKey.WAGON, dead: ImageKey.WAGON },
    sizeX: 2,
    sizeY: 2,
    ...getGameObjectsAttributes(),
  },
  {
    type: 'table',
    imagesKeys: { default: ImageKey.TABLE, dead: ImageKey.TABLE },
    sizeX: 2,
    sizeY: 2,
    ...getGameObjectsAttributes(),
  },

  {
    type: 'woodenPalisade',
    imagesKeys: {
      default: ImageKey.WOODEN_PALISADE,
      dead: ImageKey.WOODEN_PALISADE,
    },
    ...getGameObjectsAttributes(),
  },
];

const getItemsAttributes = (): {
  itemsAttributes: [];
  spriteType: SpriteType.ITEMS;
  canOccupiedFields: boolean;
  isInteractive: boolean;
} => ({
  itemsAttributes: [],
  spriteType: SpriteType.ITEMS,
  canOccupiedFields: false,
  isInteractive: true,
});

const itemsLibrary: ItemsSprite[] = [
  {
    type: 'sword',
    imagesKeys: { default: ImageKey.SWORD, dead: ImageKey.SWORD_EQUIPED },
    ...getItemsAttributes(),
  },
  {
    type: 'fireWand',
    imagesKeys: { default: ImageKey.WAND, dead: ImageKey.WAND },
    ...getItemsAttributes(),
  },
  {
    type: 'reanimatePotion',
    imagesKeys: { default: ImageKey.POTION, dead: ImageKey.POTION },
    ...getItemsAttributes(),
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
  {
    speed: 1,
    type: 'skeleton',
    imagesKeys: { default: ImageKey.SKELETON, dead: ImageKey.BONES },
    hp: 300,
    ...getEntitiesConstantAttributes(),
  },
  {
    speed: 4,
    type: 'fireElemental',
    imagesKeys: {
      default: ImageKey.FIRE_ELEMENTAL,
      dead: ImageKey.PILE_OF_DUST,
    },
    hp: 400,
    ...getEntitiesConstantAttributes(),
  },
  {
    speed: 1,
    type: 'beggar',
    imagesKeys: { default: ImageKey.ENEMY, dead: ImageKey.ENEMY_DEAD },
    hp: 100,
    ...getEntitiesConstantAttributes(),
  },
  {
    speed: 1,
    type: 'villager',
    imagesKeys: { default: ImageKey.VILLAGER, dead: ImageKey.VILLAGER_DEAD },
    hp: 100,
    ...getEntitiesConstantAttributes(),
  },
  {
    speed: 2,
    type: 'wizard',
    imagesKeys: { default: ImageKey.WIZARD, dead: ImageKey.WIZARD_DEAD },
    hp: 200,
    ...getEntitiesConstantAttributes(),
  },
  {
    speed: 3,
    type: 'wolf',
    imagesKeys: { default: ImageKey.WOLF, dead: ImageKey.WOLF_DEAD },
    hp: 200,
    ...getEntitiesConstantAttributes(),
  },
  {
    speed: 2,
    type: 'innkeeper',
    imagesKeys: { default: ImageKey.INNKEEPER, dead: ImageKey.INNKEEPER },
    hp: 200,
    ...getEntitiesConstantAttributes(),
  },
  {
    speed: 3,
    type: 'bear',
    imagesKeys: { default: ImageKey.BEAR, dead: ImageKey.BEAR_DEAD },
    hp: 400,
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
    type: 'stoneBlockDark',
    imagesKeys: {
      default: ImageKey.STONE_BLICK_DARK,
      dead: ImageKey.STONE_BLICK_DARK,
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
  {
    type: 'woodenBlock',
    imagesKeys: {
      default: ImageKey.WOODEN_BLOCK,
      dead: ImageKey.WOODEN_BLOCK,
    },
    ...getBlocksConstantAttributes(),
  },
];

export {
  fieldsLibrary,
  gameObjectsLibrary,
  itemsLibrary,
  entitiesLibrary,
  blocksLibrary,
};
