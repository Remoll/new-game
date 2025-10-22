import { ImageKey } from '@/imageManager/types.ts';
import { GameInstanceData, GameInstanceKey } from '../types.ts';
import gameInstance from './jsonInstances/roadToTheForest.json';

const roadToTheForest: GameInstanceData = {
  ...(gameInstance as GameInstanceData),
  gateways: [
    {
      targetGameInstanceKey: GameInstanceKey.INN,
      type: 'gateway',
      x: 0,
      y: 1,
      targetPlayerCoordinates: { x: 19, y: 5 },
      imagesKeys: { default: ImageKey.DOOR_STONE, dead: ImageKey.DOOR_STONE },
      canOccupiedFields: true,
      isInteractive: true,
    },
    {
      targetGameInstanceKey: GameInstanceKey.FOREST_EDGE,
      type: 'gateway',
      x: 24,
      y: 5,
      targetPlayerCoordinates: { x: 1, y: 1 },
      imagesKeys: { default: ImageKey.DOOR_STONE, dead: ImageKey.DOOR_STONE },
      canOccupiedFields: true,
      isInteractive: true,
    },
  ],
};

roadToTheForest.items.push({
  type: 'lostBarrel',
  x: 12,
  y: 8,
  imagesKeys: { default: ImageKey.BARREL, dead: ImageKey.BARREL },
  canOccupiedFields: true,
  isInteractive: true,
});

export default roadToTheForest;
