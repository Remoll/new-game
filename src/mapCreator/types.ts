import { ImageKey } from '@/imageManager/types.ts';

enum SpriteType {
  FIELD = 'field',
  GAME_OBJECT = 'gameObject',
}

interface GameSprite {
  type: string;
  spriteType: SpriteType;
  imageKey: ImageKey;
}

export { SpriteType, GameSprite };
