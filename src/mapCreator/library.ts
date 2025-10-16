import { ImageKey } from '@/imageManager/types.ts';
import { GameSprite, SpriteType } from './types.ts';

const fieldsLibrary: GameSprite[] = [
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

const gameObjectsLibrary: GameSprite[] = [
  {
    type: 'dog',
    spriteType: SpriteType.GAME_OBJECT,
    imageKey: ImageKey.DOG,
  },
  {
    type: 'imp',
    spriteType: SpriteType.GAME_OBJECT,
    imageKey: ImageKey.IMP,
  },
];

export { fieldsLibrary, gameObjectsLibrary };
