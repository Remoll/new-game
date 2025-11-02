import { ImageKey } from '@/imageManager/types.ts';

interface FieldAttributes {
  x: number;
  y: number;
  imageKey: ImageKey;
  crossable?: boolean;
}

export { FieldAttributes };
