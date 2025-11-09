import { ImageKey } from '@/imageManager/types.ts';

interface FieldProps {
  x: number;
  y: number;
  imageKey: ImageKey;
  crossable?: boolean;
}

export { FieldProps };
